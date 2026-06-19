import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Usuarios.css";
import BotonVolver from "../../components/BotonVolver";

export default function UsuarioList() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [tarjetaFiltro, setTarjetaFiltro] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const POR_PAGINA = 10;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsuarios, resTarjetas] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/usuarios`),
          fetch(`${import.meta.env.VITE_API_URL}/tarjetas`),
        ]);

        if (!resUsuarios.ok || !resTarjetas.ok)
          throw new Error("Error al obtener datos");

        const dataUsuarios = await resUsuarios.json();
        const dataTarjetas = await resTarjetas.json();

        setUsuarios(dataUsuarios);
        setTarjetas(dataTarjetas);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("❌ No se pudieron cargar los usuarios o tarjetas");
      }
    };

    fetchData();
  }, []);

  
  const obtenerTarjetaUsuario = (id_usuario) =>
    tarjetas.find((t) => t.id_usuario === id_usuario);

  
  const crearTarjeta = async (id_usuario) => {
    const confirmar = window.confirm(
      "¿Querés crear una nueva tarjeta para este usuario?"
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas/crear/${id_usuario}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Error al crear tarjeta");

      const data = await res.json();
      alert(`✅ Tarjeta creada correctamente (${data.codigo})`);

      
      setTarjetas([...tarjetas, data]);
    } catch (error) {
      console.error("Error al crear tarjeta:", error);
      alert("❌ No se pudo crear la tarjeta");
    }
  };

  
  const eliminarUsuario = async (id_usuario) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este usuario?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id_usuario}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u.id_usuario !== id_usuario));
      } else {
        console.error("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      u.nombre?.toLowerCase().includes(termino) ||
      u.apellido?.toLowerCase().includes(termino) ||
      u.email?.toLowerCase().includes(termino) ||
      String(u.dni).includes(termino);
    const coincideRol = rolFiltro === "todos" || u.rol === rolFiltro;
    const tieneTarjeta = tarjetas.some((t) => t.id_usuario === u.id_usuario);
    const coincideTarjeta =
      tarjetaFiltro === "todos" ||
      (tarjetaFiltro === "con" && tieneTarjeta) ||
      (tarjetaFiltro === "sin" && !tieneTarjeta);
    return coincideBusqueda && coincideRol && coincideTarjeta;
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / POR_PAGINA);
  const paginaSegura = Math.min(paginaActual, totalPaginas || 1);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaSegura - 1) * POR_PAGINA,
    paginaSegura * POR_PAGINA
  );

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPaginaActual(nueva);
  };

  const btnPagStyle = (disabled) => ({
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "transparent",
    color: disabled ? "#333" : "#888",
    cursor: disabled ? "default" : "pointer",
    fontSize: "0.9rem",
  });

  return (
    <div className="usuarios-container">
      <h1 className="titulo-egipcio">Lista de Usuarios</h1>

      <button className="btn-crear" onClick={() => navigate("/usuarios/nuevo")}>
        + Crear nuevo usuario
      </button>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0 1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, email o DNI..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", minWidth: "280px" }}
        />
        <select
          value={rolFiltro}
          onChange={(e) => { setRolFiltro(e.target.value); setPaginaActual(1); }}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          <option value="todos">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        <select
          value={tarjetaFiltro}
          onChange={(e) => { setTarjetaFiltro(e.target.value); setPaginaActual(1); }}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem" }}
        >
          <option value="todos">Con y sin tarjeta</option>
          <option value="con">Con tarjeta</option>
          <option value="sin">Sin tarjeta</option>
        </select>
        {(busqueda || rolFiltro !== "todos" || tarjetaFiltro !== "todos") && (
          <button
            onClick={() => { setBusqueda(""); setRolFiltro("todos"); setTarjetaFiltro("todos"); setPaginaActual(1); }}
            style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #ff5252", backgroundColor: "transparent", color: "#ff5252", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Limpiar filtros
          </button>
        )}
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{usuariosFiltrados.length} resultado{usuariosFiltrados.length !== 1 ? "s" : ""}</span>
      </div>

      <table className="tabla-egipcia">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosPagina.length > 0 ? (
            usuariosPagina.map((u) => {
              const tarjetaUsuario = obtenerTarjetaUsuario(u.id_usuario);

              return (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.dni}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td className="acciones-egipcias">
                    <button
                      className="btn-egipcio editar"
                      onClick={() => navigate(`/usuarios/editar/${u.id_usuario}`)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-egipcio eliminar"
                      onClick={() => eliminarUsuario(u.id_usuario)}
                    >
                      Eliminar
                    </button>

                    
                    {tarjetaUsuario ? (
                      <button
                        className="btn-egipcio ver-tarjeta"
                        onClick={() =>
                          navigate(`/tarjetas/ver/${tarjetaUsuario.id_tarjeta}`)
                        }
                      >
                        Ver Tarjeta
                      </button>
                    ) : (
                      <button
                        className="btn-egipcio crear-tarjeta"
                        onClick={() => crearTarjeta(u.id_usuario)}
                      >
                        Crear Tarjeta
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                {usuarios.length === 0 ? "No hay usuarios cargados" : "No hay resultados para los filtros aplicados"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => cambiarPagina(1)}
            disabled={paginaSegura === 1}
            style={btnPagStyle(paginaSegura === 1)}
          >«</button>
          <button
            onClick={() => cambiarPagina(paginaSegura - 1)}
            disabled={paginaSegura === 1}
            style={btnPagStyle(paginaSegura === 1)}
          >‹</button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPaginas || Math.abs(n - paginaSegura) <= 2)
            .reduce((acc, n, i, arr) => {
              if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
              acc.push(n);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`dots-${i}`} style={{ color: "#555", padding: "0 4px" }}>…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => cambiarPagina(item)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: item === paginaSegura ? "none" : "1px solid #333",
                    background: item === paginaSegura ? "linear-gradient(135deg,#FFB400,#e09000)" : "transparent",
                    color: item === paginaSegura ? "#000" : "#888",
                    fontWeight: item === paginaSegura ? "700" : "400",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    minWidth: "34px",
                  }}
                >{item}</button>
              )
            )}

          <button
            onClick={() => cambiarPagina(paginaSegura + 1)}
            disabled={paginaSegura === totalPaginas}
            style={btnPagStyle(paginaSegura === totalPaginas)}
          >›</button>
          <button
            onClick={() => cambiarPagina(totalPaginas)}
            disabled={paginaSegura === totalPaginas}
            style={btnPagStyle(paginaSegura === totalPaginas)}
          >»</button>

          <span style={{ color: "#555", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
            Página {paginaSegura} de {totalPaginas} — {usuariosFiltrados.length} usuarios
          </span>
        </div>
      )}

      <div>
        <BotonVolver ruta="/" />
      </div>
    </div>
  );
}

