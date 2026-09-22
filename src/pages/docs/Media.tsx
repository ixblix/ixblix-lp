import CodeBlock from "../../components/CodeBlock";
import PageNav from "../../components/PageNav";
import { useI18n } from "../../i18n";

function Media() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t("media.title")}</h1>
      <p className="lead">{t("media.lead")}</p>

      <h2>{t("media.how.title")}</h2>
      <p>{t("media.how.text")}</p>
      <ol>
        <li>{t("media.how.step1")}</li>
        <li>{t("media.how.step2")}</li>
        <li>{t("media.how.step3")}</li>
        <li>{t("media.how.step4")}</li>
        <li>{t("media.how.step5")}</li>
      </ol>

      <h2>{t("media.upload.title")}</h2>
      <CodeBlock
        language="typescript"
        title="upload-media.ts"
        code={`import { encryptMediaToRecipient } from '@ixblix/sdk-js';
import fs from 'node:fs';
import { useI18n } from '../../i18n';

// Read the file
const fileBuffer = fs.readFileSync('./invoice.pdf');

// Encrypt
const encrypted = encryptMediaToRecipient({
  fileBuffer,
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorPublicKey,
});

// Upload encrypted file
const uploadResponse = await fetch(
  'https://api.ixblix.app/api/media/company',
  {
    method: 'POST',
    headers: {
      'X-API-Key': 'smci_xxxx',
      'Content-Type': 'application/octet-stream',
      'X-Media-Type': 'document',
      'X-Media-Filename': 'invoice.pdf',
      'X-Media-Mime': 'application/pdf',
    },
    body: encrypted.content,
  },
);

const { mediaId } = await uploadResponse.json();

// Send message with media reference
await fetch('https://api.ixblix.app/api/messages/company', {
  method: 'POST',
  headers: {
    'X-API-Key': 'smci_xxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversationId: 'conv_xxxx',
    encryptedContent: encrypted.content,
    encryptedKey: encrypted.key,
    mediaId,
  }),
});`}
      />

      <h2>{t("media.uploadCustomer.title")}</h2>
      <p>
        {t("media.uploadCustomer.text")} <code>MESSAGE_RECEIVED</code>{" "}
        {t("media.uploadCustomer.webhook")} <code>mediaId</code>
        {t("media.uploadCustomer.end")}
      </p>
      <CodeBlock
        language="json"
        title="MESSAGE_RECEIVED with media"
        code={`{
  "type": "MESSAGE_RECEIVED",
  "payload": {
    "conversationId": "conv_xxxx",
    "messageId": "msg_xxxx",
    "encryptedContent": "base64...",
    "encryptedKey": "base64...",
    "media": {
      "mediaId": "med_xxxx",
      "type": "image",
      "filename": "photo.jpg",
      "mimeType": "image/jpeg",
      "size": 245000
    }
  }
}`}
      />

      <h2>{t("media.download.title")}</h2>
      <h3>{t("media.download.company")}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`# Get media metadata
curl https://api.ixblix.app/api/media/med_xxxx \\
  -H "X-API-Key: smci_xxxx"

# Download encrypted content
curl https://api.ixblix.app/api/media/med_xxxx/content \\
  -H "X-API-Key: smci_xxxx" \\
  --output encrypted_file.bin`}
      />

      <h3>{t("media.download.decryptTitle")}</h3>
      <CodeBlock
        language="typescript"
        title="decrypt-media.ts"
        code={`import { decryptMediaEnvelope } from '@ixblix/sdk-js';
import fs from 'node:fs';

const encryptedBuffer = fs.readFileSync('./encrypted_file.bin');

const decrypted = decryptMediaEnvelope({
  envelope: encryptedBuffer,
  encryptedKey: messageEncryptedKey,
  recipientPrivateKey: operatorPrivateKey,
});

fs.writeFileSync('./invoice_decrypted.pdf', decrypted);`}
      />

      <h2>{t("media.types.title")}</h2>
      <table>
        <thead>
          <tr>
            <th>{t("media.types.table.type")}</th>
            <th>{t("media.types.table.formats")}</th>
            <th>{t("media.types.table.maxSize")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>image</code>
            </td>
            <td>JPEG, PNG, GIF, WebP</td>
            <td>10 MB</td>
          </tr>
          <tr>
            <td>
              <code>audio</code>
            </td>
            <td>OGG, MP3, AAC, WAV</td>
            <td>16 MB</td>
          </tr>
          <tr>
            <td>
              <code>video</code>
            </td>
            <td>MP4, WebM</td>
            <td>50 MB</td>
          </tr>
          <tr>
            <td>
              <code>document</code>
            </td>
            <td>PDF, DOC, DOCX, XLS, XLSX, TXT</td>
            <td>25 MB</td>
          </tr>
        </tbody>
      </table>

      <h2>{t("media.metadata.title")}</h2>
      <CodeBlock
        language="json"
        title="GET /api/media/:mediaId response"
        code={`{
  "mediaId": "med_xxxx",
  "type": "image",
  "filename": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 245000,
  "uploadedBy": "company",
  "conversationId": "conv_xxxx",
  "createdAt": "2026-01-15T12:00:00.000Z"
}`}
      />

      <h2>{t("media.api.uploadTitle")}</h2>
      <p>{t("media.api.uploadText")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`# Upload encrypted media file
curl -X POST https://api.ixblix.app/api/media/company \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/octet-stream" \\
  -H "X-Media-Type: document" \\
  -H "X-Media-Filename: invoice.pdf" \\
  -H "X-Media-Mime: application/pdf" \\
  --data-binary @encrypted_file.bin

# Response: { "mediaId": "med_xxxx" }

# Then send a message referencing the media
curl -X POST https://api.ixblix.app/api/messages/company \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64-aes-256-gcm-ciphertext",
    "encryptedKey": "base64-rsa-oaep-wrapped-aes-key",
    "mediaId": "med_xxxx"
  }'`}
      />

      <PageNav
        prev={{ titleKey: "Rich Messages", path: "/docs/rich-messages" }}
        next={{ titleKey: "Presence & Typing", path: "/docs/presence" }}
      />
    </>
  );
}

export default Media;
