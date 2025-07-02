import { describe, it, expect } from 'vitest';
import { createSlug, interpolate, parseList } from '../../src/utils/string';

describe('string utils', () => {
  describe('createSlug', () => {
    it('should create lowercase slug from text', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(createSlug('Hello! World? 123')).toBe('hello-world-123');
    });

    it('should handle unicode characters', () => {
      expect(createSlug('Café & Restaurant')).toBe('cafe-and-restaurant');
    });
  });

  describe('interpolate', () => {
    it('should replace variables in template', () => {
      const template = 'Hello {{name}}, today is {{date}}';
      const vars = { name: 'John', date: '2024-01-15' };
      expect(interpolate(template, vars)).toBe('Hello John, today is 2024-01-15');
    });

    it('should handle function variables', () => {
      const template = 'Current time: {{time}}';
      const vars = { time: () => '10:30' };
      expect(interpolate(template, vars)).toBe('Current time: 10:30');
    });

    it('should leave unmatched variables as is', () => {
      const template = 'Hello {{name}}, {{unknown}}';
      const vars = { name: 'John' };
      expect(interpolate(template, vars)).toBe('Hello John, {{unknown}}');
    });
  });

  describe('parseList', () => {
    it('should parse comma-separated list', () => {
      expect(parseList('a, b, c')).toEqual(['a', 'b', 'c']);
    });

    it('should trim whitespace', () => {
      expect(parseList('  a  ,  b  ,  c  ')).toEqual(['a', 'b', 'c']);
    });

    it('should filter empty items', () => {
      expect(parseList('a,,b,,')).toEqual(['a', 'b']);
    });

    it('should handle custom separator', () => {
      expect(parseList('a|b|c', '|')).toEqual(['a', 'b', 'c']);
    });
  });
});