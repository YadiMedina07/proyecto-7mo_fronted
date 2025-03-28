"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';
function TerminosPage() {
  const { theme } = useAuth();
  const [terminos, setTerminos] = useState(null);

  useEffect(() => {
    // Simulación de una llamada a la API para obtener los datos de los términos y condiciones
    const fetchTerminos = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/current`); // Ajusta la URL a la correcta
        const data = await response.json();
        setTerminos(data);
      } catch (error) {
        console.error("Error al cargar los términos y condiciones:", error);
      }
    };

    fetchTerminos();
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen mt-36 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {terminos ? (
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-md rounded-lg p-8 max-w-3xl w-full`}>
          {/* Título de los términos y condiciones */}
          <h1 className="text-3xl font-bold mb-6 text-center">{terminos.title}</h1>

          {/* Fecha de entrada en vigor */}
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center mb-4`}>
            Fecha de entrada en vigor: {new Date(terminos.effectiveDate).toLocaleDateString()}
          </p>

          {/* Contenido */}
          <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-justify whitespace-pre-line leading-relaxed`}>
            {terminos.content}
          </div>

          {/* Fecha de creación (si es necesario mostrarla) */}
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-8 text-center`}>
            Creado el: {new Date(terminos.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cargando términos y condiciones...</p>
      )}
    </div>
  );
}

export default TerminosPage;