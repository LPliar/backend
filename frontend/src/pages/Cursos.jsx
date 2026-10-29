import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    api("/cursos")
      .then((dados) => {
        if (ativo) setCursos(Array.isArray(dados) ? dados : []);
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => { ativo = false; };
  }, []);

  return (
    <div className="page">
      <section className="page-heading">
        <span className="eyebrow">FORMAÇÃO</span>
        <h1>Cursos</h1>
        <p>Consulte as informações institucionais dos cursos cadastrados.</p>
      </section>

      {carregando && <p className="state-message">Carregando cursos...</p>}
      {erro && <p className="alert alert-error">{erro}. Verifique se o backend está ativo.</p>}
      {!carregando && !erro && cursos.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum curso cadastrado</h2>
          <p>Os cursos disponíveis no portal aparecerão aqui após o cadastro.</p>
        </div>
      )}

      <div className="catalog-grid">
        {cursos.map((curso) => (
          <article className="content-card" key={curso.id}>
            <div className="card-body">
              <span className="tag">Curso institucional</span>
              <h2>{curso.nome}</h2>
              <p>{curso.descricao}</p>
              <p className="card-meta">
                Carga horária: <strong>{curso.cargaHoraria} horas</strong>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
