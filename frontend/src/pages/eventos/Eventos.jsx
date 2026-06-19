import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Eventos.css";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("todos");

  
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/eventos`);
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
       
        setEventos([
          {
            id_evento: 1,
            nombre: "Noche Anubis",
            fecha_inicio: "2025-11-05",
            fecha_fin: "2025-11-06",
            max_gente: 300,
            imagen: "/evento1.png",
          },
          {
            id_evento: 2,
            nombre: "Faraón Party",
            fecha_inicio: "2025-12-20",
            fecha_fin: "2025-12-21",
            max_gente: 450,
            imagen: "/evento2.png",
          },
          {
            id_evento: 3,
            nombre: "Oasis Electrónico",
            fecha_inicio: "2026-01-10",
            fecha_fin: "2026-01-11",
            max_gente: 500,
            imagen: "/evento3.png",
          },
        ]);
      }
    };

    fetchEventos();
  }, []);


  const eliminarEvento = async (id_evento) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este evento?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/eventos/${id_evento}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEventos(eventos.filter((e) => e.id_evento !== id_evento));
      } else {
        console.error("Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const hoy = new Date();

  const eventosFiltrados = eventos.filter((e) => {
    const coincideNombre = e.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const fechaFin = new Date(e.fecha_fin);
    const fechaInicio = new Date(e.fecha_inicio);
    const coincideFecha =
      fechaFiltro === "todos" ||
      (fechaFiltro === "proximos" && fechaInicio >= hoy) ||
      (fechaFiltro === "pasados" && fechaFin < hoy) ||
      (fechaFiltro === "activos" && fechaInicio <= hoy && fechaFin >= hoy);
    return coincideNombre && coincideFecha;
  });

  return (
    <div className="eventos-container">
      <h1 className="titulo-egipcio">Eventos de PolaFest</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          className="btn-egipcio"
          onClick={() => navigate("/eventos/nuevo")}
        >
          + Crear Evento
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", minWidth: "220px" }}
        />
        <select
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          <option value="todos">Todos los eventos</option>
          <option value="proximos">Próximos</option>
          <option value="activos">En curso</option>
          <option value="pasados">Pasados</option>
        </select>
        {(busqueda || fechaFiltro !== "todos") && (
          <button
            onClick={() => { setBusqueda(""); setFechaFiltro("todos"); }}
            style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #ff5252", backgroundColor: "transparent", color: "#ff5252", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Limpiar filtros
          </button>
        )}
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="carrusel">
        {eventosFiltrados.length > 0 ? eventosFiltrados.map((e) => (
          <div key={e.id_evento} className="evento-card">
            <img
              src={e.imagen ? `${import.meta.env.VITE_API_URL}/uploads/eventos/${e.imagen}` : "/evento-placeholder.png"}
              alt={e.nombre}
              className="evento-imagen"
              onError={(ev) => { ev.target.style.display = "none"; }}
            />

            <div className="evento-info">
              <h2>{e.nombre}</h2>
              <p>
                <strong>Inicio:</strong>{" "}
                {new Date(e.fecha_inicio).toLocaleDateString()}
              </p>
              <p>
                <strong>Fin:</strong>{" "}
                {new Date(e.fecha_fin).toLocaleDateString()}
              </p>
              <p>
                <strong>Máx. Personas:</strong> {e.max_gente}
              </p>

              <div className="botones-evento">
                <button
                  className="btn-egipcio"
                  onClick={() => navigate(`/consumos/${e.id_evento}`)}
                >
                  🍸 Ver consumos
                </button>

                <button
                  className="btn-egipcio editar"
                  onClick={() => navigate(`/eventos/editar/${e.id_evento}`)}
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn-egipcio eliminar"
                  onClick={() => eliminarEvento(e.id_evento)}
                >
                  ❌ Eliminar
                </button>
              </div>
            </div>
          </div>
        )) : (
          <p style={{ textAlign: "center", color: "#888", padding: "2rem", width: "100%" }}>
            {eventos.length === 0 ? "No hay eventos cargados" : "No hay eventos que coincidan con los filtros"}
          </p>
        )}
      </div>

      <button className="btn-volver" onClick={() => navigate("/")}>
        ← Volver
      </button>
    </div>
  );
}
