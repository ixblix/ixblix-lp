import CodeBlock from '../../components/CodeBlock';
import PageNav from '../../components/PageNav';
import { useI18n } from '../../i18n';

function ErrorHandling() {
  const { t } = useI18n();
  return (
    <>
      <h1>{t('errors.title')}</h1>
      <p className="lead">{t('errors.lead')}</p>

      <h2>{t('errors.format.title')}</h2>
      <p>{t('errors.format.text')}</p>
      <CodeBlock
        language="json"
        title="Error response"
        code={`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The 'contactName' field is required.",
    "details": [
      {
        "field": "contactName",
        "message": "Must be a non-empty string"
      }
    ]
  }
}`}
      />

      <h2>{t('errors.status.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('errors.status.table.code')}</th>
            <th>{t('errors.status.table.meaning')}</th>
            <th>{t('errors.status.table.cause')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>400</code>
            </td>
            <td>{t('errors.status.400')}</td>
            <td>{t('errors.status.400cause')}</td>
          </tr>
          <tr>
            <td>
              <code>401</code>
            </td>
            <td>{t('errors.status.401')}</td>
            <td>{t('errors.status.401cause')}</td>
          </tr>
          <tr>
            <td>
              <code>403</code>
            </td>
            <td>{t('errors.status.403')}</td>
            <td>{t('errors.status.403cause')}</td>
          </tr>
          <tr>
            <td>
              <code>404</code>
            </td>
            <td>{t('errors.status.404')}</td>
            <td>{t('errors.status.404cause')}</td>
          </tr>
          <tr>
            <td>
              <code>409</code>
            </td>
            <td>{t('errors.status.409')}</td>
            <td>{t('errors.status.409cause')}</td>
          </tr>
          <tr>
            <td>
              <code>422</code>
            </td>
            <td>{t('errors.status.422')}</td>
            <td>{t('errors.status.422cause')}</td>
          </tr>
          <tr>
            <td>
              <code>429</code>
            </td>
            <td>{t('errors.status.429')}</td>
            <td>{t('errors.status.429cause')}</td>
          </tr>
          <tr>
            <td>
              <code>500</code>
            </td>
            <td>{t('errors.status.500')}</td>
            <td>{t('errors.status.500cause')}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('errors.codes.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('errors.codes.table.code')}</th>
            <th>{t('errors.codes.table.description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>VALIDATION_ERROR</code>
            </td>
            <td>{t('errors.codes.validation')}</td>
          </tr>
          <tr>
            <td>
              <code>AUTHENTICATION_REQUIRED</code>
            </td>
            <td>{t('errors.codes.authRequired')}</td>
          </tr>
          <tr>
            <td>
              <code>INVALID_CREDENTIALS</code>
            </td>
            <td>{t('errors.codes.invalidCreds')}</td>
          </tr>
          <tr>
            <td>
              <code>COMPANY_NOT_ACTIVE</code>
            </td>
            <td>{t('errors.codes.notActive')}</td>
          </tr>
          <tr>
            <td>
              <code>CONVERSATION_NOT_FOUND</code>
            </td>
            <td>{t('errors.codes.notFound')}</td>
          </tr>
          <tr>
            <td>
              <code>CONVERSATION_CLOSED</code>
            </td>
            <td>{t('errors.codes.closed')}</td>
          </tr>
          <tr>
            <td>
              <code>ENCRYPTION_KEY_REQUIRED</code>
            </td>
            <td>{t('errors.codes.encryption')}</td>
          </tr>
          <tr>
            <td>
              <code>INSUFFICIENT_BALANCE</code>
            </td>
            <td>{t('errors.codes.balance')}</td>
          </tr>
          <tr>
            <td>
              <code>WEBHOOK_URL_UNREACHABLE</code>
            </td>
            <td>{t('errors.codes.webhook')}</td>
          </tr>
          <tr>
            <td>
              <code>RATE_LIMIT_EXCEEDED</code>
            </td>
            <td>{t('errors.codes.rateLimit')}</td>
          </tr>
          <tr>
            <td>
              <code>INTERNAL_ERROR</code>
            </td>
            <td>{t('errors.codes.internal')}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t('errors.sdk.title')}</h2>
      <CodeBlock
        language="typescript"
        title="error-handling.ts"
        code={`import { IxblixClient, IxblixError } from '@ixblix/sdk-js';

const client = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey: 'smci_xxxx',
});

try {
  const conversation = await client.conversation.create({
    contactName: 'Jane',
    contactExternalId: 'c-123',
  });
} catch (err) {
  if (err instanceof IxblixError) {
    console.error('API Error:', err.code);     // "VALIDATION_ERROR"
    console.error('Message:', err.message);    // "The 'contactName' field..."
    console.error('Status:', err.statusCode);  // 400
    console.error('Details:', err.details);    // [{ field, message }]
  } else {
    // Network error or unexpected issue
    console.error('Unexpected error:', err);
  }
}`}
      />

      <h2>{t('errors.retry.title')}</h2>
      <p>{t('errors.retry.text')} <code>429</code> {t('errors.retry.end')}</p>
      <CodeBlock
        language="typescript"
        title="retry.ts"
        code={`async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof IxblixError) {
        const isRetryable =
          err.statusCode === 429 || err.statusCode >= 500;

        if (!isRetryable || attempt === maxRetries) throw err;

        const delay = Math.min(1000 * 2 ** attempt, 10_000);
        const jitter = Math.random() * 1000;
        await new Promise((r) => setTimeout(r, delay + jitter));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Unreachable');
}`}
      />

      <h2>{t('errors.webhook.title')}</h2>
      <p>{t('errors.webhook.text')}</p>
      <ul>
        <li>{t('errors.webhook.retries')}</li>
        <li>{t('errors.webhook.backoff')}</li>
        <li>{t('errors.webhook.dedup')} <code>X-Ixblix-Event-Id</code>{t('errors.webhook.dedupEnd')}</li>
      </ul>

      <div className="callout callout-info">
        <div className="callout-title">{t('errors.callout.respondTitle')}</div>
        <p>{t('errors.callout.respondText')} <code>200 OK</code> {t('errors.callout.respondEnd')}</p>
      </div>

      <PageNav
        prev={{ titleKey: 'Authentication', path: '/docs/auth' }}
        next={{ titleKey: 'JavaScript SDK', path: '/docs/sdk' }}
      />
    </>
  );
}

export default ErrorHandling;
