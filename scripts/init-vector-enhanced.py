#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced vector initialization with improved chunking strategy and better Chinese support.
Uses multilingual sentence-transformers model for better Chinese + English understanding.

Improvements:
1. Finer-grained chunks for better retrieval precision
2. Multilingual model (paraphrase-multilingual-mpnet-base-v2) for Chinese queries
3. Each company gets separate detailed chunks
4. More semantic context in chunk content

Requirements:
  pip install sentence-transformers numpy requests python-dotenv

Usage:
  python scripts/init-vector-enhanced.py
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
import requests
import numpy as np

# Fix Windows console encoding for emoji/unicode
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    from sentence_transformers import SentenceTransformer
except Exception as e:
    print("Missing sentence-transformers. Install with: pip install sentence-transformers")
    raise

# Load env
root = Path(__file__).resolve().parent.parent
load_dotenv(root / '.env.local')

UPSTASH_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
# Use multilingual model for better Chinese support
MODEL_NAME = 'paraphrase-multilingual-mpnet-base-v2'  # 768D, supports 50+ languages
BATCH_SIZE = int(os.getenv('UPSTASH_UPLOAD_BATCH', '8'))

if not UPSTASH_URL or not UPSTASH_TOKEN:
    print('❌ Missing Upstash credentials in .env.local')
    raise SystemExit(1)

# Load digitaltwin data
with open(root / 'digitaltwin.json', 'r', encoding='utf-8') as f:
    dt = json.load(f)

chunks = []
chunk_id = 0

# Personal - more detailed
personal = dt['personal']
chunks.append({
    'id': f'personal-basic-{chunk_id}',
    'content': f"{personal['name']} is a {personal['title']} based in {personal.get('location', 'Australia')}. {personal.get('summary', '')}",
    'metadata': {'type': 'personal', 'source': 'Personal Information', 'category': 'basic'}
})
chunk_id += 1

chunks.append({
    'id': f'personal-pitch-{chunk_id}',
    'content': f"Elevator pitch: {personal.get('elevator_pitch', '')}",
    'metadata': {'type': 'personal', 'source': 'Personal Information', 'category': 'pitch'}
})
chunk_id += 1

# Experience - EACH company gets detailed separate chunks
for exp in dt.get('experience', []):
    company = exp.get('company', '')
    title = exp.get('title', '')
    
    # Company overview chunk - with Chinese company name if available
    company_keywords = company
    if '中山' in company or 'Zhongshan' in company:
        company_keywords = f"{company} (中山恒润会计师事务所, Zhongshan Hengrun Accounting Firm)"
    elif 'BF Suma' in company:
        company_keywords = f"{company} (BF Suma Australia, customer success)"
    
    chunks.append({
        'id': f'exp-overview-{company.replace(" ", "_")}-{chunk_id}',
        'content': f"{title} at {company_keywords} ({exp.get('duration', '')}). Context: {exp.get('company_context', '')}. Team structure: {exp.get('team_structure', '')}. Technologies used: {', '.join(exp.get('technical_skills_used', []))}.",
        'metadata': {'type': 'experience', 'source': f"{company} - Overview", 'category': 'overview', 'company': company}
    })
    chunk_id += 1
    
    # Each STAR achievement gets its own chunk with keywords
    for idx, star in enumerate(exp.get('achievements_star', [])):
        # Extract key metrics/keywords from result
        result = star.get('result', '')
        keywords = []
        if 'churn' in result.lower() or '22%' in result or '16%' in result:
            keywords.append('customer churn reduction')
        if '$600' in result or '600K' in result:
            keywords.append('cost savings')
        if '税' in result or 'tax' in result.lower():
            keywords.append('tax compliance')
        if '1000+' in result or '1,000' in result:
            keywords.append('large scale operations')
        
        keyword_str = f" Keywords: {', '.join(keywords)}." if keywords else ""
        
        chunks.append({
            'id': f'exp-star-{company.replace(" ", "_")}-{idx}-{chunk_id}',
            'content': f"Achievement at {company}: Situation - {star.get('situation', '')}. Task - {star.get('task', '')}. Action - {star.get('action', '')}. Result - {star.get('result', '')}.{keyword_str}",
            'metadata': {'type': 'experience', 'source': f"{company} - Achievement {idx+1}", 'category': 'achievement', 'company': company}
        })
        chunk_id += 1
    
    # Separate leadership chunk if exists
    if exp.get('leadership_examples'):
        chunks.append({
            'id': f'exp-leadership-{company.replace(" ", "_")}-{chunk_id}',
            'content': f"Leadership experience at {company}: {'. '.join(exp.get('leadership_examples', []))}",
            'metadata': {'type': 'experience', 'source': f"{company} - Leadership", 'category': 'leadership', 'company': company}
        })
        chunk_id += 1
    
    # Add quantifiable impact chunk if there are metrics
    metrics = []
    for star in exp.get('achievements_star', []):
        result = star.get('result', '')
        if any(char.isdigit() for char in result):
            metrics.append(result)
    
    if metrics:
        chunks.append({
            'id': f'exp-metrics-{company.replace(" ", "_")}-{chunk_id}',
            'content': f"Quantifiable impact at {company}: {' | '.join(metrics)}",
            'metadata': {'type': 'experience', 'source': f"{company} - Metrics", 'category': 'metrics', 'company': company}
        })
        chunk_id += 1

