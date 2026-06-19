import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import CompraEntradas from "./CompraEntradas";
import "../../css/Eventos.css";

export default function EventoDetalle() {
  const { id } = useParams();
  const [mostrarCompra, setMostrarCompra] = useState(false);

  const eventos = [
    {
      id: 1,
      nombre: "Noche Anubis",
      descripcion:
        "Sumergite en una noche mística entre jeroglíficos, fuego y música electrónica del más allá. DJ internacional invitado.",
      imagen: "/evento1.jpg",
      fecha: "5 de Noviembre de 2025",
    },
    {
      id: 2,
      nombre: "Faraón Party",
      descripcion:
        "El templo del ritmo abre sus puertas. Dress code: dorado o negro. Premios a los mejores disfraces faraónicos.",
      imagen: "/evento2.jpg",
      fecha: "20 de Diciembre de 2025",
    },
    {
      id: 3,
      nombre: "Oasis Electrónico",
      descripcion:
        "Una experiencia veraniega única: luces, arena, agua y sets en vivo. La noche más esperada del año.",
      imagen: "/evento3.jpg",
      fecha: "10 de Enero de 2026",
    },
  ];

  const evento = eventos.find((e) => e.id === parseInt(id));

  if (!evento) return <h2>Evento no encontrado</h2>;

  return (
    <div className="detalle-container">
      <img src={evento.imagen} alt={evento.nombre} className="detalle-img" />
      <div className="detalle-info">
        <h1 className="titulo-egipcio">{evento.nombre}</h1>
        <p>{evento.descripcion}</p>
        <p>
          <strong>Fecha:</strong> {evento.fecha}
        </p>

        <button
          className="btn-egipcio"
          onClick={() => setMostrarCompra(true)}
        >
          Comprar Entradas
        </button>

        <Link to="/eventos" className="btn-volver">
          ← Volver a Eventos
        </Link>
      </div>

      {mostrarCompra && (
        <CompraEntradas evento={evento} cerrar={() => setMostrarCompra(false)} />
      )}
    </div>
  );
}
