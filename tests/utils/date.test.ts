import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, getDateVariables } from '../../src/utils/date';

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

  describe('getDateVariables', () => {
    it('should return all date-related variables', () => {
      const date = new Date('2024-01-15T10:30:45');
      const vars = getDateVariables(date);
      
      expect(vars).toHaveProperty('date', '2024-01-15');
      expect(vars).toHaveProperty('datetime', '2024-01-15 10:30:45');
      expect(vars).toHaveProperty('year', '2024');
      expect(vars).toHaveProperty('month', '01');
      expect(vars).toHaveProperty('day', '15');
      expect(vars).toHaveProperty('timestamp');
      expect(Number(vars.timestamp)).toBe(date.getTime());
    });
  });
});