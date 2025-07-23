"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaMoon, FaSun } from "react-icons/fa";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logoUrl } = useLogo();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
        setSalesMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Helpers para clases condicionales
  const lightBg = (s) => theme === "light" ? s : "";
  const darkBg  = (s) => theme === "dark"  ? s : "";

  return (
    <nav
      className={`fixed top-0 w-full z-50 shadow-md ${
        theme === "dark"
          ? "bg-gray-800 border-b border-pink-600 text-white"
          : "bg-white border-b border-pink-600 text-gray-800"
      }`}
    >
      {/* Promo banner */}
      <div
        className={`overflow-hidden whitespace-nowrap bg-gradient-to-r ${
          theme === "dark" ? "from-gray-700 to-gray-800" : "from-pink-500 to-pink-700"
        } text-sm font-semibold py-1 text-center ${
          theme === "dark" ? "text-gray-200" : "text-white"
        }`}
      >
        <motion.span
          animate={{ x: ["100%", "-100%"], opacity: [1, 0.7, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          ¡Envío gratis hasta el 31 de diciembre! — Aprovecha ya y prueba nuestros curados artesanales
        </motion.span>
      </div>

      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl || "/fallback-logo.png"}
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>

        {/* Main nav links */}
        <div className="hidden lg:flex space-x-8 uppercase text-sm font-medium tracking-wide">
          {[
            ["/", "Inicio"],
            ["/nosotros", "Nosotros"],
            ["/servicios", "Servicios"],
            ["/producto", "Productos"],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              <span className="relative group pb-1 transition-colors duration-200 hover:text-pink-600">
                {label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-pink-600 group-hover:w-full transition-all duration-200" />
              </span>
            </Link>
          ))}
        </div>

        {/* Icons & user menu */}
        <div className="flex items-center space-x-4">
          <Link href="/carrito" className="group flex items-center space-x-1">
            <FaShoppingCart className="w-5 h-5 transition-colors duration-200 group-hover:text-pink-500" />
            <span className="text-sm">Carrito</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 hover:bg-pink-50 hover:text-pink-600"
            >
              <FaUser className="w-5 h-5" />
              <span className="text-sm">{isAuthenticated ? user?.name : "Usuario"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 py-2 rounded-md shadow-lg ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
              >
                {!isAuthenticated ? (
                  <div className="flex justify-around px-4 pb-4 border-b">
                    <Link href="/login">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500">
                        Ingresar
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500">
                        Crear cuenta
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="px-4">
                    <p className="text-sm font-semibold mb-2">¡Hola, {user?.name}!</p>
                    {[
                      ["/profileuser", "Ver perfil"],
                      ["/misPedidos", "Ver pedidos"],
                      ["/historialPedido", "Historial pedidos"],
                      ["/review", "Escribir reseña"],
                    ].map(([href, label]) => (
                      <Link key={href} href={href}>
                        <p className="py-1 hover:text-pink-500 cursor-pointer text-sm">{label}</p>
                      </Link>
                    ))}

                    {/* Opciones de Administrador */}
                    {user?.role === "admin" && (
                      <div className="mt-4">
                        <button
                          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                          className="w-full text-left font-semibold hover:text-pink-500"
                        >
                          Opciones de Administrador
                        </button>
                        {adminMenuOpen && (
                          <div
                            className={`${theme === "dark"
                              ? "bg-gray-600 text-gray-200"
                              : "bg-gray-50 text-gray-800"
                            } mt-2 rounded-md p-2`}
                          >
                            {[
                              ["/adminDashboard", "Dashboard Admin"],
                              ["/adminUsuarios", "Gestión de Usuarios"],
                              ["/adminProductos", "Administrar productos"],
                              ["/adminVerproductos", "Ver productos"],
                              ["/adminLowStock", "Stock crítico"],
                              ["/adminPromociones", "Administrar promociones"],
                              ["/adminPedidos", "Administrar pedidos"],
                            ].map(([href, label]) => (
                              <Link key={href} href={href}>
                                <p className="py-1 hover:text-pink-500 cursor-pointer text-sm">{label}</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gestión de Documentos */}
                    {user?.role === "admin" && (
                      <div className="mt-4">
                        <button
                          onClick={() => setDocumentAdminMenuOpen(!documentAdminMenuOpen)}
                          className="w-full text-left font-semibold hover:text-pink-500"
                        >
                          Gestión de Documentos
                        </button>
                        {documentAdminMenuOpen && (
                          <div
                            className={`${theme === "dark"
                              ? "bg-gray-600 text-gray-200"
                              : "bg-gray-50 text-gray-800"
                            } mt-2 rounded-md p-2`}
                          >
                            {[
                              ["/adminDocumentos", "Políticas de privacidad"],
                              ["/adminDocumentos2", "Términos y condiciones"],
                              ["/adminDocumentos3", "Deslinde de responsabilidad"],
                              ["/adminLogo", "Administrar Logo"],
                            ].map(([href, label]) => (
                              <Link key={href} href={href}>
                                <p className="py-1 hover:text-pink-500 cursor-pointer text-sm">{label}</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Panel de Ventas */}
                    {user?.role === "admin" && (
                      <div className="mt-4">
                        <button
                          onClick={() => setSalesMenuOpen(!salesMenuOpen)}
                          className="w-full text-left font-semibold hover:text-pink-500"
                        >
                          Panel de Ventas
                        </button>
                        {salesMenuOpen && (
                          <div
                            className={`${theme === "dark"
                              ? "bg-gray-600 text-gray-200"
                              : "bg-gray-50 text-gray-800"
                            } mt-2 rounded-md p-2`}
                          >
                            {[
                              ["/adminVentas", "Ver Ventas"],
                              ["/diarias", "Ventas diarias"],
                              ["/adminGraficos", "Gráficos de ventas"],
                              ["/inventario", "Predicciones de producción"],
                              ["/adminContactos", "Responder preguntas"],
                            ].map(([href, label]) => (
                              <Link key={href} href={href}>
                                <p className="py-1 hover:text-pink-500 cursor-pointer text-sm">{label}</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full text-left text-red-500 hover:text-red-400 text-sm font-semibold"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-pink-50 transition-colors duration-200"
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}
          >
            {theme === "light" ? (
              <FaMoon className="w-5 h-5 text-gray-800" />
            ) : (
              <FaSun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
