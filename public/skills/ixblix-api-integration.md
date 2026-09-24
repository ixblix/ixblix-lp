# ixblix REST API Integration Guide

This skill provides complete instructions for integrating with the ixblix platform using direct REST API calls.

## Overview

ixblix is an independent commercial messaging platform that enables secure, white-labeled conversations with end-to-end encryption. This guide covers the complete integration flow using cURL and HTTP clients.

**API Base URL:** `https://api.ixblix.app`

## Integration Flow

### Step 1: Register as an Integrator

Register your application (CRM, help desk, ticket system) to receive API credentials.

```bash
curl -X POST https://api.ixblix.app/api/integrators/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My CRM Platform",
    "hostname": "mycrm.example.com",
    "callbackUrl": "https://mycrm.example.com/ixblix/callback"
  }'
```

**Request fields:**

| Field            | Required | Description                                                                                                                                                                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | Yes      | Display name of your integrator.                                                                                                                                                                                                      |
| `hostname`       | Yes      | Unique hostname for this integrator. Must be unique across all integrators.                                                                                                                                                           |
| `callbackUrl`    | Yes      | URL where ixblix sends the registration challenge and, after it succeeds, the integrator credentials.                                                                                                                                 |
| `force`          | No       | If true, allows replacing an existing verified hostname registration. Defaults to false.                                                                                                                                              |
| `subscriptionId` | No       | Subscription identifier in the format `{paymentProvider}:{id}`. The `id` portion is opaque to the API and interpreted by the payment provider internally. Required when the assigned payment provider needs a subscription reference. |

**Callback Verification:** registration uses a three-phase callback flow:

1. **Challenge:** ixblix sends a POST to your `callbackUrl` with:

```json
{
  "challenge": "mycrm.example.com"
}
```

Your endpoint must respond with `200 OK` and the **exact registration payload** you sent in step 1.

2. **Credentials:** ixblix sends a POST to your `callbackUrl` with:

```json
{
  "event": "INTEGRATOR_CREDENTIALS",
  "integratorId": "int_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accessToken": "ixblix_integrator_token_xxxxxxxxxxxx",
  "timestamp": "2026-01-15T10:30:00.000Z"
}
```

Your endpoint must echo the credentials payload back with `200 OK`. Store the credentials securely.

### Step 2: List Available Plans

```bash
curl https://api.ixblix.app/api/plans \
  -u "integratorId:accessToken"
```

Response (array of plans):

```json
[
  {
    "id": "uuid-of-plan",
    "name": "Starter",
    "billingType": "PERIOD",
    "period": "MONTHLY",
    "priceCents": 4900,
    "currency": "BRL",
    "isActive": true,
    "isPublic": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### Step 3: Register a Company

Create a company under your integrator account:

```bash
curl -X POST https://api.ixblix.app/api/companies/register \
  -u "integratorId:accessToken" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "handle": "acme",
    "planId": "uuid-of-plan"
  }'
```

Response includes `company` and `payment` with a `checkoutUrl` — redirect the company owner there to complete payment.

```json
{
  "company": {
    "id": "cmp_xxxx",
    "name": "Acme Corporation",
    "handle": "acme",
    "status": "PENDING_PAYMENT"
  },
  "payment": {
    "transactionId": "company_cmp_xxxx-txn",
    "provider": "efi",
    "amountCents": 4900,
    "currency": "BRL",
    "confirmationUrl": "/api/companies/cmp_xxxx/activate/company_cmp_xxxx-txn",
    "status": "PENDING",
    "checkoutUrl": "https://api.ixblix.app/checkout/company_cmp_xxxx-txn"
  }
}
```

### Step 4: Activate the Company

After payment confirmation:

```bash
curl -X POST https://api.ixblix.app/api/companies/{companyId}/activate/{transactionId} \
  -u "integratorId:accessToken"
```

Response:

```json
{
  "apiKey": "smci_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "ACTIVE"
}
```

**Important:** The `apiKey` is shown only once. Store it securely.

### Step 5: Configure Webhook URL

Set your webhook endpoint to receive events:

```bash
curl -X PUT https://api.ixblix.app/api/companies/webhook \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{ "webhookUrl": "https://mycrm.example.com/ixblix/webhooks" }'
```

Response includes `webhookSecret` for verifying signatures. Store it securely.

### Step 6: Register Encryption Key

Generate an RSA-2048 keypair and register the public key:

```bash
# Generate keypair (Node.js example)
node -e "const crypto = require('crypto'); const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {modulusLength: 2048, publicKeyEncoding: {type: 'spki', format: 'pem'}, privateKeyEncoding: {type: 'pkcs8', format: 'pem'}}); console.log(JSON.stringify({publicKey, privateKey}))"

# Register public key
curl -X PUT https://api.ixblix.app/api/companies/encryption-key \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "operator-key-1",
    "publicKey": "MIIBIjANBgkqhki..."
  }'
```

> **Note:** The `publicKey` must be base64-encoded SPKI DER format (not PEM). The `keyId` is a stable identifier you choose to locate the matching private key later.

### Step 7: Create a Conversation

```bash
curl -X POST https://api.ixblix.app/api/conversations \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "externalId": "crm-contact-123",
      "name": "Jane Doe",
      "metadata": { "ticketId": "TK-456" }
    }
  }'
