import { lazy, Suspense, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Files,
  Home,
  KeyRound,
  LandPlot,
  Mail,
  MapPin,
  Menu,
  Mic,
  Phone,
  Ruler,
  X,
} from 'lucide-react'
import InquiryForm from './components/InquiryForm'
import heroImage from './assets/real-estate-hero.jpg'
import './App.css'

const VoiceAgent = lazy(() => import('./components/VoiceAgent'))

const services = [
  { Icon: Home, title: 'Houses for Sale', text: 'Ready-to-move homes across Al-Kabeer Town.' },
  { Icon: KeyRound, title: 'Buy a Property', text: 'We find the right house at the right price.' },
  { Icon: Building2, title: 'Rented Houses', text: 'Verified rental homes for families.' },
  { Icon: LandPlot, title: 'Open Land', text: 'Plots without construction, ready to build.' },
  { Icon: Ruler, title: 'Commercial', text: 'Shops and commercial plots on main boulevards.' },
  { Icon: Files, title: 'File Merging', text: 'Merge files of Al-Kabeer Phase 2 and other projects.' },
]

const plots = [
  { size: '2 Marla', note: 'Compact and affordable' },
  { size: '3 Marla', note: 'A perfect family start' },
  { size: '5 Marla', note: 'Our most popular choice' },
  { size: 'Commercial', note: 'A promising business opportunity' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <section className="hero" id="home">
        <img className="hero__image" src={heroImage} alt="Homes and tree-lined streets in Al-Kabeer Town" />
        <div className="hero__overlay" />
        <header className="site-header">
          <div className="container site-header__inner">
            <a className="brand" href="#home" onClick={closeMenu} aria-label="KS Big Real Estate home">
              <span className="brand__mark">KS</span>
              <span>KS Big Real Estate</span>
            </a>
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main navigation">
              <a href="#services" onClick={closeMenu}>Services</a>
              <a href="#plots" onClick={closeMenu}>Plots</a>
              <a href="#agent" onClick={closeMenu}>AI Agent</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </nav>
          </div>
        </header>

        <div className="container hero__content">
          <span className="location-pill">
            <MapPin size={16} aria-hidden="true" />
            Al-Kabeer Town Phase 2, Lahore
          </span>
          <h1>Your trusted partner for <span>homes &amp; plots</span></h1>
          <p>
            Sale, purchase and rentals of houses, 2, 3 and 5 marla plots, commercial
            land and file merging — all under one roof.
          </p>
          <div className="hero__actions">
            <a className="button button--lime" href="#inquiry">
              Contact Us <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button button--outline" href="#agent">
              <Mic size={17} aria-hidden="true" /> Talk to AI Agent
            </a>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <p className="eyebrow">What we offer</p>
          <h2 className="section-title">Complete real estate services</h2>
          <div className="service-grid">
            {services.map(({ Icon, title, text }) => (
              <article className="service-card" key={title}>
                <span className="service-card__icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section plots-section" id="plots">
        <div className="container">
          <p className="eyebrow eyebrow--light">Find your place</p>
          <h2 className="section-title">Plots &amp; land available</h2>
          <p className="section-intro">
            Land without construction and commercial plots in Al-Kabeer Town Phase 2.
          </p>
          <div className="plot-grid">
            {plots.map((plot) => (
              <article className="plot-card" key={plot.size}>
                <h3>{plot.size}</h3>
                <p>{plot.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section agent-section" id="agent">
        <div className="container agent-layout">
          <div className="agent-copy">
            <p className="eyebrow">24/7 assistant</p>
            <h2 className="section-title">Speak with our <span>AI voice agent</span></h2>
            <p className="section-intro">
              Ask about available houses, plot prices, rentals or file merging — in Urdu
              or English, any time.
            </p>
          </div>
          <Suspense fallback={<div className="voice-card voice-card--loading">Preparing voice assistant…</div>}>
            <VoiceAgent />
          </Suspense>
        </div>
      </section>

      <section className="section inquiry-section" id="inquiry">
        <div className="container inquiry-container">
          <p className="eyebrow">Send an inquiry</p>
          <h2 className="section-title">Tell us what you need</h2>
          <InquiryForm />
        </div>
      </section>

      <section className="owner-section">
        <div className="container owner-content">
          <span className="owner-mark">KSB</span>
          <h2>Khurram Shahzad Baig</h2>
          <p className="owner-role"><BadgeCheck size={17} aria-hidden="true" /> CEO, KS Big Real Estate</p>
          <p className="owner-quote">
            “Our promise is honest dealing and the best value for every family and investor in Al-Kabeer Town.”
          </p>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div>
            <a className="footer-brand" href="#home">KS Big Real Estate</a>
            <p className="footer-muted">Houses · Plots · Commercial · Rentals · File Merging</p>
          </div>
          <div className="footer-contact">
            <p><MapPin size={18} aria-hidden="true" /> Al-Kabeer Town Phase 2, Lahore</p>
            <a href="tel:+923000000000"><Phone size={18} aria-hidden="true" /> +92 300 0000000</a>
            <a href="mailto:info@ksbigrealestate.com"><Mail size={18} aria-hidden="true" /> info@ksbigrealestate.com</a>
          </div>
          <div>
            <h2 className="footer-heading">Get in touch</h2>
            <p className="footer-muted">Have a question? Tell us what you are looking for.</p>
            <a className="footer-link" href="#inquiry">Send an inquiry <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <p className="copyright">© 2026 KS Big Real Estate. All rights reserved.</p>
      </footer>
    </main>
  )
}

export default App
