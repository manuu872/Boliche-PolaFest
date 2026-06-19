import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/ConsumoEvento.css";

export default function ConsumoEvento() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [consumos, setConsumos] = useState([]);
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConsumos = async () => {
      try {
        
        const resEvento = await fetch(`${import.meta.env.VITE_API_URL}/eventos/${id}`);
        if (!resEvento.ok) throw new Error("No se pudo obtener el evento");
        const dataEvento = await resEvento.json();
        setEvento(dataEvento);

        
        const resVentas = await fetch(`${import.meta.env.VITE_API_URL}/ventas/evento/${id}`);
        if (!resVentas.ok) throw new Error("No se pudo obtener los consumos");

        const dataVentas = await resVentas.json();

        
        const ventasAdaptadas = dataVentas.map((venta) => ({
          id_venta: venta.id_venta,
          cliente: `${venta.tarjeta?.usuario?.nombre || ""} ${venta.tarjeta?.usuario?.apellido || ""}`,
          fecha: new Date(venta.fecha).toLocaleDateString("es-AR"),
          total: venta.total,
          detalles: venta.detalles || [],
        }));

        setConsumos(ventasAdaptadas);
      } catch (error) {
        console.error("Error al cargar consumos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarConsumos();
  }, [id]);

  if (loading) return <p className="cargando">Cargando consumos...</p>;

  return (
    <div className="consumos-container">
      <h1 className="titulo-egipcio">
        Consumos en {evento ? evento.nombre : "Evento"}
      </h1>

      <button className="btn-volver" onClick={() => navigate("/eventos")}>
        ← Volver a Eventos
      </button>

      {consumos.length === 0 ? (
        <p style={{ color: "white", marginTop: "20px" }}>No hay consumos registrados para este evento.</p>
      ) : (
        <div className="tabla-consumos">
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {consumos.map((venta) =>
                venta.detalles.map((d, i) => (
                  <tr key={`${venta.id_venta}-${i}`}>
                    <td>{venta.id_venta}</td>
                    <td>{venta.cliente}</td>
                    <td>{d.producto?.nombre || "Producto eliminado"}</td>
                    <td>{d.cantidad}</td>
                    <td>${d.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                    <td>{venta.fecha}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
