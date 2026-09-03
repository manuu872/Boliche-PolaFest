import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wine, Users, Calendar, CreditCard, Wallet, BarChart3, LogOut } from "lucide-react";
import "../css/Home.css";

const CARDS = [
  { label: "Bebidas",      icon: Wine,       ruta: "/bebidas",      desc: "Gestión de stock y productos" },
  { label: "Usuarios",     icon: Users,      ruta: "/usuarios",     desc: "Alta, baja y modificación" },
  { label: "Eventos",      icon: Calendar,   ruta: "/eventos",      desc: "Administración de noches" },
  { label: "Tarjetas",     icon: CreditCard, ruta: "/tarjetas",     desc: "Saldo y estado de tarjetas" },
  { label: "Cajero",       icon: Wallet,     ruta: "/ventas",       desc: "Registro de ventas" },
  { label: "Estadísticas", icon: BarChart3,  ruta: "/estadisticas", desc: "Reportes y métricas" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Home() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="home-vip">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-left">
          <img src="/logo.png" alt="PolaFest" className="home-logo" />
          <div>
            <span className="home-brand">PolaFest</span>
            <span className="home-rol">Panel de Administración</span>
          </div>
        </div>
        <div className="home-header-right">
          {usuario.nombre && (
            <span className="home-username">Hola, {usuario.nombre}</span>
          )}
          <button className="home-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Grid */}
      <main className="home-main">
        <motion.div
          className="home-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CARDS.map(({ label, icon: Icon, ruta, desc }) => (
            <motion.div
              key={ruta}
              className="home-card"
              variants={cardVariants}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              onClick={() => navigate(ruta)}
            >
              <div className="home-card-icon">
                <Icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="home-card-label">{label}</h3>
              <p className="home-card-desc">{desc}</p>
              <div className="home-card-glow" />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
