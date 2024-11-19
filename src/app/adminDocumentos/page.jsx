'use client'; // Indica que es un componente del lado del cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config"; // Importar las configuraciones

function PrivacyPolicyPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [policies, setPolicies] = useState([]); // Estado para la política actual
  const [loading, setLoading] = useState(true); // Estado de carga
  const [newPolicy, setNewPolicy] = useState({ title: "", content: "", effectiveDate: "" }); // Estado del formulario
  const [previousVersions, setPreviousVersions] = useState([]); // Estado para guardar las versiones anteriores
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Fetch de la política actual junto con las versiones anteriores
  const fetchCurrentPolicyWithVersions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current-with-versions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de la política actual y versiones anteriores:", data);
        setPolicies([data.currentPolicy]); // Configura la política actual
        setPreviousVersions(data.previousVersions); // Configura las versiones anteriores
        setLoading(false);
      } else {
        console.error("Error al obtener la política:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener la política:", error);
      setLoading(false);
    }
  };

  // Crear o actualizar una política
  const handleCreateOrUpdatePolicy = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPolicy),
        }
      );

      if (response.ok) {
        await fetchCurrentPolicyWithVersions(); // Actualiza la lista
        setNewPolicy({ title: "", content: "", effectiveDate: "" }); // Resetea el formulario
      } else {
        console.error("Error al crear/actualizar la política:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear/actualizar la política:", error);
    }
  };
  
  const handleDeleteVersion = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const currentPolicyId = policies[0]?._id; // Obtiene el ID de la política actual
  
      if (!currentPolicyId) {
        console.error("No se encontró una política actual");
        return;
      }
  
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${currentPolicyId}/previous-version/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        // Actualizar las versiones anteriores después de eliminar
        const updatedPolicy = await response.json();
        setPreviousVersions(updatedPolicy.policy.previousVersions);
      } else {
        console.error("Error al eliminar la versión:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar la versión:", error);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchCurrentPolicyWithVersions();
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <p className="text-center mt-20">Cargando políticas de privacidad...</p>;
  }

  return (
    <div className={`w-full min-h-screen py-8 pt-36 flex justify-center ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8 pt-10">Gestión de Política de Privacidad</h1>

        {/* Formulario para crear o actualizar una política */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md rounded-lg overflow-hidden p-6 mb-8`}>
          <h2 className="text-2xl font-bold mb-4">Crear Nueva Política de Privacidad</h2>
          <div className="mb-4">
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>Título</label>
            <input
              type="text"
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
              className={`w-full border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"} p-2 rounded-lg`}
            />
          </div>

          <div className="mb-4">
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>Contenido</label>
            <textarea
              value={newPolicy.content}
              onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
              className={`w-full border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"} p-2 rounded-lg`}
              rows="6"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>Fecha de Vigencia</label>
            <input
              type="date"
              value={newPolicy.effectiveDate}
              onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
              className={`w-full border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"} p-2 rounded-lg`}
            />
          </div>

          <button
            onClick={handleCreateOrUpdatePolicy}
            className="bg-pink-700 text-white py-2 px-4 rounded hover:bg-pink-500"
          >
            Crear Política
          </button>
        </div>
                {/* Tabla de versiones de la política de privacidad */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden p-6`}>
          <h2 className="text-2xl font-bold mb-4">Versiones de la Política de Privacidad</h2>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>Título</th>
                <th className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>Fecha de Creación</th>
                <th className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>Fecha de Vigencia</th>
              </tr>
            </thead>
            <tbody>
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <tr key={policy._id}>
                    <td className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-900'}`}>{policy.title}</td>
                    <td className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-900'}`}>{new Date(policy.createdAt).toLocaleDateString()}</td>
                    <td className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-900'}`}>{new Date(policy.effectiveDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No hay políticas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tabla de historial de versiones */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md rounded-lg overflow-hidden p-6`}>
          <h2 className="text-2xl font-bold mb-4">Historial de Políticas de Privacidad</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`}>Título</th>
                <th className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`}>Fecha de Creación</th>
                <th className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`}>Fecha de Vigencia</th>
              </tr>
            </thead>
            <tbody>
  {previousVersions.length > 0 ? (
    previousVersions.map((version, index) => (
      <tr key={index}>
        <td className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-900"}`}>{version.title}</td>
        <td className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-900"}`}>{new Date(version.createdAt).toLocaleDateString()}</td>
        <td className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-900"}`}>{new Date(version.effectiveDate).toLocaleDateString()}</td>
        <td className={`px-4 py-2 border ${theme === "dark" ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-900"}`}>
          <button
            onClick={() => handleDeleteVersion(index)}
            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className={`text-center py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        No hay versiones anteriores registradas.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
