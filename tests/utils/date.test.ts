import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from '../../src/utils/date';

describe('date utils', () => {
  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2024-03-05T10:30:00');
      expect(formatDate(date)).toBe('2024-03-05');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime as YYYY-MM-DD HH:MM:SS', () => {
      const date = new Date('2024-01-15T10:30:45');
      expect(formatDateTime(date)).toBe('2024-01-15 10:30:45');
    });
  });

});