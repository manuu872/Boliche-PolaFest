import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const registrado = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Credenciales incorrectas");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      if (data.usuario.rol === "admin") {
        navigate("/");
      } else {
        navigate("/cliente");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>PolaFest</h1>
        <p style={styles.subtitle}>Iniciá sesión para continuar</p>

        {registrado && (
          <p style={styles.success}>Cuenta creada con éxito. Podés iniciar sesión.</p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={styles.registerText}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={styles.link}>
            Crear cuenta
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
    backgroundColor: "#080808",
    backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(255,180,0,0.12) 0%, transparent 60%)",
  },
  card: {
    backgroundColor: "rgba(18,18,18,0.95)",
    padding: "2.8rem 2.5rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 0 60px rgba(255,180,0,0.12), 0 0 0 1px rgba(255,180,0,0.15)",
    backdropFilter: "blur(10px)",
    animation: "fadeUp 0.5s ease",
  },
  title: {
    color: "#FFB400",
    textAlign: "center",
    fontSize: "2.4rem",
    fontWeight: "800",
    fontFamily: "'Cinzel', serif",
    marginBottom: "0.2rem",
    letterSpacing: "2px",
    textShadow: "0 0 30px rgba(255,180,0,0.4)",
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "0.88rem",
    letterSpacing: "0.5px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  label: {
    color: "#aaa",
    fontSize: "0.82rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    border: "1px solid #2a2a2a",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    padding: "0.9rem",
    background: "linear-gradient(135deg, #FFB400, #ff8c00)",
    color: "#000",
    fontWeight: "800",
    fontSize: "0.95rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "0.6rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
    boxShadow: "0 4px 20px rgba(255,180,0,0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "0.82rem",
    textAlign: "center",
    backgroundColor: "rgba(255,77,77,0.08)",
    padding: "0.5rem",
    borderRadius: "8px",
  },
  success: {
    color: "#4caf50",
    fontSize: "0.85rem",
    textAlign: "center",
    backgroundColor: "#4caf5018",
    padding: "0.5rem",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  registerText: {
    color: "#555",
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.88rem",
  },
  link: {
    color: "#FFB400",
    textDecoration: "none",
    fontWeight: "700",
  },
};
