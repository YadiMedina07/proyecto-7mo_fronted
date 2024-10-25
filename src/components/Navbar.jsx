"use client"; // Indicar que es un Client Component

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "../assets/logo_ch.png";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Extraer logout del contexto de autenticación
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false); // Nuevo menú para admin
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  const toggleDocumentAdminMenu = () => {
    setDocumentAdminMenuOpen(!documentAdminMenuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
    // Manejar el cierre de sesión con redirección
    const handleLogout = async () => {
      await logout(); // Llamar a la función de logout desde el contexto
      router.push('/'); // Redirigir al inicio después de cerrar sesión
    };
  

  // Cerrar el dropdown cuando se haga clic fuera del mismo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false); // Cerrar el menú admin si está abierto
        setDocumentAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b-2 rounded-lg border-gray-300 fixed top-0 w-full z-50 pb-4">
      <div className="bg-gradient-to-r from-pink-500 to-pink-800 text-black py-1 text-center font-semibold">
        Aprovecha Envío Gratis!!!!!! Compra ahora y obtén envíos gratis hasta el 31 de Diciembre
      </div>
      <div className="container mx-auto flex justify-between items-center py-2">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/acercade" className="flex items-center space-x-2">
            <span>Acerca de nosotros</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/servicios" className="flex items-center space-x-2">
            <span>Servicios</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/contactanos" className="flex items-center space-x-2">
            <span>Contactanos</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/politicas" className="flex items-center space-x-2">
            <span>Politicas</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/catalogo" className="flex items-center space-x-2">
            <span>Catalogo</span>
          </Link>
        </div>

        {/* Usuario, Carrito y menú hamburguesa a la derecha */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
            <Link href="/cart" className="flex items-center space-x-2">
              <FaShoppingCart className="w-6 h-6 cursor-pointer" />
              <span>Carrito</span>
            </Link>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-700"
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

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-4 z-50">
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
                      <p className="mt-2 font-semibold hover:text-pink-700 hover:font-semibold">
                        Ver perfil
                      </p>
                    </Link>

                    {user?.role === 'admin' && (
                      <div className="mt-4">
                        <button
                          onClick={toggleAdminMenu}
                          className="w-full text-left font-semibold hover:text-pink-700 hover:font-bold"
                        >
                          Opciones de Administrador
                        </button>
                        {adminMenuOpen && (
                          <div className="mt-2 bg-gray-50 border-t border-gray-200">
                            <Link href="/adminDashboard">
                              <p className="mt-2 hover:text-pink-700 hover:font-bold">
                                Dashboard Admin
                              </p>
                            </Link>
                            <Link href="/adminUsuarios">
                              <p className="mt-2 hover:text-pink-700 hover:font-bold" >
                                Gestión de Usuarios
                              </p>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {user?.role === 'admin' && (
                      <div className="mt-4">
                        <button
                          onClick={toggleDocumentAdminMenu}
                          className="w-full text-left font-semibold hover:text-pink-700 hover:font-bold"
                        >
                          Gestion de Documentos
                        </button>
                        {documentAdminMenuOpen && (
                          <div className="mt-2 bg-gray-50 border-t border-gray-200">
                            <Link href="/adminDocumentos">
                              <p className="mt-2 font-semibold hover:text-pink-700 hover:font-bold">
                                Administrar Pepe
                              </p>
                            </Link>
                            <Link href="/adminDocumentos2">
                              <p className="mt-2 font-semibold hover:text-pink-700 hover:font-bold">
                                Administrar Terminos
                              </p>
                            </Link>
                            <Link href="/adminDocumentos3">
                              <p className="mt-2 font-semibold hover:text-pink-700 hover:font-bold">
                                Administrar Deslinde
                              </p>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleLogout} // Llamar a la función logout
                      className="mt-2 text-red-500 hover:text-red-400"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