# Skills - more granular
tech = dt.get('skills', {}).get('technical', {})
for lang in tech.get('programming_languages', []):
    chunks.append({
        'id': f'skill-lang-{lang.get("language", "").replace(" ", "_")}-{chunk_id}',
        'content': f"Programming language expertise: {lang.get('language', '')} ({lang.get('proficiency', '')} level) with {lang.get('years_experience', '')} years of experience. Frameworks: {', '.join(lang.get('frameworks', []))}. Use cases: {', '.join(lang.get('use_cases', []))}.",
        'metadata': {'type': 'skill', 'source': f"Technical Skills - {lang.get('language', '')}", 'category': 'programming'}
    })
    chunk_id += 1

# AI/ML as separate chunk
if tech.get('ai_ml'):
    chunks.append({
        'id': f'skill-ai-ml-{chunk_id}',
        'content': f"AI and Machine Learning skills: {', '.join(tech.get('ai_ml', []))}",
        'metadata': {'type': 'skill', 'source': 'Technical Skills - AI/ML', 'category': 'ai_ml'}
    })
    chunk_id += 1

# Cloud platforms
if tech.get('cloud_platforms'):
    chunks.append({
        'id': f'skill-cloud-{chunk_id}',
        'content': f"Cloud platform experience: {', '.join(tech.get('cloud_platforms', []))}",
        'metadata': {'type': 'skill', 'source': 'Technical Skills - Cloud', 'category': 'cloud'}
    })
    chunk_id += 1

# Projects - each project separate with detailed context
for proj in dt.get('projects_portfolio', []):
    chunks.append({
        'id': f'project-{proj.get("name", "").replace(" ", "_")}-{chunk_id}',
        'content': f"Project: {proj.get('name', '')}. Description: {proj.get('description', '')}. Technologies used: {', '.join(proj.get('technologies', []))}. Business impact: {proj.get('impact', '')}. Key features: {'. '.join(proj.get('key_features', []))}.",
        'metadata': {'type': 'project', 'source': f"Project - {proj.get('name', '')}", 'category': 'project'}
    })
    chunk_id += 1

print(f"✅ Generated {len(chunks)} enhanced chunks (increased from 18)")

# Discover Upstash expected dimension
info_url = UPSTASH_URL.rstrip('/') + '/info'
resp = requests.get(info_url, headers={'Authorization': f'Bearer {UPSTASH_TOKEN}'}, timeout=15)
if resp.status_code != 200:
    print('❌ Failed to fetch Upstash index info:', resp.status_code, resp.text)
    raise SystemExit(1)

