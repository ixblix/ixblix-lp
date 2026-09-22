import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function AuthReference() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('auth.title')}</h1>
      <p className="lead">{t('auth.lead')}</p>

      <h2>{t('auth.methods.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('auth.methods.table.method')}</th>
            <th>{t('auth.methods.table.who')}</th>
            <th>{t('auth.methods.table.header')}</th>
            <th>{t('auth.methods.table.format')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HTTP Basic Auth</strong>
            </td>
            <td>{t('auth.methods.integrators')}</td>
            <td>
              <code>Authorization</code>
            </td>
            <td>
              <code>Basic base64(integratorId:accessToken)</code>
            </td>
          </tr>
          <tr>
            <td>
              <strong>API Key</strong>
            </td>
            <td>{t('auth.methods.companies')}</td>
            <td>
              <code>X-API-Key</code>
            </td>
            <td>
              <code>smci_xxxxxxxxxxxx</code>
            </td>
          </tr>
          <tr>
            <td>
              <strong>{t('auth.methods.none')}</strong>
            </td>
            <td>{t('auth.methods.customers')}</td>
            <td>—</td>
            <td>{t('auth.methods.publicDesc')}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('auth.integrator.title')}</h2>
      <p>{t('auth.integrator.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/integrators/profile \\
  -u "int_a1b2c3d4-...:ixblix_integrator_token_xxxx"`}
      />
      <p>{t('auth.integrator.username')} <code>integratorId</code> {t('auth.integrator.and')} <code>accessToken</code>{t('auth.integrator.end')}</p>

      <h3>{t('auth.integrator.endpointsTitle')}</h3>
      <ul>
        <li>
          <code>GET /api/integrators/profile</code>
        </li>
        <li>
          <code>POST /api/companies/register</code>
        </li>
        <li>
          <code>POST /api/companies/:id/activate/:transactionId</code>
        </li>
        <li>
          <code>GET /api/companies/</code>
        </li>
      </ul>

      <h2>{t('auth.company.title')}</h2>
      <p>{t('auth.company.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/conversations \\
  -H "X-API-Key: smci_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{ "contactName": "Jane", "contactExternalId": "c-123" }'`}
      />

      <h3>{t('auth.company.formatTitle')}</h3>
      <ul>
        <li>
          {t('auth.company.prefix')} <code>smci_</code>
        </li>
        <li>
          {t('auth.company.length')}
        </li>
        <li>
          {t('auth.company.generated')}
        </li>
        <li>
          {t('auth.company.once')}
        </li>
      </ul>

      <h2>{t('auth.public.title')}</h2>
      <p>{t('auth.public.text')}</p>
      <table>
        <thead>
          <tr>
            <th>{t('auth.public.table.endpoint')}</th>
            <th>{t('auth.public.table.access')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>GET /api/conversations/:token</code>
            </td>
            <td>{t('auth.public.convToken')}</td>
          </tr>
          <tr>
            <td>
              <code>POST /api/conversations/:token/close</code>
            </td>
            <td>Conversation deeplink token</td>
          </tr>
          <tr>
            <td>
              <code>POST /api/conversations/:token/key</code>
            </td>
            <td>Conversation deeplink token</td>
          </tr>
          <tr>
            <td>
              <code>POST /api/messages/contact</code>
            </td>
            <td>{t('auth.public.convId')}</td>
          </tr>
          <tr>
            <td>
              <code>POST /api/messages/contact/read</code>
            </td>
            <td>Conversation ID in body</td>
          </tr>
          <tr>
            <td>
              <code>GET /api/companies/public/:handle</code>
            </td>
            <td>{t('auth.public.handle')}</td>
          </tr>
          <tr>
            <td>
              <code>GET /api/plans</code>
            </td>
            <td>{t('auth.public.public')}</td>
          </tr>
          <tr>
            <td>
              <code>GET /api/installation</code>
            </td>
            <td>Public</td>
          </tr>
          <tr>
            <td>
              <code>GET /health</code>
            </td>
            <td>Public</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('auth.admin.title')}</h2>
      <p>{t('auth.admin.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/admin/companies \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`}
      />

      <h2>{t('auth.best.title')}</h2>
      <ul>
        <li>
          {t('auth.best.never')}
        </li>
        <li>
          {t('auth.best.rotate')}
        </li>
        <li>
          {t('auth.best.store')}
        </li>
        <li>
          {t('auth.best.https')}
        </li>
        <li>
          {t('auth.best.verify')}
        </li>
      </ul>

      <PageNav
        prev={{ titleKey: 'Key Transfer', path: '/docs/key-transfer' }}
        next={{ titleKey: 'Error Handling', path: '/docs/errors' }}
      />
    </>
  );
}

export default AuthReference;
