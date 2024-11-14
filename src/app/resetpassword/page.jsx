"use client"; // Para asegurar que es un componente del cliente
//este es el que manda
import { useState } from 'react';
import { CONFIGURACIONES } from '../config/config';
import { useAuth } from '../../context/authContext';
function RequestPasswordResetPage() {
  const { theme } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor, ingresa un correo válido');
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES. BASEURL2}/auth/send-reset-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Correo enviado con éxito, revisa tu bandeja de entrada');
        setError(''); // Limpiar error si es exitoso
      } else {
        const result = await response.json();
        setError(result.message || 'No se pudo enviar el correo');
      }
    } catch (error) {
      setError('Hubo un problema enviando el correo de recuperación.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-md`}>
        <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>
        
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={handleEmailChange}
              className={`w-full border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} p-2 rounded-lg`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-700 text-white py-2 px-4 rounded-lg hover:bg-pink-500"
          >
            Enviar enlace de restablecimiento
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;