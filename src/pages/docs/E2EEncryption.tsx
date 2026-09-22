import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function E2EEncryption() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('e2ee.title')}</h1>
      <p className="lead">{t('e2ee.lead')}</p>

      <h2>{t('e2ee.scheme.title')}</h2>
      <p>{t('e2ee.scheme.text')}</p>
      <ul>
        <li>
          <strong>RSA-OAEP</strong> (2048-bit, SHA-256) {t('e2ee.scheme.rsa')}
        </li>
        <li>
          <strong>AES-256-GCM</strong> {t('e2ee.scheme.aes')}
        </li>
      </ul>
      <p>{t('e2ee.scheme.fresh')}</p>

      <h2>{t('e2ee.how.title')}</h2>
      <ol>
        <li>
          <strong>{t('e2ee.how.operator')}</strong> {t('e2ee.how.operatorDesc')}
        </li>
        <li>
          <strong>{t('e2ee.how.customer')}</strong> {t('e2ee.how.customerDesc')}
        </li>
        <li>
          <strong>{t('e2ee.how.send')}</strong>{t('e2ee.how.sendDesc')}
          <ul>
            <li>{t('e2ee.how.genAes')}</li>
            <li>{t('e2ee.how.encryptMsg')}</li>
            <li>{t('e2ee.how.wrapRecipient')}</li>
            <li>{t('e2ee.how.wrapSelf')}</li>
            <li>{t('e2ee.how.sendApi')}</li>
          </ul>
        </li>
        <li>
          <strong>{t('e2ee.how.read')}</strong>{t('e2ee.how.readDesc')}
          <ul>
            <li>{t('e2ee.how.unwrap')}</li>
            <li>{t('e2ee.how.decrypt')}</li>
          </ul>
        </li>
      </ol>

      <h2>{t('e2ee.gen.title')}</h2>
      <CodeBlock
        language="typescript"
        title="generate-keypair.ts"
        code={`import { generateOperatorKeyPair } from '@ixblix/sdk-js';

const { publicKey, privateKey } = await generateOperatorKeyPair();

// publicKey and privateKey are in SPKI/PKCS8 PEM format
console.log('Public Key:', publicKey);
// → "-----BEGIN PUBLIC KEY-----\nMIIBIjANBg..."

console.log('Private Key:', privateKey);
// → "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADA..."`}
      />

      <h3>{t('e2ee.gen.nodeTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="node-crypto.ts"
        code={`import crypto from 'node:crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});`}
      />

      <h2>{t('e2ee.register.title')}</h2>
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

      <h2>{t('e2ee.encrypt.title')}</h2>
      <CodeBlock
        language="typescript"
        title="encrypt.ts"
        code={`import { encryptToRecipient } from '@ixblix/sdk-js';

const result = encryptToRecipient({
  plaintext: 'Hello, this is a secret message!',
  recipientPublicKey: customerPublicKey,  // from CUSTOMER_JOINED webhook
  senderPublicKey: operatorPublicKey,     // your registered public key
});

// result.content — AES-256-GCM encrypted message (base64)
// result.key     — RSA-OAEP wrapped AES key for recipient (base64)
// result.selfKey — RSA-OAEP wrapped AES key for sender (base64)

// Send to API
await fetch('https://api.ixblix.app/api/messages/company', {
  method: 'POST',
  headers: {
    'X-API-Key': 'smci_xxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversationId: 'conv_xxxx',
    encryptedContent: result.content,
    encryptedKey: result.key,
  }),
});`}
      />

      <h2>{t('e2ee.decrypt.title')}</h2>
      <CodeBlock
        language="typescript"
        title="decrypt.ts"
        code={`import { decryptEnvelope } from '@ixblix/sdk-js';

// From MESSAGE_RECEIVED webhook
const encryptedContent = event.payload.encryptedContent;
const encryptedKey = event.payload.encryptedKey;

const plaintext = decryptEnvelope({
  envelope: encryptedContent,
  encryptedKey: encryptedKey,
  recipientPrivateKey: operatorPrivateKey,
});

console.log('Decrypted:', plaintext);`}
      />

      <h2>{t('e2ee.media.title')}</h2>
      <p>{t('e2ee.media.text')}</p>
      <CodeBlock
        language="typescript"
        title="encrypt-media.ts"
        code={`import { encryptMediaToRecipient, decryptMediaEnvelope } from '@ixblix/sdk-js';

// Encrypt
const encrypted = encryptMediaToRecipient({
  fileBuffer: imageBuffer,
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorPublicKey,
});

// Upload encrypted media
const { mediaId } = await uploadMedia(encrypted.content);

// Send message referencing the media
await sendMessage({
  conversationId: 'conv_xxxx',
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
  mediaId,
});

// Decrypt received media
const decrypted = decryptMediaEnvelope({
  envelope: encryptedMediaBuffer,
  encryptedKey: wrappedKey,
  recipientPrivateKey: operatorPrivateKey,
});`}
      />

      <h2>{t('e2ee.keyMgmt.title')}</h2>

      <h3>{t('e2ee.keyMgmt.storeTitle')}</h3>
      <p>{t('e2ee.keyMgmt.storeText')}</p>
      <ul>
        <li>
          <strong>{t('e2ee.keyMgmt.env')}</strong>{t('e2ee.keyMgmt.envDesc')}
        </li>
        <li>
          <strong>{t('e2ee.keyMgmt.db')}</strong>{t('e2ee.keyMgmt.dbDesc')}
        </li>
        <li>
          <strong>{t('e2ee.keyMgmt.vault')}</strong>{t('e2ee.keyMgmt.vaultDesc')}
        </li>
      </ul>

      <div className="callout callout-danger">
        <div className="callout-title">{t('e2ee.callout.neverTitle')}</div>
        <p>{t('e2ee.callout.neverText')}</p>
      </div>

      <h3>{t('e2ee.keyMgmt.retrieveTitle')}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/companies/encryption-key \\
  -H "X-API-Key: smci_xxxx"`}
      />

      <h3>{t('e2ee.keyMgmt.convKeysTitle')}</h3>
      <p>{t('e2ee.keyMgmt.convKeysText')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/conversations/conv_xxxx/keys \\
  -H "X-API-Key: smci_xxxx"`}
      />
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "operatorPublicKey": "-----BEGIN PUBLIC KEY-----\\n...",
  "customerPublicKey": "-----BEGIN PUBLIC KEY-----\\n..."
}`}
      />

      <h2>{t('e2ee.security.title')}</h2>
      <ul>
        <li>
          <strong>{t('e2ee.security.forward')}</strong>{t('e2ee.security.forwardDesc')}
        </li>
        <li>
          <strong>{t('e2ee.security.server')}</strong>{t('e2ee.security.serverDesc')}
        </li>
        <li>
          <strong>{t('e2ee.security.auth')}</strong>{t('e2ee.security.authDesc')}
        </li>
        <li>
          <strong>{t('e2ee.security.selfRead')}</strong>{t('e2ee.security.selfReadDesc')}
        </li>
      </ul>

      <PageNav
        prev={{ titleKey: 'Webhooks', path: '/docs/webhooks' }}
        next={{ titleKey: 'Rich Messages', path: '/docs/rich-messages' }}
      />
    </>
  );
}

export default E2EEncryption;
