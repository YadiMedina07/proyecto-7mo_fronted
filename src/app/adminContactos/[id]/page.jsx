"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../context/authContext"
import { useRouter, useParams } from "next/navigation"
import Breadcrumbs from "../../../components/Breadcrumbs"
import { CONFIGURACIONES } from "../../config/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  ArrowLeft,
  AlertCircle,
  FileText,
} from "lucide-react"

export default function DetalleContactoPage() {
  const { theme } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [c, setC] = useState(null)
  const [resp, setResp] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/contactos/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setC(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleResponder = async () => {
    if (!resp.trim()) {
      setStatus("empty")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/contactos/${id}/responder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta: resp }),
      })
      if (!res.ok) throw new Error("Error")

      // Actualizar el estado local
      setC((prev) => ({ ...prev, responded: true, respuesta: resp }))
      setStatus("success")
      setResp("")
    } catch {
      setStatus("error")
    }
  }

  const handleGoBack = () => {
    router.push("/adminContactos")
  }

  if (loading) {
    return (
      <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!c) {
    return (
      <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No se pudo cargar la información del contacto.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          pages={[
            { name: "Home", path: "/" },
            { name: "Admin", path: "/admin" },
            { name: "Atención al Cliente", path: "/adminContactos" },
            { name: `${c.email}`, path: `/adminContactos/${id}` },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Consulta de {c.email}</h1>
            <p className="text-gray-600 dark:text-gray-400">Detalles del mensaje de contacto</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Contacto */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles del Mensaje */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Detalles del Mensaje</CardTitle>
                    <CardDescription>Información completa de la consulta</CardDescription>
                  </div>
                </div>
                {c.responded ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Respondido
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    Motivo
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{c.motivo}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Sin fecha"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  Comentario
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {c.comentario || c.mensaje || "Sin comentario"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Respuesta */}
          {c.responded ? (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800 dark:text-green-200">Respuesta Enviada</CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      Esta consulta ya ha sido respondida
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{c.respuesta}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-yellow-800 dark:text-yellow-200">Enviar Respuesta</CardTitle>
                    <CardDescription>Responde a la consulta del cliente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Textarea
                  rows={6}
                  value={resp}
                  onChange={(e) => setResp(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Estados de la respuesta */}
                {status === "empty" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Por favor, escribe una respuesta antes de enviar.</AlertDescription>
                  </Alert>
                )}

                {status === "success" && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      ¡Respuesta enviada exitosamente!
                    </AlertDescription>
                  </Alert>
                )}

                {status === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Error al enviar la respuesta. Inténtalo de nuevo.</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleResponder}
                    disabled={status === "loading"}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {status === "loading" ? "Enviando..." : "Enviar respuesta"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Información del Cliente */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-purple-800 dark:text-purple-200">Información del Cliente</CardTitle>
                  <CardDescription>Datos de contacto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                    <p className="font-medium text-gray-900 dark:text-white">{c.nombre || "Sin nombre"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{c.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                    <p className="font-medium text-gray-900 dark:text-white">{c.telefono || "No proporcionado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Estado de la Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                {c.responded ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="font-semibold text-green-800 dark:text-green-200">Consulta Respondida</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">El cliente ha recibido una respuesta</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">Pendiente de Respuesta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Esta consulta requiere atención</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
