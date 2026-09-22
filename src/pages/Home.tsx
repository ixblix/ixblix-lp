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
        <h2 className="home-skills-title">AI Agent Skills</h2>
        <p className="home-skills-desc">
          Add these skill files to your AI agent (Claude, ChatGPT, Copilot, etc.) to enable full ixblix integration capabilities.
        </p>
        <div className="home-skills-grid">
          <div className="home-skill-card">
            <div className="home-skill-icon">🔌</div>
            <h3>REST API Skill</h3>
            <p>Complete integration guide using direct HTTP/cURL calls. No SDK required.</p>
            <a
              href="/skills/ixblix-api-integration.md"
              className="btn btn-outline-dark"
              download
            >
              Download API Skill
            </a>
          </div>
          <div className="home-skill-card">
            <div className="home-skill-icon">📦</div>
            <h3>JavaScript SDK Skill</h3>
            <p>Full integration guide using the official @ixblix/sdk-js TypeScript package.</p>
            <a
              href="/skills/ixblix-sdk-integration.md"
              className="btn btn-outline-dark"
              download
            >
              Download SDK Skill
            </a>
          </div>
        </div>
        <div className="home-skills-instructions">
          <h3>How to Add Skills to Your AI Agent</h3>
          <div className="home-skill-instruction-item">
            <h4>Claude (Anthropic)</h4>
            <ol>
              <li>Download the skill file above</li>
              <li>Open Claude and go to Projects</li>
              <li>Create a new project or edit existing</li>
              <li>Click "Add Knowledge" → "Upload file"</li>
              <li>Upload the downloaded .md file</li>
              <li>Claude now has full ixblix integration knowledge</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>ChatGPT (OpenAI)</h4>
            <ol>
              <li>Download the skill file above</li>
              <li>Open ChatGPT and go to "Create a GPT"</li>
              <li>In the "Configure" tab, scroll to "Knowledge"</li>
              <li>Click "Upload" and select the .md file</li>
              <li>Your custom GPT now knows ixblix integration</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>GitHub Copilot</h4>
            <ol>
              <li>Download the skill file above</li>
              <li>Place it in your project's <code>.github/instructions/</code> folder</li>
              <li>Or add it to your <code>.github/copilot-instructions.md</code></li>
              <li>Copilot will reference it when answering ixblix questions</li>
            </ol>
          </div>
          <div className="home-skill-instruction-item">
            <h4>Cursor / Windsurf / Other IDEs</h4>
            <ol>
              <li>Download the skill file above</li>
              <li>Place it in your project root or <code>.cursor/rules/</code> folder</li>
              <li>Reference it in your agent's system prompt or rules file</li>
              <li>The agent will use it as context for ixblix integration tasks</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
