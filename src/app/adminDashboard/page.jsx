"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import {
  Users,
  UserX,
  AlertTriangle,
  LogIn,
  Shield,
  Clock,
  Ban,
  Unlock,
  Activity,
  TrendingUp,
  Calendar,
  Mail,
  User,
  Timer,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function AdminDashboard() {
  const { user, isAuthenticated, theme } = useAuth()
  const [recentUsers, setRecentUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [failedAttempts, setFailedAttempts] = useState([])
  const [recentLogins, setRecentLogins] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState({ email: "", duration: "" })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login" // Redirige manualmente
    }
  }, [isAuthenticated, user])

  // Función para abrir el modal
  const openModal = (email) => {
    setModalData({ email, duration: "" }) // Captura el correo del usuario
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalData({ email: null, duration: "" }) // Reinicia los datos del modal
  }

  // Cargar datos si el usuario es admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchData = async () => {
        setLoading(true)
        try {
          // 1. Usuarios recientes
          const recentUsersResponse = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`, {
            method: "GET",
            credentials: "include", // Enviar la cookie
          })
          const recentUsersData = await recentUsersResponse.json()
          setRecentUsers(recentUsersData)

          // 2. Usuarios bloqueados
          await fetchBlockedUsers()

          // 3. Intentos fallidos
          const failedAttemptsResponse = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`, {
            method: "GET",
            credentials: "include", // Enviar la cookie
          })
          const failedAttemptsData = await failedAttemptsResponse.json()
          setFailedAttempts(failedAttemptsData)

          // 4. Inicios de sesión recientes
          await fetchRecentLogins()
        } catch (error) {
          console.error("Error al obtener datos del backend:", error)
        } finally {
          setLoading(false)
        }
      }

      // Ejecutar la función la primera vez y luego cada X tiempo (aquí cada 30s)
      fetchData()
      const intervalId = setInterval(fetchData, 30_000)

      // Limpiar el intervalo al desmontar
      return () => clearInterval(intervalId)
    }
  }, [isAuthenticated, user])

  // Bloqueo temporal de usuario
  const blockUserTemporarily = async ({ email, duration }) => {
    setActionLoading((prev) => ({ ...prev, [`temp-${email}`]: true }))
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`, {
        method: "POST",
        credentials: "include", // Cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, lockDuration: duration }),
      })
      if (response.ok) {
        console.log("Usuario bloqueado temporalmente")
        closeModal()
        // Refrescar datos
        await fetchBlockedUsers()
      } else {
        const data = await response.json()
        console.error("Error al bloquear temporalmente:", data.message)
      }
    } catch (error) {
      console.error("Error al bloquear temporalmente:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [`temp-${email}`]: false }))
    }
  }

  // Bloqueo permanente de usuario
  const blockUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [`block-${userId}`]: true }))
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`, {
        method: "POST",
        credentials: "include", // Cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        console.log("Usuario bloqueado exitosamente")
        // Refrescar datos
        await fetchBlockedUsers()
      } else {
        const data = await response.json()
        console.error("Error al bloquear usuario:", data.message)
      }
    } catch (error) {
      console.error("Error al bloquear usuario:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [`block-${userId}`]: false }))
    }
  }

  // Obtener usuarios bloqueados
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`, {
        method: "GET",
        credentials: "include", // Cookie
      })
      const data = await response.json()
      setBlockedUsers(data)
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error)
    }
  }

  // Obtener inicios de sesión recientes
  const fetchRecentLogins = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`, {
        method: "GET",
        credentials: "include", // Cookie
      })
      const data = await response.json()
      setRecentLogins(data)
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error)
    }
  }

  // Desbloquear usuario
  const unblockUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [`unblock-${userId}`]: true }))
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`, {
        method: "POST",
        credentials: "include", // Cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        console.log("Usuario desbloqueado exitosamente")
        fetchBlockedUsers() // Actualizar la lista de usuarios bloqueados
      } else {
        const data = await response.json()
        console.error("Error al desbloquear usuario:", data.message)
      }
    } catch (error) {
      console.error("Error al desbloquear usuario:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [`unblock-${userId}`]: false }))
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen py-8 pt-36 px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Estadísticas skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="p-4 border rounded-lg">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen py-8 pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-10 w-10 text-pink-600" />
            <h1 className="text-4xl font-bold text-black">ADMINISTRACIÓN</h1>
          </div>
          <p className="text-muted-foreground text-lg">Panel de control y monitoreo del sistema</p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Recientes</p>
                  <p className="text-3xl font-bold text-pink-600">{recentUsers.length}</p>
                </div>
                <div className="h-12 w-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Bloqueados</p>
                  <p className="text-3xl font-bold text-red-600">{blockedUsers.length}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Intentos Fallidos</p>
                  <p className="text-3xl font-bold text-yellow-600">{failedAttempts.length}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inicios Recientes</p>
                  <p className="text-3xl font-bold text-blue-600">{recentLogins.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secciones Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usuarios Recientes */}
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="bg-pink-50 dark:bg-pink-900/10">
              <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
                <Users className="h-5 w-5" />
                Usuarios Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <Card key={user._id} className="bg-pink-50 dark:bg-pink-900/10 border-pink-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-pink-600" />
                              <span className="font-semibold">{user.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-pink-600 border-pink-300">
                            Nuevo
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay usuarios recientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usuarios Bloqueados */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="bg-red-50 dark:bg-red-900/10">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <UserX className="h-5 w-5" />
                Usuarios Bloqueados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {blockedUsers.length > 0 ? (
                <div className="space-y-4">
                  {blockedUsers.map((user) => (
                    <Card key={user.id} className="bg-red-50 dark:bg-red-900/10 border-red-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-red-600" />
                                <span className="font-semibold">{user.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                            <Badge
                              variant={user.blockedType === "Temporary" ? "secondary" : "destructive"}
                              className="gap-1"
                            >
                              <Ban className="h-3 w-3" />
                              {user.blockedType}
                            </Badge>
                          </div>

                          {user.blockedType === "Temporary" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              <span>Hasta: {new Date(user.lockedUntil).toLocaleString()}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Actualizado: {new Date(user.lastUpdated).toLocaleString()}</span>
                          </div>

                          {user.currentlyBlocked && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unblockUser(user.id)}
                              disabled={actionLoading[`unblock-${user.id}`]}
                              className="w-full gap-2 text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <Unlock className="h-3 w-3" />
                              {actionLoading[`unblock-${user.id}`] ? "Desbloqueando..." : "Desbloquear"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay usuarios bloqueados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Intentos Fallidos */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-900/10">
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                Intentos Fallidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {failedAttempts.length > 0 ? (
                <div className="space-y-4">
                  {failedAttempts.map((user) => (
                    <Card key={user.id} className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-yellow-600" />
                                <span className="font-semibold">{user.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {user.failedLoginAttempts} intentos
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => blockUser(user.id)}
                              disabled={actionLoading[`block-${user.id}`]}
                              className="flex-1 gap-2"
                            >
                              <Ban className="h-3 w-3" />
                              {actionLoading[`block-${user.id}`] ? "Bloqueando..." : "Bloquear Permanente"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openModal(user.email)}
                              disabled={actionLoading[`temp-${user.email}`]}
                              className="flex-1 gap-2"
                            >
                              <Timer className="h-3 w-3" />
                              Bloquear Temporal
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay intentos fallidos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inicios de Sesión Recientes */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/10">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <LogIn className="h-5 w-5" />
                Inicios de Sesión Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {recentLogins.length > 0 ? (
                <div className="space-y-4">
                  {recentLogins.map((login) => (
                    <Card key={login._id} className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">{login.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{login.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(login.lastLogin).toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-300 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Activo
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay inicios de sesión recientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal para Bloqueo Temporal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-600" />
                Bloquear Temporalmente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vas a bloquear temporalmente al usuario: <strong>{modalData.email}</strong>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración del bloqueo (en horas)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Ej: 24"
                  value={modalData.duration}
                  onChange={(e) => setModalData({ ...modalData, duration: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                onClick={() => blockUserTemporarily(modalData)}
                disabled={!modalData.duration || actionLoading[`temp-${modalData.email}`]}
                className="gap-2"
              >
                <Timer className="h-4 w-4" />
                {actionLoading[`temp-${modalData.email}`] ? "Bloqueando..." : "Bloquear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Información del Sistema */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-pink-600" />
                <span>Actualización automática cada 30 segundos</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-pink-600" />
                <span>Panel de administración seguro</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-pink-600" />
                <span>Monitoreo en tiempo real</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
