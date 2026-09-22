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

Register your application (CRM, help desk, ticket system) to receive API credentials:

```typescript
import { IxblixClient } from "@ixblix/sdk-js";

const integratorClient = new IxblixClient({
  baseUrl: "https://api.ixblix.app",
});

await integratorClient.registerIntegrator({
  name: "My CRM Platform",
  hostname: "mycrm.example.com",
  callbackUrl: "https://mycrm.example.com/ixblix/callback",
  // Optional: subscription identifier when required by the assigned payment provider
  // subscriptionId: '{paymentProvider}:{id}',
});

// ixblix will POST a challenge to your callbackUrl, then POST the credentials.
// Your callback must first echo the original registration payload, then echo
// the credentials payload.
```

**Request fields:**

| Field            | Required | Description                                                                                                                                                                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | Yes      | Display name of your integrator.                                                                                                                                                                                                      |
| `hostname`       | Yes      | Unique hostname for this integrator. Must be unique across all integrators.                                                                                                                                                           |
| `callbackUrl`    | Yes      | URL where ixblix sends the registration challenge and, after it succeeds, the integrator credentials.                                                                                                                                 |
| `force`          | No       | If true, allows replacing an existing verified hostname registration.                                                                                                                                                                 |
| `subscriptionId` | No       | Subscription identifier in the format `{paymentProvider}:{id}`. The `id` portion is opaque to the API and interpreted by the payment provider internally. Required when the assigned payment provider needs a subscription reference. |

**Callback Handler:**

```typescript
import express from "express";
const app = express();
app.use(express.json());

const registrationPayload = {
  name: "My CRM Platform",
  hostname: "mycrm.example.com",
  callbackUrl: "https://mycrm.example.com/ixblix/callback",
};

app.post("/ixblix/callback", async (req, res) => {
  // Phase 2: answer the challenge with the original registration payload
  if (req.body?.challenge) {
    return res.status(200).json(registrationPayload);
  }

  // Phase 3: store credentials and echo them back
  if (req.body?.event === "INTEGRATOR_CREDENTIALS") {
    const { integratorId, accessToken } = req.body;
    await saveIntegratorCredentials({ integratorId, accessToken });
    return res.status(200).json(req.body);
  }

  res.status(200).json({ received: true });
});
```

### Step 2: Create an Authenticated Client

```typescript
import { IxblixClient, loadOrCreateOperatorKey } from "@ixblix/sdk-js";

const integratorClient = new IxblixClient({
  baseUrl: "https://api.ixblix.app",
  integratorId: "int_a1b2c3d4-...",
  integratorAccessToken: "ixblix_integrator_token_xxxx",
});

// Verify credentials
const profile = await integratorClient.getProfile();
console.log("Registered as:", profile.name);
```

### Step 3: List Available Plans

```typescript
const plans = await integratorClient.listPlans();
console.log("Available plans:", plans);
```

### Step 4: Register a Company

```typescript
const { company, payment } = await integratorClient.registerCompany({
  name: "Acme Corporation",
  planId: plans[0].id,
  handle: "acme",
});

// Redirect the company owner to payment.checkoutUrl to complete payment
console.log("Checkout URL:", payment.checkoutUrl);
```

### Step 5: Activate the Company

After payment confirmation:

```typescript
const { apiKey } = await integratorClient.activateCompany(
  company.id,
  payment.transactionId,
);

// Create company-scoped client
const companyClient = new IxblixClient({
  baseUrl: "https://api.ixblix.app",
  apiKey,
  operatorKey: operatorKey, // from Step 7
});
```

**Important:** The `apiKey` is shown only once. Store it securely.

### Step 6: Configure Webhook URL

```typescript
const { webhookSecret } = await companyClient.updateWebhook({
  webhookUrl: "https://mycrm.example.com/ixblix/webhooks",
});

// Store webhookSecret for signature verification
```

### Step 7: Generate and Register Operator Keypair

```typescript
import {
  generateOperatorKeyPair,
  loadOrCreateOperatorKey,
} from "@ixblix/sdk-js";

// Option A: Generate new keypair
const { publicKey, privateKey } = await generateOperatorKeyPair();

// Option B: Load or create (persists to disk)
const operatorKey = await loadOrCreateOperatorKey({
  path: "./keys/operator.json",
});

// Register public key
await companyClient.registerEncryptionKey({
  keyId: operatorKey.keyId,
  publicKey: operatorKey.publicKeySpki,
});
```

### Step 8: Create a Conversation

