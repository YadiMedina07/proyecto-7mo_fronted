"use client";

export default function UbicacionPage() {
  return (
    <div className="container mx-auto p-6 pt-48">
      <h1 className="text-3xl font-bold text-center mb-6">Nuestra Ubicación</h1>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Mapa */}
        <div className="relative">
          <iframe
            className="w-full h-80 rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d556.223149749565!2d-98.41954227364508!3d21.142017452192405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1738701326403!5m2!1ses!2smx"
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Información de la ubicación */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Dirección</h2>
          <p className="text-lg">
            📍Av Juárez #22 esquina con Hilario Menindez, Huejutla de Reyes Centro, Mexico
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Horario de Atención</h2>
          <ul className="text-lg">
            <li>🕘 Lunes a Viernes: 9:00 AM - 10:00 PM</li>
            <li>🕙 Sábado: 10:00 AM - 9:00 PM</li>
            <li>🚫 Domingo: Cerrado</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-4">Contacto</h2>
          <p>📞 Teléfono: 771 556 9607</p>
          <p>📧 Email: corazonhuasteco2023@hotmail.com</p>

          {/* Botón para abrir en Google Maps */}
          <a
            href="https://goo.gl/maps/Y7h8wABxYt72"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
