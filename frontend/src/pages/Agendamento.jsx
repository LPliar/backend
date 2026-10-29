import { useState } from "react";
import { api } from "../services/api";

const inicial = {
  nome: "",
  email: "",
  telefone: "",
  tipoDocumento: "RG",
  numeroDocumento: "",
  data: "",
  horario: "",
  observacoes: ""
};

function dataLocal() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

export default function Agendamento() {
  const [form, setForm] = useState(inicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      const resposta = await api("/agendamentos", {
        method: "POST",
        body: form
      });

      setSucesso(
        `${resposta.mensagem} Número da solicitação: ${resposta.agendamento.id}.`
      );
      setForm(inicial);
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="page narrow-page">
      <section className="page-heading">
        <span className="eyebrow">ATENDIMENTO</span>
        <h1>Solicitar agendamento</h1>
        <p>Preencha os dados para enviar uma solicitação à equipe.</p>
      </section>

      <form className="form-card" onSubmit={enviar}>
        {erro && <div className="alert alert-error" role="alert">{erro}</div>}
        {sucesso && <div className="alert alert-success" role="status">{sucesso}</div>}

        <div className="form-grid">
          <label className="field field-full">
            <span>Nome completo *</span>
            <input name="nome" value={form.nome} onChange={alterar} required maxLength={100} />
          </label>

          <label className="field">
            <span>E-mail *</span>
            <input type="email" name="email" value={form.email} onChange={alterar} required maxLength={150} />
          </label>

          <label className="field">
            <span>Telefone *</span>
            <input name="telefone" value={form.telefone} onChange={alterar} required maxLength={20} />
          </label>

          <label className="field">
            <span>Tipo de documento *</span>
            <select name="tipoDocumento" value={form.tipoDocumento} onChange={alterar} required>
              <option value="RG">RG</option>
              <option value="CAC">CAC</option>
            </select>
          </label>

          <label className="field">
            <span>Número do documento *</span>
            <input name="numeroDocumento" value={form.numeroDocumento} onChange={alterar} required maxLength={30} autoComplete="off" />
          </label>

          <label className="field">
            <span>Data desejada *</span>
            <input type="date" name="data" value={form.data} onChange={alterar} min={dataLocal()} required />
          </label>

          <label className="field">
            <span>Horário desejado *</span>
            <input type="time" name="horario" value={form.horario} onChange={alterar} required />
          </label>

          <label className="field field-full">
            <span>Observações</span>
            <textarea name="observacoes" value={form.observacoes} onChange={alterar} rows={4} maxLength={2000} />
          </label>
        </div>

        <div className="privacy-note">
          Os dados são enviados à API para análise da solicitação. Utilize dados fictícios durante os testes.
        </div>

        <button className="button button-primary button-wide" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar solicitação"}
        </button>
      </form>
    </div>
  );
}
