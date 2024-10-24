'use client';  // Esta línea es importante para habilitar el uso de hooks en este componente

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importamos useRouter para redirigir
import { useAuth } from '../../context/authContext'; // Importamos el contexto de autenticación

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // Obtenemos la función de login del contexto
  const router = useRouter(); // Usamos useRouter para manejar las redirecciones

  // Manejador del submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el refresh de la página

    try {
      // Llamamos a la función login del contexto
      const result = await login(email, password);
      if (result.success) {
        setMessage('Inicio de sesión exitoso');
        router.push('/');  // Redirigimos al usuario a la página de inicio
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setMessage('Error interno del servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Sección central: Formulario de login */}
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg mt-40">
        {/* Botón de "Atrás" */}
        <div className="mb-4">
          <Link href="/">
            <p className="text-pink-700 font-bold mb-6 block">&larr; Atrás</p>
          </Link>
        </div>

        {/* Título de "Inicia Sesión" */}
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Inicia Sesión</h2>

        {/* Mensaje de error si existe */}
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Correo Electrónico */}
          <div className="mb-4">
            <label className="block text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* Botón de Iniciar Sesión */}
          <button
            type="submit"
            className="w-full bg-pink-700 text-white py-2 px-4 rounded-lg hover:bg-pink-500"
          >
            Iniciar Sesión
          </button>

          {/* Crear cuenta */}
          <p className="text-xs text-black mt-4 block text-center">
            ¿No tienes una cuenta?{" "}
            <Link href="/register">
              <span className="text-blue-700 inline">Crear una cuenta</span>
            </Link>
          </p>

          {/* Botón para restablecer la contraseña */}
          <p className="text-xs text-black mt-4 block text-center">
            ¿Olvidaste tu contraseña?{" "}
            <Link href="/resetpassword">
              <span className="text-blue-700 inline">Restablecer contraseña</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
