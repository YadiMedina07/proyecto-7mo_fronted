import Image from 'next/image';

function HomePage() {
  // Lista de productos para llenar las cartas
  const productos = [
    {
      id: 1,
      nombre: 'producto1',
      descripcion: 'sabor fresa.',
      precio: '$50.00 MXN',
      imagen: '/producto1.jpg', // Ruta de la imagen del producto
    },
    {
      id: 2,
      nombre: 'producto2',
      descripcion: 'sabor mango',
      precio: '$100.00 MXN',
      imagen: '/producto2.jpg',
    },
    {
      id: 3,
      nombre: 'producto3',
      descripcion: 'sabor jobo',
      precio: '$130.00 MXN',
      imagen: '/producto3.jpg',
    },
  ];

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8 pt-10">Catálogo de Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
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
