import { Link } from 'react-router-dom';
import { useI18n, type Locale } from '../i18n';

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
];

function Home() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="home-page">
      {/* Language switcher */}
      <div className="home-lang-bar">
        <div className="home-lang-switcher">
          {locales.map((l) => (
            <button
              key={l.code}
              className={`home-lang-btn ${locale === l.code ? 'active' : ''}`}
              onClick={() => setLocale(l.code)}
              type="button"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-hero-brand">ixblix</h1>
        <p className="home-hero-tagline">{t('home.tagline')}</p>
        <div className="home-hero-actions">
          <Link to="/docs/quickstart" className="btn btn-primary">
            {t('home.cta.start')}
          </Link>
          <a
            href="https://dev.ixblix.app"
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('home.cta.api')}
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <h2 className="home-features-title">{t('home.features.title')}</h2>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">🔐</div>
            <h3>{t('home.features.e2ee.title')}</h3>
            <p>{t('home.features.e2ee.desc')}</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">🔗</div>
            <h3>{t('home.features.webhooks.title')}</h3>
            <p>{t('home.features.webhooks.desc')}</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">🎨</div>
            <h3>{t('home.features.whitelabel.title')}</h3>
            <p>{t('home.features.whitelabel.desc')}</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">💬</div>
            <h3>{t('home.features.rich.title')}</h3>
            <p>{t('home.features.rich.desc')}</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">📱</div>
            <h3>{t('home.features.multiplatform.title')}</h3>
            <p>{t('home.features.multiplatform.desc')}</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">📦</div>
            <h3>{t('home.features.sdk.title')}</h3>
            <p>{t('home.features.sdk.desc')}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>{t('home.ctaSection.title')}</h2>
        <p>{t('home.ctaSection.desc')}</p>
        <Link to="/docs/quickstart" className="btn btn-primary">
          {t('home.ctaSection.button')}
        </Link>
      </section>

      {/* AI Agent Skills */}
      <section className="home-skills">
        <h2 className="home-skills-title">{t('home.skills.title')}</h2>
        <p className="home-skills-desc">
          {t('home.skills.desc')}
        </p>
        <div className="home-skills-grid">
          <div className="home-skill-card">
            <div className="home-skill-icon">🔌</div>
            <h3>{t('home.skills.api.title')}</h3>
            <p>{t('home.skills.api.desc')}</p>
            <a
              href="/skills/ixblix-api-integration.md"
              className="btn btn-outline-dark"
              download
            >
              {t('home.skills.api.download')}
            </a>
          </div>
          <div className="home-skill-card">
            <div className="home-skill-icon">📦</div>
            <h3>{t('home.skills.sdk.title')}</h3>
            <p>{t('home.skills.sdk.desc')}</p>
            <a
              href="/skills/ixblix-sdk-integration.md"
              className="btn btn-outline-dark"
              download
            >
              {t('home.skills.sdk.download')}
            </a>
          </div>
        </div>
        <div className="home-skills-instructions">
          <h3>{t('home.skills.instructions.title')}</h3>
          <div className="home-skill-instruction-item">
            <h4>{t('home.skills.instructions.claude.title')}</h4>
            <ol>
              <li>{t('home.skills.instructions.claude.step1')}</li>
              <li>{t('home.skills.instructions.claude.step2')}</li>
              <li>{t('home.skills.instructions.claude.step3')}</li>
              <li>{t('home.skills.instructions.claude.step4')}</li>
              <li>{t('home.skills.instructions.claude.step5')}</li>
              <li>{t('home.skills.instructions.claude.step6')}</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>{t('home.skills.instructions.chatgpt.title')}</h4>
            <ol>
              <li>{t('home.skills.instructions.chatgpt.step1')}</li>
              <li>{t('home.skills.instructions.chatgpt.step2')}</li>
              <li>{t('home.skills.instructions.chatgpt.step3')}</li>
              <li>{t('home.skills.instructions.chatgpt.step4')}</li>
              <li>{t('home.skills.instructions.chatgpt.step5')}</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>{t('home.skills.instructions.copilot.title')}</h4>
            <ol>
              <li>{t('home.skills.instructions.copilot.step1')}</li>
              <li dangerouslySetInnerHTML={{ __html: t('home.skills.instructions.copilot.step2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('home.skills.instructions.copilot.step3') }} />
              <li>{t('home.skills.instructions.copilot.step4')}</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>{t('home.skills.instructions.cursor.title')}</h4>
            <ol>
              <li>{t('home.skills.instructions.cursor.step1')}</li>
              <li dangerouslySetInnerHTML={{ __html: t('home.skills.instructions.cursor.step2') }} />
              <li>{t('home.skills.instructions.cursor.step3')}</li>
              <li>{t('home.skills.instructions.cursor.step4')}</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
