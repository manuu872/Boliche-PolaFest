import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/TarjetaList.css";

export default function TarjetaList() {
  const [tarjetas, setTarjetas] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [saldoMin, setSaldoMin] = useState("");

  
  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas`);
        if (!res.ok) throw new Error("Error al obtener las tarjetas");

        const data = await res.json();
        setTarjetas(data);
      } catch (error) {
        console.error("Error al cargar tarjetas:", error);
        alert("❌ No se pudieron cargar las tarjetas");
      }
    };

    fetchTarjetas();
  }, []);

  const tarjetasFiltradas = tarjetas.filter((t) => {
    const coincideCodigo = t.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado =
      estadoFiltro === "todos" ||
      (estadoFiltro === "activas" && t.activa) ||
      (estadoFiltro === "inactivas" && !t.activa);
    const coincideSaldo = saldoMin === "" || parseFloat(t.saldo) >= parseFloat(saldoMin);
    return coincideCodigo && coincideEstado && coincideSaldo;
  });

  return (
    <div className="tarjetas-container">
      <h1 className="titulo-egipcio">Listado de Tarjetas</h1>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Buscar por código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", minWidth: "200px" }}
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          <option value="todos">Todas</option>
          <option value="activas">Solo activas</option>
          <option value="inactivas">Solo inactivas</option>
        </select>
        <input
          type="number"
          placeholder="Saldo mínimo ($)"
          value={saldoMin}
          onChange={(e) => setSaldoMin(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", width: "160px" }}
        />
        {(busqueda || estadoFiltro !== "todos" || saldoMin !== "") && (
          <button
            onClick={() => { setBusqueda(""); setEstadoFiltro("todos"); setSaldoMin(""); }}
            style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #ff5252", backgroundColor: "transparent", color: "#ff5252", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Limpiar filtros
          </button>
        )}
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{tarjetasFiltradas.length} resultado{tarjetasFiltradas.length !== 1 ? "s" : ""}</span>
      </div>

      <table className="tabla-egipcia">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Saldo</th>
            <th>Activa</th>
            <th>ID Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tarjetasFiltradas.length > 0 ? (
            tarjetasFiltradas.map((t) => (
              <tr key={t.id_tarjeta}>
                <td>{t.id_tarjeta}</td>
                <td>{t.codigo}</td>
                <td>${parseFloat(t.saldo).toFixed(2)}</td>
                <td style={{ color: t.activa ? "#00e676" : "#ff5252" }}>
                  {t.activa ? "✅ Sí" : "❌ No"}
                </td>
                <td>{t.id_usuario}</td>
                <td>
                  <button className="btn-egipcio" onClick={() => navigate(`/tarjetas/ver/${t.id_tarjeta}`)}>
                    Ver Tarjeta
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                {tarjetas.length === 0 ? "No hay tarjetas registradas" : "No hay resultados para los filtros aplicados"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn-volver" onClick={() => navigate("/")}>
        ← Volver
      </button>
    </div>
  );
}