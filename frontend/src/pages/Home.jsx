import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <button onClick={handleLogout} style={{
        position: "absolute", top: "1rem", right: "1rem",
        backgroundColor: "transparent", border: "1px solid #ff5252",
        color: "#ff5252", padding: "0.4rem 0.9rem", borderRadius: "8px",
        cursor: "pointer", fontSize: "0.85rem", zIndex: 10
      }}>
        🚪 Salir
      </button>
      <div className="logo-section">
        <img src="/logo.png" alt="PolaFest Logo" className="logo-home" />
      </div>

      
      <div className="cards-container">
        <Link to="/bebidas" className="card">
          <img src="/bebidas.png" alt="Bebidas" />
        </Link>

        <Link to="/usuarios" className="card">
          <img src="/usuarios.png" alt="Usuario" />
        </Link>

        <Link to="/eventos" className="card">
          <img src="/eventos.png" alt="Eventos" />
        </Link>
         <Link to="/tarjetas" className="card">
          <img src="/tarjetas.png" alt="Tarjetas" />
        </Link>
        <Link to="/ventas" className="card">
          <img src="/cajero.png" alt="Cajero" />
        </Link>
         <Link to="/estadisticas" className="card">
          <img src="/estadisticas.png" alt="Estadisticas" />
        </Link>

      </div>
    </div>
  );
}
