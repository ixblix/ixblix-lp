import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function SampleIntegrator() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('sample.title')}</h1>
      <p className="lead">{t('sample.lead')}</p>

      <h2>{t('sample.arch.title')}</h2>
      <p>{t('sample.arch.text')}</p>
      <ul>
        <li>{t('sample.arch.reg')}</li>
        <li>{t('sample.arch.company')}</li>
        <li>{t('sample.arch.webhooks')}</li>
        <li>{t('sample.arch.encrypt')}</li>
        <li>{t('sample.arch.persist')}</li>
      </ul>

      <h2>{t('sample.setup.title')}</h2>
      <CodeBlock
        language="bash"
        title="Terminal"
        code={`mkdir my-integrator && cd my-integrator
npm init -y
npm install express @ixblix/sdk-js
npm install -D typescript @types/express tsx
npx tsc --init`}
      />

      <h2>{t('sample.complete.title')}</h2>
      <CodeBlock
        language="typescript"
        title="src/server.ts"
        code={`import express from 'express';
import {
import { useI18n } from '../../i18n';
  IxblixClient,
  IxblixError,
  generateOperatorKeyPair,
  encryptToRecipient,
  decryptEnvelope,
  verifyWebhook,
  loadOrCreateOperatorKey,
} from '@ixblix/sdk-js';

const app = express();
app.use(express.json());

// ── Configuration ──────────────────────────────────────────
const API_URL = 'https://api.ixblix.app';
const PORT = process.env.PORT || 4000;

// In production, store these in a database or vault
let integratorId: string | null = null;
let accessToken: string | null = null;
const companyKeys = new Map<string, string>(); // companyId → apiKey
const customerKeys = new Map<string, string>(); // conversationId → publicKey
const webhookSecrets = new Map<string, string>(); // companyId → secret

// ── Operator Keypair ───────────────────────────────────────
let operatorKey: { publicKey: string; privateKey: string };

async function init() {
  operatorKey = await loadOrCreateOperatorKey({
    path: './keys/operator.json',
  });
  console.log('Operator key loaded. Public key fingerprint ready.');
}

// ── Callback Endpoint (receives integrator credentials) ────
app.post('/ixblix/callback', (req, res) => {
  integratorId = req.body.integratorId;
  accessToken = req.body.accessToken;
  console.log('Integrator registered:', integratorId);
  res.status(200).json({ received: true });
});

// ── Webhook Endpoint ───────────────────────────────────────
app.post('/ixblix/webhook/:companyId', async (req, res) => {
  const { companyId } = req.params;
  const secret = webhookSecrets.get(companyId!);

  if (!secret || !verifyWebhook(req.body, req.headers, secret)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  const apiKey = companyKeys.get(companyId!);
  if (!apiKey) return res.status(404).send('Unknown company');

  const client = new IxblixClient({ baseUrl: API_URL, apiKey });

  switch (event.type) {
    case 'CUSTOMER_JOINED': {
      // Store customer's public key for this conversation
      customerKeys.set(
        event.payload.conversationId,
        event.payload.customerPublicKey,
      );
      console.log(
        \`Customer joined conversation \${event.payload.conversationId}\`,
      );

      // Send a welcome message
      const encrypted = encryptToRecipient({
        plaintext: 'Hello! How can we help you today?',
        recipientPublicKey: event.payload.customerPublicKey,
        senderPublicKey: operatorKey.publicKey,
      });

      await client.message.sendCompany({
        conversationId: event.payload.conversationId,
        encryptedContent: encrypted.content,
        encryptedKey: encrypted.key,
      });
      break;
    }

    case 'MESSAGE_RECEIVED': {
      const customerPubKey = customerKeys.get(event.payload.conversationId);
      if (!customerPubKey) {
        console.error('No customer key for conversation');
        break;
      }

      // Decrypt the incoming message
      const plaintext = decryptEnvelope({
        envelope: event.payload.encryptedContent,
        encryptedKey: event.payload.encryptedKey,
        recipientPrivateKey: operatorKey.privateKey,
      });

      console.log(
        \`[\${event.payload.conversationId}] Customer: \${plaintext}\`,
      );

      // In a real app, you'd create a ticket in your desk system here
      // and route the message to an operator.

      // Auto-reply for demo purposes
      const reply = encryptToRecipient({
        plaintext: \`Received: "\${plaintext}". An agent will be with you shortly.\`,
        recipientPublicKey: customerPubKey,
        senderPublicKey: operatorKey.publicKey,
        attachments: [
          { type: 'reply', label: 'I have another question' },
          { type: 'reply', label: 'That answers it, thanks!' },
        ],
      });

      await client.message.sendCompany({
        conversationId: event.payload.conversationId,
        encryptedContent: reply.content,
        encryptedKey: reply.key,
      });
      break;
    }

    case 'MESSAGE_READ': {
      console.log(
        \`Messages read in \${event.payload.conversationId}:\`,
        event.payload.messageIds,
      );
      break;
    }

    case 'TYPING': {
      console.log(\`Customer typing in \${event.payload.conversationId}\`);
      break;
    }

    case 'CONVERSATION_CLOSED': {
      console.log(\`Conversation closed: \${event.payload.conversationId}\`);
      customerKeys.delete(event.payload.conversationId);
      break;
    }

    default:
      console.log(\`Unhandled event: \${event.type}\`);
  }

  res.status(200).send('OK');
});

// ── Helper: Register & Activate Company ────────────────────
app.post('/api/companies', async (req, res) => {
  try {
    const client = new IxblixClient({
      baseUrl: API_URL,
      integratorId: integratorId!,
      accessToken: accessToken!,
    });

    const { company, checkoutUrl } = await client.company.register({
      name: req.body.name,
      planId: req.body.planId,
    });

    res.json({ company, checkoutUrl });
  } catch (err) {
    if (err instanceof IxblixError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal error' });
    }
  }
});

// ── Helper: Activate Company ───────────────────────────────
app.post('/api/companies/:id/activate', async (req, res) => {
  const client = new IxblixClient({
    baseUrl: API_URL,
    integratorId: integratorId!,
    accessToken: accessToken!,
  });

  const { apiKey } = await client.company.activate(
    req.params.id,
    req.body.transactionId,
  );

  companyKeys.set(req.params.id, apiKey);

  // Set up webhook and encryption key for this company
  const companyClient = new IxblixClient({ baseUrl: API_URL, apiKey });

  const { webhookSecret } = await companyClient.company.setWebhook({
    url: \`https://my-integrator.example.com/ixblix/webhook/\${req.params.id}\`,
  });
  webhookSecrets.set(req.params.id, webhookSecret);

  await companyClient.company.setEncryptionKey({
    publicKey: operatorKey.publicKey,
  });

  res.json({ apiKey, webhookSecret });
});

// ── Start ──────────────────────────────────────────────────
init().then(() => {
  app.listen(PORT, () => {
    console.log(\`Sample integrator running on port \${PORT}\`);
  });
});`}
      />

      <h2>{t('sample.running.title')}</h2>
      <CodeBlock
        language="bash"
        title="Terminal"
        code={`npx tsx src/server.ts`}
      />

      <h2>{t('sample.ngrok.title')}</h2>
      <p>{t('sample.ngrok.text')}</p>
      <CodeBlock
        language="bash"
        title="Terminal"
        code={`ngrok http 4000
# → https://abc123.ngrok.io

# Use this as your callback URL:
# https://abc123.ngrok.io/ixblix/callback

# And as your webhook base URL:
# https://abc123.ngrok.io/ixblix/webhook/:companyId`}
      />

      <h2>{t('sample.takeaways.title')}</h2>
      <ul>
        <li>
          <strong>{t('sample.takeaways.store')}</strong>{t('sample.takeaways.storeDesc')}
        </li>
        <li>
          <strong>{t('sample.takeaways.verify')}</strong>{t('sample.takeaways.verifyDesc')} <code>verifyWebhook()</code>{t('sample.takeaways.verifyEnd')}
        </li>
        <li>
          <strong>{t('sample.takeaways.handle')}</strong>{t('sample.takeaways.handleDesc')}
        </li>
        <li>
          <strong>{t('sample.takeaways.respond')}</strong>{t('sample.takeaways.respondDesc')}
        </li>
        <li>
          <strong>{t('sample.takeaways.sdk')}</strong>{t('sample.takeaways.sdkDesc')}
        </li>
      </ul>

      <PageNav
        prev={{ titleKey: 'JavaScript SDK', path: '/docs/sdk' }}
      />
    </>
  );
}

export default SampleIntegrator;
