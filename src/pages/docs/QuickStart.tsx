import CodeBlock from "../../components/CodeBlock";
import PageNav from "../../components/PageNav";
import { useI18n } from "../../i18n";

function QuickStart() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t("quickstart.title")}</h1>
      <p className="lead">{t("quickstart.lead")}</p>

      <h2>{t("quickstart.overview.title")}</h2>
      <p>
        {t("quickstart.overview.text")}{" "}
        <strong>{t("quickstart.overview.integrators")}</strong> (CRMs, help
        desks, ticket systems) {t("quickstart.overview.flow")}{" "}
        <strong>{t("quickstart.overview.companies")}</strong> (businesses that
        talk to customers){t("quickstart.overview.flowAfter")}
      </p>
      <ol>
        <li>
          <strong>{t("quickstart.step.reg")}</strong>{" "}
          {t("quickstart.step.regDesc")}
        </li>
        <li>
          <strong>{t("quickstart.step.company")}</strong>{" "}
          {t("quickstart.step.companyDesc")}
        </li>
        <li>
          <strong>{t("quickstart.step.conversation")}</strong>{" "}
          {t("quickstart.step.conversationDesc")}
        </li>
        <li>
          <strong>{t("quickstart.step.messages")}</strong>{" "}
          {t("quickstart.step.messagesDesc")}
        </li>
      </ol>

      <h2>{t("quickstart.prereqs.title")}</h2>
      <ul>
        <li>{t("quickstart.prereq1")}</li>
        <li>{t("quickstart.prereq2")}</li>
        <li>{t("quickstart.prereq3")}</li>
      </ul>

      <h2>{t("quickstart.step1.title")}</h2>
      <CodeBlock
        language="bash"
        code="npm install @ixblix/sdk-js"
        title="Terminal"
      />
      <p>
        {t("quickstart.step1.text")} <code>https://api.ixblix.app</code>.
      </p>

      <h2>{t("quickstart.step2.title")}</h2>
      <CodeBlock
        language="typescript"
        title="register.ts"
        code={`import { IxblixClient } from '@ixblix/sdk-js';

const client = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
});

const result = await client.integrator.register({
  name: 'My CRM',
  callbackUrl: 'https://mycrm.example.com/ixblix/callback',
  contactEmail: 'admin@mycrm.example.com',
});

// ixblix will POST to your callbackUrl with credentials
// Check your callback endpoint for integratorId + accessToken`}
      />

      <div className="callout callout-info">
        <div className="callout-title">
          {t("quickstart.callout.callbackTitle")}
        </div>
        <p>
          {t("quickstart.callout.callbackText")} <code>callbackUrl</code>{" "}
          {t("quickstart.callout.callbackWith")} <code>integratorId</code>{" "}
          {t("quickstart.callout.callbackAnd")} <code>accessToken</code>
          {t("quickstart.callout.callbackEnd")} <code>200 OK</code>{" "}
          {t("quickstart.callout.callbackConfirm")}
        </p>
      </div>

      <h2>{t("quickstart.step3.title")}</h2>
      <p>{t("quickstart.step3.plansText")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/plans`}
      />
      <CodeBlock
        language="json"
        title={t("quickstart.step3.response")}
        code={`{
  "plans": [
    {
      "id": "plan_starter",
      "name": "Starter",
      "monthlyPrice": 4900,
      "includedCredits": 1000
    },
    {
      "id": "plan_pro",
      "name": "Professional",
      "monthlyPrice": 14900,
      "includedCredits": 5000
    }
  ]
}`}
      />
      <p>{t("quickstart.step3.registerText")}</p>
      <CodeBlock
        language="typescript"
        title="create-company.ts"
        code={`// Using the credentials from your callback
const client = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'your-integrator-id',
  accessToken: 'your-access-token',
});

// First, list available plans
const { plans } = await client.plans.list();
const planId = plans[0].id; // or choose based on your needs

const { company, checkoutUrl } = await client.company.register({
  name: 'Acme Corp',
  planId,
});

