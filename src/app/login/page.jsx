'use client'; // Esta línea es importante para habilitar el uso de hooks en este componente

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, theme } = useAuth(); // Obtén `login` y `theme` desde el contexto
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      if (result.success) {
        setMessage('Inicio de sesión exitoso');
        router.push('/');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setMessage('Error interno del servidor');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`w-full max-w-md p-8 shadow-lg rounded-lg mt-40 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="mb-4">
          <Link href="/">
            <p className={`font-bold mb-6 block ${theme === 'dark' ? 'text-blue-300 hover:text-blue-600' : 'text-pink-700'}`}>&larr; Atrás</p>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-8 text-center">Inicia Sesión</h2>
        
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
            />
          </div>
          
          <div className="mb-4">
            <label className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-pink-600 hover:bg-pink-500"
            
          >
            Iniciar Sesión
          </button>

          <p className={`text-xs mt-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>
            ¿No tienes una cuenta?{' '}
            <Link href="/register">
              <span className={`inline font-semibold ${theme === 'dark' ? 'text-blue-300 hover:text-blue-600' : 'text-blue-700'}`}>Crear una cuenta</span>
            </Link>
          </p>

          <p className={`text-xs mt-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-black'}`}>
            ¿Olvidaste tu contraseña?{' '}
            <Link href="/resetpassword">
              <span className={`inline font-semibold ${theme === 'dark' ? 'text-blue-300 hover:text-blue-600' : 'text-blue-700'}`}>Restablecer contraseña</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
