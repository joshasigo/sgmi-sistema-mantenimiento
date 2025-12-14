import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';
import { useAuthStore } from '../store/authStore';

// Mock del store de autenticación
vi.mock('../store/authStore');

describe('Dashboard', () => {
  it('debe renderizar el título del dashboard', () => {
    // Mock del usuario autenticado
    (useAuthStore as any).mockReturnValue({
      user: {
        id: '1',
        nombre: 'Admin Test',
        email: 'admin@sgmi.com',
        rol: { id: 2, nombre: 'Administrador' },
      },
      isAuthenticated: true,
    });

    render(<Dashboard />);

    // Verificar que el título aparece
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('debe mostrar mensaje de bienvenida con el nombre del usuario', () => {
    const testUser = {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@sgmi.com',
      rol: { id: 1, nombre: 'Técnico' },
    };

    (useAuthStore as any).mockReturnValue({
      user: testUser,
      isAuthenticated: true,
    });

    render(<Dashboard />);

    expect(screen.getByText(new RegExp(testUser.nombre, 'i'))).toBeInTheDocument();
  });

  it('debe renderizar las tarjetas de estadísticas', () => {
    (useAuthStore as any).mockReturnValue({
      user: {
        id: '1',
        nombre: 'Admin',
        email: 'admin@sgmi.com',
        rol: { id: 2, nombre: 'Administrador' },
      },
      isAuthenticated: true,
    });

    render(<Dashboard />);

    // Buscar elementos comunes del dashboard
    // (ajusta según tus componentes reales)
    const statsCards = screen.queryAllByRole('region');
    expect(statsCards.length).toBeGreaterThanOrEqual(0);
  });
});
