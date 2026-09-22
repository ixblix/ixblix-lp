import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function Presence() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('presence.title')}</h1>
      <p className="lead">{t('presence.lead')}</p>

      <h2>{t('presence.types.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('presence.types.table.type')}</th>
            <th>{t('presence.types.table.direction')}</th>
            <th>{t('presence.types.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>TYPING</code>
            </td>
            <td>{t('presence.types.both')}</td>
            <td>{t('presence.types.typingDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>RECORDING</code>
            </td>
            <td>{t('presence.types.customerOperator')}</td>
            <td>{t('presence.types.recordingDesc')}</td>
          </tr>
          <tr>
            <td>
              <code>CHAT_CLOSED</code>
            </td>
            <td>Customer → Operator</td>
            <td>{t('presence.types.chatClosedDesc')}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('presence.operator.title')}</h2>
      <p>{t('presence.operator.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations/conv_xxxx/presence \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "type": "TYPING" }'`}
      />
      <p>{t('presence.operator.ui')}</p>

      <h3>{t('presence.operator.identityTitle')}</h3>
      <p>{t('presence.operator.identityText')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X PUT https://api.ixblix.app/api/conversations/conv_xxxx/operator \\
  -H "X-API-Key: smci_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sarah from Support",
    "avatarUrl": "https://acme.example.com/avatars/sarah.png"
  }'`}
      />

      <h2>{t('presence.customer.title')}</h2>
      <p>{t('presence.customer.text')}</p>

      <h3>{t('presence.customer.typingTitle')}</h3>
      <CodeBlock
        language="json"
        title="TYPING webhook"
        code={`{
  "type": "TYPING",
  "eventId": "evt_xxxx",
  "payload": {
    "conversationId": "conv_xxxx"
  }
}`}
      />

      <h3>{t('presence.customer.recordingTitle')}</h3>
      <CodeBlock
        language="json"
        title="RECORDING webhook"
        code={`{
  "type": "RECORDING",
  "eventId": "evt_xxxx",
  "payload": {
    "conversationId": "conv_xxxx"
  }
}`}
      />

      <h3>{t('presence.customer.chatClosedTitle')}</h3>
      <CodeBlock
        language="json"
        title="CHAT_CLOSED webhook"
        code={`{
  "type": "CHAT_CLOSED",
  "eventId": "evt_xxxx",
  "payload": {
    "conversationId": "conv_xxxx"
  }
}`}
      />

      <h2>{t('presence.relay.title')}</h2>
      <p>{t('presence.relay.text')}</p>
      <CodeBlock
        language="bash"
        title="cURL"
        code={`curl -X POST https://api.ixblix.app/api/conversations/dl_xxxx/presence \\
  -H "Content-Type: application/json" \\
  -d '{ "type": "TYPING" }'`}
      />
      <p>{t('presence.relay.end')} <strong>{t('presence.relay.without')}</strong> {t('presence.relay.an')} <code>X-API-Key</code> {t('presence.relay.and')} <code>TYPING</code>{t('presence.relay.webhook')}</p>

      <h2>{t('presence.best.title')}</h2>
      <ul>
        <li>
          {t('presence.best.typing')} <code>TYPING</code>{t('presence.best.typingEnd')}
        </li>
        <li>
          {t('presence.best.throttle')}
        </li>
        <li>
          {t('presence.best.recording')} <code>RECORDING</code>{t('presence.best.recordingEnd')}
        </li>
      </ul>

      <PageNav
        prev={{ titleKey: 'Media Attachments', path: '/docs/media' }}
        next={{ titleKey: 'Key Transfer', path: '/docs/key-transfer' }}
      />
    </>
  );
}

export default Presence;
