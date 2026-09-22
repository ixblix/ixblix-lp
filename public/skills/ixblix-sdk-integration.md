# ixblix JavaScript SDK Integration Guide

This skill provides complete instructions for integrating with the ixblix platform using the official `@ixblix/sdk-js` package.

## Overview

ixblix is an independent commercial messaging platform that enables secure, white-labeled conversations with end-to-end encryption. This guide covers the complete integration flow using the TypeScript SDK.

**API Base URL:** `https://api.ixblix.app`

## Installation

```bash
npm install @ixblix/sdk-js
```

## Integration Flow

### Step 1: Register as an Integrator

Register your application (CRM, help desk, ticket system) to receive API credentials.

```typescript
import { IxblixClient } from '@ixblix/sdk-js';

const client = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
});

const result = await client.integrator.register({
  name: 'My CRM Platform',
  callbackUrl: 'https://mycrm.example.com/ixblix/callback',
  contactEmail: 'admin@mycrm.example.com',
  // Optional: subscription identifier when required by the assigned payment provider
  // subscriptionId: '{paymentProvider}:{id}',
});

// ixblix will POST to your callbackUrl with credentials
// Check your callback endpoint for integratorId + accessToken
```

**Request fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name of your integrator. |
| `callbackUrl` | Yes | URL where ixblix sends credentials for verification. |
| `contactEmail` | Yes | Contact email for the integrator. |
| `subscriptionId` | No | Subscription identifier in the format `{paymentProvider}:{id}`. The `id` portion is opaque to the API and interpreted by the payment provider internally. Required when the assigned payment provider needs a subscription reference. |

**Callback Handler:**

```typescript
import express from 'express';
const app = express();
app.use(express.json());

app.post('/ixblix/callback', async (req, res) => {
  const { integratorId, accessToken } = req.body;
  
  // Store credentials securely (encrypted database, vault)
  await saveIntegratorCredentials({ integratorId, accessToken });
  
  // Must respond 200 to confirm receipt
  res.status(200).json({ received: true });
});
```

### Step 2: Create an Authenticated Client

```typescript
import { IxblixClient } from '@ixblix/sdk-js';

const integratorClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'int_a1b2c3d4-...',
  accessToken: 'ixblix_integrator_token_xxxx',
});

// Verify credentials
const profile = await integratorClient.integrator.getProfile();
console.log('Registered as:', profile.name);
```

### Step 3: List Available Plans

```typescript
const { plans } = await integratorClient.plans.list();
console.log('Available plans:', plans);
```

### Step 4: Register a Company

```typescript
const { company, checkoutUrl } = await integratorClient.company.register({
  name: 'Acme Corporation',
  planId: plans[0].id,
  handle: 'acme',
  website: 'https://acme.example.com',
});

// Redirect the company owner to checkoutUrl to complete payment
console.log('Checkout URL:', checkoutUrl);
```

### Step 5: Activate the Company

After payment confirmation:

```typescript
const { apiKey } = await integratorClient.company.activate(
  company.id,
  transactionId,
);

// Create company-scoped client
const companyClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey,
});
```

**Important:** The `apiKey` is shown only once. Store it securely.

### Step 6: Configure Webhook URL

```typescript
const { webhookSecret } = await companyClient.company.setWebhook({
  url: 'https://mycrm.example.com/ixblix/webhooks',
});

// Store webhookSecret for signature verification
```

### Step 7: Generate and Register Operator Keypair

```typescript
import { generateOperatorKeyPair, loadOrCreateOperatorKey } from '@ixblix/sdk-js';

// Option A: Generate new keypair
const { publicKey, privateKey } = await generateOperatorKeyPair();

// Option B: Load or create (persists to disk)
const operatorKey = await loadOrCreateOperatorKey({
  path: './keys/operator.json',
});

// Register public key
await companyClient.company.setEncryptionKey({
  publicKey: operatorKey.publicKey,
});
```

### Step 8: Create a Conversation

```typescript
const { conversation, deeplink } = await companyClient.conversation.create({
  contactName: 'Jane Doe',
  contactExternalId: 'crm-contact-123',
  originChannel: 'whatsapp',
  metadata: { ticketId: 'TK-456' },
});

// Send the deeplink to your customer via WhatsApp, SMS, etc.
console.log('Share this link:', deeplink);
```

### Step 9: Handle Customer Join

When the customer opens the deeplink, you receive a `CUSTOMER_JOINED` webhook:

