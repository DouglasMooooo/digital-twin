#!/usr/bin/env python3
"""
Generate embeddings using sentence-transformers (local, free) and ensure they match Upstash index dimension (e.g. 1024).
If model output dimension != index dimension, apply a deterministic linear projection to expand or reduce to the required dimension.
Uploads vectors to Upstash Vector via REST API in batches.

Requirements:
  pip install sentence-transformers numpy requests python-dotenv

Usage:
  python scripts/init-vector-hf-1024.py
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv
import requests
import math

# Try to import sentence_transformers
try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    print("Missing sentence-transformers. Install with: pip install sentence-transformers")
    raise

import numpy as np

# Load env
root = Path(__file__).resolve().parent.parent
load_dotenv(root / '.env.local')

UPSTASH_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
MODEL_NAME = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-mpnet-base-v2')
BATCH_SIZE = int(os.getenv('UPSTASH_UPLOAD_BATCH', '8'))

if not UPSTASH_URL or not UPSTASH_TOKEN:
    print('❌ Missing Upstash credentials in .env.local')
    raise SystemExit(1)

# Load digitaltwin chunks (similar logic to lib/vectordb.ts)
with open(root / 'digitaltwin.json', 'r', encoding='utf-8') as f:
    dt = json.load(f)

chunks = []
chunk_id = 0

# Personal
chunks.append({
    'id': f'personal-{chunk_id}',
    'content': f"Name: {dt['personal']['name']}. Title: {dt['personal']['title']}. Location: {dt['personal'].get('location','')}. Summary: {dt['personal'].get('summary','')}. Elevator Pitch: {dt['personal'].get('elevator_pitch','')}" ,
    'metadata': {'type':'personal','source':'Personal Information'}
})
chunk_id += 1

# Experience
for exp in dt.get('experience', []):
    chunks.append({
        'id': f'exp-overview-{chunk_id}',
        'content': f"{exp.get('title','')} at {exp.get('company','')} ({exp.get('duration','')}). {exp.get('company_context','')}. Team: {exp.get('team_structure','')}. Skills: {', '.join(exp.get('technical_skills_used',[]))}.",
        'metadata': {'type':'experience','source': f"{exp.get('company','')} - {exp.get('title','')}", 'category': 'overview'}
    })
    chunk_id += 1

    for idx, a in enumerate(exp.get('achievements_star', [])):
        chunks.append({
            'id': f'exp-star-{chunk_id}',
            'content': f"STAR Example from {exp.get('company','')}: Situation: {a.get('situation','')}. Task: {a.get('task','')}. Action: {a.get('action','')}. Result: {a.get('result','')}",
            'metadata': {'type':'experience','source': f"{exp.get('company','')} - Achievement {idx+1}", 'category': 'achievement'}
        })
        chunk_id += 1

    if exp.get('leadership_examples'):
        chunks.append({
            'id': f'exp-leadership-{chunk_id}',
            'content': f"Leadership at {exp.get('company','')}: {'. '.join(exp.get('leadership_examples', []))}",
            'metadata': {'type':'experience','source': f"{exp.get('company','')} - Leadership", 'category': 'leadership'}
        })
        chunk_id += 1

# Skills
tech = dt.get('skills', {}).get('technical', {})
for lang in tech.get('programming_languages', []):
    chunks.append({
        'id': f'skill-lang-{chunk_id}',
        'content': f"Programming Language: {lang.get('language','')} with {lang.get('years_experience','')} years experience. Proficiency: {lang.get('proficiency','')}. Frameworks: {', '.join(lang.get('frameworks',[]))}.",
        'metadata': {'type':'skill','source': f"Technical Skills - {lang.get('language','')}", 'category': 'programming'}
    })
    chunk_id += 1

# Projects
for p in dt.get('projects', []):
    chunks.append({
        'id': f'project-{chunk_id}',
        'content': f"Project: {p.get('name','')}. Description: {p.get('description','')}. Technologies: {', '.join(p.get('technologies',[]))}. Results: {p.get('results','')}",
        'metadata': {'type':'project','source': f"Projects - {p.get('name','')}", 'category': 'project'}
    })
    chunk_id += 1

print(f"✅ Generated {len(chunks)} chunks")

# Discover Upstash expected dimension
info_url = UPSTASH_URL.rstrip('/') + '/info'
resp = requests.get(info_url, headers={'Authorization': f'Bearer {UPSTASH_TOKEN}'}, timeout=15)
if resp.status_code != 200:
    print('❌ Failed to fetch Upstash index info:', resp.status_code, resp.text)
    raise SystemExit(1)
info = resp.json()
# Try common keys
expected_dim = None
for k in ('dimension','dims','dimension_size','vector_dimension','size'):
    if k in info:
        expected_dim = int(info[k])
        break
# Fallback: try to parse message seen earlier
if expected_dim is None:
    # No standard field; attempt to infer from info JSON
    for v in info.values():
        if isinstance(v, (int, float)) and 64 <= int(v) <= 8192:
            expected_dim = int(v)
            break

if expected_dim is None:
    print('⚠️ Could not determine expected vector dimension from Upstash /info. Defaulting to 1024')
    expected_dim = 1024

print(f"Upstash expects dimension: {expected_dim}")

# Load model
print(f"Loading model: {MODEL_NAME}")
model = SentenceTransformer(MODEL_NAME)

# Check model output dimension using a dummy encode
sample = chunks[0]['content'] if chunks else 'test'
emb0 = model.encode(sample)
model_dim = len(emb0)
print(f"Model emits dimension: {model_dim}")

# If mismatch, build deterministic projection matrix to map model_dim -> expected_dim
rng_seed = 42
if model_dim != expected_dim:
    print(f"Dimension mismatch: model {model_dim} -> target {expected_dim}. Creating deterministic projection matrix.")
    rng = np.random.RandomState(rng_seed)
    # Use Gaussian random projection matrix and orthonormalize rows for stability
    proj = rng.normal(size=(expected_dim, model_dim)).astype('float32')
    # Optionally normalize rows
    row_norms = np.linalg.norm(proj, axis=1, keepdims=True)
    row_norms[row_norms==0] = 1.0
    proj = proj / row_norms
else:
    proj = None

# Helper to compute final vector
def to_target_vec(vec: np.ndarray) -> np.ndarray:
    # vec: (model_dim,)
    if proj is None:
        out = vec
    else:
        out = proj.dot(vec)
    # Normalize to unit length (optional)
    norm = np.linalg.norm(out)
    if norm > 0:
        out = out / norm
    return out.astype(float)

# Batch upload
upload_url = UPSTASH_URL.rstrip('/') + '/upsert'
headers = {'Authorization': f'Bearer {UPSTASH_TOKEN}', 'Content-Type': 'application/json'}

success = 0
fail = 0

batch = []
for i, ch in enumerate(chunks):
    text = ch['content']
    emb = model.encode(text)
    final = to_target_vec(np.array(emb))
    vec_list = final.tolist()
    item = {
        'id': ch['id'],
        'vector': vec_list,
        'metadata': ch['metadata']
    }
    batch.append(item)

    if len(batch) >= BATCH_SIZE or i == len(chunks)-1:
        payload = {'vectors': batch}
        r = requests.post(upload_url, headers=headers, json=payload, timeout=30)
        if r.status_code == 200:
            # Accept success
            res = r.json()
            # Upstash may return per-item errors; we won't deeply parse here
            success += len(batch)
            print(f"Uploaded batch of {len(batch)}")
        else:
            print('❌ Upsert failed:', r.status_code, r.text[:200])
            fail += len(batch)
        batch = []

print(f"\n📊 Done. success={success}, fail={fail}")

if fail == 0:
    print('🎉 All vectors uploaded successfully')
else:
    print('⚠️ Some uploads failed')
