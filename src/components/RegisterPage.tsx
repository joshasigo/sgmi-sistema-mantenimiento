/**
 * RegisterPage.tsx
 * 
 * Página de registro de nuevos usuarios del SGMI
 * Diseñada en Figma con componentes de shadcn/ui
 * 
 * Características:
 * - Validación de formulario
 * - Verificación de contraseña fuerte
 * - Validación de email
 * - Confirmación de contraseña
 * - Registro exitoso con feedback visual
 */

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterPage({ onBack, onRegisterSuccess }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.company.trim()) {
      newErrors.company = "El nombre de la empresa es requerido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simular registro
    setTimeout(() => {
      // Guardar usuario
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          name: formData.fullName.split(" ")[0],
          company: formData.company,
        })
      );

      setIsSuccess(true);
      setIsLoading(false);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    }, 1500);
  };

  const PasswordStrength = ({ password }: { password: string }) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const strengthLabels = ["Muy débil", "Débil", "Media", "Fuerte"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

    return (
      <div className="space-y-1">
        <div className="flex gap-1 h-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : "bg-gray-200"}`}
            ></div>
          ))}
        </div>
        {password && <p className="text-xs text-gray-600">Seguridad: {strengthLabels[strength - 1] || "Muy débil"}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 py-8">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white shadow-2xl border-0">
          <div className="p-8">
            {!isSuccess ? (
              <>
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al login
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-1">Crear Cuenta</h2>
                <p className="text-gray-600 mb-6">Únete a SGMI en segundos</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre completo */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="Juan Pérez"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 border-gray-200 ${errors.fullName ? "border-red-500" : ""}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 border-gray-200 ${errors.email ? "border-red-500" : ""}`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>

                  {/* Empresa */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Empresa</label>
                    <Input
                      type="text"
                      name="company"
                      placeholder="Nombre de tu empresa"
                      value={formData.company}
                      onChange={handleChange}
                      className={`border-gray-200 ${errors.company ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.company && <p className="text-xs text-red-600">{errors.company}</p>}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="+57 300 0000000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`border-gray-200 ${errors.phone ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && <PasswordStrength password={formData.password} />}
                    {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  {/* Checkbox Términos */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      Aceptó los <span className="text-blue-600 hover:underline cursor-pointer">Términos de Servicio</span> y la{" "}
                      <span className="text-blue-600 hover:underline cursor-pointer">Política de Privacidad</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                  ¿Ya tienes cuenta?{" "}
                  <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium">
                    Inicia sesión
                  </button>
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
                <p className="text-gray-600 mb-6">
                  Tu cuenta ha sido creada exitosamente. Iniciando sesión...
                </p>
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center mt-6 text-blue-100 text-sm">
          <p>© 2025 SGMI. Todos los derechos reservados.</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
