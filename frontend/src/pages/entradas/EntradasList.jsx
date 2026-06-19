import React, { useState, useEffect } from "react";

import "../../css/Entradas.css";
import BotonVolver from "../../components/BotonVolver";

export default function EntradasList() {
  const [entradas, setEntradas] = useState([]);
  

  useEffect(() => {
    
    setTimeout(() => {
      setEntradas([
        {
          id_entrada: 1,
          codigo_qr: "QR-001-ANUBIS",
          fecha_compra: "2025-10-10",
          usada: true,
          id_usuario: 1,
          id_evento: 1,
          usuario: { nombre: "Manuel", apellido: "Jimenez" },
          evento: { nombre: "Noche Anubis" },
        },
        {
          id_entrada: 2,
          codigo_qr: "QR-002-FARAON",
          fecha_compra: "2025-10-18",
          usada: false,
          id_usuario: 2,
          id_evento: 2,
          usuario: { nombre: "Guido", apellido: "Gariboldi" },
          evento: { nombre: "Faraón Party" },
        },
        {
          id_entrada: 3,
          codigo_qr: "QR-003-OASIS",
          fecha_compra: "2025-10-22",
          usada: false,
          id_usuario: 3,
          id_evento: 3,
          usuario: { nombre: "Sofía", apellido: "Pérez" },
          evento: { nombre: "Oasis Electrónico" },
        },
      ]);
    }, 400);
  }, []);

  return (
    <div className="entradas-container">
      <h1 className="titulo-egipcio">🎟️ Entradas Vendidas</h1>

      <table className="tabla-egipcia">
        <thead>
          <tr>
            <th>ID</th>
            <th>Código QR</th>
            <th>Fecha Compra</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {entradas.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No hay entradas registradas.
              </td>
            </tr>
          ) : (
            entradas.map((e) => (
              <tr key={e.id_entrada}>
                <td>{e.id_entrada}</td>
                <td>{e.codigo_qr}</td>
                <td>{new Date(e.fecha_compra).toLocaleDateString("es-AR")}</td>
                <td>
                  {e.usuario
                    ? `${e.usuario.nombre} ${e.usuario.apellido}`
                    : `#${e.id_usuario}`}
                </td>
                <td>{e.evento ? e.evento.nombre : `ID ${e.id_evento}`}</td>
                <td>
                  <span className={e.usada ? "estado usada" : "estado no-usada"}>
                    {e.usada ? "Usada" : "No usada"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
        <div>
          <BotonVolver ruta="/eventos" />
        </div>
     
    </div>
  );
}
