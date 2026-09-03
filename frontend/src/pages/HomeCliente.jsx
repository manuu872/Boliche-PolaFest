import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, LogOut, CreditCard, Wallet, Calendar, Wine,
  Search, TrendingUp, CheckCircle, Zap,
} from "lucide-react";
import "../css/HomeCliente.css";

const API = import.meta.env.VITE_API_URL;

const MONTOS_RAPIDOS = [5000, 10000, 20000];

export default function HomeCliente() {
  const navigate = useNavigate();
  const [tarjeta, setTarjeta] = useState(null);
  const [bebidas, setBebidas] = useState([]);
  const [monto, setMonto] = useState("");
  const [loadingTarjeta, setLoadingTarjeta] = useState(true);
  const [mensajePago, setMensajePago] = useState("");
  const [pagoAcreditado, setPagoAcreditado] = useState(false);
  const [busquedaBebida, setBusquedaBebida] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [ventas, setVentas] = useState([]);
  const [proximoEvento, setProximoEvento] = useState(null);
  const esperandoPago = useRef(false);

  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem("usuario")); } catch { return null; }
  })();

  /* ── Fetch inicial ── */
  useEffect(() => {
    fetchTarjeta();
    fetchBebidas();
    fetchEventos();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") verificarPagoPendiente();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const fetchTarjeta = async () => {
    try {
      const res = await fetch(`${API}/tarjetas`);
      const data = await res.json();
      const miTarjeta = data.find((t) => t.id_usuario === usuario?.id_usuario);
      setTarjeta(miTarjeta || null);
      if (miTarjeta?.id_tarjeta) fetchVentas(miTarjeta.id_tarjeta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTarjeta(false);
    }
  };

  const fetchVentas = async (id_tarjeta) => {
    try {
      const res = await fetch(`${API}/ventas/tarjeta/${id_tarjeta}`);
      const data = await res.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch { setVentas([]); }
  };

  const fetchBebidas = async () => {
    try {
      const res = await fetch(`${API}/productos`);
      setBebidas(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchEventos = async () => {
    try {
      const res = await fetch(`${API}/eventos`);
      const data = await res.json();
      const hoy = new Date();
      const proximos = data
        .filter((e) => new Date(e.fecha) >= hoy)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setProximoEvento(proximos[0] || null);
    } catch { /* sin banner */ }
  };

  /* ── Pago MP ── */
  const verificarPagoPendiente = () => {
    if (!esperandoPago.current) return;
    const pendingId = localStorage.getItem("pendingTarjetaId");
    if (!pendingId) return;
    const lastPaymentId = localStorage.getItem("lastAppliedPaymentId");
    const url = `${API}/pagos/confirmar-preferencia?id_tarjeta=${pendingId}${lastPaymentId ? `&exclude_payment_id=${lastPaymentId}` : ""}`;
    fetch(url).then((r) => r.json()).then((d) => {
      if (d.ok) {
        esperandoPago.current = false;
        localStorage.removeItem("pendingTarjetaId");
        localStorage.setItem("lastAppliedPaymentId", d.payment_id);
        setPagoAcreditado(true);
        setMensajePago("Saldo cargado correctamente");
        fetchTarjeta();
      }
    }).catch(() => {});
  };

  const handleVerificarPago = async () => {
    if (!tarjeta) return;
    const lastPaymentId = localStorage.getItem("lastAppliedPaymentId");
    const url = `${API}/pagos/confirmar-preferencia?id_tarjeta=${tarjeta.id_tarjeta}${lastPaymentId ? `&exclude_payment_id=${lastPaymentId}` : ""}`;
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
    } catch { alert("Error al verificar pago"); }
  };

  const handleCargarSaldo = async (montoParam) => {
    const montoNum = parseFloat(montoParam ?? monto);
    if (!tarjeta || isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresá un monto válido");
      return;
    }
    try {
      const res = await fetch(`${API}/pagos/crear-preferencia`, {
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
    } catch { alert("Error al conectar con Mercado Pago"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  /* ── Formatear código tarjeta ── */
  const formatCodigo = (codigo) => {
    if (!codigo) return "•••• ••••";
    const str = String(codigo);
    const last4 = str.slice(-4).padStart(4, "•");
    return `•••• ${last4}`;
  };

  /* ── Filtros bebidas ── */
  const tipos = ["todos", ...new Set(bebidas.map((b) => b.tipo).filter(Boolean))];
  const bebidasFiltradas = bebidas.filter((b) => {
    const nombre = b.nombre.toLowerCase().includes(busquedaBebida.toLowerCase());
    const tipo = tipoFiltro === "todos" || b.tipo === tipoFiltro;
    return nombre && tipo;
  });

  return (
    <div className="hc-page">

      {/* ── Header ── */}
      <header className="hc-header">
        <div className="hc-header-left">
          <img src="/logo.png" alt="PolaFest" className="hc-logo" onError={(e) => { e.target.style.display = "none"; }} />
          <span className="hc-brand">PolaFest</span>
        </div>
        <div className="hc-header-right">
          <div className="hc-avatar"><User size={17} /></div>
          <span className="hc-username">{usuario?.nombre} {usuario?.apellido}</span>
          <button className="hc-logout" onClick={handleLogout}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <div className="hc-content">

        {/* ── Banner próximo evento ── */}
        <AnimatePresence>
          {proximoEvento && (
            <motion.div
              className="hc-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Calendar size={20} className="hc-banner-icon" />
              <div className="hc-banner-text">
                <span>Próxima fiesta — </span>
                <span className="hc-banner-nombre">{proximoEvento.nombre}</span>
                <br />
                <span className="hc-banner-fecha">
                  {new Date(proximoEvento.fecha).toLocaleDateString("es-AR", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mensaje pago ── */}
        <AnimatePresence>
          {mensajePago && (
            <motion.div
              className="hc-msg-ok"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={18} /> {mensajePago}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tarjeta VIP ── */}
        <section>
          {loadingTarjeta ? (
            <div className="hc-vacio" style={{ padding: "3rem 0" }}>Cargando tarjeta...</div>
          ) : tarjeta ? (
            <motion.div
              className="hc-card-vip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="hc-card-shine" />

              {/* Fila 1: chip + estado */}
              <div className="hc-card-row1">
                <div className="hc-chip">
                  <div className="hc-chip-rect" />
                  <span className="hc-card-brand">VIP</span>
                </div>
                <span className={`hc-card-estado ${tarjeta.activa ? "activa" : "inactiva"}`}>
                  {tarjeta.activa ? "Activa" : "Inactiva"}
                </span>
              </div>

              {/* Saldo */}
              <div className="hc-saldo-label">Saldo disponible</div>
              <div className="hc-saldo-monto">
                ${Number(tarjeta.saldo).toLocaleString("es-AR")}
              </div>

              {/* Número formateado */}
              <div className="hc-card-numero">{formatCodigo(tarjeta.codigo)}</div>
            </motion.div>
          ) : (
            <div className="hc-sin-tarjeta">
              <CreditCard size={36} />
              <p>No tenés una tarjeta asignada.<br />Consultá con el staff de PolaFest.</p>
            </div>
          )}
        </section>

        {/* ── Recarga ── */}
        {tarjeta && (
          <section className="hc-recarga">
            <p className="hc-recarga-title">
              <Zap size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
              Cargar saldo
            </p>

            {/* Montos rápidos */}
            <div className="hc-montos-rapidos">
              {MONTOS_RAPIDOS.map((m) => (
                <button
                  key={m}
                  className={`hc-monto-btn ${monto === String(m) ? "activo" : ""}`}
                  onClick={() => setMonto(String(m))}
                >
                  ${m.toLocaleString("es-AR")}
                </button>
              ))}
            </div>

            {/* Input personalizado */}
            <div className="hc-input-row">
              <input
                type="number"
                className="hc-input"
                placeholder="Monto personalizado..."
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
              <button className="hc-btn-cargar" onClick={() => handleCargarSaldo()}>
                <Wallet size={15} /> Ir a pagar
              </button>
            </div>

            <button
              className="hc-btn-verificar"
              onClick={handleVerificarPago}
              disabled={pagoAcreditado}
            >
              {pagoAcreditado ? "Saldo ya acreditado" : "Ya pagué — actualizar saldo"}
            </button>
          </section>
        )}

        {/* ── Historial de consumos ── */}
        <section>
          <div className="hc-section-title">
            <TrendingUp size={15} /> Mis consumos
          </div>
          <div className="hc-historial">
            <AnimatePresence>
              {ventas.length === 0 ? (
                <p className="hc-vacio">No tenés consumos registrados todavía.</p>
              ) : ventas.map((v) => (
                <motion.div
                  key={v.id_venta}
                  className="hc-tx-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="hc-tx-icon consumo">
                    <Wine size={16} />
                  </div>
                  <div className="hc-tx-body">
                    <div className="hc-tx-evento">
                      {v.evento?.nombre || `Evento #${v.id_evento}`}
                    </div>
                    <div className="hc-tx-fecha">
                      {new Date(v.fecha).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                    {v.detalles?.length > 0 && (
                      <div className="hc-tx-pills">
                        {v.detalles.map((d, i) => (
                          <span key={i} className="hc-pill">
                            {d.producto?.nombre || "Producto"} x{d.cantidad}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hc-tx-monto negativo">
                    -${Number(v.total).toLocaleString("es-AR")}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Carta de barra ── */}
        <section>
          <div className="hc-section-title">
            <Wine size={15} /> Carta de barra
          </div>

          <div className="hc-barra-filtros">
            <div className="hc-barra-busqueda">
              <Search size={15} className="hc-barra-busqueda-icon" />
              <input
                type="text"
                className="hc-barra-input"
                placeholder="Buscar bebida..."
                value={busquedaBebida}
                onChange={(e) => setBusquedaBebida(e.target.value)}
              />
            </div>
            <div className="hc-chips-filtro">
              {tipos.map((t) => (
                <button
                  key={t}
                  className={`hc-chip-filtro ${tipoFiltro === t ? "activo" : ""}`}
                  onClick={() => setTipoFiltro(t)}
                >
                  {t === "todos" ? "Todos" : t}
                </button>
              ))}
            </div>
          </div>

          <div className="hc-barra-grid">
            <AnimatePresence>
              {bebidasFiltradas.length === 0 ? (
                <p className="hc-vacio" style={{ gridColumn: "1/-1" }}>
                  Sin resultados.
                </p>
              ) : bebidasFiltradas.map((b) => (
                <motion.div
                  key={b.id_producto}
                  className="hc-bebida-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Wine size={22} className="hc-bebida-icon" />
                  <div className="hc-bebida-nombre">{b.nombre}</div>
                  <div className="hc-bebida-tipo">{b.tipo}</div>
                  <div className="hc-bebida-precio">
                    ${Number(b.precio).toLocaleString("es-AR")}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
}
