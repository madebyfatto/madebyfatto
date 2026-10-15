import { useEffect, useState } from "react"
import alviLogo from "./assets/alvi-logo-negative.png"
import alviMark from "./assets/alvi-mark.png"
import fattoLogo from "./assets/fatto-logo.png"

type AnalyticsConsent = "granted" | "denied"
type Gtag = (...args: unknown[]) => void
type Clarity = (...args: unknown[]) => void

// Replace these placeholder values with the production identifiers before publishing.
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"
const CLARITY_PROJECT_ID = "XXXXXXXXXX"
const CONSENT_STORAGE_KEY = "fatto-analytics-consent"
const COOKIE_PREFERENCES_STORAGE_KEY = "fatto-cookie-preferences"

type CookiePreferences = {
  analytics: boolean
  marketing: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: Gtag
    clarity?: Clarity & { q?: unknown[][] }
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

let googleAnalyticsLoaded = false
let clarityLoaded = false

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined"
}

function getStoredConsent(): AnalyticsConsent | null {
  if (!isBrowser()) return null

  try {
    const consent = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return consent === "granted" || consent === "denied" ? consent : null
  } catch {
    return null
  }
}

function saveConsent(consent: AnalyticsConsent) {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, consent)
  } catch {
    // The page remains fully usable when browser storage is unavailable.
  }
}

function getStoredCookiePreferences(): CookiePreferences {
  const fallback = { analytics: getStoredConsent() === "granted", marketing: false }
  if (!isBrowser()) return fallback

  try {
    const stored = window.localStorage.getItem(COOKIE_PREFERENCES_STORAGE_KEY)
    if (!stored) return fallback

    const preferences = JSON.parse(stored) as Partial<CookiePreferences>
    if (typeof preferences.analytics !== "boolean" || typeof preferences.marketing !== "boolean") return fallback
    return { analytics: preferences.analytics, marketing: preferences.marketing }
  } catch {
    return fallback
  }
}

function saveCookiePreferences(preferences: CookiePreferences) {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(COOKIE_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // The page remains fully usable when browser storage is unavailable.
  }
}

function hasConfiguredGoogleAnalyticsId() {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX"
}

function hasConfiguredClarityId() {
  return CLARITY_PROJECT_ID !== "XXXXXXXXXX" && CLARITY_PROJECT_ID.trim().length > 0
}

function getGtag(): Gtag {
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args))
  return window.gtag
}

function getClarity(): Clarity {
  window.clarity = window.clarity || Object.assign(
    (...args: unknown[]) => window.clarity?.q?.push(args),
    { q: [] as unknown[][] },
  )
  return window.clarity!
}

function appendScript(id: string, source: string) {
  if (document.getElementById(id)) return

  const script = document.createElement("script")
  script.id = id
  script.async = true
  script.src = source
  document.head.appendChild(script)
}

function applyAnalyticsConsent(consent: AnalyticsConsent) {
  if (!isBrowser()) return

  if (consent === "granted") {
    if (hasConfiguredGoogleAnalyticsId()) {
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = false
      const gtag = getGtag()

      if (!googleAnalyticsLoaded) {
        gtag("js", new Date())
        gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true, send_page_view: true })
        appendScript("fatto-google-analytics", `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`)
        googleAnalyticsLoaded = true
      }

      gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
      })
    }

    if (hasConfiguredClarityId()) {
      const clarity = getClarity()
      clarity("consent")

      if (!clarityLoaded) {
        appendScript("fatto-microsoft-clarity", `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`)
        clarityLoaded = true
      }
    }

    return
  }

  if (hasConfiguredGoogleAnalyticsId()) {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true
    window.gtag?.("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    })
  }

  if (clarityLoaded) window.clarity?.("consent", false)
}

