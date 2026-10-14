import { useEffect, useState } from "react"
import alviLogo from "./assets/alvi-logo-negative.png"
import alviMark from "./assets/alvi-mark.png"
import fattoLogo from "./assets/fatto-logo.png"

type SiteLocale = "pt-BR" | "en-US" | "es-ES" | "fr-FR" | "it-IT"

const localeLabels: Record<SiteLocale, { short: string; name: string }> = {
  "pt-BR": { short: "PT", name: "Português" },
  "en-US": { short: "EN", name: "English" },
  "es-ES": { short: "ES", name: "Español" },
  "fr-FR": { short: "FR", name: "Français" },
  "it-IT": { short: "IT", name: "Italiano" },
}

const content = {
  "pt-BR": {
    navigation: { products: "Produtos", vision: "Visão", openMenu: "Abrir menu", closeMenu: "Fechar menu" },
    hero: { future: "O futuro não se prevê.", built: "Se constrói.", support: "Tecnologia para transformar intenção em progresso." },
    products: { title: "Produtos", support: "O que estamos construindo.", status: "Em construção", plan: "Planeje.", adjust: "Ajuste.", continue: "Continue.", description: "Finanças que acompanham a vida real.", cta: "Conheça a Alvi" },
    beliefs: [
      { title: "Autonomia.", text: "Criamos para que cada pessoa tenha mais clareza e liberdade para escolher e agir." },
      { title: "Constância.", text: "Acreditamos no progresso que acontece aos poucos e permanece." },
      { title: "Longo prazo.", text: "Construímos soluções que continuam úteis depois que a novidade passa." },
      { title: "Impacto real.", text: "Simplificamos o cotidiano para abrir espaço para o que importa." },
    ],
    vision: { title: "No que acreditamos", support: "O que sustenta cada produto." },
    footer: "Tecnologia para o que vem depois.",
  },
  "en-US": {
    navigation: { products: "Products", vision: "Vision", openMenu: "Open menu", closeMenu: "Close menu" },
    hero: { future: "The future isn’t predicted.", built: "It’s built.", support: "Technology that turns intention into progress." },
    products: { title: "Products", support: "What we’re building.", status: "In the works", plan: "Plan.", adjust: "Adjust.", continue: "Continue.", description: "Finances that keep up with real life.", cta: "Meet Alvi" },
    beliefs: [
      { title: "Autonomy.", text: "We build for greater clarity and freedom to choose and act." },
      { title: "Consistency.", text: "We believe in progress that happens gradually and endures." },
      { title: "Long term.", text: "We build solutions that remain useful after the novelty wears off." },
      { title: "Real impact.", text: "We simplify everyday life to make room for what matters." },
    ],
    vision: { title: "What we believe", support: "What sustains every product." },
    footer: "Technology for what comes next.",
  },
  "es-ES": {
    navigation: { products: "Productos", vision: "Visión", openMenu: "Abrir menú", closeMenu: "Cerrar menú" },
    hero: { future: "El futuro no se predice.", built: "Se construye.", support: "Tecnología para transformar la intención en progreso." },
    products: { title: "Productos", support: "Lo que estamos construyendo.", status: "En desarrollo", plan: "Planifica.", adjust: "Ajusta.", continue: "Continúa.", description: "Finanzas que acompañan la vida real.", cta: "Conoce Alvi" },
    beliefs: [
      { title: "Autonomía.", text: "Creamos para que cada persona tenga más claridad y libertad para elegir y actuar." },
      { title: "Constancia.", text: "Creemos en el progreso que sucede poco a poco y permanece." },
      { title: "Largo plazo.", text: "Construimos soluciones que siguen siendo útiles cuando pasa la novedad." },
      { title: "Impacto real.", text: "Simplificamos el día a día para abrir espacio a lo que importa." },
    ],
    vision: { title: "En lo que creemos", support: "Lo que sostiene cada producto." },
    footer: "Tecnología para lo que viene después.",
  },
  "fr-FR": {
    navigation: { products: "Produits", vision: "Vision", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu" },
    hero: { future: "L’avenir ne se prédit pas.", built: "Il se construit.", support: "La technologie qui transforme l’intention en progrès." },
    products: { title: "Produits", support: "Ce que nous construisons.", status: "En construction", plan: "Planifiez.", adjust: "Ajustez.", continue: "Continuez.", description: "Des finances qui suivent le rythme de la vraie vie.", cta: "Découvrir Alvi" },
    beliefs: [
      { title: "Autonomie.", text: "Nous créons pour que chacun ait plus de clarté et de liberté pour choisir et agir." },
      { title: "Constance.", text: "Nous croyons au progrès qui se fait peu à peu et qui dure." },
      { title: "Long terme.", text: "Nous construisons des solutions qui restent utiles une fois la nouveauté passée." },
      { title: "Impact réel.", text: "Nous simplifions le quotidien pour faire de la place à ce qui compte." },
    ],
    vision: { title: "Ce en quoi nous croyons", support: "Ce qui soutient chaque produit." },
    footer: "La technologie pour la suite.",
  },
  "it-IT": {
    navigation: { products: "Prodotti", vision: "Visione", openMenu: "Apri menu", closeMenu: "Chiudi menu" },
    hero: { future: "Il futuro non si prevede.", built: "Si costruisce.", support: "Tecnologia per trasformare l’intenzione in progresso." },
    products: { title: "Prodotti", support: "Ciò che stiamo costruendo.", status: "In costruzione", plan: "Pianifica.", adjust: "Adatta.", continue: "Continua.", description: "Finanze che seguono la vita reale.", cta: "Scopri Alvi" },
    beliefs: [
      { title: "Autonomia.", text: "Creiamo perché ogni persona abbia più chiarezza e libertà di scegliere e agire." },
      { title: "Costanza.", text: "Crediamo nel progresso che avviene poco alla volta e dura." },
      { title: "Lungo termine.", text: "Costruiamo soluzioni che restano utili anche quando la novità passa." },
      { title: "Impatto reale.", text: "Semplifichiamo il quotidiano per fare spazio a ciò che conta." },
    ],
    vision: { title: "Ciò in cui crediamo", support: "Ciò che sostiene ogni prodotto." },
    footer: "Tecnologia per ciò che viene dopo.",
  },
} as const

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
  const [siteLocale, setSiteLocale] = useState<SiteLocale>("pt-BR")
  const [languageOpen, setLanguageOpen] = useState(false)
  const copy = content[siteLocale]
  const beliefs = copy.beliefs

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeroReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
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

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    setLanguageOpen(false)
  }
  const selectLocale = (locale: SiteLocale) => {
    setSiteLocale(locale)
    setLanguageOpen(false)
    closeMenu()
  }

  const LanguagePicker = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`fatto-language-picker ${mobile ? "is-mobile" : ""} ${languageOpen ? "is-open" : ""}`}>
      <button
        className="fatto-language-trigger"
        type="button"
        aria-expanded={languageOpen}
        aria-haspopup="menu"
        aria-label="Select language"
        onClick={() => setLanguageOpen((open) => !open)}
      >
        <span>{localeLabels[siteLocale].short}</span>
        <span className="fatto-language-chevron" aria-hidden="true" />
      </button>
      <div className="fatto-language-options" role="menu">
        {(Object.entries(localeLabels) as [SiteLocale, { short: string; name: string }][]).map(([locale, label]) => (
          <button
            key={locale}
            type="button"
            role="menuitemradio"
            aria-checked={siteLocale === locale}
            className={siteLocale === locale ? "is-active" : ""}
            onClick={() => selectLocale(locale)}
          >
            <span>{label.name}</span>
            <span>{label.short}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={`fatto-site ${heroReady ? "is-ready" : ""}`} lang={siteLocale}>
      <style>{styles}</style>

      <header className="fatto-header">
        <a className="fatto-header-logo" href="#inicio" aria-label={siteLocale === "en-US" ? "Fatto home" : "Fatto — início"}>
          <img src={fattoLogo} alt="Fatto" />
        </a>

        <nav className="fatto-desktop-nav" aria-label={siteLocale === "en-US" ? "Main navigation" : "Navegação principal"}>
          <a href="#produtos">{copy.navigation.products}</a>
          <a href="#visao">{copy.navigation.vision}</a>
          <LanguagePicker />
        </nav>

        <button
          className="fatto-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="fatto-mobile-navigation"
          aria-label={menuOpen ? copy.navigation.closeMenu : copy.navigation.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="fatto-mobile-navigation"
          className={`fatto-mobile-nav ${menuOpen ? "is-open" : ""}`}
          aria-label={siteLocale === "en-US" ? "Mobile navigation" : "Navegação móvel"}
        >
          <a href="#produtos" onClick={closeMenu}>{copy.navigation.products}</a>
          <a href="#visao" onClick={closeMenu}>{copy.navigation.vision}</a>
          <LanguagePicker mobile />
        </nav>
      </header>

      <main>
        <section className="fatto-hero" id="inicio" aria-labelledby="hero-title">
          <div className="fatto-hero-inner">
            <div className="fatto-hero-signal" aria-hidden="true">
              <span className="fatto-hero-signal-line" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-one" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-two" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-three" />
              <span className="fatto-hero-signal-dot fatto-hero-signal-dot-four" />
            </div>

            <h1 id="hero-title" className="fatto-hero-title">
              <span className="fatto-hero-line fatto-hero-line-muted"><span>{copy.hero.future}</span></span>
              <span className="fatto-hero-line fatto-hero-line-main"><strong>{copy.hero.built}</strong></span>
            </h1>
            <p className="fatto-hero-support">{copy.hero.support}</p>
          </div>
        </section>

        <section className="fatto-section fatto-products" id="produtos" aria-labelledby="products-title">
          <div className="fatto-section-heading" data-reveal>
            <p className="fatto-section-index">01</p>
            <div>
              <h2 id="products-title">{copy.products.title}</h2>
              <p>{copy.products.support}</p>
            </div>
          </div>

          <article className="fatto-alvi-card" id="alvi" data-reveal>
            <img className="fatto-alvi-logo" src={alviLogo} alt="Alvi" />
            <div className="fatto-alvi-copy">
              <span className="fatto-status"><span aria-hidden="true" />{copy.products.status}</span>
              <div className="fatto-alvi-message">
                <h3>
                  <span>{copy.products.plan}</span>
                  <span>{copy.products.adjust}</span>
                  <span>{copy.products.continue}</span>
                </h3>
                <p>{copy.products.description}</p>
              </div>
              <a className="fatto-alvi-link" href="#alvi" onClick={(event) => event.preventDefault()}>
                {copy.products.cta} <ArrowIcon />
              </a>
            </div>
            <div className="fatto-alvi-visual" aria-hidden="true">
              <span className="fatto-route fatto-route-one" />
              <span className="fatto-route fatto-route-two" />
              <span className="fatto-route fatto-route-three" />
              <div className="fatto-alvi-mark-shell"><img src={alviMark} alt="" /></div>
            </div>
          </article>
        </section>

        <section className="fatto-section fatto-beliefs" id="visao" aria-labelledby="beliefs-title">
          <div className="fatto-section-heading" data-reveal>
            <p className="fatto-section-index">02</p>
            <div>
              <h2 id="beliefs-title">{copy.vision.title}</h2>
              <p>{copy.vision.support}</p>
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
          <p>{copy.footer}</p>
        </div>
        <p className="fatto-copyright">© 2026</p>
      </footer>
    </div>
  )
}

const styles = `
  :root { color-scheme: dark; }
  html { scroll-behavior: smooth; }
  * { box-sizing: border-box; }

  .fatto-site {
    --bg: #090909;
    --text: #f5f2ed;
    --muted: #a09da1;
    --quiet: #646267;
    --line: #282729;
    --accent: #ff1d43;
    --accent-soft: #ff5b7f;
    min-height: 100vh;
    overflow: hidden;
    background: var(--bg);
    color: var(--text);
    font-family: "Albert Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .fatto-site a { color: inherit; text-decoration: none; }

  .fatto-header {
    position: sticky;
    z-index: 20;
    top: 0;
    display: flex;
    height: 76px;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(24px, 5vw, 104px);
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 95%, transparent);
    backdrop-filter: blur(16px);
  }

  .fatto-header-logo { display: inline-flex; align-items: center; }
  .fatto-header-logo img { display: block; width: auto; height: 21px; }

  .fatto-desktop-nav {
    display: flex;
    align-items: center;
    gap: 42px;
    color: var(--muted);
    font-size: 14px;
    font-weight: 400;
  }

  .fatto-desktop-nav a, .fatto-mobile-nav a { transition: color 180ms ease; }
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
    border-radius: 99px;
    background: var(--accent);
    content: "";
    opacity: 0;
    transform: scale(0);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .fatto-desktop-nav a:hover, .fatto-mobile-nav a:hover, .fatto-mobile-nav a:focus-visible { color: #ff7892; }
  .fatto-desktop-nav a:hover::before { opacity: 1; transform: scale(1); }

  .fatto-language-picker { position: relative; z-index: 30; margin-left: -24px; }
  .fatto-language-trigger { display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; border: 0; background: transparent; color: var(--muted); font: inherit; font-size: 11px; font-weight: 520; letter-spacing: .06em; cursor: pointer; transition: color 180ms ease; }
  .fatto-language-trigger:hover, .fatto-language-trigger:focus-visible, .fatto-language-picker.is-open .fatto-language-trigger { color: var(--text); }
  .fatto-language-chevron { width: 6px; height: 6px; margin-top: -3px; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg); transition: transform 180ms ease; }
  .fatto-language-picker.is-open .fatto-language-chevron { margin-top: 3px; transform: rotate(225deg); }
  .fatto-language-options { position: absolute; top: calc(100% + 10px); right: -12px; display: grid; width: 156px; padding: 6px; border: 1px solid #2a292c; border-radius: 10px; background: #141414; box-shadow: 0 18px 38px rgba(0, 0, 0, .32); opacity: 0; pointer-events: none; transform: translateY(-5px); transition: opacity 180ms ease, transform 180ms ease; }
  .fatto-language-picker.is-open .fatto-language-options { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .fatto-language-options button { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 9px 10px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; letter-spacing: -.01em; text-align: left; cursor: pointer; transition: color 160ms ease, background 160ms ease; }
  .fatto-language-options button > span:last-child { color: var(--quiet); font-size: 10px; font-weight: 520; letter-spacing: .06em; }
  .fatto-language-options button:hover, .fatto-language-options button:focus-visible { background: #202024; color: var(--text); }
  .fatto-language-options button.is-active { color: var(--accent-soft); }

  .fatto-menu-button, .fatto-mobile-nav { display: none; }

  .fatto-hero {
    display: flex;
    min-height: min(760px, calc(100svh - 76px));
    align-items: center;
    padding: clamp(72px, 10vw, 164px) clamp(24px, 12vw, 252px) clamp(84px, 9vw, 148px);
    border-bottom: 1px solid var(--line);
  }

  .fatto-hero-inner { position: relative; width: min(100%, 1260px); }
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

  .fatto-hero-line { display: block; overflow: hidden; }
  .fatto-hero-line > span, .fatto-hero-line > strong {
    display: block;
    opacity: 0;
    filter: blur(8px);
    transform: translateY(112%);
    will-change: transform, opacity, filter;
  }

  .fatto-hero-line-muted > span {
    background: linear-gradient(90deg, #dddadd 0%, #b5b2b6 42%, #767478 74%, #252426 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .fatto-hero-line-main { margin-top: 0.06em; color: var(--text); }
  .fatto-hero-line-main strong { font-weight: 600; }
  .is-ready .fatto-hero-line > span, .is-ready .fatto-hero-line > strong {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
    transition: transform 960ms cubic-bezier(.16, 1, .3, 1), opacity 680ms ease, filter 720ms ease;
  }
  .is-ready .fatto-hero-line-main > strong { transition-delay: 190ms; }

  .fatto-hero-support {
    margin: clamp(18px, 1.6vw, 28px) 0 0;
    color: var(--muted);
    font-size: clamp(17px, 1.55vw, 23px);
    font-weight: 400;
    letter-spacing: -0.025em;
    opacity: 0;
    transform: translateY(14px);
  }
  .is-ready .fatto-hero-support { opacity: 1; transform: translateY(0); transition: opacity 500ms ease 500ms, transform 700ms cubic-bezier(.16, 1, .3, 1) 500ms; }

  .fatto-hero-signal {
    position: absolute;
    top: -28px;
    left: clamp(-70px, -5vw, -36px);
    width: 20px;
    height: clamp(172px, 17vw, 258px);
  }
  .fatto-hero-signal-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 29, 67, .42) 15%, var(--accent) 29%, var(--accent) 71%, rgba(255, 29, 67, .42) 85%, transparent 100%);
    transform: scaleY(0);
    transform-origin: top;
  }
  .fatto-hero-signal-dot {
    position: absolute;
    left: 50%;
    width: 9px;
    height: 9px;
    border-radius: 99px;
    background: var(--accent);
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  .fatto-hero-signal-dot-one { top: 26%; }
  .fatto-hero-signal-dot-two { top: 74%; background: var(--accent-soft); }
  .fatto-hero-signal-dot-three, .fatto-hero-signal-dot-four { display: none; }
  .is-ready .fatto-hero-signal-line { transform: scaleY(1); transition: transform 1300ms cubic-bezier(.22, 1, .36, 1) 180ms; }

  .fatto-section {
    display: grid;
    grid-template-columns: minmax(220px, 0.52fr) minmax(0, 1.48fr);
    gap: clamp(48px, 7vw, 128px);
    padding: clamp(96px, 11vw, 176px) clamp(24px, 5vw, 104px);
  }
  .fatto-section-heading { display: grid; grid-template-columns: 48px 1fr; align-self: start; gap: 20px; }
  .fatto-section-index { margin: 6px 0 0; color: var(--quiet); font-size: 14px; font-variant-numeric: tabular-nums; }
  .fatto-section-heading h2 { margin: 0; color: var(--text); font-size: clamp(28px, 2.2vw, 38px); font-weight: 540; letter-spacing: -0.055em; line-height: 0.98; white-space: nowrap; }
  .fatto-section-heading div > p { margin: 22px 0 0; color: var(--muted); font-size: clamp(17px, 1.45vw, 23px); letter-spacing: -0.03em; line-height: 1.25; white-space: nowrap; }

  [data-reveal] { opacity: 0; transform: translateY(22px); transition: opacity 600ms ease, transform 850ms cubic-bezier(.16, 1, .3, 1); }
  [data-reveal].is-visible { opacity: 1; transform: translateY(0); }

  .fatto-alvi-card {
    position: relative;
    display: grid;
    min-height: 600px;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
    overflow: hidden;
    border: 1px solid #612033;
    border-radius: 12px;
    background: linear-gradient(135deg, #1c080d 0%, #160609 62%, #100507 100%);
    isolation: isolate;
  }
  .fatto-alvi-copy { position: relative; z-index: 3; display: flex; min-width: 0; flex-direction: column; align-items: flex-start; padding: clamp(28px, 3vw, 48px); }
  .fatto-status { display: inline-flex; align-items: center; gap: 10px; color: #f0e9eb; font-size: 12px; font-weight: 380; white-space: nowrap; }
  .fatto-status > span { width: 8px; height: 8px; border-radius: 99px; background: var(--accent); box-shadow: 0 0 0 4px rgba(255, 29, 67, .12); }
  .fatto-alvi-logo { position: absolute; z-index: 4; top: clamp(28px, 3vw, 48px); right: clamp(28px, 3vw, 48px); display: block; width: auto; height: clamp(38px, 3.2vw, 52px); }
  .fatto-alvi-message { margin: auto 0; }
  .fatto-alvi-message h3 { margin: 0; color: var(--text); font-size: clamp(44px, 4.4vw, 76px); font-weight: 430; letter-spacing: -0.072em; line-height: .88; }
  .fatto-alvi-message h3 span { display: block; }
  .fatto-alvi-message h3 span + span { margin-top: .1em; }
  .fatto-alvi-message h3 span:nth-child(1) { font-weight: 400; }
  .fatto-alvi-message h3 span:nth-child(2) { color: var(--accent); font-style: italic; font-weight: 600; transform: skewX(-8deg); transform-origin: left center; }
  .fatto-alvi-message h3 span:nth-child(3) { font-weight: 700; }
  .fatto-alvi-message p { margin: 30px 0 0; color: var(--text); font-size: clamp(14px, 1.4vw, 21px); font-weight: 400; letter-spacing: -0.032em; line-height: 1.2; white-space: nowrap; }
  .fatto-alvi-link { display: inline-flex; align-items: center; gap: 13px; padding: 0 0 12px; border-bottom: 1px solid #a66a79; color: var(--text); font-size: 17px; font-weight: 520; white-space: nowrap; transition: border-color 180ms ease, color 180ms ease; }
  .fatto-alvi-link svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; transition: transform 220ms cubic-bezier(.16, 1, .3, 1); }
  .fatto-alvi-link:hover { border-color: var(--accent-soft); color: var(--accent-soft); }
  .fatto-alvi-link:hover svg { transform: translateX(5px); }

  .fatto-alvi-visual { position: relative; min-height: 100%; perspective: 1200px; }
  .fatto-route { position: absolute; width: auto; aspect-ratio: 1 / 1; border: 1px solid rgba(255, 86, 126, .22); border-radius: 50%; transform-origin: center; transition: opacity 500ms ease, transform 900ms cubic-bezier(.16, 1, .3, 1); }
  .fatto-route-one { top: 18%; right: -13%; width: 92%; aspect-ratio: 1; }
  .fatto-route-two { top: 38%; right: 12%; width: 78%; aspect-ratio: 1; }
  .fatto-route-three { right: -20%; bottom: 4%; width: 58%; aspect-ratio: 1; }
  .fatto-alvi-mark-shell { position: absolute; top: 50%; left: 55%; width: min(72%, 330px); transform: translate(-50%, -50%) rotate(4deg) rotateY(0); transform-origin: center left; transform-style: preserve-3d; filter: drop-shadow(0 26px 32px rgba(0, 0, 0, .28)); transition: transform 700ms cubic-bezier(.16, 1, .3, 1), filter 500ms ease; }
  .fatto-alvi-mark-shell img { display: block; width: 100%; height: auto; }
  @media (hover: hover) and (pointer: fine) {
    .fatto-alvi-card:hover .fatto-alvi-mark-shell { transform: translate(-50%, -50%) rotate(3deg) rotateY(-12deg) rotateX(3deg) scale(1.025); filter: drop-shadow(18px 32px 38px rgba(0, 0, 0, .38)); }
    .fatto-alvi-card:hover .fatto-route { opacity: .74; }
    .fatto-alvi-card:hover .fatto-route-one { transform: translate(-18px, 16px) scale(.91); }
    .fatto-alvi-card:hover .fatto-route-two { transform: translate(-16px, -8px) scale(.88); }
    .fatto-alvi-card:hover .fatto-route-three { transform: translate(-12px, 10px) scale(.9); }
  }

  .fatto-beliefs { border-top: 1px solid var(--line); padding-block: clamp(96px, 8vw, 144px); }
  .fatto-beliefs-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 0 0 0 clamp(48px, 4vw, 76px); padding: 0; list-style: none; }
  .fatto-beliefs-list li { display: flex; min-height: 0; flex-direction: column; gap: 0; padding: clamp(22px, 1.8vw, 28px); border: 1px solid #202024; border-radius: 16px; background: #121212; }
  .fatto-beliefs-list li > span { color: var(--quiet); font-size: 13px; font-variant-numeric: tabular-nums; }
  .fatto-beliefs-list p { margin: 10px 0 0; color: var(--muted); font-size: clamp(20px, 1.75vw, 29px); font-weight: 390; letter-spacing: -0.055em; line-height: 1.12; }
  .fatto-beliefs-list strong { color: var(--text); font-weight: 590; }

  .fatto-footer { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px; padding: 32px clamp(24px, 5vw, 104px); border-top: 1px solid var(--line); }
  .fatto-footer-company { display: grid; gap: 5px; justify-self: start; }
  .fatto-footer p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.35; }
  .fatto-footer-company p:first-child { color: var(--text); }
  .fatto-copyright { justify-self: end; color: var(--quiet) !important; }

  @media (max-width: 900px) {
    .fatto-hero { min-height: 660px; padding-inline: clamp(32px, 8vw, 80px); }
    .fatto-section { grid-template-columns: 1fr; gap: 54px; padding-inline: clamp(32px, 8vw, 80px); }
    .fatto-section-heading { max-width: 480px; }
    .fatto-alvi-card { grid-template-columns: minmax(0, 1.05fr) minmax(260px, .75fr); min-height: 560px; }
    .fatto-beliefs-list { margin-left: 0; }
  }

  @media (max-width: 620px) {
    .fatto-header { height: 68px; padding: 0 22px; }
    .fatto-header-logo img { height: 21px; }
    .fatto-desktop-nav { display: none; }

    .fatto-menu-button { display: grid; width: 42px; height: 42px; padding: 10px 7px; border: 0; background: transparent; cursor: pointer; place-content: center; gap: 5px; }
    .fatto-menu-button span { display: block; width: 22px; height: 1px; background: var(--text); transition: transform 220ms ease, opacity 180ms ease; }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

    .fatto-mobile-nav { position: absolute; z-index: 1; top: 67px; right: 0; left: 0; display: grid; gap: 6px; max-height: 0; padding: 0 28px; overflow: hidden; border-bottom: 1px solid transparent; background: #0d0d0d; opacity: 0; transition: max-height 260ms ease, padding 260ms ease, opacity 180ms ease, border-color 260ms ease; }
    .fatto-mobile-nav.is-open { max-height: 390px; padding-block: 18px 22px; border-color: var(--line); opacity: 1; }
    .fatto-mobile-nav a { position: relative; padding: 10px 0 10px 16px; color: var(--muted); font-size: 18px; }
    .fatto-mobile-nav a::before { position: absolute; top: 50%; left: 0; width: 6px; height: 6px; border-radius: 99px; background: var(--accent); content: ""; opacity: 0; transform: translateY(-50%) scale(0); transition: opacity 180ms ease, transform 180ms ease; }
    .fatto-mobile-nav a:hover::before, .fatto-mobile-nav a:focus-visible::before { opacity: 1; transform: translateY(-50%) scale(1); }
    .fatto-language-picker.is-mobile { margin: 0; padding: 10px 0 0 16px; }
    .fatto-language-picker.is-mobile .fatto-language-trigger { font-size: 12px; }
    .fatto-language-picker.is-mobile .fatto-language-options { position: static; width: min(100%, 220px); max-height: 0; margin-top: 0; padding: 0; overflow: hidden; border: 0; border-radius: 0; background: transparent; box-shadow: none; opacity: 0; transform: none; transition: max-height 220ms ease, margin 220ms ease, opacity 180ms ease; }
    .fatto-language-picker.is-mobile.is-open .fatto-language-options { max-height: 240px; margin-top: 8px; opacity: 1; }
    .fatto-language-picker.is-mobile .fatto-language-options button { padding: 8px 0; }

    .fatto-hero { min-height: auto; align-items: flex-start; padding: 56px 22px 68px; }
    .fatto-hero-inner { padding: 0 0 0 22px; }
    .fatto-hero-title { max-width: none; font-size: clamp(29px, 8vw, 33px); line-height: .96; }
    .fatto-hero-line-main { margin-top: .13em; }
    .fatto-hero-line-muted > span { white-space: nowrap; }
    .fatto-hero-support { max-width: 310px; margin-top: 14px; font-size: 16px; line-height: 1.35; }
    .fatto-hero-signal { top: 4px; left: -16px; width: 14px; height: 126px; }
    .fatto-hero-signal-line { top: 0; left: 50%; width: 1px; height: 100%; background: linear-gradient(180deg, transparent 0%, rgba(255, 29, 67, .42) 14%, var(--accent) 28%, var(--accent) 72%, rgba(255, 29, 67, .42) 86%, transparent 100%); transform: scaleY(0); transform-origin: top; }
    .fatto-hero-signal-dot { top: 50%; left: 50%; width: 8px; height: 8px; transform: translate(-50%, -50%); }
    .fatto-hero-signal-dot-one { top: 26%; left: 50%; }
    .fatto-hero-signal-dot-two { top: 74%; right: auto; left: 50%; }
    .fatto-hero-signal-dot-three, .fatto-hero-signal-dot-four { display: none; }
    .is-ready .fatto-hero-signal-line { transform: scaleY(1); }

    .fatto-section { gap: 30px; padding: 58px 22px; }
    .fatto-section-heading { display: block; }
    .fatto-section-index { display: none; }
    .fatto-section-heading h2 { font-size: 29px; font-weight: 540; white-space: normal; }
    .fatto-section-heading div > p { margin-top: 7px; font-size: 16px; white-space: normal; }

    .fatto-alvi-card { display: flex; min-height: 570px; flex-direction: column; border-radius: 14px; }
    .fatto-alvi-copy { min-height: 350px; padding: 26px; }
    .fatto-status { font-size: 12px; }
    .fatto-alvi-logo { top: 26px; right: 26px; height: 26px; }
    .fatto-alvi-message { margin: 38px 0 30px; }
    .fatto-alvi-message h3 { font-size: clamp(32px, 9vw, 38px); line-height: .94; }
    .fatto-alvi-message p { margin-top: 24px; font-size: 14px; letter-spacing: -.04em; white-space: normal; }
    .fatto-alvi-link { margin-top: auto; font-size: 16px; }
    .fatto-alvi-visual { min-height: 220px; }
    .fatto-alvi-mark-shell { top: 57%; left: 50%; width: min(38%, 164px); }
    .fatto-route-one { top: -6%; right: 2%; width: 84%; }
    .fatto-route-two { top: 13%; right: 26%; width: 64%; }
    .fatto-route-three { right: -8%; bottom: -54%; width: 55%; }

    .fatto-beliefs { gap: 28px; padding: 58px 22px 64px; }
    .fatto-beliefs-list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-left: 0; }
    .fatto-beliefs-list li { min-height: 178px; gap: 15px; padding: 17px; border-radius: 14px; }
    .fatto-beliefs-list li > span { padding-top: 0; color: var(--quiet); font-size: 11px; }
    .fatto-beliefs-list p { margin: 15px 0 0; font-size: clamp(18px, 5vw, 21px); line-height: 1.18; letter-spacing: -.045em; }

    .fatto-footer { grid-template-columns: minmax(0, 1fr) auto; gap: 16px; padding: 30px 28px; }
    .fatto-footer p { font-size: 12px; }
    .fatto-copyright { white-space: nowrap; }
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 1ms !important; animation-duration: 1ms !important; }
    [data-reveal], [data-reveal].is-visible, .fatto-hero-line > span, .fatto-hero-line > strong, .fatto-hero-support { opacity: 1; transform: none; filter: none; }
    .fatto-hero-signal-line { transform: scaleY(1); }
  }

  @media (max-width: 620px) and (prefers-reduced-motion: reduce) {
    .fatto-hero-signal-line { transform: scaleY(1); }
  }
`
