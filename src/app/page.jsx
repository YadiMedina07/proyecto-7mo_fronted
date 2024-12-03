import Image from 'next/image';

function HomePage() {
  // Lista de productos por sección (se pueden personalizar más)
  const productos = [
    {
      id: 1,
      nombre: 'Producto A',
      descripcion: 'Sabor limón.',
      precio: '$50.00 MXN',
      imagen: '/assets/producto1.jpg',
    },
    {
      id: 2,
      nombre: 'Producto B',
      descripcion: 'Sabor manzana.',
      precio: '$70.00 MXN',
      imagen: '/assets/producto2.jpg',
    },
    {
      id: 3,
      nombre: 'Producto C',
      descripcion: 'Sabor durazno.',
      precio: '$90.00 MXN',
      imagen: '/assets/producto3.jpg',
    },
  ];

  return (
    <div className="container mx-auto py-8 pt-36">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8 pt-10 drop-shadow-xl">
        ENCUENTRA LOS MEJORES PRODUCTOS!!!!!!!
      </h1>
      
      {/* Sección de 3 partes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full">
        {/* Sección 1: Código QR */}
        <div className="flex justify-center items-center bg-gray-200 p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <img src="/assets/QR.jpg" alt="QR 1" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-lg font-semibold">Escanea este código QR para ver un ejemplo.</p>
          </div>
        </div>

        {/* Sección 2: Imagen */}
        <div className="flex justify-center items-center bg-gray-200 p-6 rounded-lg shadow-lg">
          <Image
            src="/assets/baner.jpg"
            alt="Imagen central"
            width={300}
            height={200}
            className="object-contain rounded-lg w-full"
          />
        </div>

        {/* Sección 3: Otro Código QR */}
        <div className="flex justify-center items-center bg-gray-200 p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <img src="/assets/QR.jpg" alt="QR 2" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-lg font-semibold">Toda la información en un clic</p>
          </div>
        </div>
      </div>

      {/* Título del Catálogo */}
      <h1 className="text-3xl font-bold text-center mb-8 pt-10">Catálogo de Productos</h1>

      {/* Catálogo de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={300}
              height={200}
              className="w-full h-60 object-contain"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-4">{producto.descripcion}</p>
              <p className="text-lg font-bold mb-4">{producto.precio}</p>
              <button className="bg-pink-700 text-white py-2 px-4 rounded hover:bg-pink-500">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
