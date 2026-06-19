import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Usuarios.css";

export default function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
    password: "",
    rol: "Cliente",
  });

 
  useEffect(() => {
    const fetchUsuario = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`);
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        alert("❌ No se pudo cargar la información del usuario");
      }
    };
    fetchUsuario();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = id
      ? `${import.meta.env.VITE_API_URL}/usuarios/${id}` 
      : `${import.meta.env.VITE_API_URL}/usuarios`; 
    const method = id ? "PUT" : "POST";
    
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      dni: formData.dni,
      fecha_nacimiento: formData.fechaNacimiento,
      email: formData.email,
      password: formData.password,
      rol: formData.rol,
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al guardar usuario");
    alert(
      id
        ? `✅ Usuario actualizado correctamente: ${formData.nombre}`
        : `✅ Usuario creado correctamente: ${formData.nombre}`
    );
    navigate("/usuarios");
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("❌ Ocurrió un error al guardar el usuario");
  }
};
  return (
    <div className="form-egipcio-container">
      <h1 className="titulo-egipcio">
        {id ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </h1>
      <form onSubmit={handleSubmit} className="form-egipcio">
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="Cliente">Cliente</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div className="botones-form">
          <button type="submit" className="btn-egipcio crear">
            {id ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            className="btn-egipcio cancelar"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

