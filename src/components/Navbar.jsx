"use client"; // Indicar que es un Client Component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaFileInvoice,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useRouter } from "next/navigation"; // Importa el hook de useRouter para la redirección
import { motion } from "framer-motion"; // Para transiciones suaves

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logoUrl } = useLogo();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () =>
    setDocumentAdminMenuOpen(!documentAdminMenuOpen);

  // Este useEffect asegura que el componente se renderice solo después de que esté montado en el cliente
  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
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
      className={`${theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-b-2 text-gray-700"
        } fixed top-0 w-full z-50 pb-4 rounded-lg`}
    >
      <div
        className={`overflow-hidden whitespace-nowrap bg-gradient-to-r ${theme === "dark"
          ? "from-gray-800 to-gray-900 text-gray-200"
          : "from-pink-500 to-pink-800 text-black"
          } py-1 text-center font-semibold`}
      >
        <motion.span
          animate={{
            x: ["100%", "-100%"], // Desplazamiento de derecha a izquierda
            opacity: [1, 0.7, 1], // Parpadeo suave
          }}
          transition={{
            duration: 10, // Velocidad del desplazamiento
            repeat: Infinity, // Animación continua
            ease: "linear", // Movimiento constante sin pausas
          }}
          className="inline-block"
        >
          Aprovecha Envío Gratis!!!!!! Compra ahora y obtén envíos gratis hasta el 31 de Diciembre
        </motion.span>
      </div>

      <div className="container mx-auto flex justify-between items-center ">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={logoUrl || "/fallback-logo.png"}
              alt="Corazon Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-10">
          <Link href="/">
            <span className={`cursor-pointer ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"}`}>
              Inicio
            </span>
          </Link>
          <Link href="/nosotros">
            <span className={`cursor-pointer ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"}`}>
              Acerca de nosotros
            </span>
          </Link>
          <Link href="/servicios">
            <span className={`cursor-pointer ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"}`}>
              Servicios
            </span>
          </Link>
          <Link href="/producto">
            <span className={`cursor-pointer ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"}`}>
              Producto
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/carrito" className={`flex items-center space-x-2 ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"}`}>
            <FaShoppingCart className="w-6 h-6 cursor-pointer" />
            <span>compras</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className={`flex items-center space-x-2 ${theme === "dark" ? "text-gray-200 hover:text-pink-400" : "text-gray-700 hover:text-pink-700"
                }`}
            >
              <FaUser className="w-6 h-6" />
              <span>{isAuthenticated ? user?.name : "Usuario"}</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"}`}>
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
                    <p className="text-sm font-semibold">¡Hola, {user?.name}!</p>
                    <Link href="/profileuser">
                      <p className={`mt-2 font-semibold ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                        Ver perfil
                      </p>
                    </Link>
                    <Link href="/misPedidos">
                      <p className={`mt-2 font-semibold ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                        Ver pedidos
                      </p>
                    </Link>
                    <Link href="/historialPedido">
                      <p className={`mt-2 font-semibold ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                        Ver historial pedidos
                      </p>
                    </Link>
                    <Link href="/review">
                      <p className={`mt-2 font-semibold ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                     Escribir reseña</p>
                    </Link>
                    {user?.role === "admin" && (
                      <div className="mt-4">
                        <button
                          onClick={toggleAdminMenu}
                          className={`w-full text-left font-semibold ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}
                        >
                          Opciones de Administrador
                        </button>
                        {adminMenuOpen && (
                          <div className={`mt-2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                            <Link href="/adminDashboard">
                              <p className={`mt-2 ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                                Dashboard Admin
                              </p>
                            </Link>
                            <Link href="/adminUsuarios">
                              <p className={`mt-2 ${theme === "dark" ? "hover:text-pink-400" : "hover:text-pink-700"}`}>
                                Gestión de Usuarios
                              </p>
                            </Link>
                            <Link href="/adminProductos">
                              <p
                                className={`mt-2 ${theme === "dark"
                                  ? "hover:text-yellow-400"
                                  : "hover:text-green-700"
                                  }`}
                              >
                                Administrar productos
                              </p>
                            </Link>
                            <Link href="/adminVerproductos">
                              <p
                                className={`mt-2 ${theme === "dark"
                                  ? "hover:text-yellow-400"
                                  : "hover:text-green-700"
                                  }`}
                              >
                                Ver productos
                              </p>
                            </Link>
                            <Link href="/inventario">
                              <p
                                className={`mt-2 ${theme === "dark"
                                  ? "hover:text-yellow-400"
                                  : "hover:text-green-700"
                                  }`}
                              >
                                Administrar inventario
                              </p>
                            </Link>
                            <Link href="/adminPromociones">
                              <p
                                className={`mt-2 ${theme === "dark"
                                  ? "hover:text-yellow-400"
                                  : "hover:text-green-700"
                                  }`}
                              >
                                Administrar promociones
                              </p>
                            </Link>
                            <Link href="/adminPedidos">
                              <p
                                className={`mt-2 ${theme === "dark"
                                  ? "hover:text-yellow-400"
                                  : "hover:text-green-700"
                                  }`}
                              >
                                Administrar pedidos
                              </p>
                            </Link>
                          </div>
                        )}
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
                              <div
                                className={`mt-2 border-t ${theme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-gray-50 border-gray-200"
                                  }`}
                              >
                                <Link href="/adminDocumentos">
                                  <p
                                    className={`mt-2 ${theme === "dark"
                                      ? "hover:text-pink-400"
                                      : "hover:text-pink-700"
                                      }`}
                                  >
                                    Administrar Politicas
                                  </p>
                                </Link>
                                <Link href="/adminDocumentos2">
                                  <p
                                    className={`mt-2 ${theme === "dark"
                                      ? "hover:text-pink-400"
                                      : "hover:text-pink-700"
                                      }`}
                                  >
                                    Administrar Terminos
                                  </p>
                                </Link>
                                <Link href="/adminDocumentos3">
                                  <p
                                    className={`mt-2 ${theme === "dark"
                                      ? "hover:text-pink-400"
                                      : "hover:text-pink-700"
                                      }`}
                                  >
                                    Administrar Deslinde
                                  </p>
                                </Link>
                                <Link href="/adminLogo">
                                  <p
                                    className={`mt-2 ${theme === "dark"
                                      ? "hover:text-yellow-400"
                                      : "hover:text-green-700"
                                      }`}
                                  >
                                    Administrar Logo
                                  </p>
                                </Link>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <button onClick={handleLogout} className="mt-2 text-red-500 hover:text-red-400">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center ${theme === "dark" ? "text-yellow-400" : "text-gray-700 hover:text-yellow-600"}`}
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
