#!/usr/bin/env python3
"""
Initialize Upstash Vector database with digital twin data using HuggingFace free API
Run: python3 scripts/init-vector-huggingface.py
"""

import json
import os
import sys
import time
import requests
from pathlib import Path

# Load environment variables
sys.path.insert(0, str(Path(__file__).parent.parent))
from dotenv import load_dotenv
load_dotenv()

# Configuration
UPSTASH_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')
HF_API_KEY = os.getenv('HF_API_KEY', '')

# HuggingFace free inference API endpoint
# Model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions, fast & free)
HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"

print("🚀 HuggingFace Embedding + Upstash Vector Database Initializer\n")
print("📍 Model: sentence-transformers/all-MiniLM-L6-v2 (384D)")
print("📍 Using HuggingFace free inference API\n")

if not UPSTASH_URL or not UPSTASH_TOKEN:
    print("❌ Error: Missing Upstash Vector credentials!")
    print("Please check your .env file has:")
    print("  - UPSTASH_VECTOR_REST_URL")
    print("  - UPSTASH_VECTOR_REST_TOKEN")
    sys.exit(1)

# Load digital twin data
digital_twin_path = Path(__file__).parent.parent / 'digitaltwin.json'
with open(digital_twin_path, 'r', encoding='utf-8') as f:
    digital_twin_data = json.load(f)

def generate_chunks():
    """Generate text chunks from digital twin data"""
    chunks = []
    chunk_id = 0

    # Personal information
    personal = digital_twin_data.get('personal', {})
    chunks.append({
        'id': f'personal-{chunk_id}',
        'type': 'personal',
        'content': f"Name: {personal.get('name', '')}. Title: {personal.get('title', '')}. Location: {personal.get('location', '')}. Summary: {personal.get('summary', '')}. Elevator Pitch: {personal.get('elevator_pitch', '')}",
        'source': 'Personal Information',
    })
    chunk_id += 1

    # Experience - STAR format
    experience = digital_twin_data.get('experience', [])
    for exp in experience:
        # Company overview
        skills = ', '.join(exp.get('technical_skills_used', []))
        chunks.append({
            'id': f'exp-overview-{chunk_id}',
            'type': 'experience',
            'content': f"{exp.get('title', '')} at {exp.get('company', '')} ({exp.get('duration', '')}). {exp.get('company_context', '')}. Team: {exp.get('team_structure', '')}. Skills: {skills}.",
            'source': f"{exp.get('company', '')} - {exp.get('title', '')}",
            'category': 'overview',
        })
        chunk_id += 1

        # Each STAR achievement
        for idx, achievement in enumerate(exp.get('achievements_star', [])):
            category = achievement.get('category', f'Achievement {idx + 1}')
            content = f"STAR Example from {exp.get('company', '')} ({category}): Situation: {achievement.get('situation', '')}. Task: {achievement.get('task', '')}. Action: {achievement.get('action', '')}. Result: {achievement.get('result', '')}."
            if achievement.get('metrics'):
                content += f" Metrics: {json.dumps(achievement.get('metrics', {}))}"
            
            chunks.append({
                'id': f'exp-star-{chunk_id}',
                'type': 'experience',
                'content': content,
                'source': f"{exp.get('company', '')} - {category}",
                'category': 'achievement',
            })
            chunk_id += 1

        # Leadership examples
        leadership = exp.get('leadership_examples', [])
        if leadership:
            chunks.append({
                'id': f'exp-leadership-{chunk_id}',
                'type': 'experience',
                'content': f"Leadership at {exp.get('company', '')}: {'. '.join(leadership)}",
                'source': f"{exp.get('company', '')} - Leadership",
                'category': 'leadership',
            })
            chunk_id += 1

    # Skills
    skills = digital_twin_data.get('skills', {}).get('technical', {})
    
    # Programming languages
    for lang in skills.get('programming_languages', []):
        chunks.append({
            'id': f'skill-lang-{chunk_id}',
            'type': 'skill',
            'content': f"Programming Language: {lang.get('language', '')} with {lang.get('years_experience', 0)} years experience. Proficiency: {lang.get('proficiency', '')}. Frameworks: {', '.join(lang.get('frameworks', []))}.",
            'source': f"Technical Skills - {lang.get('language', '')}",
            'category': 'programming',
        })
        chunk_id += 1

    # AI/ML skills
    ai_ml = skills.get('ai_ml', [])
    if ai_ml:
        chunks.append({
            'id': f'skill-ai-{chunk_id}',
            'type': 'skill',
            'content': f"AI/ML Skills: {'. '.join(ai_ml)}",
            'source': 'Technical Skills - AI/ML',
            'category': 'ai_ml',
        })
        chunk_id += 1

    # Projects
    for project in digital_twin_data.get('projects_portfolio', []):
        chunks.append({
            'id': f'project-{chunk_id}',
            'type': 'project',
            'content': f"Project: {project.get('name', '')}. Description: {project.get('description', '')}. Technologies: {', '.join(project.get('technologies', []))}. Impact: {project.get('impact', '')}.",
            'source': f"Project - {project.get('name', '')}",
        })
        chunk_id += 1

    # Career goals
    goals = digital_twin_data.get('career_goals', {})
    if goals:
        chunks.append({
            'id': f'career-goals-{chunk_id}',
            'type': 'personal',
            'content': f"Career Goals - Short term: {goals.get('short_term', '')}. Long term: {goals.get('long_term', '')}. Learning focus: {', '.join(goals.get('learning_focus', []))}.",
            'source': 'Career Goals',
        })
        chunk_id += 1

    return chunks


