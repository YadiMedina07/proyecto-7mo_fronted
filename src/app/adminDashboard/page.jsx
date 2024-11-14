"use client";  // Asegura que este es un Client Component

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';// Importar las configuraciones
function AdminDashboard() {
  const { user, isAuthenticated, theme } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';  // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      // Obtener usuarios recientes
      const fetchRecentUsers = async () => {
        const token = localStorage.getItem('token');  // Obtén el token almacenado en localStorage
        console.log("mando", token);
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluye el token en el encabezado
            'Content-Type': 'application/json',
          },
          credentials: 'include',  // Solo si también usas cookies
        });
        const data = await response.json();
        setRecentUsers(data);
      };

      // Obtener usuarios bloqueados
      const fetchBlockedUsers = async () => {
        const token = localStorage.getItem('token');  // Obtén el token almacenado en localStorage
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Incluye el token en el encabezado
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setBlockedUsers(data);
      };;

      fetchRecentUsers();
      fetchBlockedUsers();
    }
  }, [isAuthenticated, user]);

  return (
    <div className={`w-full min-h-screen py-8 pt-36 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8 text-center pt-10">Dashboard Admin</h1>

      <div className="flex justify-center">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Usuarios Recientes */}
    <div className={`shadow-md rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Usuarios Recientes</h2>
      {recentUsers.length > 0 ? (
        recentUsers.map((user) => (
          <div key={user._id} className={`${theme === 'dark' ? 'bg-green-700 text-gray-100' : 'bg-green-200 text-gray-900'} rounded-lg p-4 mb-4 shadow`}>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No hay usuarios recientes</p>
      )}
    </div>

    {/* Usuarios Bloqueados */}
    <div className={`shadow-md rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4">Usuarios Bloqueados Recientemente</h2>
      {blockedUsers.length > 0 ? (
        blockedUsers.map((user) => (
          <div key={user._id} className={`${theme === 'dark' ? 'bg-red-700 text-gray-100' : 'bg-red-200 text-gray-900'} rounded-lg p-4 mb-4 shadow`}>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Fecha de Bloqueo:</strong> {new Date(user.lockedUntil).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No hay usuarios bloqueados</p>
      )}
    </div>
  </div>
</div>

    </div>
  );
}

export default AdminDashboard;
