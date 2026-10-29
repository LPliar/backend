import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { token, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  async function fazerLogin(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const resposta = await api("/auth/login", {
        method: "POST",
        body: { email, senha }
      });

      entrar(resposta.token, resposta.usuario);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="page narrow-page">
      <section className="page-heading">
        <span className="eyebrow">ÁREA RESTRITA</span>
        <h1>Entrar</h1>
        <p>Acesso destinado à equipe autorizada.</p>
      </section>

      <form className="form-card login-card" onSubmit={fazerLogin}>
        {erro && <div className="alert alert-error" role="alert">{erro}</div>}

        <label className="field">
          <span>E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>

        <label className="field">
          <span>Senha</span>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
        </label>

        <button className="button button-primary button-wide" type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
