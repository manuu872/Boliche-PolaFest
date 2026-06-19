import React from "react";
import "./css/Form.css"

export default function Login() {
  return (
    <div className="form-page">
        <img src="fondolog.png"alt="fondoLog"className="background-logo"/>
        <div className="form-card">
          
            <h2>Iniciar Sesión</h2>
            <form>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    
    </div>
  );
}