// Direct the company owner to checkoutUrl to complete payment`}
      />

      <h2>{t("quickstart.step4.title")}</h2>
      <p>{t("quickstart.step4.text")}</p>
      <CodeBlock
        language="typescript"
        title="activate.ts"
        code={`const { apiKey } = await client.company.activate(
  company.id,
  transactionId,
);

// Now use the company's API key for operations
const companyClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey,
});

// Set your webhook URL
const { webhookSecret } = await companyClient.company.setWebhook({
  url: 'https://mycrm.example.com/ixblix/webhooks',
});`}
      />

      <h2>{t("quickstart.step5.title")}</h2>
      <CodeBlock
        language="typescript"
        title="start-conversation.ts"
        code={`const { conversation, deeplink } = await companyClient.conversation.create({
  contactName: 'Jane Doe',
  contactExternalId: 'crm-contact-123',
  originChannel: 'whatsapp',
});

// Send the deeplink to your customer via WhatsApp, SMS, etc.
console.log('Share this link:', deeplink);`}
      />

      <h2>{t("quickstart.step6.title")}</h2>
      <CodeBlock
        language="typescript"
        title="send-message.ts"
        code={`import { encryptToRecipient } from '@ixblix/sdk-js';

// When customer joins, you receive a CUSTOMER_JOINED webhook
// with their public key. Encrypt messages to that key.

const encrypted = encryptToRecipient({
  plaintext: 'Hello from Acme Corp!',
  recipientPublicKey: customerPublicKey,
  senderPublicKey: yourOperatorPublicKey,
});

await companyClient.message.sendCompany({
  conversationId: conversation.id,
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
});`}
      />

      <h2>{t("quickstart.step7.title")}</h2>
      <p>
        {t("quickstart.step7.text")} <code>MESSAGE_RECEIVED</code>{" "}
        {t("quickstart.step7.textAfter")}
      </p>
      <CodeBlock
        language="typescript"
        title="webhook-handler.ts"
        code={`import { verifyWebhook, decryptEnvelope } from '@ixblix/sdk-js';

app.post('/ixblix/webhooks', (req, res) => {
  const isValid = verifyWebhook(req.body, req.headers, webhookSecret);
  if (!isValid) return res.status(401).send('Invalid signature');

  const event = req.body;

  if (event.type === 'MESSAGE_RECEIVED') {
    const plaintext = decryptEnvelope({
      envelope: event.payload.encryptedContent,
      encryptedKey: event.payload.encryptedKey,
      recipientPrivateKey: yourOperatorPrivateKey,
    });
    console.log('Customer said:', plaintext);
  }

  res.status(200).send('OK');
});`}
      />

      <h2>{t("quickstart.api.title")}</h2>
      <p>{t("quickstart.api.text")}</p>

      <h3>{t("quickstart.api.regTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/integrators/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My CRM",
    "callbackUrl": "https://mycrm.example.com/ixblix/callback",
    "contactEmail": "admin@mycrm.example.com"
  }'`}
      />

      <h3>{t("quickstart.api.companyTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/companies \\
  -u "integrator-id:access-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corp",
    "planId": "plan-starter-id"
  }'`}
      />

      <h3>{t("quickstart.api.activateTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/companies/cmp_xxxx/activate \\
  -u "integrator-id:access-token" \\
  -H "Content-Type: application/json" \\
  -d '{ "transactionId": "txn_xxxx" }'`}
      />

      <h3>{t("quickstart.api.webhookTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/companies/webhook \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://mycrm.example.com/ixblix/webhooks" }'`}
      />

      <h3>{t("quickstart.api.conversationTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contactName": "Jane Doe",
    "contactExternalId": "crm-contact-123",
    "originChannel": "whatsapp"
  }'`}
      />

      <h3>{t("quickstart.api.sendMessageTitle")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/messages/company \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64-aes-256-gcm-ciphertext",
    "encryptedKey": "base64-rsa-oaep-wrapped-aes-key"
  }'`}
      />

      <div className="callout callout-success">
        <div className="callout-title">{t("quickstart.callout.liveTitle")}</div>
        <p>
          {t("quickstart.callout.liveText")}{" "}
          <a href="/docs/webhooks">{t("quickstart.callout.liveWebhooks")}</a>,{" "}
          <a href="/docs/rich-messages">{t("quickstart.callout.liveRich")}</a>,{" "}
          <a href="/docs/media">{t("quickstart.callout.liveMedia")}</a>
          {t("quickstart.callout.liveAnd")}
        </p>
      </div>

      <h2>{t("quickstart.nextSteps.title")}</h2>
      <ul>
        <li>
          <a href="/docs/integrator-registration">
            {t("nav.integratorRegistration")}
          </a>{" "}
          — {t("quickstart.nextSteps.integrator")}
        </li>
        <li>
          <a href="/docs/e2e-encryption">{t("nav.e2eEncryption")}</a> —{" "}
          {t("quickstart.nextSteps.e2ee")}
        </li>
        <li>
          <a href="/docs/webhooks">{t("nav.webhooks")}</a> —{" "}
          {t("quickstart.nextSteps.webhooks")}
        </li>
        <li>
          <a href="/docs/sdk">{t("nav.sdk")}</a> —{" "}
          {t("quickstart.nextSteps.sdk")}
        </li>
      </ul>

      <PageNav
        next={{
          titleKey: "Integrator Registration",
          path: "/docs/integrator-registration",
        }}
      />
    </>
  );
}

export default QuickStart;
