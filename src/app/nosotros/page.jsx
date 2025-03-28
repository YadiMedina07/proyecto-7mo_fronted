"use client";
function NosotrosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-10 text-center pt-48">
      <h1 className="text-4xl font-bold mb-16 text-gray-800">Nosotros</h1>

      {/* Contenedor de Misión y Visión */}
      <div className="flex gap-16 mb-16">
        {/* Misión */}
        <div className="w-80 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Misión</h2>
          <p className="text-md">
            Elaborar curados artesanales de la más alta calidad, fusionando tradición y sabor con ingredientes naturales, 
            brindando a nuestros clientes una experiencia única y auténtica en cada sorbo.
          </p>
        </div>

        {/* Visión */}
        <div className="w-80 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Visión</h2>
          <p className="text-md">
            Ser la marca líder en curados artesanales a nivel nacional, reconocida por la excelencia en nuestros productos 
            y nuestro compromiso con la cultura y la tradición mexicana.
          </p>
        </div>
      </div>

      {/* Valores (Debajo de Misión y Visión) */}
      <div className="w-80 text-gray-800 mb-20">
        <h2 className="text-2xl font-semibold mb-4">Valores</h2>
        <ul className="text-md space-y-4 text-left">
          <li> <strong>Calidad:</strong> Seleccionamos los mejores ingredientes naturales.</li>
          <li> <strong>Tradición:</strong> Respetamos las recetas originales y las técnicas artesanales.</li>
          <li> <strong>Innovación:</strong> Exploramos nuevos sabores sin perder nuestra esencia.</li>
          <li> <strong>Compromiso:</strong> Trabajamos con pasión para ofrecer lo mejor a nuestros clientes.</li>
          <li><strong>Sostenibilidad:</strong> Promovemos prácticas responsables con el medio ambiente.</li>
        </ul>
      </div>
    </div>
  );
}

export default NosotrosPage;

