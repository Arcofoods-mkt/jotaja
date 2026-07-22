import React from 'react';
import Topbar from '../components/Topbar';

export default function Home() {
  return (
    <main>
      {/* 1. HERO SECTION (com Topbar inclusa para pegar o background) */}
      <section className="hero-bg">
        <Topbar />
        <div className="container hero">
        <div className="hero-content">
          <h1>
            O futuro do seu negócio no <br/>
            <span className="text-gradient font-display">JotaJá Summit</span>
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Conecte-se com as maiores indústrias, descubra inovações do mercado e transforme seus resultados em 2 dias de imersão total.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-color)' }}>Por que se inscrever agora?</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span style={{ fontSize: '1.05rem' }}><strong>Ganhe 5% OFF</strong> na sua próxima compra Arcofoods</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span style={{ fontSize: '1.05rem' }}>Participe de <strong>sorteios exclusivos</strong> durante os 2 dias de evento</span>
            </div>
          </div>
        </div>

        <div className="hero-form-wrapper">
          <div className="glass" style={{ padding: '2.5rem 2rem', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3>Garanta seu convite</h3>
            <p style={{ fontSize: '0.875rem' }}>Preencha os dados abaixo e receba 5% de desconto na sua próxima compra.</p>
            
            <form style={{ marginTop: '1.5rem' }}>
              <input type="text" placeholder="Nome Pessoal" className="input-field" required />
              <input type="text" placeholder="Nome do Estabelecimento" className="input-field" required />
              <input type="text" placeholder="CNPJ" className="input-field" required />
              <input type="email" placeholder="E-mail" className="input-field" required />
              <input type="tel" placeholder="WhatsApp" className="input-field" required />
              
              <select className="input-field" required defaultValue="">
                <option value="" disabled>Selecione a Tipologia</option>
                <option value="varejo">Varejo</option>
                <option value="atacado">Atacado</option>
                <option value="industria">Indústria</option>
                <option value="outro">Outro</option>
              </select>

              <button type="button" className="btn-primary">
                Quero meu Desconto e Convite
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>

      {/* 2. CARROSSEL DE INDÚSTRIAS */}
      <section className="carousel">
        <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', color: '#94a3b8' }}>
            Empresas e Indústrias Participantes
          </p>
        </div>
        <div className="container" style={{ overflow: 'hidden', padding: 0 }}>
          <div className="carousel-track">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="carousel-item">
                LOGO {i % 7 + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ESTATÍSTICAS */}
      <section className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem', color: 'var(--text-color)', lineHeight: 1.1 }}>
          A SUA VIRADA COMEÇA AQUI!
        </h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
          DA TEORIA À PRÁTICA, O EVENTO QUE MUDA O JOGO.
        </p>

        <div className="stats-grid" style={{ gap: '1rem', background: 'transparent' }}>
          <div className="stat-card" style={{ padding: '1rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="stat-number" style={{ color: 'var(--accent-color)', textShadow: 'none', background: 'none', WebkitTextFillColor: 'var(--accent-color)' }}>3.000</div>
            <div className="stat-label" style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: 800 }}>PARTICIPANTES</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="stat-number" style={{ color: 'var(--accent-color)', textShadow: 'none', background: 'none', WebkitTextFillColor: 'var(--accent-color)' }}>70+</div>
            <div className="stat-label" style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: 800 }}>STANDS</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="stat-number" style={{ color: 'var(--accent-color)', textShadow: 'none', background: 'none', WebkitTextFillColor: 'var(--accent-color)' }}>2 DIAS</div>
            <div className="stat-label" style={{ fontSize: '1rem', color: 'var(--text-color)', fontWeight: 800 }}>DE IMERSÃO</div>
          </div>
        </div>
      </section>

      {/* 4. SOBRE O EVENTO */}
      <section className="about-section">
        <div className="container about-grid">
          <div className="about-content">
            <h2>O que rolou em 2025 e o que esperar de 2026</h2>
            <p style={{ fontSize: '1.1rem' }}>
              O JotaJá Summit já se consolidou como o maior ponto de encontro para quem quer acelerar os negócios. No ano passado, lotamos os auditórios e geramos milhões em negócios fechados.
            </p>
            <p style={{ fontSize: '1.1rem' }}>
              Nesta nova edição, teremos palestras exclusivas, oportunidades de networking inigualáveis e muito mais. Prepare-se para elevar sua empresa de patamar.
            </p>
            <ul style={{ listStyle: 'none', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> Muito Networking
              </li>
              <li style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> Rodadas de Negócios
              </li>
              <li style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> Inovações do Varejo
              </li>
            </ul>
          </div>
          <div className="about-images">
            <div className="glass img-placeholder img-1">Foto 2025</div>
            <div className="glass img-placeholder img-2">Foto 2025</div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="footer">
        <div className="container">
          <h2>JotaJá Summit 2026</h2>
          <p style={{ maxWidth: '500px', margin: '0 auto', color: '#94a3b8' }}>
            O evento que vai revolucionar o seu negócio. Não fique de fora dessa imersão.
          </p>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">WhatsApp</a>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            © {new Date().getFullYear()} JotaJá Summit. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
