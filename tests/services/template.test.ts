import { describe, it, expect } from 'vitest';
import { createBuiltInVariables } from '../../src/services/template';

describe('createBuiltInVariables', () => {
  it('should create built-in variables with slug when provided', () => {
    const variables = createBuiltInVariables('test-slug');
    
    expect(variables.slug).toBe('test-slug');
    expect(variables.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(variables.datetime).toBeTruthy();
    expect(variables.timestamp).toBeTruthy();
    expect(variables.year).toBeTruthy();
    expect(variables.month).toBeTruthy();
    expect(variables.day).toBeTruthy();
  });

  it('should create built-in variables without slug when not provided', () => {
    const variables = createBuiltInVariables();
    
    expect(variables.slug).toBeUndefined();
    expect(variables.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should handle empty slug', () => {
    const variables = createBuiltInVariables('');
    
    expect(variables.slug).toBeUndefined();
  });
});