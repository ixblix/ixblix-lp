import CodeBlock from "../../components/CodeBlock";
import PageNav from "../../components/PageNav";
import { useI18n } from "../../i18n";

function RichMessages() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t("rich.title")}</h1>
      <p className="lead">{t("rich.lead")}</p>

      <h2>{t("rich.overview.title")}</h2>
      <p>
        {t("rich.overview.text")} <code>attachments</code>{" "}
        {t("rich.overview.alongside")}
      </p>
      <p>
        {t("rich.overview.operator")}{" "}
        <strong>{t("rich.overview.operatorBold")}</strong>
        {t("rich.overview.operatorEnd")}
      </p>

      <h2>{t("rich.types.title")}</h2>

      <h3>{t("rich.types.quickReply.title")}</h3>
      <p>
        {t("rich.types.quickReply.text")} <code>label</code>
        {t("rich.types.quickReply.end")}
      </p>
      <CodeBlock
        language="typescript"
        title="quick-reply.ts"
        code={`const attachments = [
  { type: 'reply', label: 'Yes, confirm order' },
  { type: 'reply', label: 'No, cancel' },
  { type: 'reply', label: 'Talk to a human' },
];`}
      />

      <h3>{t("rich.types.url.title")}</h3>
      <p>{t("rich.types.url.text")}</p>
      <CodeBlock
        language="typescript"
        title="url-button.ts"
        code={`const attachments = [
  {
    type: 'url',
    label: 'Track your order',
    url: 'https://acme.example.com/track/TK-456',
  },
];`}
      />

      <h3>{t("rich.types.copy.title")}</h3>
      <p>{t("rich.types.copy.text")}</p>
      <CodeBlock
        language="typescript"
        title="copy-button.ts"
        code={`const attachments = [
  {
    type: 'copy',
    label: 'Copy order number',
    value: 'ORD-2026-001234',
  },
];`}
      />

      <h3>{t("rich.types.pix.title")}</h3>
      <p>{t("rich.types.pix.text")}</p>
      <CodeBlock
        language="typescript"
        title="pix-button.ts"
        code={`const attachments = [
  {
    type: 'pix',
    label: 'Copy Pix code',
    value: '00020126580014br.gov.bcb.pix...',
  },
];`}
      />

      <h3>{t("rich.types.vcard.title")}</h3>
      <p>{t("rich.types.vcard.text")}</p>
      <CodeBlock
        language="typescript"
        title="vcard.ts"
        code={`const attachments = [
  {
    type: 'vcard',
    name: 'John Support',
    phone: '+5511999998888',
    organization: 'Acme Corp',
  },
];`}
      />

      <h3>{t("rich.types.location.title")}</h3>
      <p>{t("rich.types.location.text")}</p>
      <CodeBlock
        language="typescript"
        title="location.ts"
        code={`const attachments = [
  {
    type: 'location',
    latitude: -23.5505,
    longitude: -46.6333,
    name: 'Acme Store',
    address: 'Av. Paulista, 1000 — São Paulo, SP',
  },
];`}
      />

      <h2>{t("rich.sending.title")}</h2>
      <p>{t("rich.sending.text")}</p>
      <CodeBlock
        language="typescript"
        title="send-rich.ts"
        code={`import { encryptToRecipient, encryptAttachments } from '@ixblix/sdk-js';

const plaintext = 'Please confirm your order:';
const attachments = [
  { type: 'reply', label: 'Confirm' },
  { type: 'reply', label: 'Cancel' },
  { type: 'url', label: 'View details', url: 'https://acme.example.com/order/123' },
];

// Encrypt message + attachments with the same AES key
const encrypted = encryptToRecipient({
  plaintext,
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorPublicKey,
  attachments,  // attachments are encrypted with the same AES key
});

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
  }),
});`}
      />

      <h2>{t("rich.rendering.title")}</h2>
      <ul>
        <li>
          <strong>{t("rich.rendering.inline")}</strong>
          {t("rich.rendering.inlineDesc")}
        </li>
        <li>
          <strong>{t("rich.rendering.modal")}</strong>
          {t("rich.rendering.modalDesc")}
        </li>
        <li>{t("rich.rendering.order")}</li>
        <li>
          {t("rich.rendering.reply")} <code>reply</code>
          {t("rich.rendering.replyEnd")}
        </li>
        <li>
          <code>url</code> {t("rich.rendering.url")}
        </li>
        <li>
          <code>copy</code> {t("rich.rendering.copy")} <code>pix</code>
          {t("rich.rendering.copyEnd")}
        </li>
      </ul>

      <h2>{t("rich.mixing.title")}</h2>
      <p>{t("rich.mixing.text")}</p>
      <CodeBlock
        language="typescript"
        title="mixed.ts"
        code={`const attachments = [
  { type: 'reply', label: 'Yes' },
  { type: 'reply', label: 'No' },
  { type: 'url', label: 'Learn more', url: 'https://example.com' },
  { type: 'copy', label: 'Copy code', value: 'SAVE20' },
  { type: 'vcard', name: 'Support', phone: '+5511999998888', organization: 'Acme' },
];`}
      />

      <h2>{t("rich.api.title")}</h2>
      <p>{t("rich.api.text")}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/messages/company \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64-aes-256-gcm-ciphertext",
    "encryptedKey": "base64-rsa-oaep-wrapped-aes-key",
    "attachments": [
      { "type": "reply", "label": "Confirm" },
      { "type": "reply", "label": "Cancel" },
      { "type": "url", "label": "View details", "url": "https://acme.example.com/order/123" }
    ]
  }'`}
      />
      <p>
        The <code>attachments</code> array is encrypted with the same AES key as
        the message content before being sent. Each attachment object follows
        the types documented above.
      </p>

      <PageNav
        prev={{
          titleKey: "End-to-End Encryption",
          path: "/docs/e2e-encryption",
        }}
        next={{ titleKey: "Media Attachments", path: "/docs/media" }}
      />
    </>
  );
}

export default RichMessages;
