"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';
function PoliticasPage() {
  const { theme } = useAuth();
  const [politica, setPolitica] = useState(null);

  useEffect(() => {
    // Simulación de una llamada a la API para obtener los datos de la política de privacidad
    const fetchPolitica = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES. BASEURL2}/docs/privacy-policy/current`); // Ajusta la URL a la correcta
        const data = await response.json();
        setPolitica(data);
      } catch (error) {
        console.error("Error al cargar la política:", error);
      }
    };

    fetchPolitica();
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {politica ? (
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-md rounded-lg p-8 max-w-3xl w-full`}>
          {/* Título de la política */}
          <h1 className="text-3xl font-bold mb-6 text-center">{politica.title}</h1>

          {/* Fecha de entrada en vigor */}
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
            Fecha de entrada en vigor: {new Date(politica.effectiveDate).toLocaleDateString()}
          </p>

          {/* Contenido */}
          <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-justify whitespace-pre-line leading-relaxed`}>
            {politica.content}
          </div>

          {/* Fecha de creación (si es necesaria mostrarla) */}
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-8 text-center`}>
            Creado el: {new Date(politica.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cargando política de privacidad...</p>
      )}
    </div>
  );
}

export default PoliticasPage;