function trackAnalyticsEvent(eventName: "click_alvi" | "navigation_products" | "navigation_vision") {
  if (!isBrowser() || !googleAnalyticsLoaded || !hasConfiguredGoogleAnalyticsId()) return
  window.gtag?.("event", eventName)
}

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
    consent: {
      settings: "Preferências de cookies", dialog: "Preferências de cookies", preferencesIntro: "Escolha quais cookies deseja permitir. Os necessários ficam sempre ativos para que o site funcione.", requiredTitle: "Cookies necessários", requiredDescription: "Sessão, segurança e suas preferências. Sempre ativos.", analyticsTitle: "Cookies de análise", analyticsDescription: "Ajudam a entender como o site é utilizado.", marketingTitle: "Cookies de marketing", marketingDescription: "Medem o desempenho de campanhas.", back: "Voltar", save: "Salvar preferências", message: "Usamos cookies necessários para o site funcionar e, se você permitir, cookies de análise para entender como ele é utilizado e melhorar sua experiência. Você pode mudar sua escolha quando quiser.", customize: "Personalizar", reject: "Rejeitar não necessários", accept: "Aceitar todos",
    },
  },
  "en-US": {
    navigation: { products: "Products", vision: "Vision", openMenu: "Open menu", closeMenu: "Close menu" },
    hero: { future: "The future isn’t predictable.", built: "It’s built.", support: "Technology that turns intention into progress." },
    products: { title: "Products", support: "What we’re building.", status: "In the works", plan: "Plan.", adjust: "Adjust.", continue: "Continue.", description: "Finances that keep up with real life.", cta: "Meet Alvi" },
    beliefs: [
      { title: "Autonomy.", text: "We build for greater clarity and freedom to choose and act." },
      { title: "Consistency.", text: "We believe in progress that happens gradually and endures." },
      { title: "Long term.", text: "We build solutions that remain useful after the novelty wears off." },
      { title: "Real impact.", text: "We simplify everyday life to make room for what matters." },
    ],
    vision: { title: "What we believe", support: "What sustains every product." },
    footer: "Technology for what comes next.",
    consent: {
      settings: "Cookie preferences", dialog: "Cookie preferences", preferencesIntro: "Choose which cookies you want to allow. Essential cookies always stay active so the site can work.", requiredTitle: "Essential cookies", requiredDescription: "Session, security and your preferences. Always active.", analyticsTitle: "Analytics cookies", analyticsDescription: "Help us understand how the site is used.", marketingTitle: "Marketing cookies", marketingDescription: "Measure campaign performance.", back: "Back", save: "Save preferences", message: "We use essential cookies to keep the site working and, with your permission, analytics cookies to understand how it is used and improve your experience. You can change your choice at any time.", customize: "Customize", reject: "Reject non-essential", accept: "Accept all",
    },
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
    consent: {
      settings: "Preferencias de cookies", dialog: "Preferencias de cookies", preferencesIntro: "Elige qué cookies quieres permitir. Las necesarias siempre permanecen activas para que el sitio funcione.", requiredTitle: "Cookies necesarias", requiredDescription: "Sesión, seguridad y tus preferencias. Siempre activas.", analyticsTitle: "Cookies de análisis", analyticsDescription: "Ayudan a entender cómo se utiliza el sitio.", marketingTitle: "Cookies de marketing", marketingDescription: "Miden el rendimiento de las campañas.", back: "Volver", save: "Guardar preferencias", message: "Usamos cookies necesarias para que el sitio funcione y, si lo permites, cookies de análisis para entender cómo se utiliza y mejorar tu experiencia. Puedes cambiar tu elección cuando quieras.", customize: "Personalizar", reject: "Rechazar no necesarias", accept: "Aceptar todas",
    },
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
    consent: {
      settings: "Préférences de cookies", dialog: "Préférences de cookies", preferencesIntro: "Choisissez les cookies que vous souhaitez autoriser. Les cookies nécessaires restent toujours actifs pour le bon fonctionnement du site.", requiredTitle: "Cookies nécessaires", requiredDescription: "Session, sécurité et vos préférences. Toujours actifs.", analyticsTitle: "Cookies d’analyse", analyticsDescription: "Ils nous aident à comprendre comment le site est utilisé.", marketingTitle: "Cookies marketing", marketingDescription: "Ils mesurent les performances des campagnes.", back: "Retour", save: "Enregistrer les préférences", message: "Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies d’analyse pour comprendre son utilisation et améliorer votre expérience. Vous pouvez modifier votre choix à tout moment.", customize: "Personnaliser", reject: "Refuser les non essentiels", accept: "Tout accepter",
    },
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
    consent: {
      settings: "Preferenze sui cookie", dialog: "Preferenze sui cookie", preferencesIntro: "Scegli quali cookie desideri consentire. Quelli necessari restano sempre attivi per il funzionamento del sito.", requiredTitle: "Cookie necessari", requiredDescription: "Sessione, sicurezza e le tue preferenze. Sempre attivi.", analyticsTitle: "Cookie analitici", analyticsDescription: "Ci aiutano a capire come viene utilizzato il sito.", marketingTitle: "Cookie di marketing", marketingDescription: "Misurano le prestazioni delle campagne.", back: "Indietro", save: "Salva preferenze", message: "Utilizziamo i cookie necessari per il funzionamento del sito e, con il tuo consenso, i cookie analitici per capire come viene utilizzato e migliorare la tua esperienza. Puoi modificare la tua scelta in qualsiasi momento.", customize: "Personalizza", reject: "Rifiuta i non necessari", accept: "Accetta tutti",
    },
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
  const [analyticsConsent, setAnalyticsConsent] = useState<AnalyticsConsent | null>(() => getStoredConsent())
  const [consentBannerOpen, setConsentBannerOpen] = useState(() => getStoredConsent() === null)
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(() => getStoredConsent() !== null)
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(() => getStoredCookiePreferences())
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

  useEffect(() => {
    if (analyticsConsent) applyAnalyticsConsent(analyticsConsent)
  }, [analyticsConsent])

  const closeMenu = () => {
    setMenuOpen(false)
    setLanguageOpen(false)
  }
  const updateCookiePreferences = (preferences: CookiePreferences, reopenInPreferences = false) => {
    const consent: AnalyticsConsent = preferences.analytics ? "granted" : "denied"
    saveConsent(consent)
    saveCookiePreferences(preferences)
    setAnalyticsConsent(consent)
    setCookiePreferences(preferences)
    setCookiePreferencesOpen(reopenInPreferences)
    setConsentBannerOpen(false)
  }
  const openCookiePreferences = () => {
    setCookiePreferences(getStoredCookiePreferences())
    setCookiePreferencesOpen(true)
    setConsentBannerOpen(true)
  }
  const selectLocale = (locale: SiteLocale) => {
    const scrollPosition = window.scrollY
    setSiteLocale(locale)
    setLanguageOpen(false)
    closeMenu()

    window.requestAnimationFrame(() => window.scrollTo(0, scrollPosition))
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
        <div className="fatto-header-inner">
          <a className="fatto-header-logo" href="#inicio" aria-label={siteLocale === "en-US" ? "Fatto home" : "Fatto — início"}>
            <img src={fattoLogo} alt="Fatto" />
          </a>

          <nav className="fatto-desktop-nav" aria-label={siteLocale === "en-US" ? "Main navigation" : "Navegação principal"}>
            <a href="#produtos" onClick={() => trackAnalyticsEvent("navigation_products")}>{copy.navigation.products}</a>
            <a href="#visao" onClick={() => trackAnalyticsEvent("navigation_vision")}>{copy.navigation.vision}</a>
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
            <a href="#produtos" onClick={() => { trackAnalyticsEvent("navigation_products"); closeMenu() }}>{copy.navigation.products}</a>
            <a href="#visao" onClick={() => { trackAnalyticsEvent("navigation_vision"); closeMenu() }}>{copy.navigation.vision}</a>
            <LanguagePicker mobile />
          </nav>
        </div>
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
              <a className="fatto-alvi-link" href="#alvi" onClick={(event) => { event.preventDefault(); trackAnalyticsEvent("click_alvi") }}>
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
        <div className="fatto-footer-inner">
          <div className="fatto-footer-company">
            <p>Fatto Tecnologia Ltda.</p>
            <p>{copy.footer}</p>
          </div>
          <p className="fatto-copyright">© 2026</p>
        </div>
      </footer>

      {!consentBannerOpen && (
        <button className="fatto-privacy-settings" type="button" onClick={openCookiePreferences}>
          {copy.consent.settings}
        </button>
      )}

      {consentBannerOpen ? (
        <section className="fatto-consent-banner" role="dialog" aria-label={copy.consent.dialog} aria-modal="false">
          {cookiePreferencesOpen ? (
            <>
              <div className="fatto-consent-copy">
                <p>{copy.consent.preferencesIntro}</p>
              </div>
              <div className="fatto-cookie-options">
                <label className="fatto-cookie-option is-required">
                  <input type="checkbox" checked disabled />
                  <span>
                    <strong>{copy.consent.requiredTitle}</strong>
                    <small>{copy.consent.requiredDescription}</small>
                  </span>
                </label>
                <label className="fatto-cookie-option">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={(event) => setCookiePreferences((preferences) => ({ ...preferences, analytics: event.target.checked }))}
                  />
                  <span>
                    <strong>{copy.consent.analyticsTitle}</strong>
                    <small>{copy.consent.analyticsDescription}</small>
                  </span>
                </label>
                <label className="fatto-cookie-option">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={(event) => setCookiePreferences((preferences) => ({ ...preferences, marketing: event.target.checked }))}
                  />
                  <span>
                    <strong>{copy.consent.marketingTitle}</strong>
                    <small>{copy.consent.marketingDescription}</small>
                  </span>
                </label>
              </div>
              <div className="fatto-consent-actions is-preferences">
                <button className="fatto-consent-decline" type="button" onClick={() => setCookiePreferencesOpen(false)}>{copy.consent.back}</button>
                <button className="fatto-consent-accept" type="button" onClick={() => updateCookiePreferences(cookiePreferences, true)}>{copy.consent.save}</button>
              </div>
            </>
          ) : (
            <>
              <div className="fatto-consent-copy">
                <p>{copy.consent.message}</p>
              </div>
              <div className="fatto-consent-actions">
                <button className="fatto-consent-decline" type="button" onClick={openCookiePreferences}>{copy.consent.customize}</button>
                <button className="fatto-consent-decline" type="button" onClick={() => updateCookiePreferences({ analytics: false, marketing: false })}>{copy.consent.reject}</button>
                <button className="fatto-consent-accept" type="button" onClick={() => updateCookiePreferences({ analytics: true, marketing: true })}>{copy.consent.accept}</button>
              </div>
            </>
          )}
        </section>
      ) : null}
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
    overflow-anchor: none;
    background: var(--bg);
    color: var(--text);
    font-family: "Albert Sans", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .fatto-site a { color: inherit; text-decoration: none; }

  .fatto-header {
    position: sticky;
    z-index: 20;
    top: 0;
    height: 76px;
    padding: 0;
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 95%, transparent);
    backdrop-filter: blur(16px);
  }

  .fatto-header-inner { display: flex; width: min(calc(100% - 48px), 1280px); height: 100%; align-items: center; justify-content: space-between; margin: 0 auto; }

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

  .fatto-language-picker { position: relative; z-index: 30; }
  .fatto-language-trigger { display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; border: 0; background: transparent; color: var(--muted); font: inherit; font-size: inherit; font-weight: inherit; letter-spacing: inherit; cursor: pointer; transition: color 180ms ease; }
  .fatto-language-trigger:hover, .fatto-language-trigger:focus-visible, .fatto-language-picker.is-open .fatto-language-trigger { color: #ff7892; }
  .fatto-language-chevron { width: 6px; height: 6px; margin-top: -3px; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg); transition: transform 180ms ease; }
  .fatto-language-picker.is-open .fatto-language-chevron { margin-top: 3px; transform: rotate(225deg); }
  .fatto-language-options { position: absolute; top: calc(100% + 10px); right: -12px; display: grid; width: 156px; padding: 6px; border: 1px solid #2a292c; border-radius: 10px; background: #141414; box-shadow: 0 18px 38px rgba(0, 0, 0, .32); opacity: 0; pointer-events: none; transform: translateY(-5px); transition: opacity 180ms ease, transform 180ms ease; }
  .fatto-language-options { position: absolute; top: calc(100% + 10px); right: -16px; display: grid; width: 172px; padding: 8px; border: 1px solid #2a292c; border-radius: 10px; background: #141414; box-shadow: 0 18px 38px rgba(0, 0, 0, .32); opacity: 0; pointer-events: none; transform: translateY(-5px); transition: opacity 180ms ease, transform 180ms ease; }
  .fatto-language-picker.is-open .fatto-language-options { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .fatto-language-options button { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 9px 10px 9px 24px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; letter-spacing: -.01em; text-align: left; cursor: pointer; transition: color 160ms ease, background 160ms ease; }
  .fatto-language-options button::before { position: absolute; top: 50%; left: 10px; width: 6px; height: 6px; border-radius: 99px; background: var(--accent); content: ""; opacity: 0; transform: translateY(-50%) scale(0); transition: opacity 160ms ease, transform 160ms ease; }
  .fatto-language-options button { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%; padding: 10px 16px 10px 30px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; letter-spacing: -.01em; text-align: left; cursor: pointer; transition: color 160ms ease, background 160ms ease; }
  .fatto-language-options button::before { position: absolute; top: 50%; left: 14px; width: 6px; height: 6px; border-radius: 99px; background: var(--accent); content: ""; opacity: 0; transform: translateY(-50%) scale(0); transition: opacity 160ms ease, transform 160ms ease; }
  .fatto-language-options button > span:last-child { color: var(--quiet); font-size: 10px; font-weight: 520; letter-spacing: .06em; }
  .fatto-language-options button:hover, .fatto-language-options button:focus-visible { background: #202024; color: var(--accent-soft); }
  .fatto-language-options button:hover::before, .fatto-language-options button:focus-visible::before, .fatto-language-options button.is-active::before { opacity: 1; transform: translateY(-50%) scale(1); }
  .fatto-language-options button.is-active { color: var(--accent-soft); }

  .fatto-menu-button, .fatto-mobile-nav { display: none; }

  .fatto-hero {
    position: relative;
    display: flex;
    min-height: min(760px, calc(100svh - 76px));
    align-items: center;
    padding: clamp(72px, 10vw, 164px) clamp(24px, 12vw, 252px) clamp(84px, 9vw, 148px);
    border-bottom: 1px solid var(--line);
    overflow: hidden;
    padding: clamp(72px, 10vw, 164px) clamp(24px, 12vw, 252px) clamp(56px, 6.5vw, 104px);
    background: var(--bg);
  }

  .fatto-hero::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 86% 116% at 106% 17%, rgba(255, 91, 126, .38) 0%, rgba(214, 35, 76, .22) 30%, rgba(125, 18, 45, .09) 54%, transparent 79%),
      radial-gradient(ellipse 64% 62% at 100% 106%, rgba(255, 91, 126, .32) 0%, rgba(214, 35, 76, .17) 43%, rgba(125, 18, 45, .08) 64%, transparent 80%),
      linear-gradient(148deg, transparent 40%, rgba(207, 35, 76, .13) 65%, rgba(173, 27, 64, .14) 100%),
      linear-gradient(180deg, transparent 34%, var(--bg) 94%);
    content: "";
    pointer-events: none;
  }
  .fatto-hero::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: radial-gradient(rgba(255, 220, 228, .28) .45px, transparent .7px);
    background-size: 5px 5px;
    content: "";
    opacity: .13;
    pointer-events: none;
    -webkit-mask-image: radial-gradient(ellipse 82% 106% at 106% 18%, #000 0%, transparent 78%);
    mask-image: radial-gradient(ellipse 82% 106% at 106% 18%, #000 0%, transparent 78%);
  }

  .fatto-hero-inner { position: relative; width: min(100%, 1260px); }
  .fatto-hero-inner { position: relative; z-index: 1; width: min(100%, 1260px); }
  .fatto-hero-title {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0;
    font-size: clamp(52px, 6.75vw, 116px);
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
    background: linear-gradient(90deg, #fff0f3 0%, #ff9cb1 20%, #ff5f82 42%, #ff315c 62%, #f51d4c 80%, #d90b3d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .fatto-hero-line-main { margin-top: 0.06em; color: var(--text); }
  .fatto-hero-line-main strong {
    font-weight: 600;
    background: linear-gradient(90deg, #d7d3d4 0%, #f4f1ec 22%, #f4f1ec 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    color: var(--text);
  }
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
  .fatto-products {
    padding-top: clamp(72px, 7vw, 112px);
  }

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
  .fatto-status { display: inline-flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid rgba(255, 171, 189, .20); border-radius: 999px; background: rgba(255, 255, 255, .045); box-shadow: 0 4px 12px rgba(0, 0, 0, .18); color: #f0e9eb; font-size: 13px; font-weight: 400; white-space: nowrap; }
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
  .fatto-beliefs-list p { margin: 10px 0 0; color: var(--muted); font-size: clamp(20px, 1.75vw, 29px); font-weight: 500; letter-spacing: -0.055em; line-height: 1.12; }
  .fatto-beliefs-list strong { color: var(--text); font-weight: 650; }

  .fatto-footer { border-top: 1px solid var(--line); }
  .fatto-footer-inner { display: grid; grid-template-columns: 1fr auto; width: min(calc(100% - 48px), 1280px); align-items: center; gap: 24px; margin: 0 auto; padding: 32px 0; }
  .fatto-footer-company { display: grid; gap: 5px; justify-self: start; }
  .fatto-footer p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.35; }
  .fatto-footer-company p:first-child { color: var(--text); }
  .fatto-copyright { justify-self: end; color: var(--quiet) !important; }

  .fatto-privacy-settings { position: fixed; z-index: 50; right: 20px; bottom: 20px; padding: 8px 11px; border: 1px solid #2a292c; border-radius: 999px; background: rgba(20, 20, 20, .92); color: var(--muted); font: inherit; font-size: 11px; letter-spacing: -.01em; cursor: pointer; backdrop-filter: blur(12px); transition: border-color 180ms ease, color 180ms ease, background 180ms ease; }
  .fatto-privacy-settings:hover, .fatto-privacy-settings:focus-visible { border-color: #4a474d; background: #1a1a1a; color: var(--text); }
  .fatto-consent-banner { position: fixed; z-index: 51; right: 24px; bottom: 24px; display: grid; width: min(440px, calc(100vw - 48px)); gap: 14px; padding: 22px; border: 1px solid #302e32; border-radius: 20px; background: rgba(20, 20, 20, .98); box-shadow: 0 22px 56px rgba(0, 0, 0, .38); backdrop-filter: blur(18px); }
  .fatto-consent-copy p { margin: 0; color: #b7b4b8; font-size: 15px; line-height: 1.48; letter-spacing: -.025em; }
  .fatto-consent-actions { display: grid; grid-template-columns: 1fr; gap: 8px; }
  .fatto-consent-actions button { min-height: 46px; padding: 10px 16px; border-radius: 11px; font: inherit; font-size: 13px; font-weight: 400; white-space: nowrap; cursor: pointer; transition: background 180ms ease, border-color 180ms ease, color 180ms ease; }
  .fatto-consent-actions.is-preferences { grid-template-columns: 1fr; }
  .fatto-consent-accept { border: 1px solid var(--accent); background: var(--accent); color: #fff; font-weight: 600 !important; }
  .fatto-consent-accept:hover, .fatto-consent-accept:focus-visible { background: #f70f39; border-color: #f70f39; }
  .fatto-consent-decline { border: 1px solid #343236; background: transparent; color: var(--muted); }
  .fatto-consent-actions .fatto-consent-decline { border: 1px solid #343236; background: transparent; color: var(--muted); font-weight: 400; }
  .fatto-consent-decline:hover, .fatto-consent-decline:focus-visible { border-color: #5b575d; color: var(--text); }
  .fatto-cookie-options { display: grid; gap: 8px; }
  .fatto-cookie-option { display: grid; grid-template-columns: 20px minmax(0, 1fr); align-items: start; gap: 12px; padding: 13px 14px; border: 1px solid #302e32; border-radius: 14px; background: #171717; cursor: pointer; transition: border-color 180ms ease, background 180ms ease; }
  .fatto-cookie-option:hover { border-color: #4e4950; background: #1b1b1b; }
  .fatto-cookie-option.is-required { cursor: default; opacity: .72; }
  .fatto-cookie-option.is-required:hover { border-color: #302e32; background: #171717; }
  .fatto-cookie-option input { width: 18px; height: 18px; margin: 1px 0 0; accent-color: var(--accent); cursor: pointer; }
  .fatto-cookie-option input:disabled { cursor: default; }
  .fatto-cookie-option > span { display: grid; gap: 3px; }
  .fatto-cookie-option strong { color: var(--text); font-size: 14px; font-weight: 540; letter-spacing: -.02em; }
  .fatto-cookie-option small { color: var(--muted); font-size: 12px; line-height: 1.35; letter-spacing: -.015em; }

  @media (max-width: 900px) {
    .fatto-hero { min-height: 660px; padding-inline: clamp(32px, 8vw, 80px); }
    .fatto-section { grid-template-columns: 1fr; gap: 54px; padding-inline: clamp(32px, 8vw, 80px); }
    .fatto-section-heading { max-width: 480px; }
    .fatto-alvi-card { grid-template-columns: minmax(0, 1.05fr) minmax(260px, .75fr); min-height: 560px; }
    .fatto-beliefs-list { margin-left: 0; }
  }

  @media (max-width: 620px) {
    .fatto-header { height: 68px; }
    .fatto-header-inner { width: 100%; padding: 0 22px; }
    .fatto-header-logo img { height: 21px; }
    .fatto-desktop-nav { display: none; }

    .fatto-menu-button { display: grid; width: 42px; height: 42px; padding: 10px 7px; border: 0; background: transparent; cursor: pointer; place-content: center; gap: 5px; }
    .fatto-menu-button span { display: block; width: 22px; height: 1px; background: var(--text); transition: width 180ms ease, transform 220ms ease, opacity 180ms ease; }
    .fatto-menu-button span:nth-child(3) { width: 15px; justify-self: end; }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
    .fatto-menu-button[aria-expanded="true"] span:nth-child(3) { width: 22px; justify-self: center; transform: translateY(-6px) rotate(-45deg); }

    .fatto-mobile-nav { position: absolute; z-index: 1; top: 67px; right: 0; left: 0; display: grid; gap: 6px; max-height: 0; padding: 0 28px; overflow: hidden; border-bottom: 1px solid transparent; background: #0d0d0d; opacity: 0; transition: max-height 260ms ease, padding 260ms ease, opacity 180ms ease, border-color 260ms ease; }
    .fatto-mobile-nav.is-open { max-height: 420px; padding-block: 18px 22px; border-color: var(--line); opacity: 1; }
    .fatto-mobile-nav a { position: relative; padding: 10px 0 10px 16px; color: var(--muted); font-size: 18px; }
    .fatto-mobile-nav a::before { position: absolute; top: 50%; left: 0; width: 6px; height: 6px; border-radius: 99px; background: var(--accent); content: ""; opacity: 0; transform: translateY(-50%) scale(0); transition: opacity 180ms ease, transform 180ms ease; }
    .fatto-mobile-nav a:hover::before, .fatto-mobile-nav a:focus-visible::before { opacity: 1; transform: translateY(-50%) scale(1); }
    .fatto-language-picker.is-mobile { width: 100%; margin: 0; padding: 10px 0 0 16px; }
    .fatto-language-picker.is-mobile .fatto-language-trigger { font-size: 18px; font-weight: 400; letter-spacing: normal; }
    .fatto-language-picker.is-mobile .fatto-language-options { position: static; width: 100%; max-height: 0; margin-top: 0; padding: 0; overflow: hidden; border: 0; border-radius: 0; background: transparent; box-shadow: none; opacity: 0; transform: none; transition: max-height 220ms ease, margin 220ms ease, opacity 180ms ease; }
    .fatto-language-picker.is-mobile .fatto-language-options { position: static; width: calc(100% + 12px); max-height: 0; margin-top: 0; margin-left: -12px; padding: 0; overflow: hidden; border: 0; border-radius: 0; background: transparent; box-shadow: none; opacity: 0; transform: none; transition: max-height 220ms ease, margin 220ms ease, opacity 180ms ease; }
    .fatto-language-picker.is-mobile.is-open .fatto-language-options { max-height: 240px; margin-top: 8px; opacity: 1; }
    .fatto-language-picker.is-mobile .fatto-language-options button { padding: 8px 0 8px 16px; }
    .fatto-language-picker.is-mobile .fatto-language-options button::before { left: 0; }
    .fatto-language-picker.is-mobile .fatto-language-options button { padding: 9px 18px 9px 28px; }
    .fatto-language-picker.is-mobile .fatto-language-options button::before { left: 12px; }
    .fatto-privacy-settings { right: 14px; bottom: 14px; }
    .fatto-consent-banner { right: 14px; bottom: 14px; left: 14px; width: auto; gap: 18px; padding: 20px; }
    .fatto-consent-copy p { font-size: 14px; }
    .fatto-consent-actions { display: grid; grid-template-columns: 1fr; }
    .fatto-consent-actions.is-preferences { grid-template-columns: 1fr; }
    .fatto-consent-actions button { width: 100%; }

    /* Mobile keeps the original hard transition: hero gradient, then solid black Products. */
    .fatto-hero { min-height: auto; align-items: flex-start; padding: 42px 22px; border-bottom: 0 !important; background: var(--bg); }
    .fatto-hero::before {
      display: block;
      background:
        radial-gradient(ellipse 150% 120% at 108% 18%, rgba(255, 91, 126, .32) 0%, rgba(214, 35, 76, .18) 30%, rgba(125, 18, 45, .07) 54%, transparent 79%),
        radial-gradient(ellipse 88% 58% at 100% 108%, rgba(255, 91, 126, .27) 0%, rgba(214, 35, 76, .14) 43%, rgba(125, 18, 45, .06) 64%, transparent 80%),
        linear-gradient(150deg, transparent 42%, rgba(207, 35, 76, .10) 67%, rgba(173, 27, 64, .12) 100%),
        linear-gradient(180deg, transparent 36%, #4a1726 100%);
    }
    .fatto-hero::after { display: block; opacity: .11; }
    .fatto-hero-inner { padding: 0 0 0 22px; }
    .fatto-hero-title { max-width: none; font-size: clamp(27px, 7.5vw, 30px); line-height: .96; }
    .fatto-hero-line-main { margin-top: .13em; }
    .fatto-hero-line-muted > span { white-space: normal; }
    .fatto-hero-support { max-width: 310px; margin-top: 12px; font-size: 16px; line-height: 1.35; }
    .fatto-hero-signal { top: 0; left: -16px; width: 14px; height: 110px; }
    .fatto-hero-signal-line { top: 0; left: 50%; width: 1px; height: 100%; background: linear-gradient(180deg, rgba(255, 29, 67, .42) 0%, var(--accent) 16%, var(--accent) 72%, rgba(255, 29, 67, .42) 86%, transparent 100%); transform: scaleY(0); transform-origin: top; }
    .fatto-hero-signal-dot { top: 50%; left: 50%; width: 8px; height: 8px; transform: translate(-50%, -50%); }
    .fatto-hero-signal-dot-one { top: 26%; left: 50%; }
    .fatto-hero-signal-dot-two { top: 74%; right: auto; left: 50%; }
    .fatto-hero-signal-dot-three, .fatto-hero-signal-dot-four { display: none; }
    .is-ready .fatto-hero-signal-line { transform: scaleY(1); }

    .fatto-section { gap: 30px; padding: 58px 22px; }
    .fatto-products { margin-top: 0; padding-top: 50px; border-top: 0 !important; box-shadow: none; background: var(--bg); }
    .fatto-section-heading { display: block; }
    .fatto-section-index { display: none; }
    .fatto-section-heading h2 { font-size: 29px; font-weight: 540; white-space: normal; }
    .fatto-section-heading div > p { margin-top: 7px; font-size: 16px; white-space: normal; }

    .fatto-alvi-card { display: flex; min-height: 570px; flex-direction: column; border-radius: 14px; }
    .fatto-alvi-copy { min-height: 350px; padding: 26px; }
    .fatto-status { font-size: 13px; }
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
    .fatto-beliefs-list p { margin: 15px 0 0; font-size: clamp(18px, 5vw, 21px); font-weight: 500; line-height: 1.18; letter-spacing: -.045em; }

    .fatto-footer-inner { grid-template-columns: minmax(0, 1fr) auto; width: 100%; gap: 16px; padding: 30px 28px; }
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
