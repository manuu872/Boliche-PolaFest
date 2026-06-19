import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/Tarjeta.css";

export default function MovimientoTarjeta() {
  const { idTarjeta } = useParams();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/movimientos/tarjeta/${idTarjeta}`);
        if (!res.ok) throw new Error("Error al obtener movimientos");
        const data = await res.json();
        setMovimientos(data);
      } catch (err) {
        console.warn("⚠️ No se pudo conectar al backend. Modo demo.");
        setMovimientos([
          {
            id: 1,
            tipo: "carga",
            monto: 5000,
            fecha: "2025-10-20",
          },
          {
            id: 2,
            tipo: "consumo",
            monto: -1500,
            fecha: "2025-10-21",
          },
          {
            id: 3,
            tipo: "reembolso",
            monto: 1000,
            fecha: "2025-10-23",
          },
        ]);
      }
    };

    fetchMovimientos();
  }, [idTarjeta]);

  return (
    <div className="movimientos-container">
      <h1 className="titulo-egipcio">Movimientos de Tarjeta #{idTarjeta}</h1>
      <button className="btn-egipcio" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="tabla-movimientos">
        {movimientos.length === 0 ? (
          <p>No hay movimientos registrados.</p>
        ) : (
          movimientos.map((m) => (
            <div key={m.id} className="movimiento-item">
              <div>
                <h4>{m.tipo.toUpperCase()}</h4>
                <p>{new Date(m.fecha).toLocaleDateString("es-AR")}</p>
              </div>
              <p className={m.monto < 0 ? "monto-negativo" : "monto-positivo"}>
                {m.monto < 0 ? "-" : "+"}${Math.abs(m.monto).toLocaleString("es-AR")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
