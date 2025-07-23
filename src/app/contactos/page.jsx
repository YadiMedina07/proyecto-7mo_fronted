"use client"

import { useState } from "react"
import { CONFIGURACIONES } from "../config/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, AlertCircle, Headphones, Star } from "lucide-react"

function ContactPage() {
  const [contactType, setContactType] = useState("general")
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [razon, setRazon] = useState("")
  const [telefono, setTelefono] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [status, setStatus] = useState("") // "", "loading", "success", "error"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/contactos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo: razon,
          nombre,
          email,
          telefono,
          comentario: comentarios,
        }),
      })
      if (!res.ok) throw new Error("Error al enviar")
      setStatus("success")
      // Limpiar formulario
      setNombre("")
      setEmail("")
      setRazon("")
      setTelefono("")
      setComentarios("")
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16 pt-40">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CONTÁCTANOS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Imagen decorativa */}
          <div className="hidden md:block">
            <img
              src="/assets/empresa.jpg"
              alt="Copa con bebida"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Formulario de contacto */}
          <div>
            <Card className="border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Envíanos tu mensaje</CardTitle>
                <CardDescription className="text-lg">
                  Completa el formulario y nos pondremos en contacto contigo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {/* Selector de tipo de contacto */}
                <div className="mb-8">
                  <Label className="text-base font-semibold mb-4 block">Tipo de consulta</Label>
                  <Select value={contactType} onValueChange={setContactType}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Selecciona el tipo de consulta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Contacto general
                        </div>
                      </SelectItem>
                      <SelectItem value="experiencia">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Contacto sobre experiencias
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="flex items-center gap-2 text-base font-semibold">
                      <User className="w-4 h-4" />
                      Tu nombre
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-base font-semibold">
                      <Mail className="w-4 h-4" />
                      Correo electrónico *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@email.com"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razon" className="flex items-center gap-2 text-base font-semibold">
                      <MessageSquare className="w-4 h-4" />
                      Razón de contacto *
                    </Label>
                    <Select value={razon} onValueChange={setRazon} required>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Selecciona un motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulta sobre productos">Consulta sobre productos</SelectItem>
                        <SelectItem value="Problema con un pedido">Problema con un pedido</SelectItem>
                        <SelectItem value="Soporte técnico">Soporte técnico</SelectItem>
                        <SelectItem value="Sugerencias">Sugerencias</SelectItem>
                        <SelectItem value="Otra">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center gap-2 text-base font-semibold">
                      <Phone className="w-4 h-4" />
                      Teléfono fijo
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ingresa tu teléfono"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios" className="flex items-center gap-2 text-base font-semibold">
                      <MessageSquare className="w-4 h-4" />
                      Comentarios *
                    </Label>
                    <Textarea
                      id="comentarios"
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      required
                      rows={6}
                      placeholder="Describe tu consulta o comentario en detalle..."
                      className="text-base resize-none"
                    />
                  </div>

                  {/* Estados del formulario */}
                  {status === "success" && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200 text-base">
                        ¡Tu mensaje ha sido enviado correctamente! Te responderemos pronto.
                      </AlertDescription>
                    </Alert>
                  )}

                  {status === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription className="text-base">
                        Ocurrió un error al enviar tu mensaje. Por favor inténtalo de nuevo.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {status === "loading" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando mensaje...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Enviar mensaje
                      </div>
                    )}
                  </Button>
                </form>

                {/* Nota de privacidad */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    <span className="font-semibold">Protegemos tu privacidad.</span> La información que nos proporciones
                    será utilizada únicamente para responder a tu consulta.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de características */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¿Por qué elegirnos?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Nos comprometemos a brindarte la mejor experiencia de atención al cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Respuesta Rápida</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Respondemos a todas las consultas en menos de 24 horas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Soporte Especializado</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Nuestro equipo está capacitado para resolver cualquier consulta
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Satisfacción Garantizada</h3>
                <p className="text-gray-600 dark:text-gray-400">Tu satisfacción es nuestra prioridad número uno</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
