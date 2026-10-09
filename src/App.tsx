import { useEffect, useState } from "react"
import alviLogo from "./assets/alvi-logo-negative.png"
import alviMark from "./assets/alvi-mark.png"
import fattoLogo from "./assets/fatto-logo.png"

const beliefs = [
  {
    title: "Autonomia.",
    text: "Criamos para ampliar a capacidade de escolha e ação de quem usa.",
  },
  {
    title: "Constância.",
    text: "Progresso é menos sobre intensidade e mais sobre aquilo que se sustenta.",
  },
  {
    title: "Longo prazo.",
    text: "Construímos coisas que continuam úteis depois que a novidade passa.",
  },
  {
    title: "Impacto real.",
    text: "Só vale entrar na vida de alguém se for para melhorá-la de verdade.",
  },
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M3.5 10h12M11.5 6l4 4-4 4" />
    </svg>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`fatto-site ${heroReady ? "is-ready" : ""}`}>
      <style>{styles}</style>

      <header className="fatto-header">
        <a className="fatto-header-logo" href="#inicio" aria-label="Fatto — início">
          <img src={fattoLogo} alt="Fatto" />
        </a>

        <nav className="fatto-desktop-nav" aria-label="Navegação principal">
          <a href="#produtos">Produtos</a>
          <a href="#visao">Visão</a>
        </nav>

        <button
          className="fatto-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="fatto-mobile-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          id="fatto-mobile-navigation"
          className={`fatto-mobile-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação móvel"
        >
          <a href="#produtos" onClick={closeMenu}>Produtos</a>
          <a href="#visao" onClick={closeMenu}>Visão</a>
        </nav>
      </header>

      <main>
        <section className="fatto-hero" id="inicio" aria-labelledby="hero-title">
          <div className="fatto-hero-inner">
            <div className="fatto-hero-signal" aria-hidden="true">
              <span className="fatto-hero-signal-line" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-one" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-two" />
            </div>

            <h1 id="hero-title" className="fatto-hero-title">
              <span className="fatto-hero-line fatto-hero-line-muted">
                <span>O futuro não se prevê.</span>
              </span>
              <span className="fatto-hero-line fatto-hero-line-main">
                <strong>Se constrói.</strong>
              </span>
            </h1>

            <p className="fatto-hero-support">
              Tecnologia para transformar intenção em progresso.
            </p>
          </div>

        </section>

        <section className="fatto-section fatto-products" id="produtos" aria-labelledby="products-title">
          <div className="fatto-section-heading" data-reveal>
            <p className="fatto-section-index">01</p>
            <div>
              <h2 id="products-title">Produtos</h2>
              <p>O que estamos construindo.</p>
            </div>
          </div>

          <article className="fatto-alvi-card" id="alvi" data-reveal>
            <img className="fatto-alvi-logo" src={alviLogo} alt="Alvi" />

            <div className="fatto-alvi-copy">
              <div className="fatto-alvi-meta">
                <span className="fatto-status">
                  <span aria-hidden="true" />
                  Em construção
                </span>
              </div>

              <div className="fatto-alvi-message">
                <h3>
                  <span>Planeje.</span>
                  <span>Ajuste.</span>
                  <span>Continue.</span>
                </h3>
                <p>Finanças que acompanham a vida real.</p>
              </div>

              <a className="fatto-alvi-link" href="#alvi" onClick={(event) => event.preventDefault()}>
                Conheça a Alvi
                <ArrowIcon />
              </a>
            </div>

            <div className="fatto-alvi-visual" aria-hidden="true">
              <span className="fatto-route fatto-route-one" />
              <span className="fatto-route fatto-route-two" />
              <span className="fatto-route fatto-route-three" />
              <div className="fatto-alvi-mark-shell">
                <img src={alviMark} alt="" />
              </div>
            </div>
          </article>
        </section>

        <section className="fatto-section fatto-beliefs" id="visao" aria-labelledby="beliefs-title">
          <div className="fatto-section-heading" data-reveal>
            <p className="fatto-section-index">02</p>
            <div>
              <h2 id="beliefs-title">No que acreditamos</h2>
              <p>O que sustenta cada produto.</p>
            </div>
          </div>

          <ol className="fatto-beliefs-list" data-reveal>
            {beliefs.map((belief, index) => (
              <li key={belief.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p><strong>{belief.title}</strong> {belief.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="fatto-footer">
        <div className="fatto-footer-company">
          <p>Fatto Tecnologia Ltda.</p>
          <p>Tecnologia para o que vem depois.</p>
        </div>
        <p className="fatto-copyright">© 2026 Fatto</p>
      </footer>
    </div>
  )
}

const styles = `
  :root {
    color-scheme: dark;
  }

  html {
    scroll-behavior: smooth;
  }

  * {
    box-sizing: border-box;
  }

  .fatto-site {
    --bg: #090909;
    --surface: #16070b;
    --text: #f5f2ed;
    --muted: #9b999b;
    --quiet: #616064;
    --line: #282729;
    --accent: #ff1d43;
    --accent-soft: #ff5b7f;
    min-height: 100vh;
    overflow: hidden;
    background: var(--bg);
    color: var(--text);
    font-family: "Albert Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .fatto-site a {
    color: inherit;
    text-decoration: none;
  }

  .fatto-header {
    position: sticky;
    z-index: 30;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 76px;
    padding: 0 clamp(24px, 5vw, 104px);
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    backdrop-filter: blur(16px);
  }

  .fatto-header-logo,
  .fatto-footer-logo {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
  }

  .fatto-header-logo img {
    display: block;
    width: auto;
    height: 21px;
  }

  .fatto-desktop-nav {
    display: flex;
    align-items: center;
    gap: 42px;
    color: var(--muted);
    font-size: 14px;
    font-weight: 400;
  }

  .fatto-desktop-nav a {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .fatto-desktop-nav a::before {
    position: absolute;
    left: -14px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent);
    content: "";
    opacity: 0;
    transform: scale(0);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .fatto-desktop-nav a,
  .fatto-mobile-nav a {
    transition: color 180ms ease;
  }

  .fatto-desktop-nav a:hover,
  .fatto-mobile-nav a:hover {
    color: #ff7892;
  }

  .fatto-desktop-nav a:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  .fatto-menu-button,
  .fatto-mobile-nav {
    display: none;
  }

  .fatto-hero {
    position: relative;
    display: flex;
    align-items: center;
    min-height: min(760px, calc(100svh - 76px));
    padding: clamp(72px, 10vw, 164px) clamp(24px, 12vw, 252px) clamp(84px, 9vw, 148px);
    border-bottom: 1px solid var(--line);
  }

  .fatto-hero-inner {
    position: relative;
    width: min(100%, 1260px);
  }

  .fatto-hero-title {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0;
    font-size: clamp(54px, 8.2vw, 142px);
    font-weight: 430;
    letter-spacing: -0.075em;
    line-height: 0.92;
  }

  .fatto-hero-line {
    display: block;
    overflow: hidden;
  }

  .fatto-hero-line > span,
  .fatto-hero-line > strong {
    display: block;
    transform: translateY(112%);
    opacity: 0;
    filter: blur(8px);
    will-change: transform, opacity, filter;
  }

  .fatto-hero-line-muted > span {
    background: linear-gradient(90deg, #dddadd 0%, #b5b2b6 42%, #767478 74%, #252426 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .fatto-hero-line-main {
    margin-top: 0.06em;
    color: var(--text);
  }

  .fatto-hero-line-main strong {
    font-weight: 600;
  }

  .is-ready .fatto-hero-line > span,
  .is-ready .fatto-hero-line > strong {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0);
    transition: transform 960ms cubic-bezier(.16, 1, .3, 1), opacity 680ms ease, filter 720ms ease;
  }

  .is-ready .fatto-hero-line-main > strong {
    transition-delay: 190ms;
  }

  .fatto-hero-support {
    margin: clamp(18px, 1.6vw, 28px) 0 0;
    color: var(--muted);
    font-size: clamp(17px, 1.55vw, 23px);
    font-weight: 400;
    letter-spacing: -0.025em;
    opacity: 0;
    transform: translateY(14px);
  }

  .is-ready .fatto-hero-support {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 500ms ease 500ms, transform 700ms cubic-bezier(.16, 1, .3, 1) 500ms;
  }

  .fatto-hero-signal {
    position: absolute;
    top: -12px;
    left: clamp(-58px, -4vw, -28px);
    width: 20px;
    height: clamp(132px, 14vw, 210px);
  }

  .fatto-hero-signal-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    transform: scaleY(0);
    transform-origin: top;
    background: linear-gradient(180deg, transparent 0%, var(--accent) 24%, var(--accent) 76%, transparent 100%);
  }

  .fatto-hero-signal-dot {
    position: absolute;
    left: 50%;
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: var(--accent);
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .fatto-hero-signal-dot-one { top: 31%; }
  .fatto-hero-signal-dot-two { top: 71%; background: var(--accent-soft); }

  .is-ready .fatto-hero-signal-line {
    transform: scaleY(1);
    transition: transform 820ms cubic-bezier(.16, 1, .3, 1) 160ms;
  }

  .fatto-section {
    display: grid;
    grid-template-columns: minmax(220px, 0.52fr) minmax(0, 1.48fr);
    gap: clamp(48px, 7vw, 128px);
    padding: clamp(96px, 11vw, 176px) clamp(24px, 5vw, 104px);
  }

  .fatto-section-heading {
    display: grid;
    grid-template-columns: 48px 1fr;
    align-self: start;
    gap: 20px;
  }

  .fatto-section-index {
    margin: 6px 0 0;
    color: var(--quiet);
    font-size: 14px;
    font-variant-numeric: tabular-nums;
  }

  .fatto-section-heading h2 {
    margin: 0;
    color: var(--text);
    font-size: clamp(28px, 2.2vw, 38px);
    font-weight: 540;
    letter-spacing: -0.055em;
    line-height: 0.98;
    white-space: nowrap;
  }

  .fatto-section-heading div > p {
    margin: 22px 0 0;
    color: var(--muted);
    font-size: clamp(17px, 1.45vw, 23px);
    letter-spacing: -0.03em;
    line-height: 1.25;
    white-space: nowrap;
  }

  [data-reveal] {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 600ms ease, transform 850ms cubic-bezier(.16, 1, .3, 1);
  }

  [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .fatto-alvi-card {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
    min-height: 600px;
    overflow: hidden;
    border: 1px solid #612033;
    border-radius: 12px;
    background: linear-gradient(135deg, #1c080d 0%, #160609 62%, #100507 100%);
    isolation: isolate;
  }

  .fatto-alvi-copy {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: clamp(28px, 3vw, 48px);
  }

  .fatto-alvi-meta {
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    gap: 28px;
  }

  .fatto-status {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 0;
    color: #f0e9eb;
    font-size: 12px;
    font-weight: 380;
    white-space: nowrap;
  }

  .fatto-status > span {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(255, 29, 67, 0.12);
  }

  .fatto-alvi-logo {
    position: absolute;
    z-index: 4;
    top: clamp(28px, 3vw, 48px);
    right: clamp(28px, 3vw, 48px);
    display: block;
    width: auto;
    height: clamp(38px, 3.2vw, 52px);
    max-width: none;
    object-fit: contain;
    object-position: right top;
  }

  .fatto-alvi-message {
    margin: auto 0;
  }

  .fatto-alvi-message h3 {
    margin: 0;
    color: var(--text);
    font-size: clamp(44px, 4.4vw, 76px);
    font-weight: 430;
    letter-spacing: -0.072em;
    line-height: 0.88;
  }

  .fatto-alvi-message h3 span {
    display: block;
  }

  .fatto-alvi-message h3 span + span {
    margin-top: 0.1em;
  }

  .fatto-alvi-message h3 span:nth-child(1) {
    font-weight: 400;
  }

  .fatto-alvi-message h3 span:nth-child(2) {
    color: var(--accent);
    font-style: italic;
    font-weight: 600;
    transform: skewX(-8deg);
    transform-origin: left center;
  }

  .fatto-alvi-message h3 span:nth-child(3) {
    font-weight: 700;
  }

  .fatto-alvi-message p {
    margin: 30px 0 0;
    color: var(--text);
    font-size: clamp(14px, 1.4vw, 21px);
    font-weight: 400;
    letter-spacing: -0.032em;
    line-height: 1.2;
    white-space: nowrap;
  }

  .fatto-alvi-link {
    display: inline-flex;
    align-items: center;
    gap: 13px;
    padding: 0 0 12px;
    border-bottom: 1px solid #a66a79;
    color: var(--text);
    font-size: 17px;
    font-weight: 520;
    white-space: nowrap;
    transition: border-color 180ms ease, color 180ms ease;
  }

  .fatto-alvi-link svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    transition: transform 220ms cubic-bezier(.16, 1, .3, 1);
  }

  .fatto-alvi-link:hover {
    border-color: var(--accent-soft);
    color: var(--accent-soft);
  }

  .fatto-alvi-link:hover svg {
    transform: translateX(5px);
  }

  .fatto-alvi-visual {
    position: relative;
    min-height: 100%;
    perspective: 1200px;
  }

  .fatto-route {
    position: absolute;
    border: 1px solid rgba(255, 86, 126, 0.22);
    border-radius: 999px;
    transform-origin: center;
    transition: opacity 500ms ease, transform 900ms cubic-bezier(.16, 1, .3, 1);
  }

  .fatto-route-one {
    top: 18%;
    right: -13%;
    width: 92%;
    aspect-ratio: 1;
  }

  .fatto-route-two {
    top: 38%;
    right: 12%;
    width: 78%;
    aspect-ratio: 1;
  }

  .fatto-route-three {
    right: -20%;
    bottom: 4%;
    width: 58%;
    aspect-ratio: 1;
  }

  .fatto-alvi-mark-shell {
    position: absolute;
    top: 50%;
    left: 55%;
    width: min(72%, 330px);
    transform: translate(-50%, -50%) rotate(4deg) rotateY(0deg);
    transform-origin: center left;
    transform-style: preserve-3d;
    filter: drop-shadow(0 26px 32px rgba(0, 0, 0, 0.28));
    transition: transform 700ms cubic-bezier(.16, 1, .3, 1), filter 500ms ease;
  }

  .fatto-alvi-mark-shell img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (hover: hover) and (pointer: fine) {
    .fatto-alvi-card:hover .fatto-alvi-mark-shell {
      transform: translate(-50%, -50%) rotate(3deg) rotateY(-12deg) rotateX(3deg) scale(1.025);
      filter: drop-shadow(18px 32px 38px rgba(0, 0, 0, 0.38));
    }

    .fatto-alvi-card:hover .fatto-route { opacity: 0.74; }
    .fatto-alvi-card:hover .fatto-route-one { transform: translate(-18px, 16px) scale(0.91); }
    .fatto-alvi-card:hover .fatto-route-two { transform: translate(-16px, -8px) scale(0.88); }
    .fatto-alvi-card:hover .fatto-route-three { transform: translate(-12px, 10px) scale(0.9); }
  }

  .fatto-beliefs {
    border-top: 1px solid var(--line);
    padding-block: clamp(96px, 8vw, 144px);
  }

  .fatto-beliefs-list {
    display: grid;
    margin: 0 0 0 clamp(48px, 4vw, 76px);
    padding: 0;
    list-style: none;
  }

  .fatto-beliefs-list li {
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 24px;
    padding: clamp(36px, 4vw, 58px) 0;
  }

  .fatto-beliefs-list li:first-child {
    padding-top: 0;
  }

  .fatto-beliefs-list li:last-child {
    padding-bottom: 0;
  }

  .fatto-beliefs-list li + li {
    border-top: 1px solid var(--line);
  }

  .fatto-beliefs-list li > span {
    padding-top: 0.24em;
    color: var(--quiet);
    font-size: 14px;
    font-variant-numeric: tabular-nums;
  }

  .fatto-beliefs-list p {
    max-width: 1020px;
    margin: 0;
    color: var(--muted);
    font-size: clamp(25px, 2.55vw, 42px);
    font-weight: 390;
    letter-spacing: -0.06em;
    line-height: 1.1;
  }

  .fatto-beliefs-list strong {
    color: var(--text);
    font-weight: 590;
  }

  .fatto-footer {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 32px clamp(24px, 5vw, 104px);
    border-top: 1px solid var(--line);
  }

  .fatto-footer-company {
    display: grid;
    gap: 5px;
    justify-self: start;
  }

  .fatto-footer p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.35;
  }

  .fatto-footer-company p:first-child {
    color: var(--text);
  }

  .fatto-copyright {
    flex: 0 0 auto;
    justify-self: end;
    color: var(--quiet) !important;
  }

  @media (max-width: 900px) {
    .fatto-hero {
      min-height: 660px;
      padding-inline: clamp(32px, 8vw, 80px);
    }

    .fatto-section {
      grid-template-columns: 1fr;
      gap: 54px;
      padding-inline: clamp(32px, 8vw, 80px);
    }

    .fatto-section-heading {
      max-width: 480px;
    }

    .fatto-alvi-card {
      grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.75fr);
      min-height: 560px;
    }
  }

  @media (max-width: 620px) {
    .fatto-header {
      height: 68px;
      padding: 0 24px;
    }

    .fatto-header-logo img { height: 20px; }
    .fatto-desktop-nav { display: none; }

    .fatto-menu-button {
      display: grid;
      width: 38px;
      height: 38px;
      padding: 9px;
      border: 0;
      background: transparent;
      cursor: pointer;
      place-content: center;
      gap: 6px;
    }

    .fatto-menu-button span {
      display: block;
      width: 20px;
      height: 1px;
      background: var(--text);
      transition: transform 200ms ease;
    }

    .fatto-menu-button[aria-expanded="true"] span:first-child { transform: translateY(3.5px) rotate(45deg); }
    .fatto-menu-button[aria-expanded="true"] span:last-child { transform: translateY(-3.5px) rotate(-45deg); }

    .fatto-mobile-nav {
      position: absolute;
      top: 67px;
      right: 0;
      left: 0;
      display: grid;
      gap: 4px;
      max-height: 0;
      padding: 0 24px;
      overflow: hidden;
      border-bottom: 1px solid transparent;
      background: #0d0d0d;
      opacity: 0;
      transition: max-height 260ms ease, padding 260ms ease, opacity 180ms ease, border-color 260ms ease;
    }

    .fatto-mobile-nav.is-open {
      max-height: 144px;
      padding-block: 18px 22px;
      border-color: var(--line);
      opacity: 1;
    }

    .fatto-mobile-nav a {
      padding: 10px 0;
      color: var(--muted);
      font-size: 18px;
    }

    .fatto-hero {
      min-height: calc(100svh - 68px);
      padding: 80px 24px 92px 58px;
    }

    .fatto-hero-title {
      font-size: clamp(52px, 15vw, 76px);
      line-height: 0.91;
    }

    .fatto-hero-support {
      max-width: 290px;
      margin-top: 22px;
      font-size: 17px;
      line-height: 1.3;
    }

    .fatto-hero-signal {
      top: 52px;
      left: 25px;
      height: 116px;
    }

    .fatto-section {
      gap: 44px;
      padding: 88px 24px;
    }

    .fatto-section-heading {
      grid-template-columns: 38px 1fr;
      gap: 16px;
    }

    .fatto-section-index { font-size: 12px; }
    .fatto-section-heading h2 { font-size: 30px; font-weight: 540; white-space: normal; }
    .fatto-section-heading div > p { margin-top: 15px; font-size: 17px; white-space: normal; }

    .fatto-alvi-card {
      display: flex;
      min-height: 650px;
      flex-direction: column;
    }

    .fatto-alvi-copy {
      min-height: 390px;
      padding: 28px;
    }

    .fatto-status { margin-top: 0; font-size: 12px; }
    .fatto-alvi-logo { top: 28px; right: 28px; height: 38px; }

    .fatto-alvi-message {
      margin: 48px 0 44px;
    }

    .fatto-alvi-message h3 {
      font-size: clamp(49px, 14vw, 64px);
      line-height: 0.86;
    }

    .fatto-alvi-message p {
      margin-top: 24px;
      font-size: 14px;
      letter-spacing: -0.04em;
    }

    .fatto-alvi-link { margin-top: auto; font-size: 16px; }

    .fatto-alvi-visual {
      min-height: 260px;
    }

    .fatto-alvi-mark-shell {
      top: 40%;
      left: 55%;
      width: min(52%, 238px);
    }

    .fatto-route-one { top: -42%; right: 4%; width: 92%; }
    .fatto-route-two { top: -11%; right: 26%; width: 70%; }
    .fatto-route-three { right: -8%; bottom: -54%; width: 55%; }

    .fatto-beliefs {
      gap: 46px;
      padding-block: 82px;
    }

    .fatto-beliefs-list li {
      grid-template-columns: 32px 1fr;
      gap: 16px;
      padding: 30px 0;
    }

    .fatto-beliefs-list { margin-left: 0; }
    .fatto-beliefs-list li > span { font-size: 12px; }
    .fatto-beliefs-list p { font-size: clamp(27px, 7.5vw, 37px); line-height: 1.09; }

    .fatto-footer {
      align-items: center;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 20px;
      padding: 30px 24px;
    }

    .fatto-footer-company { justify-self: start; }
    .fatto-copyright { justify-self: end; }
    .fatto-footer p { font-size: 13px; }
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 1ms !important; animation-duration: 1ms !important; }
    [data-reveal], [data-reveal].is-visible, .fatto-hero-line > span, .fatto-hero-line > strong, .fatto-hero-support, .fatto-hero-signal-dot { opacity: 1; transform: none; filter: none; }
    .fatto-hero-signal-line { transform: scaleY(1); }
  }
`
