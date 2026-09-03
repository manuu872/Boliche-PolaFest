import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BotonVolver from "../../components/BotonVolver";
import "../../css/Bebidas.css";

const API = import.meta.env.VITE_API_URL;

function StockBadge({ stock }) {
  if (stock === 0)
    return <span className="badge badge-rojo">Sin stock</span>;
  if (stock <= 10)
    return <span className="badge badge-naranja">{stock} uds.</span>;
  return <span className="badge badge-verde">{stock} uds.</span>;
}

export default function BebidasList() {
  const navigate = useNavigate();
  const [bebidas, setBebidas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [stockFiltro, setStockFiltro] = useState("todos");

  useEffect(() => {
    fetch(`${API}/productos`)
      .then((r) => r.json())
      .then(setBebidas)
      .catch(console.error);
  }, []);

  const eliminarBebida = async (id_producto) => {
    if (!window.confirm("¿Seguro que querés eliminar esta bebida?")) return;
    const res = await fetch(`${API}/productos/${id_producto}`, { method: "DELETE" });
    if (res.ok) setBebidas(bebidas.filter((b) => b.id_producto !== id_producto));
  };

  const tipos = ["todos", ...new Set(bebidas.map((b) => b.tipo).filter(Boolean))];

  const filtradas = bebidas.filter((b) => {
    const nombre = b.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const tipo = tipoFiltro === "todos" || b.tipo === tipoFiltro;
    const stock =
      stockFiltro === "todos" ||
      (stockFiltro === "bajo" && b.stock > 0 && b.stock <= 10) ||
      (stockFiltro === "sin" && b.stock === 0);
    return nombre && tipo && stock;
  });

  const hayFiltros = busqueda || tipoFiltro !== "todos" || stockFiltro !== "todos";

  return (
    <div className="bl-page">
      {/* Header */}
      <div className="bl-header">
        <div>
          <h1 className="bl-titulo">Bebidas</h1>
          <p className="bl-subtitulo">{filtradas.length} producto{filtradas.length !== 1 ? "s" : ""} encontrado{filtradas.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="bl-btn-nuevo" onClick={() => navigate("/bebidas/nueva")}>
          <Plus size={16} /> Agregar bebida
        </button>
      </div>

      {/* Filtros */}
      <div className="bl-filtros">
        <div className="bl-input-wrap">
          <Search size={15} className="bl-input-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bl-input"
          />
        </div>
        <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="bl-select">
          {tipos.map((t) => (
            <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : t}</option>
          ))}
        </select>
        <select value={stockFiltro} onChange={(e) => setStockFiltro(e.target.value)} className="bl-select">
          <option value="todos">Todo el stock</option>
          <option value="bajo">Stock bajo (≤10)</option>
          <option value="sin">Sin stock</option>
        </select>
        {hayFiltros && (
          <button className="bl-btn-limpiar" onClick={() => { setBusqueda(""); setTipoFiltro("todos"); setStockFiltro("todos"); }}>
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bl-table-wrap">
        <table className="bl-table">
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
            <AnimatePresence>
              {filtradas.length > 0 ? filtradas.map((b) => (
                <motion.tr
                  key={b.id_producto}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <td className="bl-td-id">#{b.id_producto}</td>
                  <td className="bl-td-nombre">{b.nombre}</td>
                  <td><span className="bl-tipo">{b.tipo}</span></td>
                  <td className="bl-td-precio">${Number(b.precio).toLocaleString("es-AR")}</td>
                  <td><StockBadge stock={b.stock} /></td>
                  <td>
                    <div className="bl-acciones">
                      <button className="bl-icon-btn editar" title="Editar" onClick={() => navigate(`/bebidas/editar/${b.id_producto}`)}>
                        <Pencil size={15} />
                      </button>
                      <button className="bl-icon-btn eliminar" title="Eliminar" onClick={() => eliminarBebida(b.id_producto)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="bl-vacio">
                    {bebidas.length === 0 ? "No hay bebidas cargadas" : "Sin resultados para los filtros aplicados"}
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <BotonVolver ruta="/" />
    </div>
  );
}
