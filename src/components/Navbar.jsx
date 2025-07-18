"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaShoppingCart,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(false); // <-- Nuevo estado
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logoUrl } = useLogo();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () => setDocumentAdminMenuOpen(!documentAdminMenuOpen);
  const toggleSalesMenu = () => setSalesMenuOpen(!salesMenuOpen); // <-- Nuevo toggle

  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
        setSalesMenuOpen(false); // <-- cerrar también el menú de ventas
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav
      className={`${theme === "dark"
        ? "bg-gray-900 border-gray-700 text-gray-200"
        : "bg-white border-b-2 text-gray-700"
      } fixed top-0 w-full z-50 pb-4 rounded-lg`}
    >
      {/* Banner animado */}
      <div className={`overflow-hidden whitespace-nowrap bg-gradient-to-r ${theme === "dark"
        ? "from-gray-800 to-gray-900 text-gray-200"
        : "from-pink-500 to-pink-800 text-black"
        } py-1 text-center font-semibold`}
      >
        <motion.span
          animate={{ x: ["100%", "-100%"], opacity: [1, 0.7, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          Aprovecha Envío Gratis!!!!!! Compra ahora y obtén envíos gratis hasta el 31 de Diciembre
        </motion.span>
      </div>

      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl || "/fallback-logo.png"}
            alt="Corazon Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* Navegación principal */}
        <div className="flex items-center space-x-10">
          {["/", "/nosotros", "/servicios", "/producto"].map((path, i) => {
            const label = ["Inicio", "Acerca de nosotros", "Servicios", "Producto"][i];
            return (
              <Link key={path} href={path}>
                <span className={`cursor-pointer ${theme === "dark"
                  ? "text-gray-200 hover:text-pink-400"
                  : "text-gray-700 hover:text-pink-700"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Iconos y dropdown */}
        <div className="flex items-center space-x-4">
          <Link href="/carrito" className={`flex items-center space-x-2 ${theme === "dark"
            ? "text-gray-200 hover:text-pink-400"
            : "text-gray-700 hover:text-pink-700"
            }`}
          >
            <FaShoppingCart className="w-6 h-6" />
            <span>compras</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className={`flex items-center space-x-2 ${theme === "dark"
                ? "text-gray-200 hover:text-pink-400"
                : "text-gray-700 hover:text-pink-700"
                }`}
            >
              <FaUser className="w-6 h-6" />
              <span>{isAuthenticated ? user?.name : "Usuario"}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${theme === "dark"
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-700"
                }`}
              >
                {!isAuthenticated ? (
                  <div className="flex justify-around items-center pb-4 border-b">
                    <Link href="/login">
                      <p className="bg-pink-700 text-white hover:bg-pink-500 px-4 py-2 rounded-lg">
                        Ingresar
                      </p>
                    </Link>
                    <Link href="/register">
                      <p className="bg-pink-700 text-white hover:bg-pink-400 px-4 py-2 rounded-lg">
                        Crear Cuenta
                      </p>
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    {/* Perfil y pedidos */}
                    <p className="text-sm font-semibold">¡Hola, {user?.name}!</p>
                    {[
                      ["/profileuser","Ver perfil"],
                      ["/misPedidos","Ver pedidos"],
                      ["/historialPedido","Historial pedidos"],
                      ["/review","Escribir reseña"],
                    ].map(([href,label]) => (
                      <Link key={href} href={href}>
                        <p className={`mt-2 font-semibold ${theme === "dark"
                          ? "hover:text-pink-400"
                          : "hover:text-pink-700"
                          }`}
                        >
                          {label}
                        </p>
                      </Link>
                    ))}

                    {/* Opciones de Administrador */}
                    {user?.role === "admin" && (
                      <div className="mt-4">
                        <button
                          onClick={toggleAdminMenu}
                          className={`w-full text-left font-semibold ${theme === "dark"
                            ? "hover:text-pink-400"
                            : "hover:text-pink-700"
                            }`}
                        >
                          Opciones de Administrador
                        </button>
                        {adminMenuOpen && (
                          <div className={`mt-2 ${theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            {[
                              ["/adminDashboard","Dashboard Admin"],
                              ["/adminUsuarios","Gestión de Usuarios"],
                              ["/adminProductos","Administrar productos"],
                              ["/adminVerproductos","Ver productos"],
                              ["/adminLowStock","Productos de bajo stock"],
                              ["/adminPromociones","Administrar promociones"],
                              ["/adminPedidos","Administrar pedidos"],
                            ].map(([href,label]) => (
                              <Link key={href} href={href}>
                                <p className={`mt-2 ${theme === "dark"
                                  ? "hover:text-pink-400"
                                  : "hover:text-green-700"
                                  }`}
                                >
                                  {label}
                                </p>
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
                          onClick={toggleDocumentAdminMenu}
                          className={`w-full text-left font-semibold ${theme === "dark"
                            ? "hover:text-pink-400"
                            : "hover:text-pink-700"
                            }`}
                        >
                          Gestión de Documentos
                        </button>
                        {documentAdminMenuOpen && (
                          <div className={`mt-2 border-t ${theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            {[
                              ["/adminDocumentos","Administrar Políticas"],
                              ["/adminDocumentos2","Administrar Términos"],
                              ["/adminDocumentos3","Administrar Deslinde"],
                              ["/adminLogo","Administrar Logo"],
                            ].map(([href,label]) => (
                              <Link key={href} href={href}>
                                <p className={`mt-2 ${theme === "dark"
                                  ? "hover:text-pink-400"
                                  : "hover:text-pink-700"
                                  }`}
                                >
                                  {label}
                                </p>
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
                          onClick={toggleSalesMenu}
                          className={`w-full text-left font-semibold ${theme === "dark"
                            ? "hover:text-pink-400"
                            : "hover:text-pink-700"
                            }`}
                        >
                          Panel de Ventas
                        </button>
                        {salesMenuOpen && (
                          <div className={`mt-2 border-t ${theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <Link href="/adminVentas">
                              <p className={`mt-2 ${theme === "dark"
                                ? "hover:text-pink-400"
                                : "hover:text-pink-700"
                                }`}
                              >
                                Ver Ventas
                              </p>
                            </Link>
                            <Link href="/diarias">
                              <p className={`mt-2 ${theme === "dark"
                                ? "hover:text-pink-400"
                                : "hover:text-pink-700"
                                }`}
                              >
                                Reportes de Ventas diarias
                              </p>
                            </Link>
                            <Link href="/adminGraficos">
                              <p className={`mt-2 ${theme === "dark"
                                ? "hover:text-pink-400"
                                : "hover:text-pink-700"
                                }`}
                              >
                                Grafico de Ventas
                              </p>
                            </Link>
                            {/* Añade aquí más enlaces de ventas si los necesitas */}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="mt-4 text-red-500 hover:text-red-400 font-semibold"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center ${theme === "dark"
              ? "text-yellow-400"
              : "text-gray-700 hover:text-yellow-600"
              }`}
          >
            {theme === "light" ? (
              <FaMoon className="w-6 h-6" title="Modo Oscuro" />
            ) : (
              <FaSun className="w-6 h-6" title="Modo Claro" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
