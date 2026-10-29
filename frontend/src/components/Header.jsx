import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  async function encerrarSessao() {
    await sair();
    navigate("/");
  }

  const classeLink = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Alvo Certo, início">
          <span className="brand-mark" aria-hidden="true"><i /><b /></span>
          <span className="brand-copy"><strong>alvo certo</strong><small>clube de tiro</small></span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          <NavLink className={classeLink} to="/" end>Início</NavLink>
          <NavLink className={classeLink} to="/cursos">Cursos</NavLink>
          <NavLink className={classeLink} to="/catalogo">Catálogo</NavLink>
          {usuario && <NavLink className={classeLink} to="/admin">Administração</NavLink>}
        </nav>

        <div className="header-actions">
          {usuario ? (
            <button className="header-login" onClick={encerrarSessao}>Sair <span aria-hidden="true">↗</span></button>
          ) : (
            <NavLink className="header-login" to="/login">Equipe <span aria-hidden="true">↗</span></NavLink>
          )}
          <Link className="header-contact" to="/agendamento">Fale com a gente <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </header>
  );
}
