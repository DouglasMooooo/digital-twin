#!/usr/bin/env python3
"""
Quick embedding test script.
Usage: python scripts/test-embedding.py
Prints embedding dimension and first 6 values for a sample text.
"""
from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = 'all-mpnet-base-v2'  # 可改成 'all-MiniLM-L6-v2'（384D）

print(f"✓ Loading model: {MODEL_NAME}")
model = SentenceTransformer(MODEL_NAME)

texts = ["谁构建了 Digital Twin？"]
print(f"✓ Encoding text: {texts[0]}")
embs = model.encode(texts, show_progress_bar=False)

print(f"\n📊 结果:")
print(f"  维度 (Dimension): {len(embs[0])}")
print(f"  前 6 个值 (First 6): {embs[0][:6]}")
print(f"  类型 (Type): {type(embs[0])}")
print(f"  范围 (Min/Max): [{np.min(embs[0]):.4f}, {np.max(embs[0]):.4f}]")
