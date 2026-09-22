import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

interface PageNavProps {
  prev?: { titleKey: string; path: string };
  next?: { titleKey: string; path: string };
}

function PageNav({ prev, next }: PageNavProps) {
  const { t } = useI18n();

  return (
    <div className="page-nav">
      {prev ? (
        <Link to={prev.path} className="page-nav-link">
          <span className="page-nav-label">{t('common.prev')}</span>
          <span className="page-nav-title">{t(prev.titleKey)}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={next.path} className="page-nav-link next">
          <span className="page-nav-label">{t('common.next')}</span>
          <span className="page-nav-title">{t(next.titleKey)}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

export default PageNav;
