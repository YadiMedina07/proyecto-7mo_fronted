"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  HelpCircle,
  Search,
  MessageCircle,
  ShoppingCart,
  CreditCard,
  Truck,
  Grape,
  Coffee,
  Mail,
  Phone,
} from "lucide-react"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const faqs = [
    {
      id: "productos",
      category: "Productos",
      icon: <Grape className="w-5 h-5" />,
      color: "purple",
      questions: [
        {
          question: "¿Qué son los curados artesanales?",
          answer:
            "Los curados artesanales son bebidas elaboradas con frutas naturales y destilados, siguiendo recetas tradicionales para ofrecer un sabor único y auténtico. Cada botella es cuidadosamente preparada con ingredientes de la más alta calidad.",
        },
        {
          question: "¿Cuáles son los sabores disponibles?",
          answer:
            "Nuestros sabores incluyen una amplia variedad: Café, Jobo, Fresa, Arándano, Zarzamora, Mango, Coco, Horchata, Piña y Uva. Cada sabor está elaborado con frutas naturales y siguiendo recetas tradicionales.",
        },
        {
          question: "¿Cuál es el contenido alcohólico de sus productos?",
          answer:
            "Nuestros curados artesanales tienen un contenido alcohólico que varía entre 20% y 35% vol., dependiendo del sabor y la receta específica. Siempre indicamos el porcentaje exacto en cada etiqueta.",
        },
      ],
    },
    {
      id: "compras",
      category: "Compras",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "blue",
      questions: [
        {
          question: "¿Dónde puedo comprar sus productos?",
          answer:
            "Puedes adquirir nuestros productos directamente en nuestra tienda física ubicada en Huejutla de Reyes, o a través de nuestra tienda en línea con envíos a todo México.",
        },
        {
          question: "¿Tienen descuentos por compras al mayoreo?",
          answer:
            "Sí, ofrecemos descuentos especiales para compras al mayoreo. Contáctanos directamente para conocer nuestras tarifas preferenciales y condiciones especiales para distribuidores.",
        },
        {
          question: "¿Puedo personalizar las etiquetas para eventos especiales?",
          answer:
            "¡Por supuesto! Ofrecemos servicio de personalización de etiquetas para bodas, cumpleaños, eventos corporativos y ocasiones especiales. Contáctanos para conocer los detalles y precios.",
        },
      ],
    },
    {
      id: "envios",
      category: "Envíos",
      icon: <Truck className="w-5 h-5" />,
      color: "green",
      questions: [
        {
          question: "¿Hacen envíos a todo el país?",
          answer:
            "Sí, realizamos envíos a todo México. El costo de envío varía según la ubicación y el peso del pedido. Los tiempos de entrega son de 3 a 7 días hábiles dependiendo del destino.",
        },
        {
          question: "¿Cuál es el tiempo de entrega?",
          answer:
            "Los tiempos de entrega varían según la ubicación: Ciudad de México y área metropolitana (2-3 días), estados cercanos (3-5 días), y resto del país (5-7 días hábiles).",
        },
        {
          question: "¿Cómo puedo rastrear mi pedido?",
          answer:
            "Una vez que tu pedido sea enviado, recibirás un número de guía por correo electrónico para que puedas rastrear tu paquete en tiempo real a través de la paquetería correspondiente.",
        },
      ],
    },
    {
      id: "pagos",
      category: "Pagos",
      icon: <CreditCard className="w-5 h-5" />,
      color: "orange",
      questions: [
        {
          question: "¿Cuáles son las opciones de pago?",
          answer:
            "Aceptamos múltiples formas de pago: tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal, transferencias bancarias, y pagos en efectivo en nuestra tienda física.",
        },
        {
          question: "¿Es seguro pagar en línea?",
          answer:
            "Absolutamente. Utilizamos tecnología de encriptación SSL y procesadores de pago certificados para garantizar la seguridad de tus datos financieros. Nunca almacenamos información de tarjetas de crédito.",
        },
        {
          question: "¿Puedo pagar contra entrega?",
          answer:
            "Actualmente no ofrecemos pago contra entrega. Sin embargo, aceptamos transferencias bancarias si prefieres no usar tarjeta de crédito en línea.",
        },
      ],
    },
  ]

  // Filtrar preguntas basado en el término de búsqueda
  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-800 dark:text-purple-200",
        icon: "text-purple-600 dark:text-purple-400",
      },
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-200",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-200",
        icon: "text-green-600 dark:text-green-400",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-800 dark:text-orange-200",
        icon: "text-orange-600 dark:text-orange-400",
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-16 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros curados artesanales
          </p>
        </div>

        

      

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFaqs.map((category) => {
            if (category.questions.length === 0) return null
            const colors = getColorClasses(category.color)

            return (
              <Card key={category.id} className="border-0 shadow-xl">
                <CardHeader className={`${colors.bg} rounded-t-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center`}>
                      <span className={colors.icon}>{category.icon}</span>
                    </div>
                    <div>
                      <CardTitle className={`${colors.text} text-2xl`}>{category.category}</CardTitle>
                      <CardDescription className={`${colors.text} opacity-80`}>
                        {category.questions.length} pregunta{category.questions.length !== 1 ? "s" : ""} disponible
                        {category.questions.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b last:border-b-0">
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="pt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>

        

        {/* Sección de ayuda adicional */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recursos Adicionales</h2>
            <p className="text-gray-600 dark:text-gray-400">Encuentra más información útil</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Guía de Sabores</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Conoce más sobre cada uno de nuestros sabores únicos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Política de Envíos</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Información detallada sobre nuestros envíos y entregas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Soporte Técnico</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ayuda con problemas técnicos de la tienda en línea
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
