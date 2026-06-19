import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    email: "",
    password: "",
    confirmar_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmar_password) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          dni: form.dni,
          fecha_nacimiento: form.fecha_nacimiento,
          email: form.email,
          password: form.password,
          rol: "cliente",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear la cuenta");
      }

      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Boliche GOD</h1>
          <p style={styles.subtitle}>Creá tu cuenta y viví la experiencia</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                style={styles.input}
                placeholder="Juan"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                style={styles.input}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>DNI</label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                style={styles.input}
                placeholder="12345678"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Fecha de nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                style={{ ...styles.input, colorScheme: "dark" }}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                type="password"
                name="confirmar_password"
                value={form.confirmar_password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={styles.loginText}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={styles.link}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
    padding: "2rem 1rem",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "2.5rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 0 40px rgba(255, 180, 0, 0.12)",
    border: "1px solid #2a2a2a",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    color: "#FFB400",
    fontSize: "2rem",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#888",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  row: {
    display: "flex",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
  },
  label: {
    color: "#aaa",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.7rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#242424",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "0.9rem",
    backgroundColor: "#FFB400",
    color: "#000",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "0.5rem",
    letterSpacing: "0.5px",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "0.875rem",
    textAlign: "center",
    backgroundColor: "#ff4d4d18",
    padding: "0.5rem",
    borderRadius: "6px",
  },
  loginText: {
    color: "#777",
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.9rem",
  },
  link: {
    color: "#FFB400",
    textDecoration: "none",
    fontWeight: "600",
  },
};
