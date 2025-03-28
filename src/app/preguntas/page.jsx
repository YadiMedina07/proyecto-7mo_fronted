"use client";
import { useState } from "react";

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Qué son los curados artesanales?",
      answer: "Los curados artesanales son bebidas elaboradas con frutas naturales y destilados, siguiendo recetas tradicionales para ofrecer un sabor único.",
    },
    {
      question: "¿Cuáles son los sabores disponibles?",
      answer: "Nuestros sabores incluyen Café, Jobo, Fresa, Arándano, Zarzamora, Mango, Coco, Horchata, Piña y Uva.",
    },
    {
      question: "¿Dónde puedo comprar sus productos?",
      answer: "Puedes adquirir nuestros productos directamente en nuestra tienda física o a través de nuestra tienda en línea.",
    },
    {
      question: "¿Hacen envíos a todo el país?",
      answer: "Sí, realizamos envíos a todo México. El costo de envío varía según la ubicación.",
    },
    {
      question: "¿Cuáles son las opciones de pago?",
      answer: "Aceptamos pagos con tarjeta de crédito, débito, PayPal y transferencias bancarias.",
    },
  ];

  return (
    <div className="container mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Preguntas Frecuentes</h1>

      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="w-full flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow-md focus:outline-none"
              onClick={() => toggleQuestion(index)}
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              <span className="text-2xl">{openQuestion === index ? "−" : "+"}</span>
            </button>
            {openQuestion === index && (
              <div className="p-4 bg-gray-100 rounded-lg mt-2">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
