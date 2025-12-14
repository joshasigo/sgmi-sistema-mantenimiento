/**
 * LandingPage.tsx
 * 
 * Página de inicio principal del SGMI
 * Diseñada en Figma con componentes de shadcn/ui
 * 
 * Secciones:
 * - Navbar: Navegación principal
 * - Hero Section: Presentación del producto
 * - Features: 6 características principales
 * - Why Choose: Ventajas competitivas
 * - CTA: Llamada a la acción
 * - Footer: Links y copyright
 */

import { useState } from "react";
import { ArrowRight, CheckCircle, Zap, BarChart3, Users, Shield, PhoneIcon } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">SGMI</span>
            </div>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gestiona tu mantenimiento de forma
                  <span className="text-blue-600"> inteligente</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  SGMI es la solución completa para optimizar tus procesos de mantenimiento. Reduce costos, mejora la eficiencia y mantén tus equipos en perfecto estado.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleEmailSubmit} className="flex gap-2 flex-1">
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    Comenzar <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
                <Button variant="outline" className="border-gray-300">
                  Ver Demo
                </Button>
              </div>

              <p className="text-sm text-gray-500">✨ Prueba gratuita. Sin tarjeta de crédito requerida.</p>
            </div>

            {/* Imagen/Ilustración */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-10"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20"></div>
                <div className="absolute inset-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl opacity-30 flex items-center justify-center">
                  <BarChart3 className="w-32 h-32 text-white opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Características Principales</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas para optimizar tu gestión de mantenimiento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Inteligente</h3>
              <p className="text-gray-600">
                Visualiza en tiempo real el estado de tus equipos y órdenes de trabajo con gráficos interactivos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <PhoneIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">App Móvil</h3>
              <p className="text-gray-600">
                Accede a tus órdenes de trabajo desde cualquier lugar con nuestra aplicación móvil.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automatización</h3>
              <p className="text-gray-600">
                Automatiza procesos repetitivos y ahorra tiempo en tareas administrativas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Usuarios</h3>
              <p className="text-gray-600">
                Administra roles y permisos para tus técnicos y supervisores de forma sencilla.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seguridad</h3>
              <p className="text-gray-600">
                Tus datos están protegidos con encriptación de nivel empresarial.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes</h3>
              <p className="text-gray-600">
                Genera reportes detallados para tomar decisiones informadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">¿Por qué elegir SGMI?</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Reduce Costos</h3>
                    <p className="text-gray-600">Minimiza tiempos de inactividad y optimiza recursos.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Mejora Eficiencia</h3>
                    <p className="text-gray-600">Streamlinea procesos y aumenta la productividad.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Fácil Implementación</h3>
                    <p className="text-gray-600">Comienza en minutos sin necesidad de instalación.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Soporte 24/7</h3>
                    <p className="text-gray-600">Nuestro equipo siempre está disponible para ayudarte.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-10"></div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a cientos de empresas que ya confían en SGMI para gestionar su mantenimiento.
          </p>
          <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
            Iniciar Sesión <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">SGMI</span>
              </div>
              <p className="text-sm">Sistema de Gestión de Mantenimiento</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Características</a></li>
                <li><a href="#" className="hover:text-white transition">Precios</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Términos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 SGMI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
