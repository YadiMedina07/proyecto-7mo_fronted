"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";

export default function AdminContactosPage() {
    const { theme } = useAuth();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${CONFIGURACIONES.BASEURL2}/contactos`, { credentials: "include" })
            .then(r => r.json())
            .then(setList)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
            <Breadcrumbs pages={[
                { name: "Home", path: "/" },
                { name: "Admin", path: "/admin" },
                { name: "Atención al Cliente", path: "/adminContactos" },
            ]} />
            <h1 className="text-3xl font-bold mb-6">Mensajes de Contacto</h1>

            {loading ? (
                <p>Cargando…</p>
            ) : (
                <ul className="space-y-2">
                    {list.map(c => (
                        <li key={c.id} className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                            <Link
                                href={`/adminContactos/${c.id}`}
                                className="flex justify-between"
                            >
                                <span>{c.motivo} – {c.email}</span>
                                <span className={`font-semibold ${c.responded ? "text-green-600" : "text-yellow-600"}`}>
                                    {c.responded ? "Respondido" : "Pendiente"}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