```typescript
const { conversation, deeplink } = await companyClient.createConversation({
  contact: {
    externalId: "crm-contact-123",
    name: "Jane Doe",
    metadata: { ticketId: "TK-456" },
  },
});

// Send the deeplink to your customer via WhatsApp, SMS, etc.
console.log("Share this link:", deeplink);
```

### Step 9: Handle Customer Join

When the customer opens the deeplink, you receive a `CUSTOMER_JOINED` webhook:

```typescript
import {
  verifyWebhook,
  encryptToRecipient,
  WEBHOOK_SIGNATURE_HEADER,
} from "@ixblix/sdk-js";

app.post("/ixblix/webhooks", async (req, res) => {
  // Verify signature
  const signature = req.headers[WEBHOOK_SIGNATURE_HEADER] as string;
  const parsed = verifyWebhook(req.body, webhookSecret, signature);
  const event = parsed.event;

  if (event.event === "CUSTOMER_JOINED") {
    // Store customer's public key for this conversation
    await saveCustomerKey(event.conversationId, event.customerPublicKey);

    // Send welcome message
    const envelope = encryptToRecipient(
      "Hello! How can we help you today?",
      event.customerPublicKey,
      operatorKey.keyId,
      operatorKey.publicKeySpki,
    );

    await companyClient.sendCompanyMessage(event.conversationId, envelope);
  }

  res.status(200).send("OK");
});
```

### Step 10: Send an Encrypted Message

```typescript
import { encryptToRecipient } from "@ixblix/sdk-js";

const keys = await companyClient.getConversationKeys(conversationId);

const envelope = encryptToRecipient(
  "Hello from Acme Corp!",
  keys.customerPublicKey!,
  operatorKey.keyId,
  operatorKey.publicKeySpki,
);

await companyClient.sendCompanyMessage(conversation.id, envelope);
```

### Step 11: Receive and Decrypt Messages

```typescript
import { decryptEnvelope } from "@ixblix/sdk-js";

if (event.event === "MESSAGE_RECEIVED") {
  // Fetch the full message to get the encrypted content and envelope
  const messages = await companyClient.listMessages(event.conversationId);
  const message = messages.find((m) => m.id === event.messageId);
  if (message) {
    const plaintext = decryptEnvelope(message, operatorKey.privateKey);
    console.log("Customer said:", plaintext);
  }
}
```

### Step 12: Mark Messages as Read

```typescript
// Operator read (company side)
await companyClient.markMessageReadByCompany(conversationId, messageId);

// Customer read triggers MESSAGE_READ webhook
if (event.event === "MESSAGE_READ") {
  console.log("Message read:", event.messageId, "at", event.readAt);
}
```

## Rich Messages

Send interactive buttons using the `encryptRichMessage` helper:

```typescript
import { encryptRichMessage } from "@ixblix/sdk-js";

const keys = await companyClient.getConversationKeys(conversationId);

const envelope = encryptRichMessage(
  "Please confirm your order:",
  {
    buttons: [
      { type: "reply", label: "Confirm" },
      { type: "reply", label: "Cancel" },
      {
        type: "url",
        label: "View details",
        url: "https://acme.example.com/order/123",
      },
      { type: "copy", label: "Copy order number", value: "ORD-2026-001234" },
      {
        type: "pix",
        label: "Copy Pix code",
        value: "00020126580014br.gov.bcb.pix...",
      },
    ],
    vcard: {
      name: "Support",
      phone: "+5511999998888",
      organization: "Acme Corp",
    },
  },
  keys.customerPublicKey!,
  operatorKey.keyId,
  operatorKey.publicKeySpki,
);

await companyClient.sendCompanyMessage(
  conversationId,
  envelope,
  "text",
  undefined,
  undefined,
  envelope.attachments,
);
```

**Rendering rules:**

- \u2264 3 buttons: rendered inline
- \> 3 buttons: rendered in modal
- Only `reply` buttons send messages back to operator

## Media Attachments

Upload and send encrypted media:

```typescript
import { encryptMediaToRecipient } from "@ixblix/sdk-js";
import fs from "node:fs";

const fileBuffer = fs.readFileSync("./invoice.pdf");
const keys = await companyClient.getConversationKeys(conversationId);

const envelope = encryptMediaToRecipient(
  fileBuffer,
  keys.customerPublicKey!,
  operatorKey.keyId,
  operatorKey.publicKeySpki,
);

// Upload encrypted file (the SDK sends it as multipart/form-data)
const message = await companyClient.sendCompanyMedia(
  conversationId,
  { data: fileBuffer, fileName: "invoice.pdf", mimeType: "application/pdf" },
  envelope,
);

console.log("Media message sent:", message.id);
```

