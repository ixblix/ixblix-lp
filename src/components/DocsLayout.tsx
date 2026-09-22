import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useI18n, type Locale } from '../i18n';

interface NavItem {
  titleKey: string;
  path: string;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    labelKey: 'nav.gettingStarted',
    items: [
      { titleKey: 'nav.quickStart', path: '/docs/quickstart' },
      { titleKey: 'nav.integratorRegistration', path: '/docs/integrator-registration' },
      { titleKey: 'nav.companyRegistration', path: '/docs/company-registration' },
      { titleKey: 'nav.messaging', path: '/docs/messaging' },
    ],
  },
  {
    labelKey: 'nav.guides',
    items: [
      { titleKey: 'nav.webhooks', path: '/docs/webhooks' },
      { titleKey: 'nav.e2eEncryption', path: '/docs/e2e-encryption' },
      { titleKey: 'nav.richMessages', path: '/docs/rich-messages' },
      { titleKey: 'nav.media', path: '/docs/media' },
      { titleKey: 'nav.presence', path: '/docs/presence' },
      { titleKey: 'nav.keyTransfer', path: '/docs/key-transfer' },
    ],
  },
  {
    labelKey: 'nav.reference',
    items: [
      { titleKey: 'nav.auth', path: '/docs/auth' },
      { titleKey: 'nav.errors', path: '/docs/errors' },
      { titleKey: 'nav.sdk', path: '/docs/sdk' },
      { titleKey: 'nav.sampleIntegrator', path: '/docs/sample-integrator' },
    ],
  },
];

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
];

function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, locale, setLocale } = useI18n();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={closeSidebar}>
            <div className="sidebar-brand-icon">i</div>
            <span className="sidebar-brand-name">ixblix</span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.labelKey} className="sidebar-group">
              <div className="sidebar-group-title">{t(group.labelKey)}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeSidebar}
                >
                  {t(item.titleKey)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-locale-switcher">
            {locales.map((l) => (
              <button
                key={l.code}
                className={`sidebar-locale-btn ${locale === l.code ? 'active' : ''}`}
                onClick={() => setLocale(l.code)}
                type="button"
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href="https://dev.ixblix.app"
            className="sidebar-footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('nav.apiReference')}
          </a>
          <a
            href="https://github.com/ixblix"
            className="sidebar-footer-link"
            style={{ marginTop: '0.5rem' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('nav.github')}
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content" key={location.pathname}>
        <div className="docs-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DocsLayout;
