import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function IntegratorRegistration() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('integrator.title')}</h1>
      <p className="lead">{t('integrator.lead')}</p>

      <h2>{t('integrator.howItWorks.title')}</h2>
      <p>{t('integrator.howItWorks.text')} <strong>{t('integrator.howItWorks.bold')}</strong> {t('integrator.howItWorks.textAfter')}</p>
      <ol className="steps">
        <li>{t('integrator.step1')} <code>POST /api/integrators/register</code> {t('integrator.step1After')}</li>
        <li>{t('integrator.step2')} <code>integratorId</code> {t('integrator.step2And')} <code>accessToken</code>{t('integrator.step2End')}</li>
        <li>{t('integrator.step3')} <code>200 OK</code> {t('integrator.step3After')}</li>
        <li>{t('integrator.step4')}</li>
      </ol>

      <h2>{t('integrator.regRequest.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/integrators/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My CRM Platform",
    "callbackUrl": "https://mycrm.example.com/ixblix/callback",
    "contactEmail": "admin@mycrm.example.com"
  }'`}
      />

      <h3>{t('integrator.requestBody.title')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('integrator.table.field')}</th>
            <th>{t('integrator.table.type')}</th>
            <th>{t('integrator.table.required')}</th>
            <th>{t('integrator.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>name</code>
            </td>
            <td>string</td>
            <td>{t('integrator.table.yes')}</td>
            <td>{t('integrator.table.nameDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>callbackUrl</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>{t('integrator.table.callbackUrlDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>contactEmail</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>{t('integrator.table.contactEmailDesc')}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('integrator.callbackPayload.title')}</h2>
      <p>{t('integrator.callbackPayload.text')} <code>POST</code> {t('integrator.callbackPayload.to')} <code>callbackUrl</code> {t('integrator.callbackPayload.with')}</p>
      <CodeBlock
        language="json"
        title="Callback POST body"
        code={`{
  "integratorId": "int_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accessToken": "ixblix_integrator_token_xxxxxxxxxxxx",
  "createdAt": "2026-01-15T10:30:00.000Z"
}`}
      />

      <div className="callout callout-warning">
        <div className="callout-title">{t('integrator.callout.storeTitle')}</div>
        <p>{t('integrator.callout.storeText')} <code>accessToken</code> {t('integrator.callout.storeOnce')}</p>
      </div>

      <h2>{t('integrator.handling.title')}</h2>
      <CodeBlock
        language="typescript"
        title="callback-handler.ts"
        code={`import express from 'express';

const app = express();
app.use(express.json());

app.post('/ixblix/callback', async (req, res) => {
  const { integratorId, accessToken } = req.body;

  // Store credentials securely (e.g., encrypted database, vault)
  await saveIntegratorCredentials({ integratorId, accessToken });

  // Must respond 200 to confirm receipt
  res.status(200).json({ received: true });
});`}
      />

      <h2>{t('integrator.authAfter.title')}</h2>
      <p>{t('integrator.authAfter.text')} <strong>{t('integrator.authAfter.bold')}</strong>{t('integrator.authAfter.colon')}</p>
      <CodeBlock
        language="bash"
        title="Authenticated request"
        code={`curl https://api.ixblix.app/api/integrators/profile \\
  -u "int_a1b2c3d4-...:ixblix_integrator_token_xxxx"`}
      />
      <p>{t('integrator.authAfter.username')} <code>integratorId</code> {t('integrator.authAfter.and')} <code>accessToken</code>{t('integrator.authAfter.end')}</p>

      <h2>{t('integrator.sdk.title')}</h2>
      <CodeBlock
        language="typescript"
        title="sdk-usage.ts"
        code={`import { IxblixClient } from '@ixblix/sdk-js';

// After receiving credentials via callback
const client = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'int_a1b2c3d4-...',
  accessToken: 'ixblix_integrator_token_xxxx',
});

// Verify credentials
const profile = await client.integrator.getProfile();
console.log('Registered as:', profile.name);`}
      />

      <h2>{t('integrator.profile.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/integrators/profile \\
  -u "integratorId:accessToken"`}
      />
      <p>{t('integrator.profile.response')}</p>
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "id": "int_a1b2c3d4-...",
  "name": "My CRM Platform",
  "callbackUrl": "https://mycrm.example.com/ixblix/callback",
  "contactEmail": "admin@mycrm.example.com",
  "status": "active",
  "createdAt": "2026-01-15T10:30:00.000Z"
}`}
      />

      <h2>{t('integrator.errors.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('integrator.errors.table.status')}</th>
            <th>{t('integrator.errors.table.meaning')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>400</code>
            </td>
            <td>{t('integrator.errors.400')}</td>
          </tr>
          <tr>
            <td>
              <code>409</code>
            </td>
            <td>{t('integrator.errors.409')}</td>
          </tr>
          <tr>
            <td>
              <code>422</code>
            </td>
            <td>{t('integrator.errors.422')}</td>
          </tr>
        </tbody>
      </table>

      <PageNav
        prev={{ titleKey: 'Quick Start', path: '/docs/quickstart' }}
        next={{ titleKey: 'Company Registration', path: '/docs/company-registration' }}
      />
    </>
  );
}

export default IntegratorRegistration;
