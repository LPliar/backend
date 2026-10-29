import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="footer-brand" to="/">alvo certo<span> · clube de tiro</span></Link>
        <p>Informação clara. Atendimento responsável.</p>
        <span className="footer-project">Projeto acadêmico de implantação de sistemas</span>
      </div>
    </footer>
  );
}
