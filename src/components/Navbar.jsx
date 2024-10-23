"use client"; // Indicar que es un Client Component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "../assets/logo_ch.png";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Extraer logout del contexto de autenticación
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white border-b-2 rounded-lg border-gray-200 fixed top-0 w-full z-10 pb-1">
      <div className="bg-gradient-to-r from-pink-500 to-pink-800 text-black py-1 text-center font-semibold">
        Aprovecha Envío Gratis!!!!!! Compra ahora y obtén envíos gratis hasta el 31 de Diciembre
      </div>
      <div className="container mx-auto flex justify-between items-center py-2">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image src={logo} alt="Logo" width={100} height={160} />
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/acercadenosotros" className="flex items-center space-x-2">
            <span>Acerca de nosotros</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/servicios" className="flex items-center space-x-2">
            <span>servicios</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/contactanos" className="flex items-center space-x-2">
            <span>Contactanos</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/politicas" className="flex items-center space-x-2">
            <span>politicas</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
          <Link href="/catalogo" className="flex items-center space-x-2">
            <span>Catalogo</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:text-pink-700">
            <Link href="/cart" className="flex items-center space-x-2">
              <FaShoppingCart className="w-6 h-6 cursor-pointer" />
              <span>Carrito</span>
            </Link>
          </div>
        {/* Usuario, Carrito y menú hamburguesa a la derecha */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-700"
            >
              <FaUser className="w-6 h-6" />
              <span>
                {isAuthenticated ? user?.name : "Usuario"} {/* Muestra el nombre si está autenticado */}
              </span>
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
                      <p className="bg-pink-700 text-white hover:bg-pink-500 px-4 py-2 rounded-lg">
                        Crear Cuenta
                      </p>
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <p className="text-sm">¡Hola, {user?.name}!</p>
                    <Link href="/profile">
                      <p className="mt-2 text-pink-700 hover:text-pink-500">
                        Ver perfil
                      </p>
                    </Link>
                    <button
                      onClick={logout} // Llamar a la función logout
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
