import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/EventoForm.css";

const API = import.meta.env.VITE_API_URL;

export default function EventoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [evento, setEvento] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    max_gente: "",
    imagen: "",
  });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const modoEdicion = Boolean(id);

  useEffect(() => {
    if (modoEdicion) {
      fetch(`${API}/eventos/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setEvento(data);
          if (data.imagen) setPreview(`${API}/uploads/eventos/${data.imagen}`);
        })
        .catch(console.error);
    }
  }, [id, modoEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    try {
      let imagenFilename = evento.imagen;

      if (archivoImagen) {
        const formData = new FormData();
        formData.append("imagen", archivoImagen);
        const resUpload = await fetch(`${API}/eventos/upload`, {
          method: "POST",
          body: formData,
        });
        if (!resUpload.ok) throw new Error("Error al subir imagen");
        const uploadData = await resUpload.json();
        imagenFilename = uploadData.filename;
      }

      const url = modoEdicion ? `${API}/eventos/${id}` : `${API}/eventos`;
      const method = modoEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...evento, imagen: imagenFilename }),
      });

      if (res.ok) {
        alert(`Evento ${modoEdicion ? "actualizado" : "creado"} con éxito`);
        navigate("/eventos");
      } else {
        alert("Error al guardar evento");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el evento");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="evento-form-container">
      <h1 className="evento-form-titulo">
        {modoEdicion ? "Editar Evento" : "Crear Evento"}
      </h1>

      <form className="evento-form" onSubmit={handleSubmit}>
        <label>Nombre del evento:</label>
        <input
          type="text"
          name="nombre"
          value={evento.nombre}
          onChange={handleChange}
          required
        />

        <label>Fecha de inicio:</label>
        <input
          type="date"
          name="fecha_inicio"
          value={evento.fecha_inicio ? evento.fecha_inicio.split("T")[0] : ""}
          onChange={handleChange}
          required
        />

        <label>Fecha de fin:</label>
        <input
          type="date"
          name="fecha_fin"
          value={evento.fecha_fin ? evento.fecha_fin.split("T")[0] : ""}
          onChange={handleChange}
          required
        />

        <label>Máximo de personas:</label>
        <input
          type="number"
          name="max_gente"
          value={evento.max_gente}
          onChange={handleChange}
          required
        />

        <label>Imagen del evento:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ color: "#ccc", fontSize: "0.9rem" }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #2a2a2a",
              marginTop: "0.5rem",
            }}
          />
        )}

        <button type="submit" className="btn-egipcio" disabled={subiendo}>
          {subiendo ? "Guardando..." : modoEdicion ? "Guardar Cambios" : "Crear Evento"}
        </button>
      </form>

      <button className="btn-volver" onClick={() => navigate("/eventos")}>
        ← Volver
      </button>
    </div>
  );
}
