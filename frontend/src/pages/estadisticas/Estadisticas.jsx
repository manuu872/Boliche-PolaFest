import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import BotonVolver from "../../components/BotonVolver";
import "../../css/Estadisticas.css";

const API = import.meta.env.VITE_API_URL;

export default function Estadisticas() {
  const [resumen, setResumen] = useState(null);
  const [ventasPorEvento, setVentasPorEvento] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [usuariosTop, setUsuariosTop] = useState([]);
  const [stockCritico, setStockCritico] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [res, ventas, productos, usuarios, stock] = await Promise.all([
          fetch(`${API}/estadisticas/resumen`).then((r) => r.json()),
          fetch(`${API}/estadisticas/ventas-por-evento`).then((r) => r.json()),
          fetch(`${API}/estadisticas/productos-mas-vendidos`).then((r) => r.json()),
          fetch(`${API}/estadisticas/usuarios-top`).then((r) => r.json()),
          fetch(`${API}/estadisticas/stock-critico`).then((r) => r.json()),
        ]);
        setResumen(res);
        setVentasPorEvento(Array.isArray(ventas) ? ventas : []);
        setProductosTop(Array.isArray(productos) ? productos.sort((a, b) => b.total_vendido - a.total_vendido) : []);
        setUsuariosTop(Array.isArray(usuarios) ? usuarios.sort((a, b) => b.gasto_total - a.gasto_total) : []);
        setStockCritico(Array.isArray(stock) ? stock : []);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString("es-AR");
    const hora = new Date().toLocaleTimeString("es-AR");

    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(255, 215, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PolaFest — Reporte de Estadísticas", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`Generado el ${fecha} a las ${hora}`, 14, 26);

    let y = 36;

    if (resumen) {
      doc.setFontSize(13);
      doc.setTextColor(255, 215, 0);
      doc.text("Resumen General", 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Indicador", "Valor"]],
        body: [
          ["Total recaudado", `$${Number(resumen.totalRecaudado).toLocaleString("es-AR")}`],
          ["Cantidad de ventas", String(resumen.cantidadVentas)],
          ["Ticket promedio", `$${Number(resumen.ticketPromedio).toLocaleString("es-AR")}`],
          ["Saldo en tarjetas (no gastado)", `$${Number(resumen.saldoEnTarjetas).toLocaleString("es-AR")}`],
          ["Tarjetas activas", `${resumen.tarjetasActivas} / ${resumen.tarjetasTotales}`],
        ],
        styles: { fillColor: [20, 20, 20], textColor: [220, 220, 220], fontSize: 10 },
        headStyles: { fillColor: [180, 130, 0], textColor: [0, 0, 0], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [30, 30, 30] },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (ventasPorEvento.length > 0) {
      if (y > 240) { doc.addPage(); doc.setFillColor(10,10,10); doc.rect(0,0,210,297,"F"); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(255, 215, 0);
      doc.text("Ventas por Evento", 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Evento", "Total Recaudado"]],
        body: ventasPorEvento.map((v) => [v.evento, `$${Number(v.total_recaudado).toLocaleString("es-AR")}`]),
        styles: { fillColor: [20, 20, 20], textColor: [220, 220, 220], fontSize: 10 },
        headStyles: { fillColor: [180, 130, 0], textColor: [0, 0, 0], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [30, 30, 30] },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (productosTop.length > 0) {
      if (y > 240) { doc.addPage(); doc.setFillColor(10,10,10); doc.rect(0,0,210,297,"F"); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(255, 215, 0);
      doc.text("Productos más vendidos", 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["#", "Producto", "Unidades vendidas"]],
        body: productosTop.map((p, i) => [`#${i + 1}`, p.producto, String(p.total_vendido)]),
        styles: { fillColor: [20, 20, 20], textColor: [220, 220, 220], fontSize: 10 },
        headStyles: { fillColor: [180, 130, 0], textColor: [0, 0, 0], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [30, 30, 30] },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (usuariosTop.length > 0) {
      if (y > 240) { doc.addPage(); doc.setFillColor(10,10,10); doc.rect(0,0,210,297,"F"); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(255, 215, 0);
      doc.text("Clientes que más gastaron", 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["#", "Cliente", "Gasto total"]],
        body: usuariosTop.map((u, i) => [`#${i + 1}`, u.usuario, `$${Number(u.gasto_total).toLocaleString("es-AR")}`]),
        styles: { fillColor: [20, 20, 20], textColor: [220, 220, 220], fontSize: 10 },
        headStyles: { fillColor: [180, 130, 0], textColor: [0, 0, 0], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [30, 30, 30] },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (stockCritico.length > 0) {
      if (y > 240) { doc.addPage(); doc.setFillColor(10,10,10); doc.rect(0,0,210,297,"F"); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(220, 60, 60);
      doc.text("Stock critico (10 unidades o menos)", 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Producto", "Tipo", "Stock"]],
        body: stockCritico.map((s) => [s.nombre, s.tipo, String(s.stock)]),
        styles: { fillColor: [20, 20, 20], textColor: [220, 220, 220], fontSize: 10 },
        headStyles: { fillColor: [150, 30, 30], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [30, 20, 20] },
      });
    }

    doc.save(`PolaFest_Estadisticas_${fecha.replace(/\//g, "-")}.pdf`);
  };

  if (cargando) {
    return (
      <div className="estadisticas-container">
        <p style={{ color: "#FFD700", textAlign: "center", marginTop: "3rem" }}>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-header">
        <h1 className="titulo-egipcio">Estadísticas — PolaFest</h1>
        <button className="btn-pdf" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>

      {/* KPI cards */}
      {resumen && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Recaudado</span>
            <span className="kpi-valor">${Number(resumen.totalRecaudado).toLocaleString("es-AR")}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Ventas realizadas</span>
            <span className="kpi-valor">{resumen.cantidadVentas}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Ticket promedio</span>
            <span className="kpi-valor">${Number(resumen.ticketPromedio).toLocaleString("es-AR")}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Saldo en tarjetas</span>
            <span className="kpi-valor" style={{ color: "#60a5fa" }}>${Number(resumen.saldoEnTarjetas).toLocaleString("es-AR")}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Tarjetas activas</span>
            <span className="kpi-valor">
              {resumen.tarjetasActivas}
              <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 400 }}> / {resumen.tarjetasTotales}</span>
            </span>
          </div>
        </div>
      )}

      <div className="estadisticas-tablas">

        {/* Ventas por evento */}
        <div className="est-seccion">
          <h2 className="est-subtitulo">Ventas por Evento</h2>
          {ventasPorEvento.length > 0 ? (
            <table className="tabla-est">
              <thead>
                <tr><th>Evento</th><th>Total recaudado</th></tr>
              </thead>
              <tbody>
                {ventasPorEvento.map((v, i) => (
                  <tr key={i}>
                    <td>{v.evento}</td>
                    <td className="td-monto">${Number(v.total_recaudado).toLocaleString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="est-vacio">Sin datos</p>}
        </div>

        {/* Productos más vendidos */}
        <div className="est-seccion">
          <h2 className="est-subtitulo">Productos más vendidos</h2>
          {productosTop.length > 0 ? (
            <table className="tabla-est">
              <thead>
                <tr><th>#</th><th>Producto</th><th>Unidades</th></tr>
              </thead>
              <tbody>
                {productosTop.map((p, i) => (
                  <tr key={i}>
                    <td className="td-rank">#{i + 1}</td>
                    <td>{p.producto}</td>
                    <td className="td-monto">{p.total_vendido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="est-vacio">Sin datos</p>}
        </div>

        {/* Clientes top */}
        <div className="est-seccion">
          <h2 className="est-subtitulo">Clientes que más gastaron</h2>
          {usuariosTop.length > 0 ? (
            <table className="tabla-est">
              <thead>
                <tr><th>#</th><th>Cliente</th><th>Gasto total</th></tr>
              </thead>
              <tbody>
                {usuariosTop.map((u, i) => (
                  <tr key={i}>
                    <td className="td-rank">#{i + 1}</td>
                    <td>{u.usuario}</td>
                    <td className="td-monto">${Number(u.gasto_total).toLocaleString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="est-vacio">Sin datos</p>}
        </div>

        {/* Stock crítico */}
        <div className="est-seccion">
          <h2 className="est-subtitulo est-alerta">Stock crítico (10 unidades o menos)</h2>
          {stockCritico.length > 0 ? (
            <table className="tabla-est">
              <thead>
                <tr><th>Producto</th><th>Tipo</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {stockCritico.map((s, i) => (
                  <tr key={i} className={s.stock <= 3 ? "fila-critica" : "fila-advertencia"}>
                    <td>{s.nombre}</td>
                    <td>{s.tipo}</td>
                    <td className="td-stock">{s.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="est-vacio" style={{ color: "#4caf50" }}>Todos los productos tienen stock suficiente</p>
          )}
        </div>

      </div>

      <BotonVolver ruta="/" />
    </div>
  );
}
