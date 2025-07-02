import { describe, it, expect } from 'vitest';
import { 
  mergeVariables,
  createDefaultVariableResolver,
  createDefaultTemplateRenderer,
  getDefaultTemplate 
} from '../../src/services/template';

describe('template service', () => {
  describe('mergeVariables', () => {
    it('should merge variables from multiple sources', () => {
      const resolver = createDefaultVariableResolver();
      const globalVars = { author: 'Global Author' };
      const templateVars = { category: 'Template Category' };
      const optionVars = { title: 'Option Title' };
      
      const merged = mergeVariables(globalVars, templateVars, optionVars, resolver);
      
      expect(merged.author).toBe('Global Author');
      expect(merged.category).toBe('Template Category');
      expect(merged.title).toBe('Option Title');
    });

    it('should resolve function variables', () => {
      const resolver = createDefaultVariableResolver();
      const vars = { 
        static: 'static value',
        dynamic: () => 'dynamic value'
      };
      
      const merged = mergeVariables({}, {}, vars, resolver);
      
      expect(merged.static).toBe('static value');
      expect(merged.dynamic).toBe('dynamic value');
    });

    it('should prioritize option variables over template and global', () => {
      const resolver = createDefaultVariableResolver();
      const globalVars = { title: 'Global Title' };
      const templateVars = { title: 'Template Title' };
      const optionVars = { title: 'Option Title' };
      
      const merged = mergeVariables(globalVars, templateVars, optionVars, resolver);
      
      expect(merged.title).toBe('Option Title');
    });
  });

  describe('createDefaultTemplateRenderer', () => {
    it('should render template with variables', () => {
      const renderer = createDefaultTemplateRenderer();
      const template = 'Hello {{name}}, today is {{date}}';
      const variables = { name: 'John', date: '2024-01-15' };
      
      const result = renderer.render(template, variables);
      
      expect(result).toBe('Hello John, today is 2024-01-15');
    });
  });

  describe('getDefaultTemplate', () => {
    it('should return default markdown template', () => {
      const template = getDefaultTemplate();
      
      expect(template).toContain('---');
      expect(template).toContain('title: Untitled');
      expect(template).toContain('Write your content here...');
    });
  });
});