import React, { useState } from "react";
import "../../css/Eventos.css";

export default function CompraEntradas({ evento, cerrar }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [medioPago, setMedioPago] = useState("tarjeta");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Compra confirmada para ${evento.nombre} con ${medioPago}`);
    cerrar();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Comprar Entradas - {evento.nombre}</h2>
        <form onSubmit={handleSubmit} className="form-compra">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Medio de pago:</label>
          <select
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
          >
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="efectivo">Efectivo</option>
            <option value="mercadopago">Mercado Pago</option>
          </select>

          <button type="submit" className="btn-egipcio">
            Confirmar compra
          </button>
          <button
            type="button"
            onClick={cerrar}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
