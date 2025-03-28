
"use client"; // Asegura que este es un Client Component

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config"; // Importar las configuraciones

function AdminDashboard() {
  const { user, isAuthenticated,theme } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ email: "", duration: "" });
  
  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"; // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  // Función para abrir el modal
  const openModal = (email) => {
    setModalData({ email, duration: "" }); // Captura el correo del usuario
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ email: null, duration: "" }); // Reinicia los datos del modal
  };

  // Cargar datos si el usuario es admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {

      const fetchData = async () => {
        
        try {
          // 1. Usuarios recientes
          const recentUsersResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`,
            {
              method: "GET",
              credentials: "include", // Enviar la cookie
            }
          );
          const recentUsersData = await recentUsersResponse.json();
          setRecentUsers(recentUsersData);

          // 2. Usuarios bloqueados
          await fetchBlockedUsers();

          // 3. Intentos fallidos
          const failedAttemptsResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`,
            {
              method: "GET",
              credentials: "include", // Enviar la cookie
            }
          );
          const failedAttemptsData = await failedAttemptsResponse.json();
          setFailedAttempts(failedAttemptsData);

          // 4. Inicios de sesión recientes
          await fetchRecentLogins();
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };

      // Ejecutar la función la primera vez y luego cada X tiempo (aquí cada 30s)
      fetchData();
      const intervalId = setInterval(fetchData, 30_000);

      // Limpiar el intervalo al desmontar
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);


  // Bloqueo temporal de usuario
  const blockUserTemporarily = async ({ email, duration }) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, lockDuration: duration }),
        }
      );
      if (response.ok) {
        console.log("Usuario bloqueado temporalmente");
        closeModal();
      } else {
        const data = await response.json();
        console.error("Error al bloquear temporalmente:", data.message);
      }
    } catch (error) {
      console.error("Error al bloquear temporalmente:", error);
    }
  };
  

  // Bloqueo permanente de usuario
  const blockUser = async (userId) => {

    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {

            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario bloqueado exitosamente");
      } else {
        const data = await response.json();
        console.error("Error al bloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al bloquear usuario:", error);
    }
  };

  // Obtener usuarios bloqueados
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      const data = await response.json();
      setBlockedUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error);
    }
  };

  // Obtener inicios de sesión recientes
  const fetchRecentLogins = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      const data = await response.json();
      setRecentLogins(data);
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error);
    }
  };
  // Desbloquear usuario
  const unblockUser = async (userId) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {

            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario desbloqueado exitosamente");
        fetchBlockedUsers(); // Actualizar la lista de usuarios bloqueados
      } else {
        const data = await response.json();
        console.error("Error al desbloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al desbloquear usuario:", error);
    }
  };




  return (
    <div
      className={`w-full min-h-screen py-8 pt-36 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center pt-10 text-pink-600">
        ADMINISTRACION
      </h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Usuarios Recientes */}
        <div
          className={`shadow-lg rounded-lg p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-pink-50"
          } border border-pink-400`}
        >
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            Usuarios Recientes
          </h2>
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user._id}
                className={`${
                  theme === "dark"
                    ? "bg-pink-700 text-gray-100"
                    : "bg-pink-100 text-gray-900"
                } rounded-lg p-4 mb-4 shadow`}
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay usuarios recientes</p>
          )}
        </div>
  
        {/* Usuarios Bloqueados */}
        <div
          className={`shadow-lg rounded-lg p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-red-50"
          } border border-red-400`}
        >
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            Usuarios Bloqueados Recientemente
          </h2>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div
                key={user.id}
                className={`${
                  theme === "dark"
                    ? "bg-red-600 text-gray-100"
                    : "bg-red-100 text-gray-900"
                } rounded-lg p-4 mb-4 shadow`}
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Tipo de Bloqueo:</strong> {user.blockedType}
                </p>
                {user.blockedType === "Temporary" && (
                  <p>
                    <strong>Bloqueado Hasta:</strong>{" "}
                    {new Date(user.lockedUntil).toLocaleString()}
                  </p>
                )}
                <p>
                  <strong>Última Actualización:</strong>{" "}
                  {new Date(user.lastUpdated).toLocaleString()}
                </p>
                {user.currentlyBlocked && (
                  <button
                    className="bg-pink-500 text-white px-4 py-2 rounded mt-2 hover:bg-pink-600"
                    onClick={() => unblockUser(user.id)}
                  >
                    Desbloquear
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay usuarios bloqueados</p>
          )}
        </div>
  
        {/* Intentos Fallidos */}
        <div
          className={`shadow-lg rounded-lg p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-yellow-50"
          } border border-yellow-400`}
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">
            Intentos Fallidos Recientes
          </h2>
          {failedAttempts.length > 0 ? (
            failedAttempts.map((user) => (
              <div
                key={user.id}
                className={`${
                  theme === "dark"
                    ? "bg-yellow-600 text-gray-100"
                    : "bg-yellow-100 text-gray-900"
                } rounded-lg p-4 mb-4 shadow`}
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Intentos Fallidos:</strong> {user.failedLoginAttempts}
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                  onClick={() => blockUser(user.id)}
                >
                  Bloquear permanentemente
                </button>
                <button
                  onClick={() => openModal(user.email)} // Envía el email en lugar del ID
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2"
                >
                  Bloquear Temporalmente
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay intentos fallidos recientes</p>
          )}
        </div>

                {/* Modal */}
                {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">
                Bloquear Temporalmente
              </h2>
              <p>
                Ingresa la duración (en horas) para bloquear al usuario con ID:{" "}
                <strong>{modalData.email}</strong>
              </p>
              <input
                type="number"
                className="w-full border rounded-lg p-2 mt-4"
                placeholder="Duración en horas"
                value={modalData.duration}
                onChange={(e) =>
                  setModalData({ ...modalData, duration: e.target.value })
                }
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => blockUserTemporarily(modalData)} // Acción del modal
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        )}


  
        {/* Inicios de Sesión Recientes */}
        <div
          className={`shadow-lg rounded-lg p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-blue-50"
          } border border-blue-400`}
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Inicios de Sesión Recientes
          </h2>
          {recentLogins.length > 0 ? (
            recentLogins.map((login) => (
              <div
                key={login._id}
                className={`${
                  theme === "dark"
                    ? "bg-blue-600 text-gray-100"
                    : "bg-blue-100 text-gray-900"
                } rounded-lg p-4 mb-4 shadow`}
              >
                <p>
                  <strong>Nombre:</strong> {login.name}
                </p>
                <p>
                  <strong>Correo:</strong> {login.email}
                </p>
                <p>
                  <strong>Último Inicio de Sesión:</strong>{" "}
                  {new Date(login.lastLogin).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay inicios de sesión recientes</p>
          )}
        </div>
      </div>
    </div>
  );
  

}

export default AdminDashboard;