```typescript
import { verifyWebhook, encryptToRecipient } from '@ixblix/sdk-js';

app.post('/ixblix/webhooks', async (req, res) => {
  // Verify signature
  const isValid = verifyWebhook(req.body, req.headers, webhookSecret);
  if (!isValid) return res.status(401).send('Invalid signature');

  const event = req.body;

  if (event.type === 'CUSTOMER_JOINED') {
    // Store customer's public key for this conversation
    await saveCustomerKey(event.payload.conversationId, event.payload.customerPublicKey);
    
    // Send welcome message
    const encrypted = encryptToRecipient({
      plaintext: 'Hello! How can we help you today?',
      recipientPublicKey: event.payload.customerPublicKey,
      senderPublicKey: operatorKey.publicKey,
    });

    await companyClient.message.sendCompany({
      conversationId: event.payload.conversationId,
      encryptedContent: encrypted.content,
      encryptedKey: encrypted.key,
    });
  }

  res.status(200).send('OK');
});
```

### Step 10: Send an Encrypted Message

```typescript
import { encryptToRecipient } from '@ixblix/sdk-js';

const customerPublicKey = await getCustomerKey(conversationId);

const encrypted = encryptToRecipient({
  plaintext: 'Hello from Acme Corp!',
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorKey.publicKey,
});

await companyClient.message.sendCompany({
  conversationId: conversation.id,
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
});
```

### Step 11: Receive and Decrypt Messages

```typescript
import { decryptEnvelope } from '@ixblix/sdk-js';

if (event.type === 'MESSAGE_RECEIVED') {
  const plaintext = decryptEnvelope({
    envelope: event.payload.encryptedContent,
    encryptedKey: event.payload.encryptedKey,
    recipientPrivateKey: operatorKey.privateKey,
  });
  
  console.log('Customer said:', plaintext);
}
```

### Step 12: Mark Messages as Read

```typescript
// Operator read (company side)
await companyClient.message.markRead(conversationId, [messageId1, messageId2]);

// Customer read triggers MESSAGE_READ webhook
if (event.type === 'MESSAGE_READ') {
  console.log('Messages read:', event.payload.messageIds);
}
```

## Rich Messages

Send interactive buttons:

```typescript
const encrypted = encryptToRecipient({
  plaintext: 'Please confirm your order:',
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorKey.publicKey,
  attachments: [
    { type: 'reply', label: 'Confirm' },
    { type: 'reply', label: 'Cancel' },
    { type: 'url', label: 'View details', url: 'https://acme.example.com/order/123' },
    { type: 'copy', label: 'Copy order number', value: 'ORD-2026-001234' },
    { type: 'pix', label: 'Copy Pix code', value: '00020126580014br.gov.bcb.pix...' },
    { type: 'vcard', name: 'Support', phone: '+5511999998888', organization: 'Acme Corp' },
    { type: 'location', latitude: -23.5505, longitude: -46.6333, name: 'Acme Store', address: 'Av. Paulista, 1000' },
  ],
});

await companyClient.message.sendCompany({
  conversationId,
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
});
```

**Rendering rules:**
- ≤ 3 buttons: rendered inline
- > 3 buttons: rendered in modal
- Only `reply` buttons send messages back to operator

## Media Attachments

Upload and send encrypted media:

```typescript
import { encryptMediaToRecipient } from '@ixblix/sdk-js';
import fs from 'node:fs';

const fileBuffer = fs.readFileSync('./invoice.pdf');

const encrypted = encryptMediaToRecipient({
  fileBuffer,
  recipientPublicKey: customerPublicKey,
  senderPublicKey: operatorKey.publicKey,
});

// Upload encrypted file
const uploadResponse = await fetch('https://api.ixblix.app/api/media/company', {
  method: 'POST',
  headers: {
    'X-API-Key': apiKey,
    'Content-Type': 'application/octet-stream',
    'X-Media-Type': 'document',
    'X-Media-Filename': 'invoice.pdf',
    'X-Media-Mime': 'application/pdf',
  },
  body: encrypted.content,
});

const { mediaId } = await uploadResponse.json();

// Send message with media reference
await companyClient.message.sendCompany({
  conversationId,
  encryptedContent: encrypted.content,
  encryptedKey: encrypted.key,
  mediaId,
});
```

**Download and decrypt received media:**

```typescript
import { decryptMediaEnvelope } from '@ixblix/sdk-js';

const encryptedBuffer = await downloadMedia(mediaId);

const decrypted = decryptMediaEnvelope({
  envelope: encryptedBuffer,
  encryptedKey: messageEncryptedKey,
  recipientPrivateKey: operatorKey.privateKey,
});

fs.writeFileSync('./invoice_decrypted.pdf', decrypted);
```

## Presence & Typing Indicators

