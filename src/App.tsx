/**
 * SGMI - Sistema de Gestión de Mantenimiento Industrial
 * 
 * Frontend desarrollado en Figma y exportado como React/TypeScript
 * Diseño disponible en: https://www.figma.com/design/9PCTgEDBWatsuCDxolLL9Z/Proyecto-SGMI
 * 
 * Componentes utilizados:
 * - shadcn/ui (componentes base)
 * - React Hooks (Estado y efectos)
 * - Tailwind CSS (Estilos)
 * - Lucide React (Iconos)
 */

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { OrdenesTrabajoSection } from "./components/OrdenesTrabajoSection";
import { AppMovilSection } from "./components/AppMovilSection";
import { InventarioSection } from "./components/InventarioSection";
import { ReportesSection } from "./components/ReportesSection";
import { UsuariosSection } from "./components/UsuariosSection";
import { ConfiguracionSection } from "./components/ConfiguracionSection";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RegisterPage } from "./components/RegisterPage";
import { useAuthStore } from "./store/authStore";

type Section =
  | "dashboard"
  | "ordenes"
  | "app-movil"
  | "inventario"
  | "reportes"
  | "usuarios"
  | "configuracion";

export default function App() {
  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");
  const [showLanding, setShowLanding] = useState(false);
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "register" | "forgot-password">("landing");
  
  const { isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    // Verificar autenticación al cargar la app
    checkAuth();
  }, [checkAuth]);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "ordenes":
        return <OrdenesTrabajoSection />;
      case "app-movil":
        return <AppMovilSection />;
      case "inventario":
        return <InventarioSection />;
      case "reportes":
        return <ReportesSection />;
      case "usuarios":
        return <UsuariosSection />;
      case "configuracion":
        return <ConfiguracionSection />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowLanding(true);
    setCurrentPage("landing");
  };

  // Si está en la página de landing
  if (showLanding && currentPage === "landing") {
    return <LandingPage onGetStarted={() => {
      setShowLanding(false);
      setCurrentPage("login");
    }} />;
  }

  // Si no está autenticado, mostrar las páginas de auth
  if (!isAuthenticated) {
    if (currentPage === "register") {
      return (
        <RegisterPage 
          onBack={() => setCurrentPage("login")}
          onRegisterSuccess={() => {
            setCurrentPage("login");
          }}
        />
      );
    }

    if (currentPage === "forgot-password") {
      return (
        <ForgotPasswordPage 
          onBack={() => setCurrentPage("login")}
        />
      );
    }

    return (
      <LoginPage 
        onLoginSuccess={() => {
          // La autenticación ya se manejó en el store
        }}
        onForgotPassword={() => setCurrentPage("forgot-password")}
        onRegister={() => setCurrentPage("register")}
      />
    );
  }

  // Si está autenticado, mostrar la app
  return (
    <div className="min-h-screen bg-blue-50">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderSection()}
      </main>
    </div>
  );
}