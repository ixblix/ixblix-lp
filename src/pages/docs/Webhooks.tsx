import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function Webhooks() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('webhooks.title')}</h1>
      <p className="lead">{t('webhooks.lead')}</p>

      <h2>{t('webhooks.setup.title')}</h2>
      <p>{t('webhooks.setup.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/companies/webhook \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://mycrm.example.com/ixblix/webhooks" }'`}
      />
      <p>{t('webhooks.setup.response')}</p>
      <CodeBlock
        language="json"
        title="Response"
        code={`{
  "webhookUrl": "https://mycrm.example.com/ixblix/webhooks",
  "webhookSecret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxx"
}`}
      />

      <div className="callout callout-warning">
        <div className="callout-title">{t('webhooks.callout.storeTitle')}</div>
        <p>{t('webhooks.callout.storeText')} <code>webhookSecret</code> {t('webhooks.callout.storeEnd')}</p>
      </div>

      <h2>{t('webhooks.verify.title')}</h2>
      <p>{t('webhooks.verify.text')} <code>X-Ixblix-Signature</code> {t('webhooks.verify.header')}</p>

      <h3>{t('webhooks.verify.sdkTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="verify-webhook.ts"
        code={`import { verifyWebhook, parseWebhook } from '@ixblix/sdk-js';

app.post('/ixblix/webhooks', (req, res) => {
  const isValid = verifyWebhook(req.body, req.headers, webhookSecret);
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = parseWebhook(req.body);

  switch (event.type) {
    case 'MESSAGE_RECEIVED':
      handleIncomingMessage(event.payload);
      break;
    case 'CUSTOMER_JOINED':
      handleCustomerJoined(event.payload);
      break;
    // ... handle other events
  }

  // Always respond 200 to acknowledge receipt
  res.status(200).send('OK');
});`}
      />

      <h3>{t('webhooks.verify.manualTitle')}</h3>
      <CodeBlock
        language="typescript"
        title="manual-verify.ts"
        code={`import crypto from 'node:crypto';

function verifySignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}`}
      />

      <h2>{t('webhooks.events.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('webhooks.events.table.event')}</th>
            <th>{t('webhooks.events.table.when')}</th>
            <th>{t('webhooks.events.table.payload')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>MESSAGE_RECEIVED</code>
            </td>
            <td>{t('webhooks.events.messageReceived')}</td>
            <td>
              <code>conversationId</code>, <code>messageId</code>,{' '}
              <code>encryptedContent</code>, <code>encryptedKey</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>MESSAGE_READ</code>
            </td>
            <td>{t('webhooks.events.messageRead')}</td>
            <td>
              <code>conversationId</code>, <code>messageIds</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>CUSTOMER_JOINED</code>
            </td>
            <td>{t('webhooks.events.customerJoined')}</td>
            <td>
              <code>conversationId</code>, <code>customerPublicKey</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>CONVERSATION_CLOSED</code>
            </td>
            <td>{t('webhooks.events.conversationClosed')}</td>
            <td>
              <code>conversationId</code>, <code>closedBy</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>TYPING</code>
            </td>
            <td>{t('webhooks.events.typing')}</td>
            <td>
              <code>conversationId</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>STOPPED_TYPING</code>
            </td>
            <td>{t('webhooks.events.stoppedTyping')}</td>
            <td>
              <code>conversationId</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>RECORDING</code>
            </td>
            <td>{t('webhooks.events.recording')}</td>
            <td>
              <code>conversationId</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>CHAT_CLOSED</code>
            </td>
            <td>{t('webhooks.events.chatClosed')}</td>
            <td>
              <code>conversationId</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>BALANCE_LOW</code>
            </td>
            <td>{t('webhooks.events.balanceLow')}</td>
            <td>
              <code>companyId</code>, <code>balance</code>, <code>threshold</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>{t('webhooks.payload.title')}</h2>
      <p>{t('webhooks.payload.text')}</p>
      <CodeBlock
        language="json"
        title="Event structure"
        code={`{
  "type": "MESSAGE_RECEIVED",
  "eventId": "evt_xxxxxxxxxxxx",
  "timestamp": "2026-01-15T11:05:00.000Z",
  "companyId": "cmp_xxxxxxxxxxxx",
  "payload": {
    // Event-specific fields
  }
}`}
      />

      <h2>{t('webhooks.headers.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('webhooks.headers.table.header')}</th>
            <th>{t('webhooks.headers.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>X-Ixblix-Signature</code>
            </td>
            <td>{t('webhooks.headers.signatureDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>X-Ixblix-Event-Id</code>
            </td>
            <td>{t('webhooks.headers.eventIdDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>Content-Type</code>
            </td>
            <td>
              <code>application/json</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>{t('webhooks.delivery.title')}</h2>
      <ul>
        <li>
          <strong>{t('webhooks.delivery.atLeastOnce')}</strong>{t('webhooks.delivery.atLeastOnceDesc')}
        </li>
        <li>
          <strong>{t('webhooks.delivery.backoff')}</strong>{t('webhooks.delivery.backoffDesc')}
        </li>
        <li>
          <strong>{t('webhooks.delivery.idempotency')}</strong>{t('webhooks.delivery.idempotencyDesc')} <code>X-Ixblix-Event-Id</code>{t('webhooks.delivery.idempotencyEnd')}
        </li>
        <li>
          <strong>{t('webhooks.delivery.timeout')}</strong>{t('webhooks.delivery.timeoutDesc')}
        </li>
      </ul>

      <div className="callout callout-info">
        <div className="callout-title">{t('webhooks.callout.respondTitle')}</div>
        <p>{t('webhooks.callout.respondText')} <code>200 OK</code> {t('webhooks.callout.respondEnd')}</p>
      </div>

      <h2>{t('webhooks.rotate.title')}</h2>
      <p>{t('webhooks.rotate.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/companies/webhook \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://mycrm.example.com/ixblix/webhooks" }'`}
      />
      <p>{t('webhooks.rotate.end')} <code>webhookSecret</code> {t('webhooks.rotate.returned')}</p>

      <PageNav
        prev={{ titleKey: 'Send & Receive Messages', path: '/docs/messaging' }}
        next={{ titleKey: 'End-to-End Encryption', path: '/docs/e2e-encryption' }}
      />
    </>
  );
}

export default Webhooks;
