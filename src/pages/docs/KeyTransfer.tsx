import CodeBlock from "../../components/CodeBlock";
import PageNav from "../../components/PageNav";
import { useI18n } from "../../i18n";

function KeyTransfer() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t("keytransfer.title")}</h1>
      <p className="lead">{t("keytransfer.lead")}</p>

      <h2>{t("keytransfer.when.title")}</h2>
      <p>{t("keytransfer.when.text")}</p>

      <h2>{t("keytransfer.how.title")}</h2>
      <ol className="steps">
        <li>
          <strong>{t("keytransfer.how.step1")}</strong>{" "}
          {t("keytransfer.how.step1Desc")}
        </li>
        <li>
          <strong>{t("keytransfer.how.step2")}</strong>{" "}
          {t("keytransfer.how.step2Desc")}
        </li>
        <li>
          <strong>{t("keytransfer.how.step3")}</strong>{" "}
          {t("keytransfer.how.step3Desc")}
        </li>
        <li>
          <strong>{t("keytransfer.how.step4")}</strong>{" "}
          {t("keytransfer.how.step4Desc")}
        </li>
        <li>
          <strong>{t("keytransfer.how.step5")}</strong>{" "}
          {t("keytransfer.how.step5Desc")}
        </li>
      </ol>

      <h2>{t("keytransfer.security.title")}</h2>
      <ul>
        <li>
          <strong>{t("keytransfer.security.ttl")}</strong>
          {t("keytransfer.security.ttlDesc")}
        </li>
        <li>
          <strong>{t("keytransfer.security.attempts")}</strong>
          {t("keytransfer.security.attemptsDesc")}
        </li>
        <li>
          <strong>{t("keytransfer.security.kek")}</strong>
          {t("keytransfer.security.kekDesc")}
        </li>
        <li>
          <strong>{t("keytransfer.security.spki")}</strong>
          {t("keytransfer.security.spkiDesc")}
        </li>
        <li>
          <strong>{t("keytransfer.security.onetime")}</strong>
          {t("keytransfer.security.onetimeDesc")}
        </li>
      </ul>

      <h2>{t("keytransfer.create.title")}</h2>
      <CodeBlock
        language="typescript"
        title="create-transfer.ts"
        code={`import crypto from 'node:crypto';

// Your existing keypair
const publicKeyPem = '...';  // SPKI format
const privateKeyPem = '...'; // PKCS8 format

// Generate a random PIN (6 digits)
const pin = Math.floor(100000 + Math.random() * 900000).toString();

// Derive encryption key from PIN
const salt = crypto.randomBytes(16);
const kek = crypto.pbkdf2Sync(pin, salt, 200_000, 32, 'sha256');

// Encrypt the keypair
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
const keypairJson = JSON.stringify({ publicKey: publicKeyPem, privateKey: privateKeyPem });
const encrypted = Buffer.concat([cipher.update(keypairJson, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();

// Upload
const response = await fetch('https://api.ixblix.app/api/key-transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationToken: 'dl_xxxx',
    encryptedPayload: encrypted.toString('base64'),
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  }),
});

const { transferId } = await response.json();
// → Show PIN and link/QR to user
console.log('Transfer ID:', transferId);
console.log('PIN:', pin);
console.log('Link: https://app.ixblix.app/transfer/' + transferId);`}
      />

      <h2>{t("keytransfer.retrieve.title")}</h2>
      <CodeBlock
        language="typescript"
        title="retrieve-transfer.ts"
        code={`import crypto from 'node:crypto';

// User enters the transfer ID and PIN
const transferId = 'trf_xxxx';
const pin = '123456'; // entered by user

// Fetch the encrypted payload
const response = await fetch(
  \`https://api.ixblix.app/api/key-transfer/\${transferId}\`,
);
const { encryptedPayload, salt, iv, authTag } = await response.json();

// Derive the same key from PIN
const kek = crypto.pbkdf2Sync(
  pin,
  Buffer.from(salt, 'base64'),
  200_000,
  32,
  'sha256',
);

// Decrypt
const decipher = crypto.createDecipheriv(
  'aes-256-gcm',
  kek,
  Buffer.from(iv, 'base64'),
);
decipher.setAuthTag(Buffer.from(authTag, 'base64'));
const decrypted = Buffer.concat([
  decipher.update(Buffer.from(encryptedPayload, 'base64')),
  decipher.final(),
]);

const { publicKey, privateKey } = JSON.parse(decrypted.toString('utf8'));

// Validate the public key is valid SPKI
crypto.createPublicKey(publicKey);

// Store securely in the target device
await secureStorage.save({ publicKey, privateKey });

// Confirm the transfer
await fetch(
  \`https://api.ixblix.app/api/key-transfer/\${transferId}/confirm\`,
  { method: 'POST' },
);`}
      />

      <h2>{t("keytransfer.poll.title")}</h2>
      <p>{t("keytransfer.poll.text")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl https://api.ixblix.app/api/key-transfer/trf_xxxx/status`}
      />
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "transferId": "trf_xxxx",
  "status": "confirmed",
  "createdAt": "2026-01-15T12:00:00.000Z",
  "expiresAt": "2026-01-15T12:05:00.000Z"
}`}
      />

      <h2>{t("keytransfer.delete.title")}</h2>
      <p>{t("keytransfer.delete.text")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X DELETE https://api.ixblix.app/api/key-transfer/trf_xxxx`}
      />

      <div className="callout callout-info">
        <div className="callout-title">
          {t("keytransfer.callout.autoTitle")}
        </div>
        <p>{t("keytransfer.callout.autoText")}</p>
      </div>

      <h2>{t("keytransfer.api.createTitle")}</h2>
      <p>{t("keytransfer.api.createText")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/key-transfer \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationToken": "dl_xxxx",
    "encryptedPayload": "base64-aes-256-gcm-encrypted-keypair",
    "salt": "base64-pbkdf2-salt",
    "iv": "base64-gcm-iv",
    "authTag": "base64-gcm-auth-tag"
  }'

# Response: { "transferId": "trf_xxxx" }`}
      />

      <h2>{t("keytransfer.api.retrieveTitle")}</h2>
      <p>{t("keytransfer.api.retrieveText")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`# Fetch the encrypted payload
curl https://api.ixblix.app/api/key-transfer/trf_xxxx

# Response:
# {
#   "encryptedPayload": "base64...",
#   "salt": "base64...",
#   "iv": "base64...",
#   "authTag": "base64..."
# }

# After decrypting with the PIN, confirm the transfer:
curl -X POST https://api.ixblix.app/api/key-transfer/trf_xxxx/confirm`}
      />

      <PageNav
        prev={{ titleKey: "Presence & Typing", path: "/docs/presence" }}
        next={{ titleKey: "Authentication", path: "/docs/auth" }}
      />
    </>
  );
}

export default KeyTransfer;
