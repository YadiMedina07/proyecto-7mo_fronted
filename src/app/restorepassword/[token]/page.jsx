"use client";
// Recibe
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/authContext';
import { CONFIGURACIONES } from '../../config/config';

function ResetPasswordPage({ params }) {
  const { theme } = useAuth(); // Obtener el tema desde el contexto
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();

  const token = params?.token; // Usamos params que Next.js envía automáticamente

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        setPasswordReset(true);
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError('Error restableciendo la contraseña.');
    }
  };

  return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} pt-48`}>
      <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-md`}>
        <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>
        {passwordReset ? (
          <p className="text-pink-700 text-sm text-center mt-6">
            Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión.
          </p>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} pb-2`}>Nueva contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} p-2 rounded-lg`}
                required
              />
            </div>

            <div className="mb-4">
              <label className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} pb-2`}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} p-2 rounded-lg`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-700 text-white py-2 px-4 rounded-lg hover:bg-pink-500"
            >
              Restablecer Contraseña
            </button>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
