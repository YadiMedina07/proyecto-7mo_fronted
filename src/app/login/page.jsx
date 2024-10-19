import Link from "next/link";

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-28">
      {/* Sección izquierda: Imagen y beneficios */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/beneficios-login.jpg')" }}
      >
        <div className="flex flex-col justify-center h-full text-white p-8 bg-green-700 bg-opacity-80">
          <h2 className="text-3xl font-bold mb-4">Beneficios:</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <span>Recibe las mejores promociones</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>Mejor calidad de servicio</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>Encuentra miles de productos que le quedan a tu vehículo</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sección derecha: Formulario de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <Link href="/">
            <p className="text-green-700 font-bold mb-6 flex hover:text-green-600">&larr; Atrás</p>
          </Link>

          <h2 className="text-2xl font-bold mb-4">Inicia Sesión</h2>

          <form>
            {/* Correo Electrónico */}
            <div className="mb-4">
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Opciones adicionales */}
            <div className="flex justify-between items-center mb-4">
              <Link href="/restorepassword">
                <p className="text-sm text-green-700 font-semibold hover:underline">
                  ¿Olvidaste tu contraseña?
                </p>
              </Link>
            </div>

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Iniciar Sesión
            </button>

            {/* Crear cuenta */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              ¿No tienes una cuenta?{" "}
              <Link href="/register">
                <p className="text-green-700 font font-semibold">Crear una cuenta</p>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
