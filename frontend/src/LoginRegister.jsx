import React from "react";
import { Link } from "react-router-dom"; 
import "./App.css";

export default function LoginRegister() {
  return (
    <div className="landing-container">
      <video autoPlay loop muted className="background-video">
        <source src="/boliche.mp4" type="video/mp4" />
      </video>

      <div className="overlay">
        <img src="/logo.png" alt="PolaFest Logo" className="logo" />

        <div className="buttons">
         
          <Link to="/register" className="btn">Crear Usuario</Link>
          <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}

