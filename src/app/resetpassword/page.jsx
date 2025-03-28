"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIGURACIONES } from '../config/config';
import { useAuth } from '../../context/authContext';

function RequestPasswordResetPage() {
  const { theme } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [preguntaSecreta, setPreguntaSecreta] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [method, setMethod] = useState('email'); // 'email' o 'secretQuestion'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let response;
      if (method === 'email') {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/send-reset-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } else {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/verify-secret-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, telefono, respuestaSecreta })
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (method === 'email') {
          setMessage('Correo enviado con éxito. Revisa tu bandeja de entrada.');
        } else {
          router.push(`/restorepassword/${data.token}`);
        }
      } else {
        setError(data.message || 'Ocurrió un error.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        // Quita el flex vertical y agrega un padding top grande
        pt-36 
        min-h-screen 
        ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}
      `}
    >
      {/* Contenedor centrado horizontalmente */}
      <div className="max-w-md mx-auto p-6 border rounded bg-white dark:bg-gray-200 dark:text-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>

        {/* Selector de método */}
        <div className="mb-4">
          <button
            onClick={() => setMethod('email')}
            className={`mr-2 ${method === 'email' ? 'font-bold' : ''}`}
          >
            Por correo
          </button>
          <button
            onClick={() => setMethod('secretQuestion')}
            className={`${method === 'secretQuestion' ? 'font-bold' : ''}`}
          >
            Por pregunta secreta
          </button>
        </div>

        {message && <p className="mb-4 text-pink-600">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          {method === 'secretQuestion' && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Teléfono registrado</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="10 dígitos"
                  maxLength="10"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Pregunta secreta</label>
                <select
                  value={preguntaSecreta}
                  onChange={(e) => setPreguntaSecreta(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>Selecciona tu pregunta secreta</option>
                  <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                  <option value="¿Cuál es tu película favorita?">¿Cuál es tu película favorita?</option>
                  <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Respuesta secreta</label>
                <input
                  type="text"
                  value={respuestaSecreta}
                  onChange={(e) => setRespuestaSecreta(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Tu respuesta"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-pink-600 text-white rounded"
          >
            {loading ? 'Procesando...' : (method === 'email' ? 'Enviar enlace' : 'Verificar respuesta')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;