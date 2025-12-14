import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../components/LoginPage';
import { useAuthStore } from '../store/authStore';

// Mock del store de autenticación
vi.mock('../store/authStore');

describe('LoginPage', () => {
  const mockOnLoginSuccess = vi.fn();
  const mockOnForgotPassword = vi.fn();
  const mockOnRegister = vi.fn();
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar mock del store
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it('debe renderizar el formulario de login correctamente', () => {
    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
        onForgotPassword={mockOnForgotPassword}
        onRegister={mockOnRegister}
      />
    );

    // Verificar que los campos están presentes
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debe permitir escribir en los campos de email y contraseña', () => {
    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    const emailInput = screen.getByPlaceholderText(/correo electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/contraseña/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'admin@sgmi.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin123' } });

    expect(emailInput.value).toBe('admin@sgmi.com');
    expect(passwordInput.value).toBe('Admin123');
  });

  it('debe llamar al login cuando se envía el formulario con datos válidos', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    const emailInput = screen.getByPlaceholderText(/correo electrónico/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'admin@sgmi.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Admin123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@sgmi.com',
        password: 'Admin123',
        demoMode: false,
      });
    });

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it('debe mostrar el spinner de carga cuando isLoading es true', () => {
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });

    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    // Verificar que el botón está deshabilitado
    const submitButton = screen.getByRole('button', { name: /iniciando sesión/i });
    expect(submitButton).toBeDisabled();
  });

  it('debe mostrar error cuando el login falla', () => {
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Credenciales incorrectas',
      clearError: mockClearError,
    });

    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
  });

  it('debe alternar la visibilidad de la contraseña', () => {
    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
      />
    );

    const passwordInput = screen.getByPlaceholderText(/contraseña/i) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });

    // Inicialmente debe ser tipo password
    expect(passwordInput.type).toBe('password');

    // Click para mostrar
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click para ocultar
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('debe llamar a onForgotPassword cuando se hace click en "Olvidé mi contraseña"', () => {
    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
        onForgotPassword={mockOnForgotPassword}
      />
    );

    const forgotPasswordLink = screen.getByText(/olvidé mi contraseña/i);
    fireEvent.click(forgotPasswordLink);

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });

  it('debe llamar a onRegister cuando se hace click en "Crear cuenta"', () => {
    render(
      <LoginPage 
        onLoginSuccess={mockOnLoginSuccess}
        onRegister={mockOnRegister}
      />
    );

    const registerLink = screen.getByText(/crear cuenta/i);
    fireEvent.click(registerLink);

    expect(mockOnRegister).toHaveBeenCalled();
  });
});