```

Response:

```json
{
  "conversation": {
    "id": "conv_xxxx",
    "token": "dl_xxxx",
    "status": "ACTIVE",
    "keyStatus": "AWAITING_CUSTOMER"
  },
  "contact": {
    "id": "contact_xxxx",
    "externalId": "crm-contact-123",
    "name": "Jane Doe",
    "consentStatus": "PENDING"
  },
  "deeplink": "https://api.ixblix.app/c/dl_xxxx",
  "company": { "id": "cmp_xxxx", "name": "Acme Corporation" }
}
```

Send the `deeplink` to your customer via WhatsApp, SMS, email, etc.

### Step 8: Handle Customer Join

When the customer opens the deeplink, you receive a `CUSTOMER_JOINED` webhook:

```json
{
  "event": "CUSTOMER_JOINED",
  "companyId": "cmp_xxxx",
  "conversationId": "conv_xxxx",
  "customerPublicKey": "MIIBIjANBgkqhki..."
}
```

**Store the customer's public key** — you need it to encrypt all messages.

### Step 9: Send an Encrypted Message

Encrypt the message using hybrid RSA + AES-256-GCM:

```bash
# Node.js encryption example
node -e "
const crypto = require('crypto');
const plaintext = 'Hello from Acme Corp!';
const aesKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();
const encryptedKey = crypto.publicEncrypt({key: customerPublicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, aesKey);
const selfEncryptedKey = crypto.publicEncrypt({key: operatorPublicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, aesKey);
console.log(JSON.stringify({
  content: ciphertext.toString('base64'),
  iv: iv.toString('base64'),
  authTag: authTag.toString('base64'),
  encryptedKey: encryptedKey.toString('base64'),
  selfEncryptedKey: selfEncryptedKey.toString('base64'),
  keyId: 'operator-key-1'
}));
"

# Send encrypted message
# The operator identity is embedded in the encrypted attachments JSON.
# Use encryptRichMessage to encrypt content + attachments (with operator) together.
node -e "
const crypto = require('crypto');
const { encryptRichMessage } = require('@ixblix/sdk-js');

const attachments = JSON.stringify({
  operator: { uuid: 'agent-42', name: 'Maria Silva', gravatarHash: 'md5-of-email' }
});
const envelope = encryptRichMessage(
  'Hello!', attachments,
  customerPublicKey, operatorKey.keyId, operatorKey.publicKeySpki
);
console.log(JSON.stringify({
  content: envelope.content,
  iv: envelope.iv,
  authTag: envelope.authTag,
  encryptedKey: envelope.encryptedKey,
  selfEncryptedKey: envelope.selfEncryptedKey,
  keyId: envelope.keyId,
  attachments: envelope.attachments
}));
"

curl -X POST https://api.ixblix.app/api/messages/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxxx",
    "content": "base64-AES-GCM-ciphertext",
    "contentType": "text",
    "iv": "base64-iv",
    "authTag": "base64-auth-tag",
    "encryptedKey": "base64-rsa-wrapped-aes-key-to-customer",
    "selfEncryptedKey": "base64-rsa-wrapped-aes-key-to-self",
    "keyId": "operator-key-1",
    "operatorUuid": "agent-42",
    "attachments": "base64-encrypted-json-with-operator-identity"
  }'
```

### Step 10: Receive Messages

When the customer replies, you receive a `MESSAGE_RECEIVED` webhook:

```json
{
  "event": "MESSAGE_RECEIVED",
  "companyId": "cmp_xxxx",
  "conversationId": "conv_xxxx",
  "messageId": "msg_xxxx",
  "sentAt": "2026-09-01T12:11:00.000Z"
}
```

Retrieve the full message (including encrypted content and envelope) via the messages list endpoint, then decrypt using your operator private key:

```bash
node -e "
const crypto = require('crypto');
// These come from the message object returned by GET /api/messages/{conversationId}
const encryptedKey = Buffer.from('base64-rsa-wrapped-aes-key', 'base64');
const aesKey = crypto.privateDecrypt({key: operatorPrivateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, encryptedKey);
const iv = Buffer.from('base64-iv', 'base64');
const authTag = Buffer.from('base64-auth-tag', 'base64');
const ciphertext = Buffer.from('base64-content', 'base64');
const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
decipher.setAuthTag(authTag);
const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
console.log(plaintext.toString('utf8'));
"
```

### Step 11: Verify Webhook Signatures

Always verify webhook signatures before processing:

```bash
node -e "
const crypto = require('crypto');
const signature = req.headers['x-ixblix-signature'];
const expected = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(req.body)).digest('hex');
const isValid = crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
console.log('Valid:', isValid);
"
```

## Webhook Event Types

All webhook events use a flat JSON structure with an `event` field indicating the type. They are signed with HMAC-SHA256 via the `X-Ixblix-Signature` header. Each delivery also includes:

- `X-Ixblix-Event-Id`: unique delivery ID (use for deduplication).
- `X-Ixblix-Event`: event type.
- `X-Ixblix-Company-Id`: company ID (useful for multi-tenant receivers to look up the correct secret in O(1)).

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

## Rich Messages

Operators may attach structured resources to a message: inline buttons, vCard, location and link preview. These are sent in the encrypted `attachments` field as a JSON string. The operator identity (name, image, gravatarHash) is also embedded here so the customer client can render the correct avatar per message. The operator encrypts the attachments JSON using the same AES key as the message content.

Plaintext `attachments` format (send one or more of `operator`, `buttons`, `vcard`):

```json
{
  "operator": {
    "uuid": "agent-42",
    "name": "Maria Silva",
    "gravatarHash": "md5-of-operator-email"
  },
  "buttons": [
    { "type": "reply", "label": "Yes" },
    { "type": "reply", "label": "No" },
    {
      "type": "url",
      "label": "Track order",
      "url": "https://acme.example.com/track/123"
    }
  ]
}
```

Send as a text message with encrypted attachments:

```bash
curl -X POST https://api.ixblix.app/api/messages/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxxx",
    "content": "base64-AES-GCM-ciphertext",
    "contentType": "text",
    "iv": "base64-iv",
    "authTag": "base64-auth-tag",
    "encryptedKey": "base64-rsa-wrapped-aes-key",
    "selfEncryptedKey": "base64-rsa-wrapped-aes-key-to-self",
    "keyId": "operator-key-1",
    "attachments": "base64-encrypted-attachments-blob"
  }'
