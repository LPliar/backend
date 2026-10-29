import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const abas = [
  { id: "agendamentos", nome: "Agendamentos" },
  { id: "clientes", nome: "Clientes" },
  { id: "categorias", nome: "Categorias", admin: true },
  { id: "produtos", nome: "Catálogo", admin: true },
  { id: "cursos", nome: "Cursos", admin: true },
  { id: "usuarios", nome: "Usuários", admin: true }
];

const endpoints = {
  agendamentos: "/agendamentos",
  clientes: "/clientes",
  categorias: "/categorias",
  produtos: "/produtos",
  cursos: "/cursos",
  usuarios: "/usuarios"
};

const formularioVazio = {
  nome: "",
  descricao: "",
  categoriaId: "",
  imagemUrl: "",
  cargaHoraria: "",
  email: "",
  senha: "",
  repeteSenha: ""
};

function documentoMascarado(numero) {
  if (!numero) return "Não informado";
  const final = String(numero).slice(-4);
  return `••••${final}`;
}

export default function Admin() {
  const { token, usuario } = useAuth();
  const ehAdmin = usuario?.perfil === "ADMIN";
  const [aba, setAba] = useState("agendamentos");
  const [dados, setDados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(formularioVazio);
  const [editando, setEditando] = useState(null);
  const [statusEdicao, setStatusEdicao] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const abasVisiveis = useMemo(
    () => abas.filter((item) => !item.admin || ehAdmin),
    [ehAdmin]
  );

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const [lista, listaCategorias] = await Promise.all([
        api(endpoints[aba], { token }),
        aba === "produtos" ? api("/categorias") : Promise.resolve([])
      ]);

      setDados(Array.isArray(lista) ? lista : []);
      if (aba === "produtos") {
        setCategorias(Array.isArray(listaCategorias) ? listaCategorias : []);
      }
    } catch (error) {
      setErro(error.message);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }, [aba, token]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function trocarAba(id) {
    setAba(id);
    setEditando(null);
    setForm(formularioVazio);
    setErro("");
    setSucesso("");
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function iniciarEdicao(item) {
    setEditando(item.id);
    setForm({
      ...formularioVazio,
      nome: item.nome || "",
      descricao: item.descricao || "",
      categoriaId: String(item.categoriaId || ""),
      imagemUrl: item.imagemUrl || "",
      cargaHoraria: String(item.cargaHoraria || "")
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditando(null);
    setForm(formularioVazio);
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      let body;
      let endpoint = endpoints[aba];

      if (aba === "categorias") {
        body = {
          nome: form.nome,
          descricao: form.descricao
        };
      } else if (aba === "produtos") {
        body = {
          nome: form.nome,
          descricao: form.descricao,
          categoriaId: Number(form.categoriaId),
          imagemUrl: form.imagemUrl || null
        };
      } else if (aba === "cursos") {
        body = {
          nome: form.nome,
          descricao: form.descricao,
          cargaHoraria: Number(form.cargaHoraria)
        };
      } else if (aba === "usuarios") {
        body = {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          repeteSenha: form.repeteSenha
        };
      } else {
        return;
      }

      const metodo = editando ? "PUT" : "POST";
      if (editando) endpoint += `/${editando}`;

      const resposta = await api(endpoint, {
        method: metodo,
        body,
        token
      });

      setSucesso(resposta.mensagem || "Registro salvo com sucesso.");
      setForm(formularioVazio);
      setEditando(null);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item) {
    const nome = item.nome || `#${item.id}`;
    if (!window.confirm(`Deseja desativar/cancelar "${nome}"?`)) return;

    setErro("");
    setSucesso("");

    try {
      const resposta = await api(`${endpoints[aba]}/${item.id}`, {
        method: "DELETE",
        token
      });
      setSucesso(resposta.mensagem || "Operação concluída.");
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  }

  async function salvarStatus(item) {
    const status = statusEdicao[item.id] || item.status;
    setErro("");
    setSucesso("");

    try {
      const resposta = await api(`/agendamentos/${item.id}`, {
        method: "PUT",
        body: { status },
        token
      });
      setSucesso(resposta.mensagem || "Status atualizado.");
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  }

  const mostraFormulario = ehAdmin &&
    ["categorias", "produtos", "cursos", "usuarios"].includes(aba);

  return (
    <div className="page admin-page">
      <section className="admin-heading">
        <div>
          <span className="eyebrow">PAINEL INTERNO</span>
          <h1>Administração</h1>
          <p>Olá, {usuario?.nome}. Perfil: {usuario?.perfil}.</p>
        </div>
        <button className="button button-outline" onClick={carregarDados} disabled={carregando}>
          {carregando ? "Atualizando..." : "Atualizar dados"}
        </button>
      </section>

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Seções administrativas">
          {abasVisiveis.map((item) => (
            <button
              key={item.id}
              className={`admin-tab${aba === item.id ? " selected" : ""}`}
              onClick={() => trocarAba(item.id)}
            >
              {item.nome}
            </button>
          ))}
        </aside>

        <section className="admin-content">
          <div className="admin-section-heading">
            <h2>{abasVisiveis.find((item) => item.id === aba)?.nome}</h2>
            <span className="tag">{dados.length} registro(s)</span>
          </div>

          {erro && <div className="alert alert-error" role="alert">{erro}</div>}
          {sucesso && <div className="alert alert-success" role="status">{sucesso}</div>}

          {mostraFormulario && (
            <form className="form-card admin-form" onSubmit={salvar}>
              <h3>{editando ? "Editar registro" : aba === "usuarios" ? "Cadastrar atendente" : "Novo cadastro"}</h3>

              <div className="form-grid">
                <label className="field">
                  <span>Nome *</span>
                  <input name="nome" value={form.nome} onChange={alterarCampo} required maxLength={120} />
                </label>

                {aba === "usuarios" && (
                  <>
                    <label className="field">
                      <span>E-mail *</span>
                      <input type="email" name="email" value={form.email} onChange={alterarCampo} required />
                    </label>
                    <label className="field">
                      <span>Senha *</span>
                      <input type="password" name="senha" value={form.senha} onChange={alterarCampo} required minLength={6} autoComplete="new-password" />
                    </label>
                    <label className="field">
                      <span>Repetir senha *</span>
                      <input type="password" name="repeteSenha" value={form.repeteSenha} onChange={alterarCampo} required minLength={6} autoComplete="new-password" />
                    </label>
                  </>
                )}

                {aba !== "usuarios" && (
                  <label className="field field-full">
                    <span>Descrição *</span>
                    <textarea name="descricao" value={form.descricao} onChange={alterarCampo} rows={3} required maxLength={3000} />
                  </label>
                )}

                {aba === "produtos" && (
                  <>
                    <label className="field">
                      <span>Categoria *</span>
                      <select name="categoriaId" value={form.categoriaId} onChange={alterarCampo} required>
                        <option value="">Selecione</option>
                        {categorias.map((categoria) => (
                          <option value={categoria.id} key={categoria.id}>{categoria.nome}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>URL da imagem (opcional)</span>
                      <input type="url" name="imagemUrl" value={form.imagemUrl} onChange={alterarCampo} placeholder="https://..." />
                    </label>
                  </>
                )}

                {aba === "cursos" && (
                  <label className="field">
                    <span>Carga horária (horas) *</span>
                    <input type="number" name="cargaHoraria" value={form.cargaHoraria} onChange={alterarCampo} min="1" step="1" required />
                  </label>
                )}
              </div>

              <div className="form-actions">
                <button className="button button-primary" type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar"}
                </button>
                {editando && (
                  <button className="button button-outline" type="button" onClick={cancelarEdicao}>
                    Cancelar edição
                  </button>
                )}
              </div>
            </form>
          )}

          {carregando && <p className="state-message">Carregando registros...</p>}

          {!carregando && aba === "agendamentos" && (
            <div className="admin-list">
              {dados.map((item) => (
                <article className="admin-card" key={item.id}>
                  <div className="admin-card-main">
                    <div>
                      <h3>{item.cliente?.nome || "Cliente"}</h3>
                      <p>{item.data} às {item.horario}</p>
                      <p>{item.cliente?.email} · {item.cliente?.telefone}</p>
                      <p>
                        Documento: {item.cliente?.tipoDocumento} · {documentoMascarado(item.cliente?.numeroDocumento)}
                      </p>
                      {item.observacoes && <p>Observações: {item.observacoes}</p>}
                    </div>
                    <div className="status-control">
                      <label className="field">
                        <span>Status</span>
                        <select
                          value={statusEdicao[item.id] || item.status}
                          onChange={(e) => setStatusEdicao((atual) => ({
                            ...atual,
                            [item.id]: e.target.value
                          }))}
                        >
                          {["PENDENTE", "CONFIRMADO", "CANCELADO", "CONCLUIDO"].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                      <button className="button button-primary button-small" onClick={() => salvarStatus(item)}>
                        Salvar status
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {dados.length === 0 && <p className="empty-state">Nenhum agendamento encontrado.</p>}
            </div>
          )}

          {!carregando && aba === "clientes" && (
            <div className="admin-list">
              {dados.map((item) => (
                <article className="admin-card" key={item.id}>
                  <h3>{item.nome}</h3>
                  <p>{item.email} · {item.telefone}</p>
                  <p>Documento: {item.tipoDocumento} · {documentoMascarado(item.numeroDocumento)}</p>
                </article>
              ))}
              {dados.length === 0 && <p className="empty-state">Nenhum cliente encontrado.</p>}
            </div>
          )}

          {!carregando && ["categorias", "produtos", "cursos", "usuarios"].includes(aba) && (
            <div className="admin-list">
              {dados.map((item) => (
                <article className="admin-card" key={item.id}>
                  <div className="admin-card-main">
                    <div>
                      <h3>{item.nome}</h3>
                      {aba === "usuarios" ? (
                        <p>{item.email} · {item.perfil}</p>
                      ) : (
                        <p>{item.descricao}</p>
                      )}
                      {aba === "produtos" && <p>Categoria: {item.categoria?.nome || "Sem categoria"}</p>}
                      {aba === "cursos" && <p>Carga horária: {item.cargaHoraria} horas</p>}
                      {item.ativo === false && <span className="tag">Inativo</span>}
                    </div>
                    {aba !== "usuarios" && (
                      <div className="form-actions">
                        <button className="button button-outline button-small" onClick={() => iniciarEdicao(item)}>
                          Editar
                        </button>
                        <button className="button button-danger button-small" onClick={() => excluir(item)}>
                          Desativar
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {dados.length === 0 && <p className="empty-state">Nenhum registro encontrado.</p>}
            </div>
          )}

          <p className="privacy-note">
            Os dados de clientes são restritos à equipe autenticada. Nesta tela,
            os números dos documentos são exibidos parcialmente mascarados.
          </p>
        </section>
      </div>
    </div>
  );
}
