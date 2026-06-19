import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Home from "./pages/Home";
import HomeCliente from "./pages/HomeCliente";
import UsuarioList from "./pages/usuarios/UsuarioList";
import UsuarioForm from "./pages/usuarios/UsuarioForm";
import Eventos from "./pages/eventos/Eventos";
import EventoDetalle from "./pages/eventos/EventoDetalle";
import MovimientoTarjeta from "./pages/tarjeta/MovimientoTarjeta";
import ConsumoEvento from "./pages/eventos/ConsumoEvento";
import BebidasList from "./pages/bebidas/BebidasList";
import BebidasForm from "./pages/bebidas/BebidasForm";
import EntradasList from "./pages/entradas/EntradasList";
import EventoForm from "./pages/eventos/EventoForm";
import VentaForm from "./pages/ventas/VentaForm";
import Navegacion from "./components/Navegacion";
import Tarjeta from "./pages/tarjeta/Tarjeta";
import TarjetaList from "./pages/tarjeta/TarjetaList";
import Estadisticas from "./pages/estadisticas/Estadisticas";

function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

function RutaPrivada({ children, soloAdmin = false }) {
  const usuario = getUsuario();
  const token = localStorage.getItem("token");

  if (!token || !usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario.rol !== "admin") return <Navigate to="/cliente" replace />;

  return children;
}

function RutaCliente({ children }) {
  const usuario = getUsuario();
  const token = localStorage.getItem("token");

  if (!token || !usuario) return <Navigate to="/login" replace />;

  return children;
}

function Layout({ children }) {
  return (
    <>
      {children}
      <Navegacion />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Home cliente — sin navegación lateral */}
      <Route path="/cliente" element={<RutaCliente><HomeCliente /></RutaCliente>} />

      {/* Solo admin */}
      <Route path="/" element={<RutaPrivada soloAdmin><Layout><Home /></Layout></RutaPrivada>} />
      <Route path="/usuarios" element={<RutaPrivada soloAdmin><Layout><UsuarioList /></Layout></RutaPrivada>} />
      <Route path="/usuarios/nuevo" element={<RutaPrivada soloAdmin><Layout><UsuarioForm /></Layout></RutaPrivada>} />
      <Route path="/usuarios/editar/:id" element={<RutaPrivada soloAdmin><Layout><UsuarioForm /></Layout></RutaPrivada>} />
      <Route path="/bebidas" element={<RutaPrivada soloAdmin><Layout><BebidasList /></Layout></RutaPrivada>} />
      <Route path="/bebidas/nueva" element={<RutaPrivada soloAdmin><Layout><BebidasForm /></Layout></RutaPrivada>} />
      <Route path="/bebidas/editar/:id" element={<RutaPrivada soloAdmin><Layout><BebidasForm /></Layout></RutaPrivada>} />
      <Route path="/ventas" element={<RutaPrivada soloAdmin><Layout><VentaForm /></Layout></RutaPrivada>} />
      <Route path="/estadisticas" element={<RutaPrivada soloAdmin><Layout><Estadisticas /></Layout></RutaPrivada>} />
      <Route path="/tarjetas" element={<RutaPrivada soloAdmin><Layout><TarjetaList /></Layout></RutaPrivada>} />
      <Route path="/eventos/nuevo" element={<RutaPrivada soloAdmin><Layout><EventoForm /></Layout></RutaPrivada>} />
      <Route path="/eventos/editar/:id" element={<RutaPrivada soloAdmin><Layout><EventoForm /></Layout></RutaPrivada>} />

      {/* Admin y cliente */}
      <Route path="/eventos" element={<RutaCliente><Layout><Eventos /></Layout></RutaCliente>} />
      <Route path="/evento/:id" element={<RutaCliente><Layout><EventoDetalle /></Layout></RutaCliente>} />
      <Route path="/entradas/:id_evento" element={<RutaCliente><Layout><EntradasList /></Layout></RutaCliente>} />
      <Route path="/tarjetas/ver/:id" element={<RutaCliente><Layout><Tarjeta /></Layout></RutaCliente>} />
      <Route path="/movimientos/:idTarjeta" element={<RutaCliente><Layout><MovimientoTarjeta /></Layout></RutaCliente>} />
      <Route path="/consumos/:id" element={<RutaCliente><Layout><ConsumoEvento /></Layout></RutaCliente>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
