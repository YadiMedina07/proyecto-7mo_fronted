"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();
  const { token } = router.query; // Obtener el token de la URL

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        setPasswordReset(true);
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError('Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda: Fondo con imagen o color */}
      <div className="hidden md:block w-1/2 bg-cover bg-blue-500 p-8" style={{ backgroundImage: "url('/images/background-left.jpg')" }}>
        <div className="h-full flex flex-col justify-center text-white text-center">
          <h1 className="text-4xl font-bold">Restablecer Contraseña</h1>
          <p className="mt-4 text-lg">Protege tu cuenta creando una contraseña segura</p>
        </div>
      </div>

      {/* Sección derecha: Formulario de restablecimiento */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Cambiar Contraseña</h2>
          {!passwordReset ? (
            <form onSubmit={handlePasswordChange}>
              {/* Nueva contraseña */}
              <div className="mb-4">
                <label className="block text-gray-700">Escriba su contraseña</label>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full border p-2 rounded-lg ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
              </div>

              {/* Confirmar contraseña */}
              <div className="mb-4">
                <label className="block text-gray-700">Confirme su contraseña</label>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full border p-2 rounded-lg ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
              </div>

              {/* Mostrar error si las contraseñas no coinciden */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {/* Botón de restablecer */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500"
              >
                Cambiar la contraseña
              </button>
            </form>
          ) : (
            <p className="text-green-600 text-sm text-center mt-6">
              Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
