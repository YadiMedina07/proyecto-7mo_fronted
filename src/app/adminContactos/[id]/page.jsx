"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import { useRouter, useParams } from "next/navigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../../config/config";

export default function DetalleContactoPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [resp, setResp] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/contactos/${id}`, { credentials:"include" })
      .then(r => r.json())
      .then(setC);
  }, [id]);

  const handleResponder = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/contactos/${id}/responder`, {
        method: "PUT",
        credentials:"include",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ respuesta: resp })
      });
      if (!res.ok) throw new Error("Error");
      setStatus("success");
      // opcional: volver al listado
      // router.push("/adminContactos");
    } catch {
      setStatus("error");
    }
  };

  if (!c) return <p>Cargando…</p>;
  return (
    <div className={`container mx-auto py-8 pt-36 ${theme==="dark"?"bg-gray-900 text-gray-100":"bg-white text-gray-900"}`}>
      <Breadcrumbs pages={[
        { name:"Home", path:"/" },
        { name:"Admin", path:"/admin" },
        { name:"Atención al Cliente", path:"/adminContactos" },
        { name:`${c.email}`, path:`/adminContactos/${id}` },
      ]}/>
      <h1 className="text-2xl font-bold mb-4">Consulta de {c.email}</h1>
      <p><strong>Motivo:</strong> {c.motivo}</p>
      <p><strong>Nombre:</strong> {c.nombre}</p>
      <p><strong>Teléfono:</strong> {c.telefono || "—"}</p>
      <p className="mb-4"><strong>Comentario:</strong><br/>{c.comentario}</p>

      {c.responded ? (
        <>
          <p className="mb-2"><strong>Respuesta enviada:</strong></p>
          <blockquote className="p-4 bg-gray-100 dark:bg-gray-800 rounded">{c.respuesta}</blockquote>
        </>
      ) : (
        <div className="space-y-2">
          <textarea
            rows={4}
            value={resp}
            onChange={e => setResp(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Escribe tu respuesta aquí…"
          />
          <button
            onClick={handleResponder}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {status==="loading" ? "Enviando…" : "Enviar respuesta"}
          </button>
          {status==="success" && <p className="text-green-600">¡Respuesta enviada!</p>}
          {status==="error"   && <p className="text-red-600">Error al enviar.</p>}
        </div>
      )}
    </div>
  );
}
