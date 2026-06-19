import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Bebidas.css";

export default function BebidasForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    precio: "",
    stock: "",
  });

  
  useEffect(() => {
    const fetchBebida = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`);
        if (!res.ok) throw new Error("Error al obtener la bebida");
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error al cargar bebida:", error);
        alert("❌ No se pudo cargar la información de la bebida");
      }
    };
    fetchBebida();
  }, [id]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = id
        ? `${import.meta.env.VITE_API_URL}/productos/${id}`
        : `${import.meta.env.VITE_API_URL}/productos`; 
      const method = id ? "PUT" : "POST";

     
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar bebida");

      alert(
        id
          ? `✅ Bebida actualizada correctamente: ${formData.nombre}`
          : `✅ Bebida creada correctamente: ${formData.nombre}`
      );

      navigate("/bebidas");
    } catch (error) {
      console.error("Error al guardar bebida:", error);
      alert("❌ Ocurrió un error al guardar la bebida");
    }
  };

  return (
    <div className="form-egipcio-container">
      <h1 className="titulo-egipcio">
        {id ? "Editar Bebida" : "Crear Nueva Bebida"}
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
          <label>Tipo</label>
          <input
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio ($)</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Stock disponible</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="botones-form">
          <button type="submit" className="btn-egipcio crear">
            {id ? "Guardar Cambios" : "Crear Bebida"}
          </button>

          <button
            type="button"
            className="btn-egipcio cancelar"
            onClick={() => navigate("/bebidas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}