"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import { useAuth } from "../../context/authContext";
import {
  User,
  Phone,
  Calendar,
  Shield,
  Clock,
  Key,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { theme } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
          setFormData({
            name: data.name,
            lastname: data.lastname,
            telefono: data.telefono,
            fechadenacimiento: data.fechadenacimiento,
          });
          setError("");
        } else {
          setError(data.message || "Error al obtener el perfil");
        }
      } catch (err) {
        console.error("Error en fetchProfile:", err);
        setError("Error interno del servidor");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        setEditMode(false);
      } else {
        setError(data.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError("Error interno del servidor");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-8 px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4 text-pink-600" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Alert>
          <AlertCircle className="h-4 w-4 text-pink-600" />
          <AlertDescription>No hay datos de usuario disponibles</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getInitials = (name, lastname) =>
    `${name?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-pink-600">Mi Perfil</h1>
        </div>

        <Card className="overflow-hidden">
          {/* Profile Header */}
          <CardHeader
            className={
              theme === "dark"
                ? "bg-gradient-to-r from-gray-800 to-gray-900"
                : "bg-gradient-to-r from-gray-200 to-gray-400"
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 ring-4 ring-pink-500">
                  <AvatarImage
                    src={`/placeholder.svg?height=80&width=80&text=${getInitials(
                      userData.name,
                      userData.lastname
                    )}`}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {getInitials(userData.name, userData.lastname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData.name} {userData.lastname}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <UserCheck className="h-4 w-4 text-pink-600" />
                    <span className="text-muted-foreground">Perfil de usuario</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                      {userData.role}
                    </Badge>
                    <Badge variant={userData.verified ? "default" : "destructive"}>
                      {userData.verified ? "Verificado" : "No verificado"}
                    </Badge>
                  </div>
                </div>
              </div>
              {!editMode && (
                <Button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white"
                >
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-pink-600">
                      <User className="h-4 w-4 text-pink-600" />
                      Nombre
                    </Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="flex items-center gap-2 text-pink-600">
                      <User className="h-4 w-4 text-pink-600" />
                      Apellido
                    </Label>
                    <Input id="lastname" name="lastname" value={formData.lastname} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center gap-2 text-pink-600">
                      <Phone className="h-4 w-4 text-pink-600" />
                      Teléfono
                    </Label>
                    <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechadenacimiento" className="flex items-center gap-2 text-pink-600">
                      <Calendar className="h-4 w-4 text-pink-600" />
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="fechadenacimiento"
                      name="fechadenacimiento"
                      type="date"
                      value={
                        formData.fechadenacimiento
                          ? new Date(formData.fechadenacimiento).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Información Personal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-pink-600">
                        <User className="h-5 w-5 text-pink-600" />
                        Información Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                          <span className="font-medium">{userData.name}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Apellido:</span>
                          <span className="font-medium">{userData.lastname}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                          <span className="font-medium">{userData.telefono || "No especificado"}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento:</span>
                          <span className="font-medium">
                            {userData.fechadenacimiento
                              ? new Date(userData.fechadenacimiento).toLocaleDateString()
                              : "No especificada"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seguridad */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-pink-600">
                        <Shield className="h-5 w-5 text-pink-600" />
                        Seguridad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Pregunta Secreta:</span>
                          <span className="font-medium text-right max-w-[200px] truncate">
                            {userData.preguntaSecreta}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Rol:</span>
                          <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                            {userData.role}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Email:</span>
                          <span className="font-medium text-right max-w-[200px] truncate">{userData.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actividad */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-pink-600">
                        <Clock className="h-5 w-5 text-pink-600" />
                        Actividad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Último inicio:</span>
                          <span className="font-medium text-right">
                            {userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "Nunca"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Cuenta creada:</span>
                          <span className="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Última actualización:</span>
                          <span className="font-medium">{new Date(userData.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estado de la Cuenta */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-pink-600">
                        <Key className="h-5 w-5 text-pink-600" />
                        Estado de la Cuenta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Verificada:</span>
                          <div className="flex items-center gap-2">
                            {userData.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <Badge variant={userData.verified ? "default" : "destructive"}>
                              {userData.verified ? "Verificada" : "No verificada"}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Bloqueada:</span>
                          <div className="flex items-center gap-2">
                            {userData.blocked ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <Badge variant={userData.blocked ? "destructive" : "default"}>
                              {userData.blocked ? "Bloqueada" : "Activa"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Estadísticas adicionales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-pink-600">Resumen de la Cuenta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">
                          {Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-sm text-muted-foreground">Días como miembro</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">{userData.verified ? "✓" : "✗"}</div>
                        <div className="text-sm text-muted-foreground">Verificación</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">{userData.role === "admin" ? "👑" : "👤"}</div>
                        <div className="text-sm text-muted-foreground">Tipo de cuenta</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">{userData.blocked ? "🔒" : "🔓"}</div>
                        <div className="text-sm text-muted-foreground">Estado</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserProfile;