```typescript
// Report operator typing
await companyClient.conversation.reportPresence(conversationId, 'TYPING');

// Set operator identity
await companyClient.conversation.setOperator(conversationId, {
  name: 'Sarah from Support',
  avatarUrl: 'https://acme.example.com/avatars/sarah.png',
});

// Handle customer presence webhooks
if (event.type === 'TYPING') {
  console.log('Customer is typing...');
}
if (event.type === 'RECORDING') {
  console.log('Customer is recording audio...');
}
if (event.type === 'CHAT_CLOSED') {
  console.log('Customer closed the chat window');
}
```

## Key Transfer (Cross-Device)

Allow customers to transfer encryption keys between devices:

```typescript
import crypto from 'node:crypto';

// Source device: Create transfer
const pin = Math.floor(100000 + Math.random() * 900000).toString();
const salt = crypto.randomBytes(16);
const kek = crypto.pbkdf2Sync(pin, salt, 200_000, 32, 'sha256');
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
const keypairJson = JSON.stringify({ publicKey, privateKey });
const encrypted = Buffer.concat([cipher.update(keypairJson, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();

const response = await fetch('https://api.ixblix.app/api/key-transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationToken: deeplinkToken,
    encryptedPayload: encrypted.toString('base64'),
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  }),
});

const { transferId } = await response.json();
// Show PIN and link to user: https://app.ixblix.app/transfer/{transferId}

// Target device: Retrieve and decrypt
const transferResponse = await fetch(`https://api.ixblix.app/api/key-transfer/${transferId}`);
const { encryptedPayload, salt: transferSalt, iv: transferIv, authTag: transferAuthTag } = await transferResponse.json();

const transferKek = crypto.pbkdf2Sync(pin, Buffer.from(transferSalt, 'base64'), 200_000, 32, 'sha256');
const decipher = crypto.createDecipheriv('aes-256-gcm', transferKek, Buffer.from(transferIv, 'base64'));
decipher.setAuthTag(Buffer.from(transferAuthTag, 'base64'));
const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedPayload, 'base64')), decipher.final()]);
const { publicKey: transferredPubKey, privateKey: transferredPrivKey } = JSON.parse(decrypted.toString('utf8'));

// Confirm transfer
await fetch(`https://api.ixblix.app/api/key-transfer/${transferId}/confirm`, { method: 'POST' });
```

## Webhook Event Types

| Event | When | Key Payload Fields |
|---|---|---|
| `MESSAGE_RECEIVED` | Customer sends a message | `conversationId`, `messageId`, `encryptedContent`, `encryptedKey` |
| `MESSAGE_READ` | Customer reads company messages | `conversationId`, `messageIds` |
| `CUSTOMER_JOINED` | Customer opens chat and registers key | `conversationId`, `customerPublicKey` |
| `CONVERSATION_CLOSED` | Conversation is closed | `conversationId`, `closedBy` |
| `TYPING` | Customer starts typing | `conversationId` |
| `RECORDING` | Customer records audio | `conversationId` |
| `CHAT_CLOSED` | Customer closes chat window | `conversationId` |
| `BALANCE_LOW` | Company credit balance is low | `companyId`, `balance`, `threshold` |

## Error Handling

```typescript
import { IxblixError } from '@ixblix/sdk-js';

try {
  await companyClient.conversation.create({ ... });
} catch (err) {
  if (err instanceof IxblixError) {
    console.error('API Error:', err.code);     // "VALIDATION_ERROR"
    console.error('Message:', err.message);    // "The 'contactName' field..."
    console.error('Status:', err.statusCode);  // 400
    console.error('Details:', err.details);    // [{ field, message }]
  }
}
```

**Retry strategy for 429 and 5xx errors:**

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof IxblixError) {
        const isRetryable = err.statusCode === 429 || err.statusCode >= 500;
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
}
```

## Complete Webhook Handler Example

