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
    "callbackUrl": "https://mycrm.example.com/ixblix/callback",
    "contactEmail": "admin@mycrm.example.com"
  }'
```

**Request fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name of your integrator. |
| `callbackUrl` | Yes | URL where ixblix sends credentials for verification. |
| `contactEmail` | Yes | Contact email for the integrator. |
| `subscriptionId` | No | Subscription identifier in the format `{paymentProvider}:{id}`. The `id` portion is opaque to the API and interpreted by the payment provider internally. Required when the assigned payment provider needs a subscription reference. |

**Callback Verification:** ixblix sends a POST to your `callbackUrl` with:
```json
{
  "integratorId": "int_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accessToken": "ixblix_integrator_token_xxxxxxxxxxxx",
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```

Your endpoint must respond with `200 OK` to confirm receipt. Store these credentials securely.

### Step 2: List Available Plans

```bash
curl https://api.ixblix.app/api/plans
```

Response:
```json
{
  "plans": [
    {
      "id": "plan_starter",
      "name": "Starter",
      "monthlyPrice": 4900,
      "includedCredits": 1000,
      "features": ["e2ee", "webhooks", "rich-messages"]
    }
  ]
}
```

### Step 3: Register a Company

Create a company under your integrator account:

```bash
curl -X POST https://api.ixblix.app/api/companies/register \
  -u "integratorId:accessToken" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corporation",
    "planId": "plan_starter",
    "handle": "acme",
    "website": "https://acme.example.com"
  }'
```

Response includes `checkoutUrl` — redirect the company owner there to complete payment.

### Step 4: Activate the Company

After payment confirmation:

```bash
curl -X POST https://api.ixblix.app/api/companies/{companyId}/activate/{transactionId} \
  -u "integratorId:accessToken"
```

Response:
```json
{
  "company": { "id": "cmp_xxxx", "status": "active" },
  "apiKey": "smci_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Important:** The `apiKey` is shown only once. Store it securely.

### Step 5: Configure Webhook URL

Set your webhook endpoint to receive events:

```bash
curl -X PUT https://api.ixblix.app/api/companies/webhook \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://mycrm.example.com/ixblix/webhooks" }'
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
    "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhki..."
  }'
```

### Step 7: Create a Conversation

```bash
curl -X POST https://api.ixblix.app/api/conversations \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Jane Doe",
    "contactExternalId": "crm-contact-123",
    "originChannel": "whatsapp",
    "metadata": { "ticketId": "TK-456" }
  }'
```

Response:
```json
{
  "conversation": { "id": "conv_xxxx", "token": "dl_xxxx" },
  "deeplink": "https://api.ixblix.app/c/dl_xxxx"
}
```

Send the `deeplink` to your customer via WhatsApp, SMS, email, etc.

### Step 8: Handle Customer Join

When the customer opens the deeplink, you receive a `CUSTOMER_JOINED` webhook:

```json
{
  "type": "CUSTOMER_JOINED",
  "eventId": "evt_xxxx",
  "payload": {
    "conversationId": "conv_xxxx",
    "customerPublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjAN..."
  }
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
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const authTag = cipher.getAuthTag();
const wrappedKey = crypto.publicEncrypt({key: customerPublicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, aesKey);
console.log(JSON.stringify({
  content: Buffer.concat([iv, authTag, encrypted]).toString('base64'),
  key: wrappedKey.toString('base64')
}));
"

# Send encrypted message
curl -X POST https://api.ixblix.app/api/messages/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64-encoded-ciphertext...",
    "encryptedKey": "base64-encoded-wrapped-key..."
  }'
```

### Step 10: Receive Messages

When the customer replies, you receive a `MESSAGE_RECEIVED` webhook:

```json
{
  "type": "MESSAGE_RECEIVED",
  "eventId": "evt_xxxx",
  "payload": {
    "conversationId": "conv_xxxx",
    "messageId": "msg_xxxx",
    "encryptedContent": "base64...",
    "encryptedKey": "base64..."
  }
}
```

Decrypt using your operator private key:

```bash
node -e "
const crypto = require('crypto');
const encryptedKey = Buffer.from('base64-wrapped-key', 'base64');
const aesKey = crypto.privateDecrypt({key: operatorPrivateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256'}, encryptedKey);
const data = Buffer.from('base64-content', 'base64');
const iv = data.slice(0, 12);
const authTag = data.slice(12, 28);
const ciphertext = data.slice(28);
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
const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
console.log('Valid:', isValid);
"
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

## Rich Messages

Send interactive buttons (quick replies, URLs, copy, Pix, vCard, location):

```bash
curl -X POST https://api.ixblix.app/api/messages/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64...",
    "encryptedKey": "base64...",
    "attachments": [
      { "type": "reply", "label": "Yes" },
      { "type": "reply", "label": "No" },
      { "type": "url", "label": "Track order", "url": "https://acme.example.com/track/123" }
    ]
  }'
```

## Media Upload

Upload encrypted media files:

```bash
# Upload encrypted file
curl -X POST https://api.ixblix.app/api/media/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/octet-stream" \
  -H "X-Media-Type: document" \
  -H "X-Media-Filename: invoice.pdf" \
  -H "X-Media-Mime: application/pdf" \
  --data-binary @encrypted_file.bin

# Send message with media reference
curl -X POST https://api.ixblix.app/api/messages/company \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxxx",
    "encryptedContent": "base64...",
    "encryptedKey": "base64...",
    "mediaId": "med_xxxx"
  }'
```

## Presence & Typing

Report operator presence:

```bash
curl -X POST https://api.ixblix.app/api/conversations/conv_xxxx/presence \
  -H "X-API-Key: smci_xxxx" \
  -H "Content-Type: application/json" \
  -d '{ "type": "TYPING" }'
```

## Key Transfer (Cross-Device)

Allow customers to transfer encryption keys between devices:

```bash
# Create transfer (source device)
curl -X POST https://api.ixblix.app/api/key-transfer \
  -H "Content-Type: application/json" \
  -d '{
    "conversationToken": "dl_xxxx",
    "encryptedPayload": "base64...",
    "salt": "base64...",
    "iv": "base64...",
    "authTag": "base64..."
  }'

# Retrieve transfer (target device)
curl https://api.ixblix.app/api/key-transfer/{transferId}

# Confirm transfer
curl -X POST https://api.ixblix.app/api/key-transfer/{transferId}/confirm
```

## Authentication Methods

| Method | Who | Header | Format |
|---|---|---|---|
| HTTP Basic Auth | Integrators | `Authorization` | `Basic base64(integratorId:accessToken)` |
| API Key | Companies | `X-API-Key` | `smci_xxxxxxxxxxxx` |
| None | Customers/Public | — | Public endpoints use conversation tokens |

## Error Handling

All errors return:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The 'contactName' field is required.",
    "details": [{ "field": "contactName", "message": "Must be a non-empty string" }]
  }
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
