

import React, { useState, useEffect } from "react";
import "../../css/VentaForm.css";
import BotonVolver from "../../components/BotonVolver";

export default function VentaForm() {
  const [codigoTarjeta, setCodigoTarjeta] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [productos, setProductos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [productosVenta, setProductosVenta] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tarjetaActiva, setTarjetaActiva] = useState(true);
  const [tarjetaId, setTarjetaId] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resProd, resEvent] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/productos`),
          fetch(`${import.meta.env.VITE_API_URL}/eventos`),
        ]);
        setProductos(await resProd.json());
        setEventos(await resEvent.json());
      } catch (err) {
        console.error("Error al cargar productos o eventos:", err);
      }
    };
    cargarDatos();
  }, []);

  const buscarTarjeta = async () => {
    if (!codigoTarjeta.trim()) {
      setError("Ingresá un código válido");
      return;
    }

    setLoading(true);
    setError("");
    setUsuario(null);
    setSaldo(0);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tarjetas/codigo/${codigoTarjeta}`
      );

      if (!response.ok) {
        setError(response.status === 404 ? "❌ No se encontró la tarjeta" : "⚠️ Error al buscar la tarjeta");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.activa) {
        setTarjetaActiva(false);
        setError("❌ Esta tarjeta está desactivada. No puede realizar compras.");
        setLoading(false);
        return;
      }

      setTarjetaActiva(true);
      setTarjetaId(data.id_tarjeta);
      setUsuario({
        nombre: data.usuario?.nombre || "Usuario sin nombre",
        id_usuario: data.id_usuario,
      });
      setSaldo(Number(data.saldo));
      setError("");
    } catch (err) {
      console.error("Error al buscar tarjeta:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = () => {
    if (!tarjetaActiva) {
      alert("❌ No se pueden agregar productos: la tarjeta está desactivada.");
      return;
    }

    if (!productoSeleccionado) {
      alert("Seleccioná un producto");
      return;
    }

    const prod = productos.find(
      (p) => p.id_producto === parseInt(productoSeleccionado)
    );
    if (!prod) return;

    
    if (prod.stock <= 0) {
      alert(`❌ No queda stock del producto "${prod.nombre}".`);
      return;
    }

    if (cantidad > prod.stock) {
      alert(`⚠️ Solo quedan ${prod.stock} unidades disponibles de "${prod.nombre}".`);
      return;
    }

    const nuevo = {
      nombre: prod.nombre,
      cantidad,
      precio: Number(prod.precio),
    };

    setProductosVenta([...productosVenta, nuevo]);
    setCantidad(1);
    setProductoSeleccionado("");
  };

  const total = productosVenta.reduce(
    (sum, p) => sum + p.cantidad * p.precio,
    0
  );

  const confirmarVenta = async () => {
    if (!usuario) {
      alert("Primero buscá una tarjeta válida");
      return;
    }
    if (!tarjetaActiva) {
      alert("❌ No se puede realizar la venta. La tarjeta está desactivada.");
      return;
    }
    if (!eventoSeleccionado) {
      alert("Seleccioná un evento");
      return;
    }
    if (productosVenta.length === 0) {
      alert("No hay productos cargados");
      return;
    }
    if (total > saldo) {
      alert("Saldo insuficiente");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_tarjeta: tarjetaId,
          id_evento: parseInt(eventoSeleccionado),
          total,
          productos: productosVenta.map((p) => ({
            id_producto: productos.find((x) => x.nombre === p.nombre)
              .id_producto,
            cantidad: p.cantidad,
            subtotal: p.cantidad * p.precio,
          })),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      await res.json();
      setSaldo(saldo - total);
      setProductosVenta([]);
      setEventoSeleccionado("");
      alert("✅ Venta realizada con éxito");
    } catch (error) {
      console.error("Error al confirmar venta:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="venta-container">
      <h1 className="titulo-egipcio">Cajero PolaFest</h1>

      <div className="tarjeta-section">
        <label>Código de Tarjeta:</label>
        <div className="tarjeta-input">
          <input
            type="text"
            value={codigoTarjeta}
            onChange={(e) => setCodigoTarjeta(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarTarjeta()}
            placeholder="Acercá la tarjeta o ingresá el código..."
            autoFocus
          />
          <button
            className="btn-egipcio"
            onClick={buscarTarjeta}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {usuario && tarjetaActiva && (
          <div className="datos-usuario">
            <p>
              <strong>Usuario:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Saldo actual:</strong> ${Number(saldo).toFixed(2)}
            </p>
          </div>
        )}
      </div>
      {usuario && tarjetaActiva && (
        <div className="eventos-section">
          <h2>Seleccionar Evento</h2>
          <select
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
          >
            <option value="">-- Seleccioná un evento --</option>
            {eventos.map((e) => (
              <option key={e.id_evento} value={e.id_evento}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
      {usuario && tarjetaActiva && (
        <>
          <div className="productos-section">
            <h2>Agregar Productos</h2>
            <div className="form-producto">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
              >
                <option value="">-- Seleccioná un producto --</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre} (${p.precio}) — Stock: {p.stock}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
              />

              <button className="btn-egipcio" onClick={agregarProducto}>
                + Agregar
              </button>
            </div>
          </div>
          {productosVenta.length > 0 && (
            <table className="tabla-egipcia">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productosVenta.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                    <td>${p.precio.toFixed(2)}</td>
                    <td>${(p.cantidad * p.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="total-section">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="btn-egipcio confirmar" onClick={confirmarVenta}>
              💰 Confirmar Venta
            </button>
          </div>
        </>
      )}

      <div>
        <BotonVolver ruta="/" />
      </div>
    </div>
  );
}