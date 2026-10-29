import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("alvo_token") || ""
  );

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("alvo_usuario") || "null");
    } catch {
      return null;
    }
  });

  function entrar(novoToken, novoUsuario) {
    sessionStorage.setItem("alvo_token", novoToken);
    sessionStorage.setItem("alvo_usuario", JSON.stringify(novoUsuario));
    setToken(novoToken);
    setUsuario(novoUsuario);
  }

  async function sair() {
    try {
      if (token) {
        await api("/auth/logout", { method: "POST", token });
      }
    } catch {
      // Mesmo se a sessão já tiver expirado ou a API estiver indisponível,
      // os dados locais da sessão serão removidos.
    } finally {
      sessionStorage.removeItem("alvo_token");
      sessionStorage.removeItem("alvo_usuario");
      setToken("");
      setUsuario(null);
    }
  }

  return (
    <AuthContext.Provider value={{ token, usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  }
  return context;
}