info = resp.json()
expected_dim = None
for k in ('dimension', 'dims', 'dimension_size', 'vector_dimension', 'size'):
    if k in info:
        expected_dim = int(info[k])
        break

if expected_dim is None:
    for v in info.values():
        if isinstance(v, (int, float)) and 64 <= int(v) <= 8192:
            expected_dim = int(v)
            break

if expected_dim is None:
    print('⚠️ Could not determine expected vector dimension. Defaulting to 1024')
    expected_dim = 1024

print(f"📏 Upstash expects dimension: {expected_dim}")

# Load multilingual model
print(f"🌍 Loading multilingual model: {MODEL_NAME}")
model = SentenceTransformer(MODEL_NAME)

# Check model dimension
sample = chunks[0]['content'] if chunks else 'test'
emb0 = model.encode(sample)
model_dim = len(emb0)
print(f"📊 Model output dimension: {model_dim}")

# Build projection matrix if needed
rng_seed = 42
if model_dim != expected_dim:
    print(f"🔧 Dimension mismatch: {model_dim} -> {expected_dim}. Creating deterministic projection.")
    rng = np.random.RandomState(rng_seed)
    proj = rng.normal(size=(expected_dim, model_dim)).astype('float32')
    row_norms = np.linalg.norm(proj, axis=1, keepdims=True)
    row_norms[row_norms == 0] = 1.0
    proj = proj / row_norms
else:
    proj = None

def to_target_vec(vec: np.ndarray) -> np.ndarray:
    if proj is None:
        out = vec
    else:
        out = proj.dot(vec)
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

print(f"\n📤 Uploading {len(chunks)} vectors in batches of {BATCH_SIZE}...")

for i, ch in enumerate(chunks):
    text = ch['content']
    emb = model.encode(text)
    final = to_target_vec(np.array(emb))
    vec_list = final.tolist()
    
    # Ensure metadata values are not too long (Upstash limit)
    safe_metadata = {}
    for k, v in ch['metadata'].items():
        if isinstance(v, str) and len(v) > 500:
            safe_metadata[k] = v[:500] + '...'
        else:
            safe_metadata[k] = v
    
    item = {
        'id': ch['id'],
        'vector': vec_list,
        'metadata': safe_metadata
    }
    batch.append(item)
    
    if len(batch) >= BATCH_SIZE or i == len(chunks) - 1:
        # Upstash REST API format: send array of items directly (not wrapped in {vectors: []})
        # Each item format: [id, vector, metadata]
        upstash_batch = []
        for item in batch:
            upstash_batch.append([
                item['id'],
                item['vector'],
                item['metadata']
            ])
        
        try:
            r = requests.post(upload_url, headers=headers, json=upstash_batch, timeout=30)
            if r.status_code == 200:
                success += len(batch)
                print(f"✅ Uploaded batch of {len(batch)} vectors ({success}/{len(chunks)})")
            else:
                print(f'❌ Upsert failed: {r.status_code} {r.text[:300]}')
                # Try uploading one by one to find problematic chunk
                for single_item in batch:
                    single_upload = [[
                        single_item['id'],
                        single_item['vector'],
                        single_item['metadata']
                    ]]
                    r2 = requests.post(upload_url, headers=headers, json=single_upload, timeout=30)
                    if r2.status_code == 200:
                        success += 1
                        print(f"   ✅ Recovered: {single_item['id']}")
                    else:
                        fail += 1
                        print(f"   ❌ Failed: {single_item['id']} - {r2.status_code}")
        except Exception as e:
            print(f'❌ Exception during upload: {str(e)[:200]}')
            fail += len(batch)
        batch = []

print(f"\n📊 Upload complete:")
print(f"   ✅ Success: {success}/{len(chunks)}")
print(f"   ❌ Failed: {fail}/{len(chunks)}")

if fail == 0:
    print('\n🎉 All vectors uploaded successfully with enhanced chunking!')
    print('   - Multilingual model for better Chinese query support')
    print('   - More granular chunks for precise retrieval')
    print('   - Company-specific keywords for better matching')
else:
    print(f'\n⚠️ {fail} uploads failed')
