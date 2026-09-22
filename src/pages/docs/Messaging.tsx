import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function Messaging() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('messaging.title')}</h1>
      <p className="lead">{t('messaging.lead')}</p>

      <h2>{t('messaging.lifecycle.title')}</h2>
      <ol>
        <li>
          <strong>{t('messaging.lifecycle.create')}</strong> {t('messaging.lifecycle.createDesc')}
        </li>
        <li>
          <strong>{t('messaging.lifecycle.share')}</strong> {t('messaging.lifecycle.shareDesc')}
        </li>
        <li>
          <strong>{t('messaging.lifecycle.join')}</strong> {t('messaging.lifecycle.joinDesc')}
        </li>
        <li>
          <strong>{t('messaging.lifecycle.exchange')}</strong> {t('messaging.lifecycle.exchangeDesc')}
        </li>
        <li>
          <strong>{t('messaging.lifecycle.close')}</strong> {t('messaging.lifecycle.closeDesc')}
        </li>
      </ol>

      <h2>{t('messaging.create.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contactName": "Jane Doe",
    "contactExternalId": "crm-contact-123",
    "originChannel": "whatsapp",
    "metadata": { "ticketId": "TK-456" }
  }'`}
      />

      <h3>{t('messaging.requestBody.title')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('messaging.table.field')}</th>
            <th>{t('messaging.table.type')}</th>
            <th>{t('messaging.table.required')}</th>
            <th>{t('messaging.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>contactName</code>
            </td>
            <td>string</td>
            <td>{t('messaging.table.yes')}</td>
            <td>{t('messaging.table.contactNameDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>contactExternalId</code>
            </td>
            <td>string</td>
            <td>Yes</td>
            <td>{t('messaging.table.contactExternalIdDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>originChannel</code>
            </td>
            <td>string</td>
            <td>{t('messaging.table.no')}</td>
            <td>
              {t('messaging.table.originChannelDesc')} <code>whatsapp</code>, <code>instagram</code>, <code>website</code>, etc.
            </td>
          </tr>
          <tr>
            <td>
              <code>metadata</code>
            </td>
            <td>object</td>
            <td>No</td>
            <td>{t('messaging.table.metadataDesc')}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t('messaging.response.title')}</h3>
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "conversation": {
    "id": "conv_xxxxxxxxxxxx",
    "status": "open",
    "token": "dl_xxxxxxxxxxxx",
    "contact": {
      "id": "cnt_xxxxxxxxxxxx",
      "name": "Jane Doe",
      "externalId": "crm-contact-123"
    }
  },
  "deeplink": "https://api.ixblix.app/c/dl_xxxxxxxxxxxx"
}`}
      />

      <div className="callout callout-info">
        <div className="callout-title">{t('messaging.callout.deeplinkTitle')}</div>
        <p>{t('messaging.callout.deeplinkText')} <code>deeplink</code> {t('messaging.callout.deeplinkEnd')}</p>
      </div>

      <h2>{t('messaging.joins.title')}</h2>
      <p>{t('messaging.joins.text')} <code>CUSTOMER_JOINED</code> {t('messaging.joins.webhook')}</p>
      <CodeBlock
        language="json"
        title="CUSTOMER_JOINED webhook"
        code={`{
  "type": "CUSTOMER_JOINED",
  "eventId": "evt_xxxxxxxxxxxx",
  "timestamp": "2026-01-15T11:00:00.000Z",
  "payload": {
    "conversationId": "conv_xxxxxxxxxxxx",
    "customerPublicKey": "-----BEGIN PUBLIC KEY-----\\nMIIBIjAN..."
  }
}`}
      />

      <div className="callout callout-warning">
        <div className="callout-title">{t('messaging.callout.storeKeyTitle')}</div>
        <p>{t('messaging.callout.storeKeyText')}</p>
      </div>

      <h2>{t('messaging.send.title')}</h2>
      <p>{t('messaging.send.text')} <code>CUSTOMER_JOINED</code> {t('messaging.send.webhook')}</p>
      <CodeBlock
        language="typescript"
        title="send-message.ts"
        code={`import { encryptToRecipient } from '@ixblix/sdk-js';

const customerPublicKey = '...'; // from CUSTOMER_JOINED webhook
const yourPublicKey = '...';     // your operator's RSA public key

const encrypted = encryptToRecipient({
  plaintext: 'Hello Jane! How can we help?',
  recipientPublicKey: customerPublicKey,
  senderPublicKey: yourPublicKey,
});

// Send via API
const response = await fetch('https://api.ixblix.app/api/messages/company', {
  method: 'POST',
  headers: {
    'X-API-Key': 'smci_xxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversationId: 'conv_xxxxxxxxxxxx',
    encryptedContent: encrypted.content,  // AES-256-GCM encrypted message
    encryptedKey: encrypted.key,          // RSA-OAEP wrapped AES key
  }),
});`}
      />

      <h3>{t('messaging.requestBody.title')}</h3>
      <table>
        <thead>
          <tr>
            <th>{t('messaging.table.field')}</th>
            <th>{t('messaging.table.type')}</th>
            <th>{t('messaging.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>conversationId</code>
            </td>
            <td>string</td>
            <td>{t('messaging.send.table.conversationIdDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>encryptedContent</code>
            </td>
            <td>string</td>
            <td>{t('messaging.send.table.encryptedContentDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>encryptedKey</code>
            </td>
            <td>string</td>
            <td>{t('messaging.send.table.encryptedKeyDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>attachments</code>
            </td>
            <td>array</td>
            <td>{t('messaging.send.table.attachmentsDesc')} <a href="/docs/rich-messages">{t('nav.richMessages')}</a></td>
          </tr>
        </tbody>
      </table>

      <h2>{t('messaging.receive.title')}</h2>
      <p>{t('messaging.receive.text')} <code>MESSAGE_RECEIVED</code> {t('messaging.receive.webhook')}</p>
      <CodeBlock
        language="json"
        title="MESSAGE_RECEIVED webhook"
        code={`{
  "type": "MESSAGE_RECEIVED",
  "eventId": "evt_xxxxxxxxxxxx",
  "timestamp": "2026-01-15T11:05:00.000Z",
  "payload": {
    "conversationId": "conv_xxxxxxxxxxxx",
    "messageId": "msg_xxxxxxxxxxxx",
    "encryptedContent": "base64-encoded-ciphertext...",
    "encryptedKey": "base64-encoded-wrapped-key..."
  }
}`}
      />

      <h3>{t('messaging.decrypt.title')}</h3>
      <CodeBlock
        language="typescript"
        title="decrypt-message.ts"
        code={`import { decryptEnvelope } from '@ixblix/sdk-js';

const plaintext = decryptEnvelope({
  envelope: event.payload.encryptedContent,
  encryptedKey: event.payload.encryptedKey,
  recipientPrivateKey: yourOperatorPrivateKey,
});

console.log('Customer said:', plaintext);
// → "Hi, I have a question about my order"`}
      />

      <h2>{t('messaging.list.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl "https://api.ixblix.app/api/messages/conv_xxxxxxxxxxxx?limit=50" \\
  -H "X-API-Key: smci_xxxx"`}
      />
      <p>{t('messaging.list.text')}</p>

      <h2>{t('messaging.read.title')}</h2>
      <h3>{t('messaging.read.operator')}</h3>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/messages/company/read \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "conv_xxxxxxxxxxxx",
    "messageIds": ["msg_xxxx", "msg_yyyy"]
  }'`}
      />
      <p>{t('messaging.read.operatorText')} <code>message_read</code> {t('messaging.read.operatorEnd')}</p>

      <h3>{t('messaging.read.customer')}</h3>
      <p>{t('messaging.read.customerText')} <code>MESSAGE_READ</code> {t('messaging.read.customerEnd')}</p>
      <CodeBlock
        language="json"
        title="MESSAGE_READ webhook"
        code={`{
  "type": "MESSAGE_READ",
  "eventId": "evt_xxxxxxxxxxxx",
  "payload": {
    "conversationId": "conv_xxxxxxxxxxxx",
    "messageIds": ["msg_xxxx"]
  }
}`}
      />

      <h2>{t('messaging.close.title')}</h2>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations/dl_xxxxxxxxxxxx/close`}
      />
      <p>{t('messaging.close.text')} <code>CONVERSATION_CLOSED</code> {t('messaging.close.webhook')}</p>

      <h2>{t('messaging.erase.title')}</h2>
      <p>{t('messaging.erase.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations/dl_xxxxxxxxxxxx/erase`}
      />

      <div className="callout callout-danger">
        <div className="callout-title">{t('messaging.callout.irreversibleTitle')}</div>
        <p>{t('messaging.callout.irreversibleText')}</p>
      </div>

      <PageNav
        prev={{ titleKey: 'Company Registration', path: '/docs/company-registration' }}
        next={{ titleKey: 'Webhooks', path: '/docs/webhooks' }}
      />
    </>
  );
}

export default Messaging;
