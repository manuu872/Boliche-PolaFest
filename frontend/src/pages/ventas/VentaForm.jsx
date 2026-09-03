import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Search, Trash2, Plus, Minus, ShoppingCart, CheckCircle, XCircle, Wine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BotonVolver from "../../components/BotonVolver";
import "../../css/VentaForm.css";

const API = import.meta.env.VITE_API_URL;

export default function VentaForm() {
  const inputRef = useRef(null);
  const [codigoTarjeta, setCodigoTarjeta] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [productos, setProductos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState("");
  const [tarjetaOk, setTarjetaOk] = useState(null); // null | true | false
  const [loading, setLoading] = useState(false);
  const [tarjetaId, setTarjetaId] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/productos`).then((r) => r.json()),
      fetch(`${API}/eventos`).then((r) => r.json()),
    ]).then(([prods, evts]) => {
      setProductos(prods);
      setEventos(evts);
    }).catch(console.error);
  }, []);

  const buscarTarjeta = async () => {
    if (!codigoTarjeta.trim()) return;
    setLoading(true);
    setError("");
    setUsuario(null);
    setTarjetaOk(null);
    setCarrito([]);

    try {
      const res = await fetch(`${API}/tarjetas/codigo/${codigoTarjeta}`);
      if (!res.ok) {
        setTarjetaOk(false);
        setError(res.status === 404 ? "Tarjeta no encontrada" : "Error al buscar la tarjeta");
        return;
      }
      const data = await res.json();
      if (!data.activa) {
        setTarjetaOk(false);
        setError("Tarjeta desactivada. No puede realizar compras.");
        return;
      }
      setTarjetaOk(true);
      setTarjetaId(data.id_tarjeta);
      setUsuario({ nombre: data.usuario?.nombre || "Sin nombre", apellido: data.usuario?.apellido || "" });
      setSaldo(Number(data.saldo));
    } catch {
      setTarjetaOk(false);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (prod) => {
    if (prod.stock <= 0) return;
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id_producto === prod.id_producto);
      if (existe) {
        if (existe.cantidad >= prod.stock) return prev;
        return prev.map((p) => p.id_producto === prod.id_producto ? { ...p, cantidad: p.cantidad + 1 } : p);
      }
      return [...prev, { ...prod, cantidad: 1, precio: Number(prod.precio) }];
    });
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) => p.id_producto === id ? { ...p, cantidad: p.cantidad + delta } : p)
        .filter((p) => p.cantidad > 0)
    );
  };

  const total = carrito.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  const saldoInsuficiente = total > saldo;

  const confirmarVenta = async () => {
    if (!usuario || !tarjetaOk) return;
    if (!eventoSeleccionado) { alert("Seleccioná un evento"); return; }
    if (carrito.length === 0) { alert("El carrito está vacío"); return; }
    if (saldoInsuficiente) { alert("Saldo insuficiente"); return; }

    try {
      const res = await fetch(`${API}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_tarjeta: tarjetaId,
          id_evento: parseInt(eventoSeleccionado),
          total,
          productos: carrito.map((p) => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            subtotal: p.cantidad * p.precio,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setSaldo(saldo - total);
      setCarrito([]);
      setEventoSeleccionado("");
      setConfirmado(true);
      setTimeout(() => setConfirmado(false), 2500);
    } catch {
      alert("Error al conectar con el servidor");
    }
  };

  const resetear = () => {
    setCodigoTarjeta("");
    setUsuario(null);
    setSaldo(0);
    setCarrito([]);
    setTarjetaOk(null);
    setError("");
    setEventoSeleccionado("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="pos-page">

      {/* ── Barra superior: escáner tarjeta ── */}
      <div className="pos-topbar">
        <div className="pos-brand">
          <CreditCard size={20} color="#FFD700" />
          <span>Cajero — PolaFest</span>
        </div>

        <div className={`pos-scanner ${tarjetaOk === true ? "scanner-ok" : tarjetaOk === false ? "scanner-error" : ""}`}>
          <div className="pos-scanner-icon">
            {tarjetaOk === true  ? <CheckCircle size={18} color="#22c55e" /> :
             tarjetaOk === false ? <XCircle size={18} color="#ef4444" /> :
                                   <CreditCard size={18} color="#555" />}
          </div>
          <input
            ref={inputRef}
            className="pos-scanner-input"
            type="text"
            placeholder="Código de tarjeta — Enter para buscar"
            value={codigoTarjeta}
            onChange={(e) => setCodigoTarjeta(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarTarjeta()}
            autoFocus
          />
          <button className="pos-scanner-btn" onClick={buscarTarjeta} disabled={loading}>
            <Search size={15} /> {loading ? "Buscando..." : "Buscar"}
          </button>
          {usuario && (
            <button className="pos-scanner-reset" onClick={resetear}>Nueva venta</button>
          )}
        </div>

        {error && <span className="pos-error">{error}</span>}
      </div>

      {/* ── Layout POS ── */}
      <div className="pos-layout">

        {/* ── Panel izquierdo: catálogo táctil ── */}
        <div className="pos-catalogo">
          <div className="pos-catalogo-header">
            <Wine size={16} color="#FFD700" />
            <span>Catálogo</span>
            <span className="pos-catalogo-count">{productos.length} productos</span>
          </div>

          {/* Selector de evento */}
          <select
            className="pos-select"
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
            disabled={!usuario}
          >
            <option value="">— Seleccioná un evento —</option>
            {eventos.map((e) => (
              <option key={e.id_evento} value={e.id_evento}>{e.nombre}</option>
            ))}
          </select>

          <div className="pos-grid">
            {productos.map((prod) => {
              const enCarrito = carrito.find((p) => p.id_producto === prod.id_producto);
              const sinStock = prod.stock <= 0;
              return (
                <motion.button
                  key={prod.id_producto}
                  className={`pos-prod-card ${sinStock ? "sin-stock" : ""} ${enCarrito ? "en-carrito" : ""}`}
                  whileTap={!sinStock && usuario ? { scale: 0.93 } : {}}
                  onClick={() => usuario && !sinStock && agregarAlCarrito(prod)}
                  disabled={sinStock || !usuario}
                >
                  <span className="pos-prod-nombre">{prod.nombre}</span>
                  <span className="pos-prod-precio">${Number(prod.precio).toLocaleString("es-AR")}</span>
                  <span className={`pos-prod-stock ${sinStock ? "rojo" : prod.stock <= 10 ? "naranja" : "verde"}`}>
                    {sinStock ? "Sin stock" : `${prod.stock} uds.`}
                  </span>
                  {enCarrito && <span className="pos-prod-badge">{enCarrito.cantidad}</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Panel derecho: ticket ── */}
        <div className="pos-ticket">

          {/* Cliente */}
          <div className={`pos-cliente ${!usuario ? "vacio" : ""}`}>
            {usuario ? (
              <>
                <div className="pos-cliente-nombre">{usuario.nombre} {usuario.apellido}</div>
                <div className="pos-saldo-label">Saldo disponible</div>
                <div className={`pos-saldo-valor ${saldoInsuficiente ? "rojo" : ""}`}>
                  ${Number(saldo).toLocaleString("es-AR")}
                </div>
              </>
            ) : (
              <div className="pos-cliente-vacio">
                <CreditCard size={32} color="#333" />
                <span>Buscá una tarjeta para comenzar</span>
              </div>
            )}
          </div>

          {/* Carrito */}
          <div className="pos-carrito-header">
            <ShoppingCart size={15} color="#FFD700" />
            <span>Pedido</span>
            {carrito.length > 0 && (
              <button className="pos-limpiar" onClick={() => setCarrito([])}>Limpiar</button>
            )}
          </div>

          <div className="pos-carrito-lista">
            <AnimatePresence>
              {carrito.length === 0 ? (
                <p className="pos-carrito-vacio">Sin productos agregados</p>
              ) : carrito.map((p) => (
                <motion.div
                  key={p.id_producto}
                  className="pos-carrito-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="pos-item-nombre">{p.nombre}</div>
                  <div className="pos-item-controles">
                    <button onClick={() => cambiarCantidad(p.id_producto, -1)}><Minus size={12} /></button>
                    <span>{p.cantidad}</span>
                    <button onClick={() => cambiarCantidad(p.id_producto, +1)} disabled={p.cantidad >= p.stock}><Plus size={12} /></button>
                  </div>
                  <div className="pos-item-subtotal">${(p.cantidad * p.precio).toLocaleString("es-AR")}</div>
                  <button className="pos-item-remove" onClick={() => setCarrito(carrito.filter((x) => x.id_producto !== p.id_producto))}>
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Total */}
          <div className="pos-total-row">
            <span>Total</span>
            <span className={`pos-total-val ${saldoInsuficiente ? "rojo" : ""}`}>
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
          {saldoInsuficiente && <p className="pos-aviso-saldo">Saldo insuficiente</p>}

          {/* Botón confirmar */}
          <AnimatePresence mode="wait">
            {confirmado ? (
              <motion.div key="ok" className="pos-confirmado" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle size={22} /> Venta registrada
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                className="pos-btn-confirmar"
                onClick={confirmarVenta}
                disabled={!usuario || carrito.length === 0 || saldoInsuficiente || !eventoSeleccionado}
                whileTap={{ scale: 0.97 }}
              >
                Confirmar Cobro — Descontar Saldo
              </motion.button>
            )}
          </AnimatePresence>

          <div style={{ marginTop: "1rem" }}>
            <BotonVolver ruta="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
