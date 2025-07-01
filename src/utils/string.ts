import slugify from 'slugify';

export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'en',
  });
}

export function interpolate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (key in variables) {
      const value = variables[key];
      return typeof value === 'function' ? value() : String(value);
    }
    return match;
  });
}

export function parseList(input: string, separator = ','): string[] {
  return input
    .split(separator)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}