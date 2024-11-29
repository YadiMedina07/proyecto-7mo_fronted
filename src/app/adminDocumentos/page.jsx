"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function PrivacyPolicyPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingPolicy, setEditingPolicy] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todas las políticas
  const fetchPolicies = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    // Verifica si data es un array, si no, lo transformas
    if (Array.isArray(data)) {
      setPolicies(data);
    } else {
      setPolicies([]);
      console.error("La respuesta no es un array:", data);
    }
  };

  // Obtener la política actual
  const fetchCurrentPolicy = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCurrentPolicy(data); // Actualiza el estado de la política actual
    } else {
      console.error("Error al obtener la política actual");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPolicies();
      fetchCurrentPolicy();
    }
  }, [isAuthenticated, user]);

  // Crear una nueva política
  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.content || !newPolicy.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      return;
    }

    if (new Date(newPolicy.effectiveDate) < new Date()) {
      toast.error(
        "La fecha de vigencia no puede ser anterior a la fecha actual.",
        { position: "top-center" }
      );
      return;
    }

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
        toast.success("Política creada exitosamente.", {
          position: "top-center",
        });
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
        setNewPolicy({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };

  // Actualizar una política existente
  const handleUpdatePolicy = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${editingPolicy._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPolicy),
        }
      );
      if (response.ok) {
        setEditingPolicy(null);
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al actualizar la política:", error);
    }
  };

  // Eliminar una política
  const handleDeletePolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al eliminar la política:", error);
    }
  };

  // Establecer una política como actual
  const handleSetCurrentPolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}/set-current`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al establecer la política como actual:", error);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 px-6 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-10 pt-10 text-pink-600">
        Gestión de Política de Privacidad
      </h1>
  
      {/* Crear o editar política */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg rounded-lg p-8 mb-12 border ${
          theme === "dark" ? "border-gray-700" : "border-pink-400"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-pink-700">
          {editingPolicy ? "Editar Política" : "Crear Nueva Política"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Título
            </label>
            <input
              type="text"
              value={editingPolicy ? editingPolicy.title : newPolicy.title}
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({ ...editingPolicy, title: e.target.value })
                  : setNewPolicy({ ...newPolicy, title: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Fecha de Vigencia</label>
            <input
              type="date"
              value={
                editingPolicy
                  ? editingPolicy.effectiveDate
                  : newPolicy.effectiveDate
              }
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({
                      ...editingPolicy,
                      effectiveDate: e.target.value,
                    })
                  : setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              min={new Date().toISOString().split("T")[0]} // Fecha actual como mínimo
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-lg font-medium mb-2">Contenido</label>
          <textarea
            value={editingPolicy ? editingPolicy.content : newPolicy.content}
            onChange={(e) =>
              editingPolicy
                ? setEditingPolicy({
                    ...editingPolicy,
                    content: e.target.value,
                  })
                : setNewPolicy({ ...newPolicy, content: e.target.value })
            }
            className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="6"
          ></textarea>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
            className="bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-500 shadow-md"
          >
            {editingPolicy ? "Guardar Cambios" : "Crear Política"}
          </button>
        </div>
      </div>
  
      {/* Mostrar la política actual */}
      {currentPolicy && (
        <div className="mb-12 shadow-lg rounded-lg p-8 bg-blue-50 border border-blue-400">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Política Actual
          </h2>
          <p className="mb-2">
            <strong>Título:</strong> {currentPolicy.title}
          </p>
          <p className="mb-2">
            <strong>Contenido:</strong> {currentPolicy.content}
          </p>
          <p className="mb-2">
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(currentPolicy.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Fecha de Vigencia:</strong>{" "}
            {new Date(currentPolicy.effectiveDate).toLocaleDateString()}
          </p>
        </div>
      )}
  
      {/* Listar políticas */}
      <div className="shadow-lg rounded-lg p-8 bg-white border border-gray-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Listado de Políticas
        </h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border border-gray-300">Título</th>
              <th className="px-4 py-2 border border-gray-300">
                Fecha de Creación
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Fecha de Vigencia
              </th>
              <th className="px-4 py-2 border border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(policies) &&
              policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{policy.title}</td>
                  <td className="px-4 py-2 border">
                    {new Date(policy.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(policy.effectiveDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => setEditingPolicy(policy)}
                    >
                      Editar
                    </button>
{/* Botón Establecer como Actual o deshabilitado si ya es actual */}
{policy.isCurrent ? (
                      <button
                        className="bg-green-700 text-white px-2 py-1 rounded mr-2 cursor-not-allowed"
                        disabled
                      >
                        Actual
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                        onClick={() => handleSetCurrentPolicy(policy._id)}
                      >
                        Establecer como Actual
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeletePolicy(policy._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default PrivacyPolicyPage;
