'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';

function AdminPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);

  // Redirige si no es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';
    }
  }, [isAuthenticated, user]);

  // Carga la lista de usuarios
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Error al cargar usuarios');
          const data = await res.json();
          setUsers(data);
        } catch (err) {
          console.error(err);
          alert('No se pudieron cargar los usuarios');
        }
      };
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  // Eliminar usuario
  const handleDelete = async (userId) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      // filtra por id numérico
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo eliminar al usuario');
    }
  };

  // Editar rol de usuario
  const handleEdit = async (u) => {
    const newRole = prompt(
      `Asigna nuevo rol a ${u.name} (${u.email}):`,
      u.role
    )?.trim();
    if (!newRole || newRole === u.role) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${u.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al actualizar rol');
      }
      const updated = await res.json();
      setUsers(prev =>
        prev.map(item => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo actualizar el rol');
    }
  };

  return (
    <div className={`w-full min-h-screen py-8 pt-36 flex justify-center ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-white text-gray-900'
      }`}
    >
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8 pt-10">
          Panel de Administración
        </h1>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden p-6`}>
          <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2 border">{u.name} {u.lastname}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border capitalize">{u.role}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 mr-2"
                        onClick={() => handleDelete(u.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(u)}
                      >
                        Editar Rol
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={`text-center py-4 ${
                      theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >
                    No hay usuarios registrados
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

export default AdminPage;
