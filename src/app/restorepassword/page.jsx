"use client";

import { useState } from 'react';

function RestorePasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError('Error enviando el correo de recuperación.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda: Fondo con imagen o color */}
      <div className="hidden md:block w-1/2 bg-cover bg-green-700 p-8" style={{ backgroundImage: "url('/images/background-left.jpg')" }}>
        <div className="h-full flex flex-col justify-center text-white text-center">
          <h1 className="text-4xl font-bold">¿Olvidaste tu contraseña?</h1>
          <p className="mt-4 text-lg">Restablece tu contraseña de forma fácil y segura.</p>
        </div>
      </div>

      {/* Sección derecha: Formulario de restauración */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>
          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              {/* Correo electrónico */}
              <div className="mb-4">
                <label className="block text-gray-700 pb-5">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Enviar enlace de restablecimiento
              </button>

              {/* Mostrar error */}
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>
          ) : (
            <p className="text-green-700 text-sm text-center mt-6">
              Se ha enviado un enlace de restablecimiento a tu correo. Por favor, revisa tu bandeja de entrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestorePasswordPage;
