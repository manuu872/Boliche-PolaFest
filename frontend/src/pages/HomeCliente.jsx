import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function HomeCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tarjeta, setTarjeta] = useState(null);
  const [bebidas, setBebidas] = useState([]);
  const [monto, setMonto] = useState("");
  const [loadingTarjeta, setLoadingTarjeta] = useState(true);
  const [mensajePago, setMensajePago] = useState("");
  const [pagoAcreditado, setPagoAcreditado] = useState(false);
  const esperandoPago = useRef(false);
  const [busquedaBebida, setBusquedaBebida] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [ventas, setVentas] = useState([]);

  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem("usuario")); } catch { return null; }
  })();

  const verificarPagoPendiente = () => {
    if (!esperandoPago.current) return;
    const pendingId = localStorage.getItem("pendingTarjetaId");
    if (!pendingId) return;
    const lastPaymentId = localStorage.getItem("lastAppliedPaymentId");
    const url = `${import.meta.env.VITE_API_URL}/pagos/confirmar-preferencia?id_tarjeta=${pendingId}${lastPaymentId ? `&exclude_payment_id=${lastPaymentId}` : ""}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          esperandoPago.current = false;
          localStorage.removeItem("pendingTarjetaId");
          localStorage.setItem("lastAppliedPaymentId", data.payment_id);
          setPagoAcreditado(true);
          setMensajePago("Saldo cargado correctamente");
          fetchTarjeta();
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTarjeta();
    fetchBebidas();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") verificarPagoPendiente();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const fetchTarjeta = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tarjetas`);
      const data = await res.json();
      const miTarjeta = data.find((t) => t.id_usuario === usuario?.id_usuario);
      setTarjeta(miTarjeta || null);
      if (miTarjeta?.id_tarjeta) fetchVentas(miTarjeta.id_tarjeta);
    } catch (err) {
      console.error("Error al cargar tarjeta:", err);
    } finally {
      setLoadingTarjeta(false);
    }
  };

  const fetchVentas = async (id_tarjeta) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ventas/tarjeta/${id_tarjeta}`);
      const data = await res.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch {
      setVentas([]);
    }
  };

  const fetchBebidas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`);
      const data = await res.json();
      setBebidas(data);
    } catch (err) {
      console.error("Error al cargar bebidas:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleVerificarPago = async () => {
    if (!tarjeta) return;
    const lastPaymentId = localStorage.getItem("lastAppliedPaymentId");
    const url = `${import.meta.env.VITE_API_URL}/pagos/confirmar-preferencia?id_tarjeta=${tarjeta.id_tarjeta}${lastPaymentId ? `&exclude_payment_id=${lastPaymentId}` : ""}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        localStorage.removeItem("pendingTarjetaId");
        setPagoAcreditado(true);
        setMensajePago("Saldo cargado correctamente");
        fetchTarjeta();
      } else {
        alert(data.mensaje || "No se encontró ningún pago reciente aprobado.");
      }
    } catch {
      alert("Error al verificar pago");
    }
  };

  const handleCargarSaldo = async () => {
    const montoNum = parseFloat(monto);
    if (!tarjeta || isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresá un monto válido");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pagos/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monto: montoNum, id_tarjeta: tarjeta.id_tarjeta }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("pendingTarjetaId", String(tarjeta.id_tarjeta));
      esperandoPago.current = true;
      setPagoAcreditado(false);
      setMensajePago("");
      window.open(data.init_point, "_blank");
    } catch {
      alert("Error al conectar con Mercado Pago");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.userInfo}>
          <span style={styles.userName}>Hola, {usuario?.nombre}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Salir</button>
        </div>
      </div>

      <div style={styles.content}>
        {mensajePago && (
          <div style={styles.mensajeExito}>{mensajePago}</div>
        )}
        {/* Tarjeta */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💳 Mi Tarjeta</h2>

          {loadingTarjeta ? (
            <p style={styles.muted}>Cargando...</p>
          ) : tarjeta ? (
            <div style={styles.tarjetaCard}>
              <div style={styles.tarjetaTop}>
                <span style={styles.tarjetaCodigo}>{tarjeta.codigo}</span>
                <span style={{ color: tarjeta.activa ? "#4caf50" : "#ff5252", fontSize: "0.85rem" }}>
                  {tarjeta.activa ? "✅ Activa" : "❌ Inactiva"}
                </span>
              </div>
              <div style={styles.saldoContainer}>
                <span style={styles.saldoLabel}>Saldo disponible</span>
                <span style={styles.saldoMonto}>${parseFloat(tarjeta.saldo).toFixed(2)}</span>
              </div>

              <div style={styles.cargarRow}>
                <input
                  type="number"
                  placeholder="Monto a cargar"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleCargarSaldo} style={styles.cargarBtn}>
                  Cargar saldo
                </button>
              </div>
              <button
                onClick={handleVerificarPago}
                disabled={pagoAcreditado}
                style={{ ...styles.verificarBtn, opacity: pagoAcreditado ? 0.4 : 1, cursor: pagoAcreditado ? "default" : "pointer" }}
              >
                {pagoAcreditado ? "Saldo ya acreditado" : "Ya pagué — actualizar saldo"}
              </button>
            </div>
          ) : (
            <p style={styles.muted}>No tenés una tarjeta asignada aún. Consultá con el staff.</p>
          )}
        </div>

        {/* Mis Consumos */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧾 Mis Consumos</h2>
          {ventas.length === 0 ? (
            <p style={styles.muted}>No tenés consumos registrados todavía.</p>
          ) : (
            <div style={styles.consumosLista}>
              {ventas.map((v) => (
                <div key={v.id_venta} style={styles.consumoItem}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#FFB400", fontSize: "0.85rem", fontWeight: "600" }}>
                        {v.evento?.nombre || `Evento #${v.id_evento}`}
                      </span>
                      <span style={{ color: "#ff5252", fontWeight: "bold", fontSize: "1rem" }}>
                        -${parseFloat(v.total).toFixed(2)}
                      </span>
                    </div>
                    <span style={{ color: "#666", fontSize: "0.75rem" }}>
                      {new Date(v.fecha).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    {v.detalles?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.2rem" }}>
                        {v.detalles.map((d, i) => (
                          <span key={i} style={{ backgroundColor: "#2a2a2a", color: "#aaa", fontSize: "0.75rem", padding: "0.2rem 0.55rem", borderRadius: "12px" }}>
                            {d.producto?.nombre || "Producto"} x{d.cantidad}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bebidas */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🍸 Bebidas</h2>

          {/* Filtros bebidas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Buscar bebida..."
              value={busquedaBebida}
              onChange={(e) => setBusquedaBebida(e.target.value)}
              style={{ padding: "0.55rem 0.9rem", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#1a1a1a", color: "#fff", fontSize: "0.9rem", maxWidth: "320px", outline: "none" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["todos", ...new Set(bebidas.map((b) => b.tipo).filter(Boolean))].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoFiltro(tipo)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "20px",
                    border: tipoFiltro === tipo ? "none" : "1px solid #444",
                    backgroundColor: tipoFiltro === tipo ? "#FFB400" : "transparent",
                    color: tipoFiltro === tipo ? "#000" : "#aaa",
                    fontWeight: tipoFiltro === tipo ? "bold" : "normal",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    transition: "all 0.15s",
                  }}
                >
                  {tipo === "todos" ? "Todos" : tipo}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.bebidasGrid}>
            {bebidas
              .filter((b) => {
                const coincideNombre = b.nombre.toLowerCase().includes(busquedaBebida.toLowerCase());
                const coincideTipo = tipoFiltro === "todos" || b.tipo === tipoFiltro;
                return coincideNombre && coincideTipo;
              })
              .map((b) => (
                <div key={b.id_producto} style={styles.bebidaCard}>
                  <span style={styles.bebidaNombre}>{b.nombre}</span>
                  <span style={styles.bebidaTipo}>{b.tipo}</span>
                  <span style={styles.bebidaPrecio}>${parseFloat(b.precio).toFixed(2)}</span>
                </div>
              ))}
            {bebidas.length === 0 && (
              <p style={styles.muted}>No hay bebidas cargadas.</p>
            )}
            {bebidas.length > 0 && bebidas.filter((b) => {
              const coincideNombre = b.nombre.toLowerCase().includes(busquedaBebida.toLowerCase());
              const coincideTipo = tipoFiltro === "todos" || b.tipo === tipoFiltro;
              return coincideNombre && coincideTipo;
            }).length === 0 && (
              <p style={styles.muted}>No hay bebidas que coincidan con el filtro.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#1a1a1a",
    borderBottom: "2px solid #FFB400",
  },
  logo: {
    height: "60px",
    objectFit: "contain",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userName: {
    color: "#FFB400",
    fontWeight: "600",
    fontSize: "1rem",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    border: "1px solid #ff5252",
    color: "#ff5252",
    padding: "0.4rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  content: {
    padding: "2rem",
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  sectionTitle: {
    color: "#FFB400",
    fontSize: "1.4rem",
    borderBottom: "1px solid #333",
    paddingBottom: "0.5rem",
  },
  tarjetaCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "420px",
    boxShadow: "0 0 20px rgba(255, 180, 0, 0.08)",
  },
  tarjetaTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tarjetaCodigo: {
    fontSize: "1rem",
    color: "#aaa",
    letterSpacing: "2px",
  },
  saldoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  saldoLabel: {
    color: "#888",
    fontSize: "0.85rem",
  },
  saldoMonto: {
    color: "#FFB400",
    fontSize: "2.2rem",
    fontWeight: "bold",
  },
  cargarRow: {
    display: "flex",
    gap: "0.75rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#242424",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  cargarBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#FFB400",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  bebidasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1rem",
  },
  bebidaCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    textAlign: "center",
  },
  bebidaNombre: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
  },
  bebidaTipo: {
    color: "#888",
    fontSize: "0.8rem",
  },
  bebidaPrecio: {
    color: "#FFB400",
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginTop: "0.3rem",
  },
  muted: {
    color: "#666",
    fontSize: "0.95rem",
  },
  consumosLista: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    maxHeight: "320px",
    overflowY: "auto",
    paddingRight: "0.25rem",
  },
  consumoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
  },
  verificarBtn: {
    backgroundColor: "transparent",
    border: "1px solid #FFB400",
    color: "#FFB400",
    padding: "0.4rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.8rem",
    marginTop: "0.3rem",
  },
  mensajeExito: {
    backgroundColor: "#1a3a1a",
    border: "1px solid #4caf50",
    color: "#4caf50",
    padding: "0.8rem 1.2rem",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
};
