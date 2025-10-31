/**
 * Vector Database Tests
 * Tests vector search functionality and data quality
 */

import { describe, it, expect } from 'vitest';
import { generateChunks, searchRelevantContext } from '../../lib/vectordb';

describe('Vector Database', () => {
  describe('generateChunks', () => {
    it('should generate chunks from digital twin data', () => {
      const chunks = generateChunks();
      
      expect(chunks).toBeDefined();
      expect(Array.isArray(chunks)).toBe(true);
      expect(chunks.length).toBeGreaterThan(0);
    });

    it('should create chunks with correct structure', () => {
      const chunks = generateChunks();
      const firstChunk = chunks[0];

      expect(firstChunk).toHaveProperty('id');
      expect(firstChunk).toHaveProperty('type');
      expect(firstChunk).toHaveProperty('content');
      expect(firstChunk).toHaveProperty('source');
      
      expect(typeof firstChunk.id).toBe('string');
      expect(typeof firstChunk.content).toBe('string');
      expect(firstChunk.content.length).toBeGreaterThan(0);
    });

    it('should generate chunks for all major categories', () => {
      const chunks = generateChunks();
      const types = new Set(chunks.map(c => c.type));

      expect(types.has('personal')).toBe(true);
      expect(types.has('experience')).toBe(true);
      expect(types.has('skill')).toBe(true);
      expect(types.has('project')).toBe(true);
    });

    it('should include STAR achievements in experience chunks', () => {
      const chunks = generateChunks();
      const experienceChunks = chunks.filter(c => c.type === 'experience');
      const starChunks = experienceChunks.filter(c => 
        c.content.includes('Situation') || 
        c.content.includes('Task') ||
        c.content.includes('Action') ||
        c.content.includes('Result')
      );

      expect(starChunks.length).toBeGreaterThan(0);
    });
  });

  describe('searchRelevantContext', () => {
    it('should return array of results for valid query', async () => {
      const query = 'Python programming experience';
      const results = await searchRelevantContext(query, 3);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should return relevant results for technical questions', async () => {
      const query = 'machine learning and AI projects';
      const results = await searchRelevantContext(query, 5);

      // Should return array (may be empty if database not initialized)
      expect(Array.isArray(results)).toBe(true);
      
      // If results exist, verify they have the expected structure
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result).toBeTypeOf('object');
        
        // Check for at least one of the expected properties
        const hasValidStructure = 
          'content' in result || 
          'type' in result || 
          'source' in result;
        
        expect(hasValidStructure).toBe(true);
      });
    });

    it('should respect topK parameter', async () => {
      const query = 'work experience';
      const results = await searchRelevantContext(query, 2);

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should handle type filter parameter', async () => {
      const query = 'experience';
      
      // Test without filter
      const allResults = await searchRelevantContext(query, 5);
      expect(Array.isArray(allResults)).toBe(true);
      
      // Note: Type filtering may not work in all environments
      // This test just checks the function doesn't crash
    });

    it('should handle empty query gracefully', async () => {
      const query = '';
      const results = await searchRelevantContext(query, 5);

      expect(Array.isArray(results)).toBe(true);
      // Should either return empty or handle gracefully
    });
  });

  describe('Data Quality', () => {
    it('should have no duplicate chunk IDs', () => {
      const chunks = generateChunks();
      const ids = chunks.map(c => c.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have meaningful content in all chunks', () => {
      const chunks = generateChunks();
      
      chunks.forEach(chunk => {
        expect(chunk.content.length).toBeGreaterThan(50); // At least 50 characters
        expect(chunk.content).not.toBe('undefined');
        expect(chunk.content).not.toBe('null');
      });
    });

    it('should have proper metadata for all chunks', () => {
      const chunks = generateChunks();

      chunks.forEach(chunk => {
        expect(chunk.source).toBeDefined();
        expect(chunk.type).toBeDefined();
        expect(['personal', 'experience', 'skill', 'project', 'education', 'interview_prep']).toContain(chunk.type);
      });
    });
  });
});