**Download and decrypt received media:**

```typescript
import { decryptMediaEnvelope } from "@ixblix/sdk-js";

const { data, media } = await companyClient.downloadCompanyMedia(
  message.mediaId!,
);

const decrypted = decryptMediaEnvelope(data, message, operatorKey.privateKey);

fs.writeFileSync("./invoice_decrypted.pdf", decrypted);
```

## Presence & Typing Indicators

```typescript
// Report operator typing
await companyClient.reportCompanyPresence(conversationId, "typing");

// Set operator identity
await companyClient.updateOperator(conversationId, {
  name: "Sarah from Support",
  image: "https://acme.example.com/avatars/sarah.png",
});

// Handle customer presence webhooks
if (event.event === "TYPING") {
  console.log("Customer is typing...");
}
if (event.event === "RECORDING") {
  console.log("Customer is recording audio...");
}
if (event.event === "CHAT_CLOSED") {
  console.log("Customer closed the chat window");
}
```

## Key Transfer (Cross-Device)

Allow customers to transfer encryption keys between devices:

```typescript
import crypto from "node:crypto";

// Source device: Create transfer
const pin = Math.floor(100000 + Math.random() * 900000).toString();
const salt = crypto.randomBytes(16);
const kek = crypto.pbkdf2Sync(pin, salt, 200_000, 32, "sha256");
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv("aes-256-gcm", kek, iv);
const keypairJson = JSON.stringify({ publicKey, privateKey });
const ciphertext = Buffer.concat([
  cipher.update(keypairJson, "utf8"),
  cipher.final(),
]);
const authTag = cipher.getAuthTag();

const response = await fetch("https://api.ixblix.app/api/key-transfer", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
    kdf: { alg: "PBKDF2-SHA256", iterations: 200_000 },
    publicKeySpki: publicKey, // base64 SPKI public key
  }),
});

const { transferId } = await response.json();
// Show PIN and link to user: https://app.ixblix.app/transfer/{transferId}

// Target device: Retrieve and decrypt
const transferResponse = await fetch(
  `https://api.ixblix.app/api/key-transfer/${transferId}`,
);
const {
  ciphertext: encCiphertext,
  salt: transferSalt,
  iv: transferIv,
  kdf,
} = await transferResponse.json();

const transferKek = crypto.pbkdf2Sync(
  pin,
  Buffer.from(transferSalt, "base64"),
  kdf.iterations,
  32,
  "sha256",
);
const decipher = crypto.createDecipheriv(
  "aes-256-gcm",
  transferKek,
  Buffer.from(transferIv, "base64"),
);
decipher.setAuthTag(Buffer.from(encCiphertext, "base64").subarray(-16));
const decrypted = Buffer.concat([
  decipher.update(Buffer.from(encCiphertext, "base64").subarray(0, -16)),
  decipher.final(),
]);
const { publicKey: transferredPubKey, privateKey: transferredPrivKey } =
  JSON.parse(decrypted.toString("utf8"));

// Confirm transfer
await fetch(`https://api.ixblix.app/api/key-transfer/${transferId}/confirm`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ publicKeySpki: transferredPubKey }),
});
```

## Webhook Event Types

All webhook events use a flat JSON structure with an `event` field indicating the type. They are signed with HMAC-SHA256 via the `X-Ixblix-Signature` header.

| Event                 | When                                  | Key Fields                                  |
| --------------------- | ------------------------------------- | ------------------------------------------- |
| `MESSAGE_RECEIVED`    | Contact sends a message               | `conversationId`, `messageId`, `replyToId?` |
| `MESSAGE_READ`        | Customer reads a company message      | `conversationId`, `messageId`, `readAt`     |
| `CUSTOMER_JOINED`     | Customer opens chat and registers key | `conversationId`, `customerPublicKey`       |
| `CONVERSATION_CLOSED` | Conversation is closed                | `conversationId`                            |
| `TYPING`              | Customer starts typing                | `conversationId`, `type: "typing"`          |
| `STOPPED_TYPING`      | Customer stops typing                 | `conversationId`, `type: "stopped"`         |
| `RECORDING`           | Customer records audio                | `conversationId`, `type: "recording"`       |
| `CHAT_CLOSED`         | Customer closes chat window           | `conversationId`, `type: "chat_closed"`     |
| `BALANCE_LOW`         | Company credit balance is low         | `companyId`, `balanceCents`                 |
| `COMPANY_ACTIVATED`   | Company activated after payment       | `companyId`, `transactionId`, `apiKey`      |

## Error Handling

```typescript
import { IxblixError } from '@ixblix/sdk-js';

