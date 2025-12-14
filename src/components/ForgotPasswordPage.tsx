/**
 * ForgotPasswordPage.tsx
 * 
 * Página de recuperación de contraseña del SGMI
 * Diseñada en Figma con componentes de shadcn/ui
 * 
 * Características:
 * - Solicitud de recuperación por email
 * - Validación de email
 * - Confirmación de envío
 * - Opción de volver al login
 */

import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    setIsLoading(true);

    // Simular envío de email
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white shadow-2xl border-0">
          <div className="p-8">
            {!isSubmitted ? (
              <>
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al login
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h2>
                <p className="text-gray-600 mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Enlace de Recuperación"
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                  Si no recibiste el email, revisa tu carpeta de spam o espera unos minutos.
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo Enviado!</h2>
                <p className="text-gray-600 mb-6">
                  Hemos enviado un enlace de recuperación a <span className="font-semibold">{email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Próximos pasos:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Abre tu correo electrónico</li>
                    <li>Busca el email de SGMI</li>
                    <li>Haz clic en el enlace de recuperación</li>
                    <li>Crea una nueva contraseña</li>
                  </ol>
                </div>

                <Button
                  onClick={onBack}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Volver al Login
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="w-full mt-3 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Intentar con otro correo
                </button>
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
      `}</style>
    </div>
  );
}
