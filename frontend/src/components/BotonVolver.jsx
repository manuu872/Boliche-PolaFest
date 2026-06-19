import { useNavigate } from "react-router-dom";
import "../css/General.css"; // 

export default function BotonVolver({ ruta = "/" }) {
  const navigate = useNavigate();

  return (
    <button
      className="btn-volver"
      onClick={() => navigate(ruta)}
    >
      ← Volver
    </button>
  );
}