try {
  await companyClient.createConversation({ ... });
} catch (err) {
  if (err instanceof IxblixError) {
    console.error('API Error:', err.code);     // "VALIDATION_ERROR"
    console.error('Message:', err.message);    // "The 'contact.externalId' field..."
    console.error('Status:', err.status);      // 400
    console.error('Details:', err.details);    // [{ path, message }]
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
        const isRetryable = err.status === 429 || err.status >= 500;
        if (!isRetryable || attempt === maxRetries) throw err;

        const delay = Math.min(1000 * 2 ** attempt, 10_000);
        const jitter = Math.random() * 1000;
        await new Promise((r) => setTimeout(r, delay + jitter));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Unreachable");
}
```

## Complete Webhook Handler Example

```typescript
import express from "express";
import {
  IxblixClient,
  verifyWebhook,
  encryptToRecipient,
  decryptEnvelope,
  loadOrCreateOperatorKey,
  WEBHOOK_SIGNATURE_HEADER,
} from "@ixblix/sdk-js";

const app = express();
app.use(express.json());

const API_URL = "https://api.ixblix.app";
const operatorKey = await loadOrCreateOperatorKey({
  path: "./keys/operator.json",
});
const webhookSecret = process.env.WEBHOOK_SECRET!;
const apiKey = process.env.COMPANY_API_KEY!;

const companyClient = new IxblixClient({
  baseUrl: API_URL,
  apiKey,
  operatorKey,
});

app.post("/ixblix/webhooks", async (req, res) => {
  const signature = req.headers[WEBHOOK_SIGNATURE_HEADER] as string;
  let parsed;
  try {
    parsed = verifyWebhook(req.body, webhookSecret, signature);
  } catch {
    return res.status(401).send("Invalid signature");
  }
  const event = parsed.event;

  switch (event.event) {
    case "CUSTOMER_JOINED": {
      await saveCustomerKey(event.conversationId, event.customerPublicKey);

      const envelope = encryptToRecipient(
        "Hello! How can we help?",
        event.customerPublicKey,
        operatorKey.keyId,
        operatorKey.publicKeySpki,
      );

      await companyClient.sendCompanyMessage(event.conversationId, envelope);
      break;
    }

    case "MESSAGE_RECEIVED": {
      const keys = await companyClient.getConversationKeys(
        event.conversationId,
      );
      const messages = await companyClient.listMessages(event.conversationId);
      const message = messages.find((m) => m.id === event.messageId);
      if (message && keys.customerPublicKey) {
        const plaintext = decryptEnvelope(message, operatorKey.privateKey);
        console.log(`Customer: ${plaintext}`);
        // Create ticket in your system, route to operator, etc.
      }
      break;
    }

    case "MESSAGE_READ":
      console.log("Message read:", event.messageId, "at", event.readAt);
      break;

    case "CONVERSATION_CLOSED":
      await deleteCustomerKey(event.conversationId);
      break;
  }

  res.status(200).send("OK");
});

app.listen(4000, () => console.log("Webhook server running on port 4000"));
```

## SDK Methods Reference

### IxblixClient

```typescript
// Integrator auth
const integratorClient = new IxblixClient({
  baseUrl: "https://api.ixblix.app",
  integratorId: "int_xxxx",
  integratorAccessToken: "ixblix_integrator_token_xxxx",
});

// Company auth
const companyClient = new IxblixClient({
  baseUrl: "https://api.ixblix.app",
  apiKey: "smci_xxxx",
  operatorKey, // OperatorKeyPair from loadOrCreateOperatorKey
});
```

### Integrator Onboarding

```typescript
await integratorClient.registerIntegrator({
  name,
  hostname,
  callbackUrl,
  force?,        // replace existing verified registration
  subscriptionId?,
});
```

### Company Onboarding (integrator auth)

```typescript
await integratorClient.registerCompany({ name, handle, planId });
await integratorClient.activateCompany(companyId, transactionId);
const plans = await integratorClient.listPlans();
const providers = await integratorClient.listPaymentProviders();
```

### Company Configuration (company auth)

```typescript
const profile = await companyClient.getProfile();
const balance = await companyClient.getBalance();
const { webhookSecret } = await companyClient.updateWebhook({ webhookUrl });
await companyClient.registerEncryptionKey({ keyId, publicKey });
const key = await companyClient.getEncryptionKey();
await companyClient.updateCustomization({ brandName, logoUrl });
await companyClient.uploadBranding({ squareIcon, rectangularLogo });
```

### Conversations

```typescript
const { conversation, deeplink } = await companyClient.createConversation({ contact: { externalId, name?, metadata? }, operator? });
const keys = await companyClient.getConversationKeys(conversationId);
await companyClient.updateOperator(conversationId, { uuid?, name?, image?, gravatarHash? });
await companyClient.reportCompanyPresence(conversationId, 'typing' | 'stopped' | 'recording');
```

### Messages

```typescript
await companyClient.sendCompanyMessage(conversationId, envelope, contentType?, operatorUuid?, replyToId?, attachments?);
await companyClient.reactToMessage(conversationId, messageId, emoji, operatorUuid?);
const messages = await companyClient.listMessages(conversationId);
await companyClient.markMessageReadByCompany(conversationId, messageId);
```

### Media

```typescript
const message = await companyClient.sendCompanyMedia(conversationId, { data, fileName, mimeType }, envelope, operatorUuid?, replyToId?, attachments?);
const media = await companyClient.getMedia(mediaId);
const { data, media } = await companyClient.downloadCompanyMedia(mediaId);
```

### Credits

```typescript
const { purchase, result } = await companyClient.purchaseCredits({
  amountCents,
  provider,
});
const purchases = await companyClient.listCreditPurchases();
```

### Payment Methods

```typescript
const methods = await companyClient.listPaymentMethods();
const options = await companyClient.getPaymentChangeOptions();
const change = await companyClient.startPaymentChange({ planId? });
```

### Crypto Helpers

```typescript
import {
  generateOperatorKeyPair,
  encryptToRecipient,
  decryptEnvelope,
  encryptRichMessage,
  decryptAttachments,
  encryptMediaToRecipient,
  encryptMediaWithAttachments,
  decryptMediaEnvelope,
  loadOrCreateOperatorKey,
} from "@ixblix/sdk-js";

const { publicKey, privateKey, publicKeySpki, keyId } =
  await generateOperatorKeyPair();
// encryptToRecipient(plaintext, recipientPublicKeySpki, senderKeyId, senderPublicKeySpki)
const envelope = encryptToRecipient(
  plaintext,
  recipientPublicKeySpki,
  senderKeyId,
  senderPublicKeySpki,
);
// decryptEnvelope(message, senderPrivateKey)
const plaintext = decryptEnvelope(message, senderPrivateKey);
// encryptRichMessage(plaintext, attachments, recipientPublicKeySpki, senderKeyId, senderPublicKeySpki)
const richEnvelope = encryptRichMessage(
  plaintext,
  attachments,
  recipientPublicKeySpki,
  senderKeyId,
  senderPublicKeySpki,
);
// decryptAttachments(message, senderPrivateKey)
const attachments = decryptAttachments(message, senderPrivateKey);
// encryptMediaToRecipient(fileBuffer, recipientPublicKeySpki, senderKeyId, senderPublicKeySpki)
const mediaEnvelope = encryptMediaToRecipient(
  fileBuffer,
  recipientPublicKeySpki,
  senderKeyId,
  senderPublicKeySpki,
);
// encryptMediaWithAttachments(fileBuffer, attachments, recipientPublicKeySpki, senderKeyId, senderPublicKeySpki)
const mediaWithAttachments = encryptMediaWithAttachments(
  fileBuffer,
  attachments,
  recipientPublicKeySpki,
  senderKeyId,
  senderPublicKeySpki,
);
// decryptMediaEnvelope(encryptedData, message, senderPrivateKey)
const decryptedMedia = decryptMediaEnvelope(
  encryptedData,
  message,
  senderPrivateKey,
);
const key = await loadOrCreateOperatorKey({ path });
```

### Webhook Helpers

```typescript
import {
  verifyWebhook,
  parseWebhook,
  WEBHOOK_SIGNATURE_HEADER,
} from "@ixblix/sdk-js";

const signature = req.headers[WEBHOOK_SIGNATURE_HEADER];
const parsed = verifyWebhook(req.body, webhookSecret, signature);
const event = parsed.event;
// Or just parse without verification:
const parsed2 = parseWebhook(req.body);
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
