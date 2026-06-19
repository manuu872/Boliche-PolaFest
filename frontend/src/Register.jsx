
import React from "react";
import "./css/Form.css"

export default function Register() {
  return (
    <div className="form-page">
      <img src="fondolog.png"alt="fondoLog"className="background-logo"/>
        <div className="form-card">
            
            <h2>Crear Usuario</h2>
            <form>
                <input type="text" placeholder="Nombre" required />
                <input type="text" placeholder="Apellido" required />
                <input type="text" placeholder="DNI" required />
                <input type="date" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Contraseña" required />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    
    </div>
  );
}
