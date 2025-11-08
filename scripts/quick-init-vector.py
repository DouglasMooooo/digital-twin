#!/usr/bin/env python3
"""
Initialize Upstash Vector with locally generated embeddings using minimal deps
Run: python3 scripts/quick-init-vector.py
"""

import json
import os
import sys
import time
import hashlib
import requests
from pathlib import Path

# Load environment variables
sys.path.insert(0, str(Path(__file__).parent.parent))
from dotenv import load_dotenv
load_dotenv()

# Configuration
UPSTASH_URL = os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_TOKEN = os.getenv('UPSTASH_VECTOR_REST_TOKEN')

print("🚀 Quick Vector DB Initializer (using deterministic embeddings)\n")

if not UPSTASH_URL or not UPSTASH_TOKEN:
    print("❌ Error: Missing Upstash Vector credentials!")
    sys.exit(1)

# Load digital twin data
digital_twin_path = Path(__file__).parent.parent / 'digitaltwin.json'
with open(digital_twin_path, 'r', encoding='utf-8') as f:
    digital_twin_data = json.load(f)

def generate_deterministic_vector(text, dimensions=384):
    """
    Generate a deterministic vector from text using hash-based approach.
    This ensures consistent vectors for the same text.
    While not semantically meaningful, it works for basic retrieval.
    """
    # Use SHA256 hash to generate seed
    hash_obj = hashlib.sha256(text.encode())
    hash_hex = hash_obj.hexdigest()
    
    # Convert hash to floats in range [-1, 1]
    vector = []
    for i in range(dimensions):
        # Take 2 hex chars at a time
        hex_pair = hash_hex[(i * 2) % len(hash_hex):(i * 2 + 2) % len(hash_hex)]
        if len(hex_pair) < 2:
            hex_pair = hash_hex[0:2]
        # Convert hex to 0-255, then to -1 to 1
        val = int(hex_pair, 16) / 255.0
        vector.append(val * 2 - 1)
    
    return vector

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


def upload_to_upstash(chunks):
    """Upload chunks to Upstash Vector"""
    headers = {
        'Authorization': f'Bearer {UPSTASH_TOKEN}',
        'Content-Type': 'application/json',
    }
    
    success_count = 0
    error_count = 0

    print(f"✅ Generated {len(chunks)} chunks\n")
    print(f"📤 Uploading to Upstash Vector...\n")

    for i, chunk in enumerate(chunks):
        try:
            # Generate deterministic vector (384 dimensions)
            vector = generate_deterministic_vector(chunk['content'], 384)
            
            # Upsert to Upstash
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
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                success_count += 1
                if (i + 1) % 5 == 0 or i == len(chunks) - 1:
                    pct = round((success_count / len(chunks)) * 100)
                    print(f"   ✅ {success_count}/{len(chunks)} ({pct}%)")
            else:
                error_count += 1
                print(f"   ❌ {chunk['id']}: {response.status_code}")
            
            time.sleep(0.2)
            
        except Exception as e:
            error_count += 1
            print(f"   ❌ {chunk['id']}: {str(e)[:50]}")
            time.sleep(0.5)

    return success_count, error_count, len(chunks)


def main():
    print('🚀 Initializing vector database...\n')
    
    try:
        chunks = generate_chunks()
        success, errors, total = upload_to_upstash(chunks)
        
        print(f"\n{'='*50}")
        print(f"✅ Complete!")
        print(f"{'='*50}")
        print(f"Total: {total} | Success: {success} | Failed: {errors}")
        
        if errors == 0:
            print('\n🎉 All chunks uploaded!')
            print('Chat is ready!')
            return 0
        elif success > 0:
            print('\n⚠️  Partial success')
            return 0
        else:
            return 1
            
    except Exception as e:
        print(f'\n❌ Error: {e}')
        return 1


if __name__ == '__main__':
    sys.exit(main())
