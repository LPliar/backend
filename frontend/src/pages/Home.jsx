import { Link } from "react-router-dom";

function TargetMark() {
  return (
    <div className="target-mark" aria-hidden="true">
      <span className="target-ring target-ring-outer" />
      <span className="target-ring target-ring-middle" />
      <span className="target-ring target-ring-inner" />
      <span className="target-center" />
      <span className="target-cross target-cross-horizontal" />
      <span className="target-cross target-cross-vertical" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> CLUBE DE TIRO · ALVO CERTO</span>
          <h1>Precisão se aprende.<br /><em>Segurança vem primeiro.</em></h1>
          <p className="hero-text">
            Um espaço para conhecer o clube, descobrir os cursos e conversar
            com a nossa equipe sobre o próximo passo.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/agendamento">
              Falar com a equipe <span aria-hidden="true">↗</span>
            </Link>
            <Link className="hero-secondary-link" to="/cursos">Conhecer os cursos <span aria-hidden="true">→</span></Link>
          </div>
          <p className="hero-caption">Atendimento próximo, informação clara e responsabilidade em cada etapa.</p>
        </div>

        <div className="hero-art" aria-label="Ilustração de um alvo de precisão">
          <div className="art-kicker">FOCO · TÉCNICA · RESPONSABILIDADE</div>
          <TargetMark />
          <div className="art-note"><span className="art-note-line" />
            <div><strong>O primeiro passo é uma conversa.</strong><br /><span>Conte o que você procura.</span></div>
          </div>
          <span className="art-index">AC / 01</span>
        </div>
      </section>

      <section className="welcome-strip" aria-label="Sobre o portal">
        <span className="welcome-mark">AC</span>
        <p><strong>Seja bem-vindo ao Alvo Certo.</strong> Aqui você encontra o que precisa para conhecer o clube com calma — e sabe com quem falar quando quiser seguir.</p>
      </section>

      <section className="home-discover">
        <div className="discover-heading">
          <div>
            <span className="eyebrow">POR ONDE COMEÇAR</span>
            <h2>Um clube, várias formas de conhecer.</h2>
          </div>
          <p>Veja o que acontece por aqui. Se ficar alguma dúvida, a gente conversa.</p>
        </div>

        <div className="discover-list">
          <Link className="discover-row" to="/cursos">
            <span className="discover-number">01</span>
            <span className="discover-title">Aprender no seu ritmo</span>
            <span className="discover-description">Conheça os cursos e suas cargas horárias.</span>
            <span className="discover-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="discover-row" to="/catalogo">
            <span className="discover-number">02</span>
            <span className="discover-title">Explorar o catálogo</span>
            <span className="discover-description">Consulte os itens e as informações cadastradas.</span>
            <span className="discover-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="discover-row" to="/agendamento">
            <span className="discover-number">03</span>
            <span className="discover-title">Conversar com a equipe</span>
            <span className="discover-description">Envie uma solicitação. Vamos retornar para combinar.</span>
            <span className="discover-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="home-note">
        <span className="note-icon" aria-hidden="true">i</span>
        <div><strong>Informação importante</strong><p>O catálogo é para consulta e o formulário envia apenas um pedido de atendimento — não confirma horário nem reserva.</p></div>
      </section>
    </div>
  );
}
