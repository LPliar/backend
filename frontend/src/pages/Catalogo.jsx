import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    api("/produtos")
      .then((dados) => {
        if (ativo) setProdutos(Array.isArray(dados) ? dados : []);
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
        <span className="eyebrow">ALVO CERTO</span>
        <h1>Catálogo institucional</h1>
        <p>Informações cadastradas para consulta. Esta página não realiza vendas ou compras.</p>
      </section>

      {carregando && <p className="state-message">Carregando catálogo...</p>}
      {erro && <p className="alert alert-error">{erro}. Verifique se o backend está ativo.</p>}
      {!carregando && !erro && produtos.length === 0 && (
        <div className="empty-state">
          <h2>Nenhum item cadastrado</h2>
          <p>Os itens institucionais aparecerão aqui quando forem cadastrados pela administração.</p>
        </div>
      )}

      <div className="catalog-grid">
        {produtos.map((produto) => (
          <article className="content-card" key={produto.id}>
            {produto.imagemUrl && (
              <img className="catalog-image" src={produto.imagemUrl} alt="" loading="lazy" />
            )}
            <div className="card-body">
              <span className="tag">{produto.categoria?.nome || "Institucional"}</span>
              <h2>{produto.nome}</h2>
              <p>{produto.descricao}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
