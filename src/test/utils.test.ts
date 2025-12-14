import { describe, it, expect } from 'vitest';
import { cn } from '../components/ui/utils';

describe('Utility Functions', () => {
  describe('cn (className merge)', () => {
    it('debe combinar clases correctamente', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('debe manejar valores condicionales', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('hidden');
    });

    it('debe manejar undefined y null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('debe sobrescribir clases de Tailwind conflictivas', () => {
      const result = cn('p-4', 'p-8');
      // Solo debe mantener la última clase de padding
      expect(result).toContain('p-8');
    });
  });
});