def get_embedding_from_huggingface(text):
    """Get embedding from HuggingFace free inference API"""
    headers = {
        'Content-Type': 'application/json',
    }
    if HF_API_KEY:
        headers['Authorization'] = f'Bearer {HF_API_KEY}'
    
    try:
        response = requests.post(
            HF_MODEL_URL,
            json={'inputs': text[:512]},  # Limit to 512 chars for speed
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"HF API returned {response.status_code}: {response.text[:200]}")
        
        embedding_data = response.json()
        
        # HuggingFace returns list of embeddings
        if isinstance(embedding_data, list) and len(embedding_data) > 0:
            vector = embedding_data[0] if isinstance(embedding_data[0], list) else embedding_data
        else:
            raise Exception(f"Unexpected HF response format: {str(embedding_data)[:100]}")
        
        return vector
        
    except Exception as e:
        print(f"    ⚠️  HF API error: {str(e)[:80]}")
        raise


def upload_to_upstash(chunks):
    """Upload chunks to Upstash Vector via REST API"""
    headers = {
        'Authorization': f'Bearer {UPSTASH_TOKEN}',
        'Content-Type': 'application/json',
    }
    
    success_count = 0
    error_count = 0
    errors = []

    print(f"✅ Generated {len(chunks)} chunks for vector storage\n")
    print(f"📤 Uploading to Upstash Vector via HuggingFace embeddings...\n")

    for i, chunk in enumerate(chunks):
        try:
            # Step 1: Get embedding from HuggingFace
            vector = get_embedding_from_huggingface(chunk['content'])
            
            # Step 2: Upsert to Upstash with the generated vector
            data = {
                'id': chunk['id'],
                'vector': vector,
                'metadata': {
                    'type': chunk['type'],
                    'source': chunk['source'],
                    'category': chunk.get('category', ''),
                    'content': chunk['content'],
                }
            }
            
            response = requests.post(
                f"{UPSTASH_URL}/upsert",
                json=data,
                headers=headers,
                timeout=15
            )
            
            if response.status_code in [200, 201]:
                success_count += 1
                if (i + 1) % 3 == 0 or i == len(chunks) - 1:
                    pct = round((success_count / len(chunks)) * 100)
                    print(f"   ✅ Uploaded {success_count}/{len(chunks)} chunks ({pct}%)")
            else:
                error_count += 1
                errors.append({'chunk_id': chunk['id'], 'status': response.status_code, 'error': response.text[:100]})
                print(f"   ❌ Upstash error on {chunk['id']}: {response.status_code}")
            
            # Delay to avoid rate limits
            time.sleep(0.5)
            
        except Exception as e:
            error_count += 1
            err_msg = str(e)[:100]
            errors.append({'chunk_id': chunk['id'], 'error': err_msg})
            print(f"   ❌ Error on {chunk['id']}: {err_msg}")
            time.sleep(1)  # Longer delay on errors

    return {'success': success_count, 'error': error_count, 'total': len(chunks), 'errors': errors}


def main():
    print('🚀 Starting vector database initialization...\n')
    
    try:
        chunks = generate_chunks()
        result = upload_to_upstash(chunks)
        
        print(f"\n{'='*60}")
        print(f"✅ Vector database initialization complete!")
        print(f"{'='*60}")
        print(f"   Total chunks: {result['total']}")
        print(f"   ✅ Successful: {result['success']}")
        if result['error'] > 0:
            print(f"   ❌ Failed: {result['error']}")
            if result['errors']:
                print(f"\n   Failed chunks (first 5):")
                for err in result['errors'][:5]:
                    print(f"     - {err.get('chunk_id', 'unknown')}: {err.get('error', err.get('status', 'unknown'))}")
        print(f"{'='*60}")
        
        if result['error'] == 0:
            print('\n🎉 All chunks uploaded successfully!')
            print('   You can now use the AI chat feature!')
            print('   Visit: http://localhost:3000')
            return 0
        elif result['success'] > 0:
            print('\n⚠️  Partial success - most chunks uploaded')
            print('   The system should still work, but some context may be missing')
            return 0
        else:
            print('\n❌ All chunks failed to upload')
            return 1
            
    except Exception as e:
        print(f'\n❌ Fatal error: {e}')
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