```typescript
import express from 'express';
import {
  IxblixClient,
  verifyWebhook,
  encryptToRecipient,
  decryptEnvelope,
  loadOrCreateOperatorKey,
} from '@ixblix/sdk-js';

const app = express();
app.use(express.json());

const API_URL = 'https://api.ixblix.app';
const operatorKey = await loadOrCreateOperatorKey({ path: './keys/operator.json' });
const webhookSecret = process.env.WEBHOOK_SECRET!;
const apiKey = process.env.COMPANY_API_KEY!;

const companyClient = new IxblixClient({ baseUrl: API_URL, apiKey });

app.post('/ixblix/webhooks', async (req, res) => {
  if (!verifyWebhook(req.body, req.headers, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;

  switch (event.type) {
    case 'CUSTOMER_JOINED': {
      await saveCustomerKey(event.payload.conversationId, event.payload.customerPublicKey);
      
      const encrypted = encryptToRecipient({
        plaintext: 'Hello! How can we help?',
        recipientPublicKey: event.payload.customerPublicKey,
        senderPublicKey: operatorKey.publicKey,
      });

      await companyClient.message.sendCompany({
        conversationId: event.payload.conversationId,
        encryptedContent: encrypted.content,
        encryptedKey: encrypted.key,
      });
      break;
    }

    case 'MESSAGE_RECEIVED': {
      const customerPubKey = await getCustomerKey(event.payload.conversationId);
      const plaintext = decryptEnvelope({
        envelope: event.payload.encryptedContent,
        encryptedKey: event.payload.encryptedKey,
        recipientPrivateKey: operatorKey.privateKey,
      });
      
      console.log(`Customer: ${plaintext}`);
      // Create ticket in your system, route to operator, etc.
      break;
    }

    case 'MESSAGE_READ':
      console.log('Messages read:', event.payload.messageIds);
      break;

    case 'CONVERSATION_CLOSED':
      await deleteCustomerKey(event.payload.conversationId);
      break;
  }

  res.status(200).send('OK');
});

app.listen(4000, () => console.log('Webhook server running on port 4000'));
```

## SDK Methods Reference

### IxblixClient

```typescript
// Integrator auth
const integratorClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  integratorId: 'int_xxxx',
  accessToken: 'ixblix_integrator_token_xxxx',
});

// Company auth
const companyClient = new IxblixClient({
  baseUrl: 'https://api.ixblix.app',
  apiKey: 'smci_xxxx',
});
```

### Integrator Methods

```typescript
await integratorClient.integrator.register({ name, callbackUrl, contactEmail });
const profile = await integratorClient.integrator.getProfile();
```

### Company Management

```typescript
const { company, checkoutUrl } = await integratorClient.company.register({ name, planId, handle });
const { apiKey } = await integratorClient.company.activate(companyId, transactionId);
const { companies } = await integratorClient.company.list();
```

### Conversations

```typescript
const { conversation, deeplink } = await companyClient.conversation.create({ contactName, contactExternalId, originChannel, metadata });
await companyClient.conversation.close(deeplinkToken);
const keys = await companyClient.conversation.getKeys(conversationId);
await companyClient.conversation.setOperator(conversationId, { name, avatarUrl });
await companyClient.conversation.reportPresence(conversationId, 'TYPING');
```

### Messages

```typescript
await companyClient.message.sendCompany({ conversationId, encryptedContent, encryptedKey });
const { messages } = await companyClient.message.list(conversationId, { limit: 50 });
await companyClient.message.markRead(conversationId, [messageId1, messageId2]);
```

### Company Configuration

```typescript
const { webhookSecret } = await companyClient.company.setWebhook({ url });
await companyClient.company.setEncryptionKey({ publicKey });
const { publicKey } = await companyClient.company.getEncryptionKey();
const { balance, plan } = await companyClient.company.getBalance();
await companyClient.company.updateCustomization({ primaryColor, logoUrl });
```

### Crypto Helpers

```typescript
import { generateOperatorKeyPair, encryptToRecipient, decryptEnvelope, encryptMediaToRecipient, decryptMediaEnvelope, loadOrCreateOperatorKey } from '@ixblix/sdk-js';

const { publicKey, privateKey } = await generateOperatorKeyPair();
const encrypted = encryptToRecipient({ plaintext, recipientPublicKey, senderPublicKey, attachments? });
const plaintext = decryptEnvelope({ envelope, encryptedKey, recipientPrivateKey });
const mediaEncrypted = encryptMediaToRecipient({ fileBuffer, recipientPublicKey, senderPublicKey });
const mediaDecrypted = decryptMediaEnvelope({ envelope, encryptedKey, recipientPrivateKey });
const key = await loadOrCreateOperatorKey({ path });
```

### Webhook Helpers

```typescript
import { verifyWebhook, parseWebhook } from '@ixblix/sdk-js';

const isValid = verifyWebhook(req.body, req.headers, webhookSecret);
const event = parseWebhook(req.body);
```

## Security Best Practices

- Store API keys and webhook secrets in encrypted vaults or environment variables
- Always verify webhook signatures using `verifyWebhook()` before processing
- Never expose operator private keys in client-side code
- Use HTTPS for all API calls and webhook endpoints
- Rotate webhook secrets periodically
- Implement exponential backoff for retries on `429` and `5xx` errors
- Use `loadOrCreateOperatorKey()` to persist keypairs securely

## Interactive API Documentation

Full OpenAPI spec with interactive testing available at: `https://dev.ixblix.app`
