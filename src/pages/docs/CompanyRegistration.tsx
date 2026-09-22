import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function CompanyRegistration() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('company.title')}</h1>
      <p className="lead">{t('company.lead')}</p>

      <h2>{t('company.overview.title')}</h2>
      <p>{t('company.overview.text')}</p>
      <ol>
        <li>
          <strong>{t('company.step.reg')}</strong> {t('company.step.regDesc')}
        </li>
        <li>
          <strong>{t('company.step.pay')}</strong> {t('company.step.payDesc')}
        </li>
        <li>
          <strong>{t('company.step.activate')}</strong> {t('company.step.activateDesc')}
        </li>
        <li>
          <strong>{t('company.step.configure')}</strong> {t('company.step.configureDesc')}
        </li>
      </ol>

      <h2>{t('company.step1.title')}</h2>
      <p>{t('company.step1.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/plans`}
      />
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "plans": [
    {
      "id": "plan_starter",
      "name": "Starter",
      "monthlyPrice": 4900,
      "includedCredits": 1000,
      "features": ["e2ee", "webhooks", "rich-messages"]
    },
    {
      "id": "plan_pro",
      "name": "Professional",
      "monthlyPrice": 14900,
      "includedCredits": 5000,
      "features": ["e2ee", "webhooks", "rich-messages", "media", "key-transfer"]
    }
  ]
}`}
      />

      <h2>{t('company.step2.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/companies/register \\
  -u "integratorId:accessToken" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corporation",
    "planId": "plan_starter",
    "handle": "acme",
    "website": "https://acme.example.com"
  }'`}
      />

      <h3>{t('company.requestBody.title')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('company.table.field')}</th>
            <th>{t('company.table.type')}</th>
            <th>{t('company.table.required')}</th>
            <th>{t('company.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>name</code>
            </td>
            <td>string</td>
            <td>{t('company.table.yes')}</td>
            <td>{t('company.table.nameDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>planId</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>{t('company.table.planIdDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>handle</code>
            </td>
            <td>string</td>
            <td>{t('company.table.no')}</td>
            <td>{t('company.table.handleDesc')} <code>api.ixblix.app/api/companies/public/acme</code>)</td>
          </tr>
          <tr>
            <td>
              <code>website</code>
            </td>
            <td>string</td>
            <td>No</td>
            <td>{t('company.table.websiteDesc')}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t('company.response.title')}</h3>
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "company": {
    "id": "cmp_xxxxxxxxxxxx",
    "name": "Acme Corporation",
    "handle": "acme",
    "status": "pending_payment"
  },
  "payment": {
    "transactionId": "txn_xxxxxxxxxxxx",
    "amount": 4900,
    "currency": "BRL"
  },
  "checkoutUrl": "https://api.ixblix.app/checkout/txn_xxxxxxxxxxxx"
}`}
      />

      <div className="callout callout-info">
        <div className="callout-title">{t('company.callout.checkoutTitle')}</div>
        <p>{t('company.callout.checkoutText')} <code>checkoutUrl</code> {t('company.callout.checkoutEnd')}</p>
      </div>

      <h2>{t('company.step3.title')}</h2>
      <p>{t('company.step3.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/companies/cmp_xxxxxxxxxxxx/activate/txn_xxxxxxxxxxxx \\
  -u "integratorId:accessToken"`}
      />
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "company": {
    "id": "cmp_xxxxxxxxxxxx",
    "name": "Acme Corporation",
    "status": "active"
  },
  "apiKey": "smci_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}`}
      />

      <div className="callout callout-warning">
        <div className="callout-title">{t('company.callout.apiKeyTitle')}</div>
        <p>{t('company.callout.apiKeyText')} <code>apiKey</code> {t('company.callout.apiKeyOnce')} <code>GET /api/companies/profile</code> {t('company.callout.apiKeyEnd')}</p>
      </div>

      <h2>{t('company.step4.title')}</h2>
      <p>{t('company.step4.text')}</p>

      <h3>{t('company.webhook.title')}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/companies/webhook \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://mycrm.example.com/ixblix/webhooks/acme" }'`}
      />
      <p>{t('company.webhook.response')} <code>webhookSecret</code> {t('company.webhook.for')}</p>
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "webhookUrl": "https://mycrm.example.com/ixblix/webhooks/acme",
  "webhookSecret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxx"
}`}
      />

      <h3>{t('company.encKey.title')}</h3>
      <p>{t('company.encKey.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/companies/encryption-key \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "publicKey": "-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhki..."
  }'`}
      />

      <h2>{t('company.list.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/companies/ \\
  -u "integratorId:accessToken"`}
      />

      <h2>{t('company.sdk.title')}</h2>
      <CodeBlock
        language="typescript"
        title="sdk-company.ts"
        code={`import { IxblixClient } from '@ixblix/sdk-js';

const integrator = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'int_xxxx',
  accessToken: 'ixblix_integrator_token_xxxx',
});

// List plans
const { plans } = await integrator.plans.list();

// Register company
const { company, checkoutUrl } = await integrator.company.register({
  name: 'Acme Corporation',
  planId: plans[0].id,
  handle: 'acme',
});

// After payment...
const { apiKey } = await integrator.company.activate(
  company.id,
  transactionId,
);

// Create company-scoped client
const companyClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey,
});`}
      />

      <PageNav
        prev={{ titleKey: 'Integrator Registration', path: '/docs/integrator-registration' }}
        next={{ titleKey: 'Send & Receive Messages', path: '/docs/messaging' }}
      />
    </>
  );
}

export default CompanyRegistration;
