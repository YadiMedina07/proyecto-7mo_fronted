"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Mail, Navigation, Calendar, ExternalLink, Building, Car, Bus } from "lucide-react"

export default function UbicacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16 pt-48">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Nuestra Ubicación
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Visítanos en nuestro establecimiento en el corazón de Huejutla de Reyes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Sección de Mapa */}
          <div className="order-2 lg:order-1">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800 dark:text-green-200">Mapa Interactivo</CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      Encuentra la ruta más fácil para llegar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <iframe
                    className="w-full h-96 lg:h-[500px]"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d556.223149749565!2d-98.41954227364508!3d21.142017452192405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1738701326403!5m2!1ses!2smx"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de Corazón Huasteco"
                  ></iframe>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800 shadow-lg">
                      <MapPin className="w-3 h-3 mr-1" />
                      Corazón Huasteco
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de la ubicación */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Dirección */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Dirección</CardTitle>
                    <CardDescription>Nuestra ubicación exacta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Av Juárez #22 esquina con Hilario Menindez
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Huejutla de Reyes Centro, México</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horario de Atención */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800 dark:text-green-200">Horario de Atención</CardTitle>
                    <CardDescription>Nuestros horarios de servicio</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Lunes a Viernes</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      9:00 AM - 10:00 PM
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Sábado</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      10:00 AM - 9:00 PM
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Domingo</span>
                    </div>
                    <Badge variant="destructive">Cerrado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-purple-800 dark:text-purple-200">Información de Contacto</CardTitle>
                    <CardDescription>Ponte en contacto con nosotros</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                      <p className="font-semibold text-gray-900 dark:text-white">771 556 9607</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-semibold text-gray-900 dark:text-white">corazonhuasteco2023@hotmail.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón para Google Maps */}
            
          </div>
        </div>

        {/* Sección de Cómo Llegar */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¿Cómo llegar?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Te ayudamos a encontrar la mejor ruta para visitarnos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">En Automóvil</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contamos con estacionamiento disponible. Ubicados en el centro de la ciudad para fácil acceso.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transporte Público</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fácil acceso mediante transporte público. Estamos ubicados en una zona céntrica y bien conectada.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
