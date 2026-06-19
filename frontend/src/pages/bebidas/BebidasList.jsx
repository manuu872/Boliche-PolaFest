import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Bebidas.css";
import BotonVolver from "../../components/BotonVolver";

export default function BebidasList() {
  const navigate = useNavigate();
  const [bebidas, setBebidas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [stockFiltro, setStockFiltro] = useState("todos");

  
  useEffect(() => {
    const fetchBebidas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setBebidas(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchBebidas();
  }, []);


  const eliminarBebida = async (id_producto) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta bebida?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id_producto}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBebidas(bebidas.filter((b) => b.id_producto !== id_producto));
      } else {
        console.error("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const tipos = ["todos", ...new Set(bebidas.map((b) => b.tipo).filter(Boolean))];

  const bebidasFiltradas = bebidas.filter((b) => {
    const coincideNombre = b.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = tipoFiltro === "todos" || b.tipo === tipoFiltro;
    const coincideStock =
      stockFiltro === "todos" ||
      (stockFiltro === "bajo" && b.stock > 0 && b.stock <= 10) ||
      (stockFiltro === "sin" && b.stock === 0);
    return coincideNombre && coincideTipo && coincideStock;
  });

  return (
    <div className="bebidas-container">
      <h1 className="titulo-egipcio">Listado de Bebidas</h1>

      <button className="btn-crear" onClick={() => navigate("/bebidas/nueva")}>
        + Agregar bebida
      </button>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", minWidth: "200px" }}
        />
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          {tipos.map((t) => (
            <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : t}</option>
          ))}
        </select>
        <select
          value={stockFiltro}
          onChange={(e) => setStockFiltro(e.target.value)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          <option value="todos">Todo el stock</option>
          <option value="bajo">Stock bajo (≤10)</option>
          <option value="sin">Sin stock</option>
        </select>
        {(busqueda || tipoFiltro !== "todos" || stockFiltro !== "todos") && (
          <button
            onClick={() => { setBusqueda(""); setTipoFiltro("todos"); setStockFiltro("todos"); }}
            style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #ff5252", backgroundColor: "transparent", color: "#ff5252", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Limpiar filtros
          </button>
        )}
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{bebidasFiltradas.length} resultado{bebidasFiltradas.length !== 1 ? "s" : ""}</span>
      </div>

      <table className="tabla-egipcia">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {bebidasFiltradas.length > 0 ? (
            bebidasFiltradas.map((b) => (
              <tr key={b.id_producto}>
                <td>{b.id_producto}</td>
                <td>{b.nombre}</td>
                <td>{b.tipo}</td>
                <td>${b.precio.toLocaleString("es-AR")}</td>
                <td
                  style={{
                    color:
                      b.stock <= 5 ? "#ff5252" : b.stock < 15 ? "#ffd54f" : "#00e676",
                    fontWeight: "bold",
                  }}
                >
                  {b.stock}
                </td>
                <td className="acciones-egipcias">
                  <button
                    className="btn-egipcio editar"
                    onClick={() => navigate(`/bebidas/editar/${b.id_producto}`)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-egipcio eliminar"
                    onClick={() => eliminarBebida(b.id_producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                {bebidas.length === 0 ? "No hay bebidas cargadas" : "No hay resultados para los filtros aplicados"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <BotonVolver ruta="/" />
      </div>
    </div>
  );
}