```

**Rendering rules:**

- ≤ 3 buttons: rendered inline
- \> 3 buttons: rendered in modal
- Only `reply` buttons send messages back to operator

## Media Upload

Upload encrypted media files as multipart/form-data. The file bytes must already be encrypted by the client; the envelope fields describe how to decrypt them.

```bash
# Upload encrypted file
curl -X POST https://api.ixblix.app/api/media/company \
  -H "X-API-Key: smci_xxxx" \
  -F "conversationId=conv_xxxx" \
  -F "file=@encrypted_file.bin" \
  -F "iv=base64-iv" \
  -F "authTag=base64-auth-tag" \
  -F "encryptedKey=base64-rsa-wrapped-aes-key" \
  -F "selfEncryptedKey=base64-rsa-wrapped-aes-key-to-self" \
  -F "keyId=operator-key-1"
```

The response is a `Message` object with a `mediaId` referencing the uploaded file.

## Presence & Typing

Report operator presence (typing, recording, or stopped):

```bash
curl -X POST https://api.ixblix.app/api/conversations/conv_xxxx/presence \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{ "type": "typing" }'
```

Accepted `type` values: `typing`, `recording`, `stopped`.

## Key Transfer (Cross-Device)

Allow customers to transfer encryption keys between devices:

```bash
# Create transfer (source device)
curl -X POST https://api.ixblix.app/api/key-transfer \
  -H "Content-Type: application/json" \
  -d '{
    "ciphertext": "base64-AES-256-GCM-ciphertext-of-keypair",
    "iv": "base64-iv",
    "salt": "base64-pbkdf2-salt",
    "kdf": { "alg": "PBKDF2-SHA256", "iterations": 200000 },
    "publicKeySpki": "base64-SPKI-public-key"
  }'

# Response: { "transferId": "uuid", "expiresAt": "..." }

# Retrieve transfer (target device)
curl https://api.ixblix.app/api/key-transfer/{transferId}

# Confirm transfer
curl -X POST https://api.ixblix.app/api/key-transfer/{transferId}/confirm \
  -H "Content-Type: application/json" \
  -d '{ "publicKeySpki": "base64-SPKI-public-key" }'
```

## Authentication Methods

| Method          | Who              | Header          | Format                                   |
| --------------- | ---------------- | --------------- | ---------------------------------------- |
| HTTP Basic Auth | Integrators      | `Authorization` | `Basic base64(integratorId:accessToken)` |
| API Key         | Companies        | `X-API-Key`     | `smci_xxxxxxxxxxxx`                      |
| None            | Customers/Public | —               | Public endpoints use conversation tokens |

## Error Handling

All errors return:

```json
{
  "error": "The 'contact.externalId' field is required.",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "path": "contact.externalId", "message": "Must be a non-empty string" }
  ]
}
```

Common status codes: `400` (Bad Request), `401` (Unauthorized), `404` (Not Found), `429` (Rate Limit), `500` (Server Error).

## Security Best Practices

- Store API keys and webhook secrets in encrypted vaults
- Always verify webhook signatures before processing
- Never expose private keys in client-side code
- Use HTTPS for all API calls and webhook endpoints
- Rotate webhook secrets periodically
- Implement exponential backoff for retries on `429` and `5xx` errors

## Interactive API Documentation

Full OpenAPI spec with interactive testing available at: `https://dev.ixblix.app`

## Full Documentation

For complete API reference with all endpoints, request/response examples, and detailed parameter descriptions, see:

- **REST API Reference**: https://ixblix.app/docs/api-reference
- **SDK Reference**: https://ixblix.app/docs/sdk
- **Quick Start Guide**: https://ixblix.app/docs/quickstart
