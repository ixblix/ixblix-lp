import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function SdkReference() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('sdk.title')}</h1>
      <p className="lead">{t('sdk.lead')} <code>@ixblix/sdk-js</code>{t('sdk.leadEnd')}</p>

      <h2>{t('sdk.install.title')}</h2>
      <CodeBlock
        language="bash"
        title="Terminal"
        code="npm install @ixblix/sdk-js"
      />

      <h2>{t('sdk.client.title')}</h2>
      <p>{t('sdk.client.text')}</p>

      <h3>{t('sdk.client.optionsTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="client-options.ts"
        code={`import { IxblixClient } from '@ixblix/sdk-js';

// Integrator auth (Basic Auth)
const integratorClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'int_xxxx',
  accessToken: 'ixblix_integrator_token_xxxx',
});

// Company auth (API Key)
const companyClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey: 'smci_xxxx',
});

// No auth (public endpoints)
const publicClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
});`}
      />

      <h3>{t('sdk.client.integratorTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="integrator-methods.ts"
        code={`// Register integrator (no auth needed)
await integratorClient.integrator.register({
  name: 'My CRM',
  callbackUrl: 'https://mycrm.example.com/callback',
  contactEmail: 'admin@mycrm.example.com',
});

// Get profile
const profile = await integratorClient.integrator.getProfile();`}
      />

      <h3>{t('sdk.client.companyTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="company-methods.ts"
        code={`// Register a company
const { company, checkoutUrl } = await integratorClient.company.register({
  name: 'Acme Corp',
  planId: 'plan_starter',
  handle: 'acme',
});

// Activate company after payment
const { apiKey } = await integratorClient.company.activate(
  company.id,
  transactionId,
);

// List companies
const { companies } = await integratorClient.company.list();`}
      />

      <h3>{t('sdk.client.conversationTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="conversation-methods.ts"
        code={`// Create conversation
const { conversation, deeplink } = await companyClient.conversation.create({
  contactName: 'Jane Doe',
  contactExternalId: 'crm-123',
  originChannel: 'whatsapp',
  metadata: { ticketId: 'TK-456' },
});

// Close conversation
await companyClient.conversation.close(deeplinkToken);

// Get conversation keys
const keys = await companyClient.conversation.getKeys(conversation.id);

// Set operator identity
await companyClient.conversation.setOperator(conversation.id, {
  name: 'Sarah',
  avatarUrl: 'https://acme.example.com/avatars/sarah.png',
});

// Report presence
await companyClient.conversation.reportPresence(conversation.id, 'TYPING');`}
      />

      <h3>{t('sdk.client.messageTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="message-methods.ts"
        code={`// Send encrypted message
await companyClient.message.sendCompany({
  conversationId: 'conv_xxxx',
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
});

// List messages
const { messages } = await companyClient.message.list('conv_xxxx', {
  limit: 50,
});

// Mark messages as read
await companyClient.message.markRead('conv_xxxx', ['msg_xxxx']);`}
      />

      <h3>{t('sdk.client.configTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="config-methods.ts"
        code={`// Set webhook URL
const { webhookSecret } = await companyClient.company.setWebhook({
  url: 'https://mycrm.example.com/webhooks',
});

// Register encryption key
await companyClient.company.setEncryptionKey({ publicKey });

// Get encryption key
const { publicKey } = await companyClient.company.getEncryptionKey();

// Get balance
const { balance, plan } = await companyClient.company.getBalance();

// Update customization
await companyClient.company.updateCustomization({
  primaryColor: '#2563eb',
  logoUrl: 'https://acme.example.com/logo.png',
});`}
      />

      <h2>{t('sdk.crypto.title')}</h2>

      <h3>generateOperatorKeyPair</h3>
      <CodeBlock
        language="typescript"
        title="generate-keypair.ts"
        code={`import { generateOperatorKeyPair } from '@ixblix/sdk-js';

const { publicKey, privateKey } = await generateOperatorKeyPair();
// Both are PEM strings (SPKI public, PKCS8 private)`}
      />

      <h3>encryptToRecipient</h3>
      <CodeBlock
        language="typescript"
        title="encrypt.ts"
        code={`import { encryptToRecipient } from '@ixblix/sdk-js';

const result = encryptToRecipient({
  plaintext: 'Hello!',
  recipientPublicKey: customerPubKey,
  senderPublicKey: operatorPubKey,
  attachments: [
    { type: 'reply', label: 'Yes' },
    { type: 'reply', label: 'No' },
  ],
});

// result.content  — encrypted message (base64)
// result.key      — wrapped AES key for recipient (base64)
// result.selfKey  — wrapped AES key for sender (base64)`}
      />

      <h3>decryptEnvelope</h3>
      <CodeBlock
        language="typescript"
        title="decrypt.ts"
        code={`import { decryptEnvelope } from '@ixblix/sdk-js';

const plaintext = decryptEnvelope({
  envelope: encryptedContent,
  encryptedKey: wrappedKey,
  recipientPrivateKey: operatorPrivKey,
});`}
      />

      <h3>encryptMediaToRecipient / decryptMediaEnvelope</h3>
      <CodeBlock
        language="typescript"
        title="media-crypto.ts"
        code={`import { encryptMediaToRecipient, decryptMediaEnvelope } from '@ixblix/sdk-js';

// Encrypt
const encrypted = encryptMediaToRecipient({
  fileBuffer: imageBuffer,
  recipientPublicKey: customerPubKey,
  senderPublicKey: operatorPubKey,
});

// Decrypt
const decrypted = decryptMediaEnvelope({
  envelope: encryptedBuffer,
  encryptedKey: wrappedKey,
  recipientPrivateKey: operatorPrivKey,
});`}
      />

      <h2>{t('sdk.keypair.title')}</h2>
      <CodeBlock
        language="typescript"
        title="keypair-persist.ts"
        code={`import { loadOrCreateOperatorKey } from '@ixblix/sdk-js';

// Loads from disk if exists, otherwise generates and saves
const { publicKey, privateKey } = await loadOrCreateOperatorKey({
  path: './keys/operator.json',
});`}
      />

      <h2>{t('sdk.webhook.title')}</h2>

      <h3>verifyWebhook</h3>
      <CodeBlock
        language="typescript"
        title="verify.ts"
        code={`import { verifyWebhook } from '@ixblix/sdk-js';

const isValid = verifyWebhook(
  req.body,        // raw body (string or object)
  req.headers,     // request headers
  webhookSecret,   // whsec_xxxx
);`}
      />

      <h3>parseWebhook</h3>
      <CodeBlock
        language="typescript"
        title="parse.ts"
        code={`import { parseWebhook } from '@ixblix/sdk-js';

const event = parseWebhook(req.body);
// event.type    — "MESSAGE_RECEIVED" | "CUSTOMER_JOINED" | ...
// event.payload — event-specific data
// event.eventId — unique event ID for dedup
// event.timestamp — ISO 8601 timestamp`}
      />

      <h2>{t('sdk.error.title')}</h2>
      <CodeBlock
        language="typescript"
        title="error.ts"
        code={`import { IxblixError } from '@ixblix/sdk-js';

try {
  await client.conversation.create({ ... });
} catch (err) {
  if (err instanceof IxblixError) {
    err.statusCode;  // 400
    err.code;        // "VALIDATION_ERROR"
    err.message;     // "The 'contactName' field is required."
    err.details;     // [{ field: "contactName", message: "..." }]
  }
}`}
      />

      <PageNav
        prev={{ titleKey: 'Error Handling', path: '/docs/errors' }}
        next={{ titleKey: 'Sample Integrator', path: '/docs/sample-integrator' }}
      />
    </>
  );
}

export default SdkReference;
