import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/Tarjeta.css";

export default function Tarjeta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarjeta, setTarjeta] = useState(null);
  const [cargaMonto, setCargaMonto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTarjeta = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener la tarjeta");
      const data = await res.json();
      setTarjeta(data);
    } catch (err) {
      console.error("Error al cargar tarjeta:", err);
      setError("❌ No se pudo cargar la información de la tarjeta.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarjeta();
  }, [id]);


  const handleCargarSaldo = async () => {
    const monto = parseFloat(cargaMonto);
    if (isNaN(monto) || monto <= 0) {
      alert("❌ Ingresá un monto válido");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas/cargar/${tarjeta.id_tarjeta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monto }),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("💰 Saldo cargado correctamente");

     
      await fetchTarjeta();
      setCargaMonto("");
    } catch (err) {
      console.error("Error al cargar saldo:", err);
      alert("❌ Error al cargar saldo");
    }
  };

  
  const handleToggleActiva = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas/toggle/${tarjeta.id_tarjeta}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error(await res.text());

      alert(`🔁 Estado de la tarjeta cambiado correctamente`);
      await fetchTarjeta();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("❌ No se pudo cambiar el estado de la tarjeta");
    }
  };

  
  const handleEliminarTarjeta = async () => {
    if (!window.confirm("⚠️ ¿Seguro que querés eliminar esta tarjeta?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas/${tarjeta.id_tarjeta}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      alert("🗑️ Tarjeta eliminada correctamente");
      navigate("/tarjetas");
    } catch (err) {
      console.error("Error al eliminar tarjeta:", err);
      alert("❌ No se pudo eliminar la tarjeta");
    }
  };

  if (loading) {
    return (
      <div className="tarjeta-container">
        <h2 className="titulo-egipcio">Cargando datos de la tarjeta...</h2>
      </div>
    );
  }

  if (error || !tarjeta) {
    return (
      <div className="tarjeta-container">
        <h2 className="titulo-egipcio">{error || "❌ Tarjeta no encontrada"}</h2>
        <button className="btn-egipcio" onClick={() => navigate("/tarjetas")}>
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="tarjeta-container">
      <h1 className="titulo-egipcio">Detalles de la Tarjeta</h1>

      <div className="tarjeta-detalle">
        <p><strong>ID Tarjeta:</strong> {tarjeta.id_tarjeta}</p>
        <p><strong>Código:</strong> {tarjeta.codigo}</p>
        <p><strong>Saldo:</strong> ${parseFloat(tarjeta.saldo).toFixed(2)}</p>
        <p>
          <strong>Activa:</strong>{" "}
          <span style={{ color: tarjeta.activa ? "#00e676" : "#ff5252", fontWeight: "bold" }}>
            {tarjeta.activa ? "Sí ✅" : "No ❌"}
          </span>
        </p>
        <p><strong>ID Usuario:</strong> {tarjeta.id_usuario}</p>

        {tarjeta.usuario && (
          <p>
            <strong>Usuario:</strong> {tarjeta.usuario.nombre} {tarjeta.usuario.apellido}
          </p>
        )}
      </div>

     
      <div className="acciones-tarjeta">
        <input
          type="number"
          placeholder="Monto a cargar"
          value={cargaMonto}
          onChange={(e) => setCargaMonto(e.target.value)}
          className="input-egipcio"
        />
        <button className="btn-egipcio" onClick={handleCargarSaldo}>💰 Cargar</button>
        <button className="btn-egipcio" onClick={handleToggleActiva}>⏸️ Pausar / Activar</button>
        <button className="btn-egipcio" onClick={handleEliminarTarjeta}>🗑️ Eliminar</button>
        <button className="btn-volver" onClick={() => navigate("/tarjetas")}>← Volver</button>
      </div>
    </div>
  );
}

