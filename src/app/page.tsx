import React from 'react';

export default function Home() {
  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="container hero">
        <div className="hero-content">
          <div className="glass tag">
            Dezembro de 2026 • Local a definir
          </div>
          <h1>
            O futuro do seu negócio no <br/>
            <span className="text-gradient">JotaJá Summit</span>
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Conecte-se com as maiores indústrias, descubra inovações do mercado e transforme seus resultados em 2 dias de imersão total.
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Inscrições Abertas</span>
          </div>
        </div>

        <div className="hero-form-wrapper">
          <div className="glass" style={{ padding: '2.5rem 2rem' }}>
            <div className="badge-discount">Ganhe 5% OFF!</div>
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
      </section>

      {/* 2. CARROSSEL DE INDÚSTRIAS */}
      <section className="carousel">
        <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', color: '#94a3b8' }}>
            Empresas e Indústrias Participantes
          </p>
        </div>
        <div className="carousel-track">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="carousel-item">
              LOGO {i % 7 + 1}
            </div>
          ))}
        </div>
      </section>

      {/* 3. ESTATÍSTICAS */}
      <section className="container" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="stats-grid">
          <div className="glass stat-card">
            <div className="stat-number text-gradient" style={{ color: '#60a5fa' }}>3.000</div>
            <div className="stat-label">PARTICIPANTES</div>
          </div>
          <div className="glass stat-card">
            <div className="stat-number text-gradient" style={{ color: '#c084fc' }}>70+</div>
            <div className="stat-label">STANDS</div>
          </div>
          <div className="glass stat-card">
            <div className="stat-number text-gradient" style={{ color: '#60a5fa' }}>2 DIAS</div>
            <div className="stat-label">DE IMERSÃO</div>
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
