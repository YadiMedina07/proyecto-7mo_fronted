"use client"; // Indicar que es un Client Component

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Ajuste de useParams para obtener el token
import { CONFIGURACIONES } from '../../config/config'; // Importar configuración
import { useAuth } from '../../../context/authContext';

export default function VerifyPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const { token } = useParams(); // Obtener el token de los parámetros de la URL
  const [verificationStatus, setVerificationStatus] = useState(null); // Estado para el estado de verificación
  const [loading, setLoading] = useState(true); // Estado para mostrar el proceso de carga

  // Función para verificar el token con el backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/verify/${token}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success'); // Estado de éxito
        setTimeout(() => {
          router.push('/login'); // Redirigir al login después de unos segundos
        }, 2000);
      } else {
        setVerificationStatus(data.message || 'error'); // Estado de error
      }
    } catch (error) {
      console.error("Error en la verificación:", error);
      setVerificationStatus('error'); // Estado de error en caso de excepción
    } finally {
      setLoading(false); // Detener la carga una vez que se obtenga la respuesta
    }
  };

  // Ejecutar la verificación del token en cuanto se cargue el componente
  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false); // Detener la carga si no hay token
      setVerificationStatus('error');
    }
  }, [token]);

  // Contenido que se mostrará en la página según el estado de verificación
  return (
    <div className={`flex flex-col justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {loading ? (
        <p>Verificando tu cuenta...</p>
      ) : verificationStatus === 'success' ? (
        <p>¡Cuenta verificada exitosamente! Redirigiendo al login...</p>
      ) : (
        <p>{verificationStatus === 'error' ? "Error en la verificación. Por favor, intenta nuevamente." : verificationStatus}</p>
      )}
    </div>
  );
}