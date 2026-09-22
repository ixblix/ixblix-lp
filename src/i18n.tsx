import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Locale = "en" | "pt" | "es";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectBrowserLocale(): Locale {
  const lang = navigator.language || "en";
  const normalized = lang.toLowerCase();
  if (normalized.startsWith("pt")) return "pt";
  if (normalized.startsWith("es")) return "es";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem("ixblix-locale");
    if (stored === "en" || stored === "pt" || stored === "es") return stored;
    return detectBrowserLocale();
  });

  useEffect(() => {
    localStorage.setItem("ixblix-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    return translations[locale]?.[key] ?? translations.en[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// ── Translations ──────────────────────────────────────────────────────────────

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    "nav.gettingStarted": "Getting Started",
    "nav.quickStart": "Quick Start",
    "nav.integratorRegistration": "Integrator Registration",
    "nav.companyRegistration": "Company Registration",
    "nav.messaging": "Send & Receive Messages",
    "nav.guides": "Guides",
    "nav.webhooks": "Webhooks",
    "nav.e2eEncryption": "End-to-End Encryption",
    "nav.richMessages": "Rich Messages",
    "nav.media": "Media Attachments",
    "nav.presence": "Presence & Typing",
    "nav.keyTransfer": "Key Transfer",
    "nav.reference": "Reference",
    "nav.auth": "Authentication",
    "nav.errors": "Error Handling",
    "nav.sdk": "JavaScript SDK",
    "nav.sampleIntegrator": "Sample Integrator",
    "nav.apiReference": "API Reference ↗",
    "nav.github": "GitHub ↗",

    // Home
    "home.tagline":
      "Independent commercial messaging platform. Integrate secure, white-labeled conversations into your CRM or help desk with end-to-end encryption.",
    "home.cta.start": "Quick Start Guide",
    "home.cta.api": "API Reference",
    "home.features.title": "Everything you need to integrate",
    "home.features.e2ee.title": "End-to-End Encryption",
    "home.features.e2ee.desc":
      "Hybrid RSA + AES-256-GCM encryption. Messages are encrypted client-side — the server never sees plaintext.",
    "home.features.webhooks.title": "Webhook-Driven",
    "home.features.webhooks.desc":
      "Receive real-time events via signed webhooks. Messages, presence, read receipts — all delivered to your endpoint.",
    "home.features.whitelabel.title": "White-Label",
    "home.features.whitelabel.desc":
      "Your brand, your experience. Customize colors, logos, and domain for each company.",
    "home.features.rich.title": "Rich Messages",
    "home.features.rich.desc":
      "Quick replies, URLs, copy-to-clipboard, Pix codes, vCards, and location sharing — all encrypted.",
    "home.features.multiplatform.title": "Multi-Platform",
    "home.features.multiplatform.desc":
      "Customers chat via PWA, iOS, or Android. Operators integrate via REST API and webhooks.",
    "home.features.sdk.title": "JavaScript SDK",
    "home.features.sdk.desc":
      "Official @ixblix/sdk-js package with typed HTTP client, crypto helpers, and webhook verification.",
    "home.ctaSection.title": "Ready to integrate?",
    "home.ctaSection.desc":
      "Start with the quick start guide and have your first conversation running in minutes.",
    "home.ctaSection.button": "Get Started",

    // AI Agent Skills
    "home.skills.title": "AI Agent Skills",
    "home.skills.desc": "Add these skill files to your AI agent (Claude, ChatGPT, Copilot, etc.) to enable full ixblix integration capabilities.",
    "home.skills.api.title": "REST API Skill",
    "home.skills.api.desc": "Complete integration guide using direct HTTP/cURL calls. No SDK required.",
    "home.skills.api.download": "Download API Skill",
    "home.skills.sdk.title": "JavaScript SDK Skill",
    "home.skills.sdk.desc": "Full integration guide using the official @ixblix/sdk-js TypeScript package.",
    "home.skills.sdk.download": "Download SDK Skill",
    "home.skills.instructions.title": "How to Add Skills to Your AI Agent",
    "home.skills.instructions.claude.title": "Claude (Anthropic)",
    "home.skills.instructions.claude.step1": "Download the skill file above",
    "home.skills.instructions.claude.step2": "Open Claude and go to Projects",
    "home.skills.instructions.claude.step3": "Create a new project or edit existing",
    "home.skills.instructions.claude.step4": "Click \"Add Knowledge\" → \"Upload file\"",
    "home.skills.instructions.claude.step5": "Upload the downloaded .md file",
    "home.skills.instructions.claude.step6": "Claude now has full ixblix integration knowledge",
    "home.skills.instructions.chatgpt.title": "ChatGPT (OpenAI)",
    "home.skills.instructions.chatgpt.step1": "Download the skill file above",
    "home.skills.instructions.chatgpt.step2": "Open ChatGPT and go to \"Create a GPT\"",
    "home.skills.instructions.chatgpt.step3": "In the \"Configure\" tab, scroll to \"Knowledge\"",
    "home.skills.instructions.chatgpt.step4": "Click \"Upload\" and select the .md file",
    "home.skills.instructions.chatgpt.step5": "Your custom GPT now knows ixblix integration",
    "home.skills.instructions.copilot.title": "GitHub Copilot",
    "home.skills.instructions.copilot.step1": "Download the skill file above",
    "home.skills.instructions.copilot.step2": "Place it in your project's <code>.github/instructions/</code> folder",
    "home.skills.instructions.copilot.step3": "Or add it to your <code>.github/copilot-instructions.md</code>",
    "home.skills.instructions.copilot.step4": "Copilot will reference it when answering ixblix questions",
    "home.skills.instructions.cursor.title": "Cursor / Windsurf / Other IDEs",
    "home.skills.instructions.cursor.step1": "Download the skill file above",
    "home.skills.instructions.cursor.step2": "Place it in your project root or <code>.cursor/rules/</code> folder",
    "home.skills.instructions.cursor.step3": "Reference it in your agent's system prompt or rules file",
    "home.skills.instructions.cursor.step4": "The agent will use it as context for ixblix integration tasks",

    // QuickStart
    "quickstart.title": "Quick Start",
    "quickstart.lead":
      "Get your first end-to-end encrypted conversation running in under 10 minutes. This guide walks you through the essential steps.",
    "quickstart.overview.title": "Overview",
    "quickstart.overview.text": "The ixblix platform connects",
    "quickstart.overview.integrators": "integrators",
    "quickstart.overview.companies": "companies",
    "quickstart.overview.flow": "with",
    "quickstart.overview.flowAfter": ". The flow is:",
    "quickstart.step.reg": "Register as an integrator",
    "quickstart.step.regDesc": "— get your API credentials",
    "quickstart.step.company": "Create a company",
    "quickstart.step.companyDesc": "— set up a business under your integrator",
    "quickstart.step.conversation": "Start a conversation",
    "quickstart.step.conversationDesc":
      "— create a chat and share the link with a customer",
    "quickstart.step.messages": "Send & receive messages",
    "quickstart.step.messagesDesc": "— encrypted end-to-end",
    "quickstart.prereqs.title": "Prerequisites",
    "quickstart.prereq1":
      "A callback URL where ixblix can verify your integrator registration (HTTPS required)",
    "quickstart.prereq2":
      "A webhook URL where ixblix will send events (HTTPS required)",
    "quickstart.prereq3": "Node.js 18+ (for the SDK) or any HTTP client",
    "quickstart.step1.title": "Step 1 — Install the SDK",
    "quickstart.step1.text": "Or use the REST API directly. The base URL is",
    "quickstart.step2.title": "Step 2 — Register Your Integrator",
    "quickstart.callout.callbackTitle": "Callback Verification",
    "quickstart.callout.callbackText": "ixblix sends a POST to your",
    "quickstart.callout.callbackWith": "with your",
    "quickstart.callout.callbackAnd": "and",
    "quickstart.callout.callbackEnd": ". Your endpoint must return",
    "quickstart.callout.callbackConfirm": "to confirm receipt.",
    "quickstart.step3.title": "Step 3 — Create a Company",
    "quickstart.step3.plansText": "First, list the available plans to choose one:",
    "quickstart.step3.response": "Response",
    "quickstart.step3.registerText": "Now register the company with the selected plan:",
    "quickstart.step4.title": "Step 4 — Activate & Configure",
    "quickstart.step4.text":
      "After payment, activate the company to receive its API key:",
    "quickstart.step5.title": "Step 5 — Start a Conversation",
    "quickstart.step6.title": "Step 6 — Send a Message",
    "quickstart.step7.title": "Step 7 — Receive Messages",
    "quickstart.step7.text": "When the customer replies, ixblix sends a",
    "quickstart.step7.textAfter": "webhook to your endpoint:",
    "quickstart.callout.liveTitle": "You're live!",
    "quickstart.callout.liveText":
      "You now have a working end-to-end encrypted conversation. Continue to the detailed guides to learn about",
    "quickstart.callout.liveWebhooks": "webhooks",
    "quickstart.callout.liveRich": "rich messages",
    "quickstart.callout.liveMedia": "media attachments",
    "quickstart.callout.liveAnd": ", and more.",
    "quickstart.nextSteps.title": "Next Steps",
    "quickstart.nextSteps.integrator": "detailed registration flow",
    "quickstart.nextSteps.e2ee": "understand the crypto scheme",
    "quickstart.nextSteps.webhooks": "all event types and verification",
    "quickstart.nextSteps.sdk": "full SDK reference",
    "quickstart.api.title": "Direct API (cURL)",
    "quickstart.api.text":
      "Prefer REST calls? Here are the equivalent cURL commands for each step.",
    "quickstart.api.regTitle": "Register Integrator",
    "quickstart.api.companyTitle": "Create Company",
    "quickstart.api.activateTitle": "Activate Company",
    "quickstart.api.webhookTitle": "Set Webhook URL",
    "quickstart.api.conversationTitle": "Create Conversation",
    "quickstart.api.sendMessageTitle": "Send Message",

    // IntegratorRegistration
    "integrator.title": "Integrator Registration",
    "integrator.lead":
      "Register your application (CRM, help desk, ticket system) as an integrator to access the ixblix API.",
    "integrator.howItWorks.title": "How It Works",
    "integrator.howItWorks.text": "Integrator registration uses a",
    "integrator.howItWorks.bold": "callback verification",
    "integrator.howItWorks.textAfter":
      "flow. You provide a URL, and ixblix sends your credentials to that URL. This proves you control the endpoint before any secrets are exchanged.",
    "integrator.step1": "You call",
    "integrator.step1After":
      "with your application name, callback URL, and contact email.",
    "integrator.step2":
      "ixblix creates your integrator account and sends a POST request to your callback URL with your",
    "integrator.step2And": "and",
    "integrator.step2End": ".",
    "integrator.step3": "Your callback endpoint must respond with",
    "integrator.step3After": "to confirm receipt.",
    "integrator.step4":
      "Store the credentials securely — you'll use them for all subsequent API calls.",
    "integrator.regRequest.title": "Registration Request",
    "integrator.requestBody.title": "Request Body",
    "integrator.table.field": "Field",
    "integrator.table.type": "Type",
    "integrator.table.required": "Required",
    "integrator.table.description": "Description",
    "integrator.table.nameDesc": "Display name of your application",
    "integrator.table.callbackUrlDesc":
      "HTTPS URL where ixblix will deliver your credentials",
    "integrator.table.contactEmailDesc": "Administrative contact email",
    "integrator.callbackPayload.title": "Callback Payload",
    "integrator.callbackPayload.text": "ixblix sends a",
    "integrator.callbackPayload.to": "to your",
    "integrator.callbackPayload.with": "with this JSON body:",
    "integrator.callout.storeTitle": "Store Credentials Securely",
    "integrator.callout.storeText": "The",
    "integrator.callout.storeOnce":
      "is shown only once during callback verification. Store it in a secure vault or encrypted database. If lost, contact support for rotation.",
    "integrator.handling.title": "Handling the Callback",
    "integrator.authAfter.title": "Authentication After Registration",
    "integrator.authAfter.text":
      "After registration, authenticate all API requests using",
    "integrator.authAfter.bold": "HTTP Basic Auth",
    "integrator.authAfter.colon": ":",
    "integrator.authAfter.username": "The username is your",
    "integrator.authAfter.and": "and the password is your",
    "integrator.authAfter.end": ".",
    "integrator.sdk.title": "Using the SDK",
    "integrator.profile.title": "Get Your Profile",
    "integrator.profile.response": "Response:",
    "integrator.errors.title": "Error Responses",
    "integrator.errors.table.status": "Status",
    "integrator.errors.table.meaning": "Meaning",
    "integrator.errors.400":
      "Invalid request body (missing fields, bad URL format)",
    "integrator.errors.409":
      "Callback URL already registered to another integrator",
    "integrator.errors.422": "Callback URL unreachable or did not return 200",
    "integrator.table.yes": "Yes",
    "integrator.table.no": "No",

    // CompanyRegistration
    "company.title": "Company Registration",
    "company.lead":
      "Create and activate companies under your integrator account. Each company gets its own API key, branding, and conversation space.",
    "company.overview.title": "Overview",
    "company.overview.text":
      "Companies are the businesses that use your integrator to talk to their customers. The lifecycle is:",
    "company.step.reg": "Register",
    "company.step.regDesc":
      "— create the company record and generate a payment transaction",
    "company.step.pay": "Pay",
    "company.step.payDesc":
      "— the company owner completes payment via the hosted checkout",
    "company.step.activate": "Activate",
    "company.step.activateDesc": "— receive the company's API key",
    "company.step.configure": "Configure",
    "company.step.configureDesc":
      "— set webhook URL, encryption key, and branding",
    "company.step1.title": "Step 1 — List Available Plans",
    "company.step1.text":
      "Before registering a company, fetch the available plans to choose one:",
    "company.step2.title": "Step 2 — Register the Company",
    "company.requestBody.title": "Request Body",
    "company.table.nameDesc": "Company display name",
    "company.table.planIdDesc": "ID of the plan to subscribe to",
    "company.table.handleDesc": "Unique slug for public profile (e.g.,",
    "company.table.websiteDesc": "Company website URL",
    "company.table.field": "Field",
    "company.table.type": "Type",
    "company.table.required": "Required",
    "company.table.description": "Description",
    "company.table.yes": "Yes",
    "company.table.no": "No",
    "company.response.title": "Response",
    "company.callout.checkoutTitle": "Checkout URL",
    "company.callout.checkoutText": "Redirect the company owner to",
    "company.callout.checkoutEnd":
      "to complete payment. The checkout page supports credit card and Pix Automático.",
    "company.step3.title": "Step 3 — Activate the Company",
    "company.step3.text":
      "After payment is confirmed, activate the company to receive its API key:",
    "company.callout.apiKeyTitle": "API Key — One-Time Display",
    "company.callout.apiKeyText": "The",
    "company.callout.apiKeyOnce":
      "is returned only at activation. Store it securely. The company can also retrieve it later via",
    "company.callout.apiKeyEnd": "(using the API key itself).",
    "company.step4.title": "Step 4 — Configure the Company",
    "company.step4.text":
      "After activation, use the company's API key to configure webhooks, encryption, and branding.",
    "company.webhook.title": "Set Webhook URL",
    "company.webhook.response": "Response includes the",
    "company.webhook.for": "for verifying webhook signatures:",
    "company.encKey.title": "Register Encryption Key",
    "company.encKey.text":
      "Register your operator's RSA public key for end-to-end encryption:",
    "company.list.title": "List Your Companies",
    "company.sdk.title": "Using the SDK",

    // Messaging
    "messaging.title": "Send & Receive Messages",
    "messaging.lead":
      "Create conversations, exchange end-to-end encrypted messages, and handle the full conversation lifecycle.",
    "messaging.lifecycle.title": "Conversation Lifecycle",
    "messaging.lifecycle.create": "Create conversation",
    "messaging.lifecycle.createDesc":
      "— your system creates a conversation and gets a deeplink",
    "messaging.lifecycle.share": "Share deeplink",
    "messaging.lifecycle.shareDesc":
      "— send the link to the customer via WhatsApp, SMS, email, etc.",
    "messaging.lifecycle.join": "Customer joins",
    "messaging.lifecycle.joinDesc":
      "— customer opens the link, registers their encryption key",
    "messaging.lifecycle.exchange": "Exchange messages",
    "messaging.lifecycle.exchangeDesc":
      "— both sides encrypt/decrypt with RSA + AES-256-GCM",
    "messaging.lifecycle.close": "Close conversation",
    "messaging.lifecycle.closeDesc": "— either side ends the chat",
    "messaging.create.title": "Create a Conversation",
    "messaging.requestBody.title": "Request Body",
    "messaging.table.field": "Field",
    "messaging.table.type": "Type",
    "messaging.table.required": "Required",
    "messaging.table.description": "Description",
    "messaging.table.yes": "Yes",
    "messaging.table.no": "No",
    "messaging.table.contactNameDesc": "Customer display name",
    "messaging.table.contactExternalIdDesc":
      "Your internal ID for this contact",
    "messaging.table.originChannelDesc": "Source channel:",
    "messaging.table.metadataDesc":
      "Arbitrary key-value data stored with the conversation",
    "messaging.response.title": "Response",
    "messaging.callout.deeplinkTitle": "Deeplink",
    "messaging.callout.deeplinkText": "Send the",
    "messaging.callout.deeplinkEnd":
      "to your customer. When they open it, they'll see a white-labeled chat interface with the company's branding.",
    "messaging.joins.title": "Customer Joins",
    "messaging.joins.text":
      "When the customer opens the deeplink and the web app loads, it generates an RSA keypair and registers the public key. You receive a",
    "messaging.joins.webhook": "webhook:",
    "messaging.callout.storeKeyTitle": "Store the Customer Public Key",
    "messaging.callout.storeKeyText":
      "You need this key to encrypt all messages sent to this customer. Store it associated with the conversation.",
    "messaging.send.title": "Send a Message (Company → Customer)",
    "messaging.send.text":
      "All messages are encrypted client-side. Use the customer's public key (from the",
    "messaging.send.webhook": "webhook) to encrypt:",
    "messaging.send.table.conversationIdDesc":
      "Conversation to send the message in",
    "messaging.send.table.encryptedContentDesc":
      "AES-256-GCM encrypted message (base64)",
    "messaging.send.table.encryptedKeyDesc":
      "RSA-OAEP wrapped AES key (base64)",
    "messaging.send.table.attachmentsDesc":
      "Optional rich message attachments (also encrypted) — see",
    "messaging.receive.title": "Receive a Message (Customer → Company)",
    "messaging.receive.text":
      "When the customer sends a message, you receive a",
    "messaging.receive.webhook": "webhook:",
    "messaging.decrypt.title": "Decrypt the Message",
    "messaging.list.title": "List Messages",
    "messaging.list.text":
      "Returns messages in reverse chronological order. Messages are returned in their encrypted form — decrypt them client-side.",
    "messaging.read.title": "Mark Messages as Read",
    "messaging.read.operator": "Operator read (company side)",
    "messaging.read.operatorText": "This sends a",
    "messaging.read.operatorEnd": "Socket.io event to the customer.",
    "messaging.read.customer": "Customer read (triggers webhook)",
    "messaging.read.customerText":
      "When the customer reads your messages, you receive a",
    "messaging.read.customerEnd": "webhook:",
    "messaging.close.title": "Close a Conversation",
    "messaging.close.text": "This triggers a",
    "messaging.close.webhook":
      "webhook to your endpoint. The customer's chat UI will show the conversation as closed.",
    "messaging.erase.title": "Erase a Conversation (LGPD)",
    "messaging.erase.text":
      "To comply with data protection regulations, you can permanently erase all conversation data:",
    "messaging.callout.irreversibleTitle": "Irreversible Action",
    "messaging.callout.irreversibleText":
      "Erasing a conversation permanently deletes all messages, media, and contact data. This cannot be undone.",

    // Webhooks
    "webhooks.title": "Webhooks",
    "webhooks.lead":
      "Receive real-time events from ixblix via signed HTTP webhooks. Every conversation action, message, and presence change is delivered to your endpoint.",
    "webhooks.setup.title": "Setting Up Webhooks",
    "webhooks.setup.text":
      "Configure your webhook URL per company using the company's API key:",
    "webhooks.setup.response": "Response:",
    "webhooks.callout.storeTitle": "Store the Secret",
    "webhooks.callout.storeText": "The",
    "webhooks.callout.storeEnd":
      "is returned only when the URL is set or rotated. Use it to verify webhook signatures.",
    "webhooks.verify.title": "Verifying Signatures",
    "webhooks.verify.text": "Every webhook request includes an",
    "webhooks.verify.header":
      "header containing an HMAC-SHA256 signature of the request body. Always verify this signature before processing the event.",
    "webhooks.verify.sdkTitle": "Using the SDK",
    "webhooks.verify.manualTitle": "Manual Verification",
    "webhooks.events.title": "Event Types",
    "webhooks.events.table.event": "Event",
    "webhooks.events.table.when": "When",
    "webhooks.events.table.payload": "Key Payload Fields",
    "webhooks.events.messageReceived": "Customer sends a message",
    "webhooks.events.messageRead": "Customer reads company messages",
    "webhooks.events.customerJoined": "Customer opens chat and registers key",
    "webhooks.events.conversationClosed": "Conversation is closed",
    "webhooks.events.typing": "Customer starts typing",
    "webhooks.events.stoppedTyping": "Customer stops typing",
    "webhooks.events.recording": "Customer starts recording audio",
    "webhooks.events.chatClosed": "Customer closes the chat window",
    "webhooks.events.balanceLow": "Company credit balance is low",
    "webhooks.payload.title": "Event Payload Structure",
    "webhooks.payload.text": "All webhook events follow this structure:",
    "webhooks.headers.title": "Request Headers",
    "webhooks.headers.table.header": "Header",
    "webhooks.headers.table.description": "Description",
    "webhooks.headers.signatureDesc":
      "HMAC-SHA256 signature of the request body",
    "webhooks.headers.eventIdDesc":
      "Unique event ID for deduplication (idempotency key)",
    "webhooks.delivery.title": "Delivery Guarantees",
    "webhooks.delivery.atLeastOnce": "At-least-once delivery",
    "webhooks.delivery.atLeastOnceDesc":
      "— events are persisted to an outbox before delivery and retried on failure.",
    "webhooks.delivery.backoff": "Exponential backoff",
    "webhooks.delivery.backoffDesc":
      "— failed deliveries are retried up to 8 times with increasing intervals.",
    "webhooks.delivery.idempotency": "Idempotency",
    "webhooks.delivery.idempotencyDesc": "— use the",
    "webhooks.delivery.idempotencyEnd":
      "header to deduplicate events. Your handler should be idempotent.",
    "webhooks.delivery.timeout": "Timeout",
    "webhooks.delivery.timeoutDesc":
      "— your endpoint must respond within 30 seconds. Process events asynchronously if needed.",
    "webhooks.callout.respondTitle": "Respond Quickly",
    "webhooks.callout.respondText": "Always respond with",
    "webhooks.callout.respondEnd":
      "as fast as possible. If your processing takes longer, queue the event and process it in a background worker.",
    "webhooks.rotate.title": "Rotating the Webhook Secret",
    "webhooks.rotate.text":
      "To rotate your webhook secret, call the same endpoint with a new URL (or the same URL):",
    "webhooks.rotate.end": "A new",
    "webhooks.rotate.returned":
      "is returned. The old secret is invalidated immediately.",

    // E2EEncryption
    "e2ee.title": "End-to-End Encryption",
    "e2ee.lead":
      "All messages in ixblix are encrypted client-side using a hybrid RSA + AES-256-GCM scheme. The server never sees plaintext content.",
    "e2ee.scheme.title": "Encryption Scheme",
    "e2ee.scheme.text": "ixblix uses a hybrid encryption approach:",
    "e2ee.scheme.rsa": "for key exchange",
    "e2ee.scheme.aes": "for message content encryption",
    "e2ee.scheme.fresh":
      "Each message gets a fresh, random AES key. The AES key is then encrypted (wrapped) with the recipient's RSA public key.",
    "e2ee.how.title": "How It Works",
    "e2ee.how.operator": "Operator generates RSA keypair",
    "e2ee.how.operatorDesc":
      "on first setup and registers the public key with ixblix.",
    "e2ee.how.customer": "Customer generates RSA keypair",
    "e2ee.how.customerDesc":
      "when they open the chat for the first time and registers their public key.",
    "e2ee.how.send": "To send a message",
    "e2ee.how.sendDesc": ", the sender:",
    "e2ee.how.genAes": "Generates a random AES-256 key",
    "e2ee.how.encryptMsg": "Encrypts the message content with AES-256-GCM",
    "e2ee.how.wrapRecipient":
      "Wraps the AES key with the recipient's RSA public key",
    "e2ee.how.wrapSelf":
      "Also wraps the AES key with their own public key (for self-read)",
    "e2ee.how.sendApi": "Sends the encrypted content + wrapped keys to the API",
    "e2ee.how.read": "To read a message",
    "e2ee.how.readDesc": ", the recipient:",
    "e2ee.how.unwrap": "Unwraps the AES key using their RSA private key",
    "e2ee.how.decrypt": "Decrypts the content with AES-256-GCM",
    "e2ee.gen.title": "Generating an Operator Keypair",
    "e2ee.gen.nodeTitle": "Using Node.js Crypto Directly",
    "e2ee.register.title": "Registering Your Public Key",
    "e2ee.encrypt.title": "Encrypting a Message",
    "e2ee.decrypt.title": "Decrypting a Message",
    "e2ee.media.title": "Encrypting Media",
    "e2ee.media.text":
      "Media files (images, audio, documents) use the same hybrid scheme. The SDK provides dedicated helpers:",
    "e2ee.keyMgmt.title": "Key Management",
    "e2ee.keyMgmt.storeTitle": "Storing Keys Securely",
    "e2ee.keyMgmt.storeText":
      "Your operator private key must be stored securely. Options:",
    "e2ee.keyMgmt.env": "Environment variable",
    "e2ee.keyMgmt.envDesc": "— for simple deployments",
    "e2ee.keyMgmt.db": "Encrypted database field",
    "e2ee.keyMgmt.dbDesc": "— encrypt the PEM with a master key",
    "e2ee.keyMgmt.vault": "Vault / KMS",
    "e2ee.keyMgmt.vaultDesc": "— AWS KMS, HashiCorp Vault, etc.",
    "e2ee.callout.neverTitle": "Never Expose Private Keys",
    "e2ee.callout.neverText":
      "The operator private key decrypts all messages for the company. If compromised, all past and future messages can be read. Never log it, embed it in client-side code, or send it over unencrypted channels.",
    "e2ee.keyMgmt.retrieveTitle": "Retrieving Your Registered Key",
    "e2ee.keyMgmt.convKeysTitle": "Getting Conversation Keys",
    "e2ee.keyMgmt.convKeysText":
      "To retrieve both the operator's and customer's public keys for a conversation:",
    "e2ee.security.title": "Security Properties",
    "e2ee.security.forward": "Forward secrecy per message",
    "e2ee.security.forwardDesc":
      "— each message uses a fresh AES key, so compromising one key doesn't affect others.",
    "e2ee.security.server": "Server cannot read messages",
    "e2ee.security.serverDesc":
      "— the backend only stores ciphertext and wrapped keys.",
    "e2ee.security.auth": "Authentication via GCM",
    "e2ee.security.authDesc":
      "— AES-GCM provides both confidentiality and integrity.",
    "e2ee.security.selfRead": "Self-read capability",
    "e2ee.security.selfReadDesc":
      "— the sender wraps the AES key to their own key, allowing them to read sent messages.",

    // RichMessages
    "rich.title": "Rich Messages",
    "rich.lead":
      "Enhance conversations with interactive buttons: quick replies, URLs, copy-to-clipboard, Pix codes, contact cards, and locations.",
    "rich.overview.title": "Overview",
    "rich.overview.text": "Rich messages are sent as",
    "rich.overview.attachments": "attachments",
    "rich.overview.alongside":
      "alongside your encrypted message content. Attachments are encrypted with the same AES key as the message body.",
    "rich.overview.operator": "Only the",
    "rich.overview.operatorBold": "operator (company)",
    "rich.overview.operatorEnd":
      "can send rich messages. Customers can only reply by tapping buttons (which sends the label as a text message).",
    "rich.types.title": "Attachment Types",
    "rich.types.quickReply.title": "Quick Reply",
    "rich.types.quickReply.text": "Shows a button that sends the",
    "rich.types.quickReply.end": "as a text reply when tapped.",
    "rich.types.url.title": "URL Button",
    "rich.types.url.text": "Opens a URL in the customer's browser.",
    "rich.types.copy.title": "Copy to Clipboard",
    "rich.types.copy.text":
      "Copies a value to the customer's clipboard when tapped.",
    "rich.types.pix.title": "Pix Code",
    "rich.types.pix.text":
      "Same as copy, but with a Pix icon to indicate it's a payment code.",
    "rich.types.vcard.title": "vCard (Contact Card)",
    "rich.types.vcard.text":
      "Displays a contact card with name, phone, and organization.",
    "rich.types.location.title": "Location",
    "rich.types.location.text": "Shows a map link with the given coordinates.",
    "rich.sending.title": "Sending Rich Messages",
    "rich.sending.text":
      "Include attachments in your message request. They are encrypted along with the message content:",
    "rich.rendering.title": "Rendering Rules",
    "rich.rendering.inline": "≤ 3 buttons",
    "rich.rendering.inlineDesc": "— rendered inline below the message",
    "rich.rendering.modal": "&gt; 3 buttons",
    "rich.rendering.modalDesc": "— rendered in a modal/overlay",
    "rich.rendering.order": "Buttons are displayed in the order they are sent",
    "rich.rendering.reply": "Only",
    "rich.rendering.replyEnd": "buttons trigger a message back to the operator",
    "rich.rendering.url": "buttons open in the system browser",
    "rich.rendering.copy": "and",
    "rich.rendering.copyEnd":
      "buttons copy to clipboard and show a confirmation toast",
    "rich.mixing.title": "Mixing Attachment Types",
    "rich.mixing.text": "You can mix different types in a single message:",
    "rich.api.title": "Direct API (cURL)",
    "rich.api.text":
      "The equivalent cURL command for sending rich messages. Attachments are sent as a JSON array alongside the encrypted content:",

    // Media
    "media.title": "Media Attachments",
    "media.lead":
      "Send and receive images, audio, video, and documents — all encrypted end-to-end.",
    "media.how.title": "How Media Encryption Works",
    "media.how.text":
      "Media files follow the same hybrid encryption scheme as messages:",
    "media.how.step1": "A fresh AES-256 key is generated for the file",
    "media.how.step2": "The file is encrypted with AES-256-GCM",
    "media.how.step3":
      "The AES key is wrapped with the recipient's RSA public key",
    "media.how.step4":
      "The encrypted file is uploaded to ixblix's object storage",
    "media.how.step5":
      "The media ID and wrapped key are sent as part of the message",
    "media.upload.title": "Upload Media (Company → Customer)",
    "media.uploadCustomer.title": "Upload Media (Customer → Company)",
    "media.uploadCustomer.text":
      "Customers upload media through the chat UI. You receive a",
    "media.uploadCustomer.webhook": "webhook with the",
    "media.uploadCustomer.end": ":",
    "media.download.title": "Download Media",
    "media.download.company": "Company downloading customer media",
    "media.download.decryptTitle": "Decrypt the Downloaded File",
    "media.types.title": "Media Types",
    "media.types.table.type": "Type",
    "media.types.table.formats": "Supported Formats",
    "media.types.table.maxSize": "Max Size",
    "media.metadata.title": "Media Metadata",
    "media.api.uploadTitle": "Upload via cURL",
    "media.api.uploadText":
      "Upload encrypted media directly with cURL. The file must already be encrypted with AES-256-GCM:",

    // Presence
    "presence.title": "Presence & Typing Indicators",
    "presence.lead":
      "Show real-time typing, recording, and chat status indicators between operators and customers.",
    "presence.types.title": "Presence Types",
    "presence.types.table.type": "Type",
    "presence.types.table.direction": "Direction",
    "presence.types.table.description": "Description",
    "presence.types.both": "Both",
    "presence.types.customerOperator": "Customer → Operator",
    "presence.types.typingDesc": "User is typing a text message",
    "presence.types.recordingDesc": "Customer is recording an audio message",
    "presence.types.chatClosedDesc": "Customer closed the chat window/tab",
    "presence.operator.title": "Operator Presence (Company → Customer)",
    "presence.operator.text":
      "Send operator presence via the API. This is delivered to the customer in real-time via Socket.io.",
    "presence.operator.ui":
      'The customer\'s chat UI shows "Agent is typing..." when it receives this event.',
    "presence.operator.identityTitle": "Set Operator Identity",
    "presence.operator.identityText":
      "Optionally associate an operator name/avatar with the conversation:",
    "presence.customer.title": "Customer Presence (Customer → Operator)",
    "presence.customer.text":
      "When the customer types or records audio, you receive webhooks:",
    "presence.customer.typingTitle": "Typing Webhook",
    "presence.customer.recordingTitle": "Recording Webhook",
    "presence.customer.chatClosedTitle": "Chat Closed Webhook",
    "presence.relay.title": "Customer Presence (Operator → API)",
    "presence.relay.text":
      "If you're relaying presence from the original channel (e.g., WhatsApp), use the unified presence route with the deeplink token:",
    "presence.relay.end": "When called",
    "presence.relay.without": "without",
    "presence.relay.an": "an",
    "presence.relay.and": "and with a deeplink token as the ref, this emits a",
    "presence.relay.webhook": "webhook to the operator.",
    "presence.best.title": "Best Practices",
    "presence.best.typing": "Send",
    "presence.best.typingEnd":
      "when the operator starts composing, and stop when they send the message or pause for more than 5 seconds.",
    "presence.best.throttle":
      "Throttle presence updates to avoid flooding — the customer UI auto-hides the indicator after a few seconds of inactivity.",
    "presence.best.recording": "Use",
    "presence.best.recordingEnd":
      "only when the customer is actively recording audio (not just holding the button).",

    // KeyTransfer
    "keytransfer.title": "Key Transfer",
    "keytransfer.lead":
      "Allow customers to transfer their encryption keypair between devices (e.g., from the PWA to a native mobile app) securely.",
    "keytransfer.when.title": "When to Use",
    "keytransfer.when.text":
      "A customer starts chatting on the web (PWA) and later wants to continue on their phone app. Since each device generates its own RSA keypair, the key must be transferred to maintain conversation continuity.",
    "keytransfer.how.title": "How It Works",
    "keytransfer.how.step1": "Source device",
    "keytransfer.how.step1Desc":
      "encrypts the keypair with a PIN-derived key (PBKDF2-SHA256, 200k iterations) and uploads the ciphertext.",
    "keytransfer.how.step2": "Source device",
    "keytransfer.how.step2Desc":
      "displays the PIN and a transfer link or QR code.",
    "keytransfer.how.step3": "Target device",
    "keytransfer.how.step3Desc":
      "opens the link, fetches the encrypted payload, and prompts the user for the PIN.",
    "keytransfer.how.step4": "Target device",
    "keytransfer.how.step4Desc":
      "derives the same key from the PIN, decrypts the keypair, and stores it securely.",
    "keytransfer.how.step5": "Target device",
    "keytransfer.how.step5Desc":
      "confirms the transfer, and the source device can optionally delete its local key.",
    "keytransfer.security.title": "Security Properties",
    "keytransfer.security.ttl": "5-minute TTL",
    "keytransfer.security.ttlDesc": "— transfers expire after 5 minutes",
    "keytransfer.security.attempts": "5 attempts max",
    "keytransfer.security.attemptsDesc": "— wrong PIN attempts are limited",
    "keytransfer.security.kek": "PIN-derived KEK",
    "keytransfer.security.kekDesc": "— PBKDF2-SHA256 with 200k iterations",
    "keytransfer.security.spki": "SPKI validation",
    "keytransfer.security.spkiDesc":
      "— the decrypted key is validated before storage",
    "keytransfer.security.onetime": "One-time use",
    "keytransfer.security.onetimeDesc":
      "— once confirmed, the transfer is consumed",
    "keytransfer.create.title": "Create a Transfer (Source Device)",
    "keytransfer.retrieve.title": "Retrieve a Transfer (Target Device)",
    "keytransfer.poll.title": "Poll Transfer Status",
    "keytransfer.poll.text":
      "The source device can poll to know when the transfer is complete:",
    "keytransfer.delete.title": "Delete a Transfer",
    "keytransfer.delete.text": "Cancel a transfer before it's consumed:",
    "keytransfer.callout.autoTitle": "Auto-Cleanup",
    "keytransfer.callout.autoText":
      "Transfers are automatically deleted after 5 minutes or after 5 failed PIN attempts. You don't need to clean up manually.",
    "keytransfer.api.createTitle": "Create Transfer via cURL",
    "keytransfer.api.createText":
      "The equivalent cURL command to create a key transfer. The encrypted payload must be generated client-side using PIN-derived encryption:",
    "keytransfer.api.retrieveTitle": "Retrieve Transfer via cURL",
    "keytransfer.api.retrieveText": "Fetch the encrypted transfer payload:",

    // AuthReference
    "auth.title": "Authentication Reference",
    "auth.lead":
      "ixblix uses three authentication methods depending on who is making the request.",
    "auth.methods.title": "Authentication Methods",
    "auth.methods.table.method": "Method",
    "auth.methods.table.who": "Who",
    "auth.methods.table.header": "Header",
    "auth.methods.table.format": "Format",
    "auth.methods.basic": "HTTP Basic Auth",
    "auth.methods.integrators": "Integrators",
    "auth.methods.apiKey": "API Key",
    "auth.methods.companies": "Companies",
    "auth.methods.none": "None",
    "auth.methods.customers": "Customers / Public",
    "auth.methods.publicDesc": "Public endpoints use conversation tokens",
    "auth.integrator.title": "Integrator Authentication (Basic Auth)",
    "auth.integrator.text":
      "Used for integrator-scoped operations: registering companies, listing companies, viewing integrator profile.",
    "auth.integrator.username": "The username is your",
    "auth.integrator.and": "and the password is your",
    "auth.integrator.end": ".",
    "auth.integrator.endpointsTitle": "Endpoints Requiring Basic Auth",
    "auth.company.title": "Company Authentication (API Key)",
    "auth.company.text":
      "Used for all company-scoped operations: conversations, messages, webhooks, encryption keys, etc.",
    "auth.company.formatTitle": "API Key Format",
    "auth.company.prefix": "Prefix:",
    "auth.company.length": "Length: 32 characters after prefix",
    "auth.company.generated": "Generated at company activation",
    "auth.company.once": "Returned only once — store securely",
    "auth.public.title": "Public Endpoints (No Auth)",
    "auth.public.text":
      "These endpoints use conversation tokens or transfer IDs for access control instead of authentication headers:",
    "auth.public.table.endpoint": "Endpoint",
    "auth.public.table.access": "Access Control",
    "auth.public.convToken": "Conversation deeplink token",
    "auth.public.convId": "Conversation ID in body",
    "auth.public.handle": "Public company handle",
    "auth.public.public": "Public",
    "auth.admin.title": "Admin Authentication (JWT)",
    "auth.admin.text":
      "The admin console uses JWT bearer tokens. These are not available to integrators or companies — admin endpoints are for platform operators only.",
    "auth.best.title": "Security Best Practices",
    "auth.best.never":
      "Never expose API keys or access tokens in client-side code",
    "auth.best.rotate": "Rotate webhook secrets periodically",
    "auth.best.store":
      "Store credentials in encrypted vaults or environment variables",
    "auth.best.https": "Use HTTPS for all API calls and webhook endpoints",
    "auth.best.verify": "Verify webhook signatures before processing events",

    // ErrorHandling
    "errors.title": "Error Handling",
    "errors.lead":
      "Understand ixblix error responses, status codes, and how to handle them gracefully.",
    "errors.format.title": "Error Response Format",
    "errors.format.text": "All API errors return a consistent JSON structure:",
    "errors.status.title": "HTTP Status Codes",
    "errors.status.table.code": "Code",
    "errors.status.table.meaning": "Meaning",
    "errors.status.table.cause": "Common Cause",
    "errors.status.400": "Bad Request",
    "errors.status.400cause": "Invalid request body, missing required fields",
    "errors.status.401": "Unauthorized",
    "errors.status.401cause": "Missing or invalid authentication",
    "errors.status.403": "Forbidden",
    "errors.status.403cause": "Valid auth but insufficient permissions",
    "errors.status.404": "Not Found",
    "errors.status.404cause": "Resource doesn't exist or was deleted",
    "errors.status.409": "Conflict",
    "errors.status.409cause": "Duplicate resource (e.g., handle already taken)",
    "errors.status.422": "Unprocessable Entity",
    "errors.status.422cause":
      "Valid JSON but semantically invalid (e.g., bad URL)",
    "errors.status.429": "Too Many Requests",
    "errors.status.429cause": "Rate limit exceeded",
    "errors.status.500": "Internal Server Error",
    "errors.status.500cause": "Unexpected server error — retry with backoff",
    "errors.codes.title": "Error Codes",
    "errors.codes.table.code": "Code",
    "errors.codes.table.description": "Description",
    "errors.codes.validation": "Request body failed validation",
    "errors.codes.authRequired": "No authentication provided",
    "errors.codes.invalidCreds": "Wrong API key or Basic Auth credentials",
    "errors.codes.notActive": "Company hasn't completed payment/activation",
    "errors.codes.notFound": "Conversation doesn't exist or is expired",
    "errors.codes.closed": "Cannot send messages in a closed conversation",
    "errors.codes.encryption":
      "Customer hasn't registered their public key yet",
    "errors.codes.balance": "Company has no credits remaining",
    "errors.codes.webhook": "Webhook URL didn't respond with 200",
    "errors.codes.rateLimit": "Too many requests in a short period",
    "errors.codes.internal": "Unexpected server error",
    "errors.sdk.title": "Handling Errors in the SDK",
    "errors.retry.title": "Retry Strategy",
    "errors.retry.text": "For",
    "errors.retry.end": "errors, implement exponential backoff:",
    "errors.webhook.title": "Webhook Error Handling",
    "errors.webhook.text":
      "If your webhook endpoint returns a non-200 status or times out (30s), ixblix retries the delivery:",
    "errors.webhook.retries": "Up to 8 retry attempts",
    "errors.webhook.backoff": "Exponential backoff between retries",
    "errors.webhook.dedup": "Use the",
    "errors.webhook.dedupEnd": "header for deduplication",
    "errors.callout.respondTitle": "Always Respond 200",
    "errors.callout.respondText":
      "Even if you can't process the event immediately, respond with",
    "errors.callout.respondEnd":
      "and queue the event for async processing. This prevents unnecessary retries.",

    // SdkReference
    "sdk.title": "JavaScript SDK",
    "sdk.lead": "Official",
    "sdk.leadEnd":
      "package — typed HTTP client, crypto helpers, keypair persistence, and webhook verification.",
    "sdk.install.title": "Installation",
    "sdk.client.title": "IxblixClient",
    "sdk.client.text":
      "The main HTTP client. Supports all three authentication modes.",
    "sdk.client.optionsTitle": "Constructor Options",
    "sdk.client.integratorTitle": "Integrator Methods",
    "sdk.client.companyTitle": "Company Management Methods",
    "sdk.client.conversationTitle": "Conversation Methods",
    "sdk.client.messageTitle": "Message Methods",
    "sdk.client.configTitle": "Company Configuration Methods",
    "sdk.crypto.title": "Crypto Helpers",
    "sdk.keypair.title": "Keypair Persistence",
    "sdk.webhook.title": "Webhook Helpers",
    "sdk.error.title": "Error Class",

    // SampleIntegrator
    "sample.title": "Sample Integrator",
    "sample.lead":
      "A complete reference implementation of a ticket desk integration with ixblix. This example shows how to wire everything together.",
    "sample.arch.title": "Architecture",
    "sample.arch.text":
      "The sample integrator is a Node.js/Express application that:",
    "sample.arch.reg": "Registers as an integrator and handles the callback",
    "sample.arch.company": "Creates companies and manages their lifecycle",
    "sample.arch.webhooks":
      "Receives webhooks for incoming messages and events",
    "sample.arch.encrypt":
      "Encrypts outgoing messages and decrypts incoming ones",
    "sample.arch.persist":
      "Persists the operator keypair and customer public keys",
    "sample.setup.title": "Project Setup",
    "sample.complete.title": "Complete Example",
    "sample.running.title": "Running the Sample",
    "sample.ngrok.title": "Testing with ngrok",
    "sample.ngrok.text":
      "To test webhooks locally, use ngrok to expose your server:",
    "sample.takeaways.title": "Key Takeaways",
    "sample.takeaways.store": "Store credentials securely",
    "sample.takeaways.storeDesc":
      "— integrator tokens, API keys, and webhook secrets should be in a database or vault, not in memory.",
    "sample.takeaways.verify": "Always verify webhooks",
    "sample.takeaways.verifyDesc": "— use",
    "sample.takeaways.verifyEnd": "before processing any event.",
    "sample.takeaways.handle": "Handle CUSTOMER_JOINED",
    "sample.takeaways.handleDesc":
      "— this is when you receive the customer's public key and can start sending encrypted messages.",
    "sample.takeaways.respond": "Respond 200 quickly",
    "sample.takeaways.respondDesc":
      "— process webhook events asynchronously if they take time.",
    "sample.takeaways.sdk": "Use the SDK",
    "sample.takeaways.sdkDesc":
      "— it handles encryption, decryption, and type safety for you.",

    // Common
    "common.prev": "← Previous",
    "common.next": "Next →",
    "common.copy": "Copy",
    "common.copied": "Copied!",
  },
  pt: {
    // Nav
    "nav.gettingStarted": "Primeiros Passos",
    "nav.quickStart": "Início Rápido",
    "nav.integratorRegistration": "Registro de Integrador",
    "nav.companyRegistration": "Registro de Empresa",
    "nav.messaging": "Enviar e Receber Mensagens",
    "nav.guides": "Guias",
    "nav.webhooks": "Webhooks",
    "nav.e2eEncryption": "Criptografia Ponta a Ponta",
    "nav.richMessages": "Mensagens Ricas",
    "nav.media": "Anexos de Mídia",
    "nav.presence": "Presença e Digitação",
    "nav.keyTransfer": "Transferência de Chave",
    "nav.reference": "Referência",
    "nav.auth": "Autenticação",
    "nav.errors": "Tratamento de Erros",
    "nav.sdk": "SDK JavaScript",
    "nav.sampleIntegrator": "Integrador de Exemplo",
    "nav.apiReference": "Referência da API ↗",
    "nav.github": "GitHub ↗",

    // Home
    "home.tagline":
      "Plataforma independente de mensageria comercial. Integre conversas seguras e white-label no seu CRM ou help desk com criptografia ponta a ponta.",
    "home.cta.start": "Guia de Início Rápido",
    "home.cta.api": "Referência da API",
    "home.features.title": "Tudo que você precisa para integrar",
    "home.features.e2ee.title": "Criptografia Ponta a Ponta",
    "home.features.e2ee.desc":
      "Criptografia híbrida RSA + AES-256-GCM. Mensagens são criptografadas no cliente — o servidor nunca vê o texto plano.",
    "home.features.webhooks.title": "Orientado a Webhooks",
    "home.features.webhooks.desc":
      "Receba eventos em tempo real via webhooks assinados. Mensagens, presença, recibos de leitura — tudo entregue ao seu endpoint.",
    "home.features.whitelabel.title": "White-Label",
    "home.features.whitelabel.desc":
      "Sua marca, sua experiência. Personalize cores, logos e domínio para cada empresa.",
    "home.features.rich.title": "Mensagens Ricas",
    "home.features.rich.desc":
      "Respostas rápidas, URLs, copiar para clipboard, códigos Pix, vCards e compartilhamento de localização — tudo criptografado.",
    "home.features.multiplatform.title": "Multi-Plataforma",
    "home.features.multiplatform.desc":
      "Clientes conversam via PWA, iOS ou Android. Operadores integram via API REST e webhooks.",
    "home.features.sdk.title": "SDK JavaScript",
    "home.features.sdk.desc":
      "Pacote oficial @ixblix/sdk-js com cliente HTTP tipado, auxiliares de criptografia e verificação de webhooks.",
    "home.ctaSection.title": "Pronto para integrar?",
    "home.ctaSection.desc":
      "Comece com o guia de início rápido e tenha sua primeira conversa funcionando em minutos.",
    "home.ctaSection.button": "Começar",

    // AI Agent Skills
    "home.skills.title": "Skills para Agentes de IA",
    "home.skills.desc": "Adicione estes arquivos de skill ao seu agente de IA (Claude, ChatGPT, Copilot, etc.) para habilitar capacidades completas de integração com ixblix.",
    "home.skills.api.title": "Skill REST API",
    "home.skills.api.desc": "Guia completo de integração usando chamadas HTTP/cURL diretas. Sem SDK necessário.",
    "home.skills.api.download": "Baixar Skill API",
    "home.skills.sdk.title": "Skill JavaScript SDK",
    "home.skills.sdk.desc": "Guia completo de integração usando o pacote oficial @ixblix/sdk-js TypeScript.",
    "home.skills.sdk.download": "Baixar Skill SDK",
    "home.skills.instructions.title": "Como Adicionar Skills ao Seu Agente de IA",
    "home.skills.instructions.claude.title": "Claude (Anthropic)",
    "home.skills.instructions.claude.step1": "Baixe o arquivo de skill acima",
    "home.skills.instructions.claude.step2": "Abra o Claude e vá para Projects",
    "home.skills.instructions.claude.step3": "Crie um novo projeto ou edite um existente",
    "home.skills.instructions.claude.step4": "Clique em \"Add Knowledge\" → \"Upload file\"",
    "home.skills.instructions.claude.step5": "Faça upload do arquivo .md baixado",
    "home.skills.instructions.claude.step6": "Claude agora tem conhecimento completo de integração ixblix",
    "home.skills.instructions.chatgpt.title": "ChatGPT (OpenAI)",
    "home.skills.instructions.chatgpt.step1": "Baixe o arquivo de skill acima",
    "home.skills.instructions.chatgpt.step2": "Abra o ChatGPT e vá para \"Create a GPT\"",
    "home.skills.instructions.chatgpt.step3": "Na aba \"Configure\", role até \"Knowledge\"",
    "home.skills.instructions.chatgpt.step4": "Clique em \"Upload\" e selecione o arquivo .md",
    "home.skills.instructions.chatgpt.step5": "Seu GPT personalizado agora conhece a integração ixblix",
    "home.skills.instructions.copilot.title": "GitHub Copilot",
    "home.skills.instructions.copilot.step1": "Baixe o arquivo de skill acima",
    "home.skills.instructions.copilot.step2": "Coloque na pasta <code>.github/instructions/</code> do seu projeto",
    "home.skills.instructions.copilot.step3": "Ou adicione ao seu <code>.github/copilot-instructions.md</code>",
    "home.skills.instructions.copilot.step4": "Copilot irá referenciá-lo ao responder perguntas sobre ixblix",
    "home.skills.instructions.cursor.title": "Cursor / Windsurf / Outras IDEs",
    "home.skills.instructions.cursor.step1": "Baixe o arquivo de skill acima",
    "home.skills.instructions.cursor.step2": "Coloque na raiz do seu projeto ou na pasta <code>.cursor/rules/</code>",
    "home.skills.instructions.cursor.step3": "Referencie no system prompt ou arquivo de regras do seu agente",
    "home.skills.instructions.cursor.step4": "O agente usará como contexto para tarefas de integração ixblix",

    // QuickStart
    "quickstart.title": "Início Rápido",
    "quickstart.lead":
      "Faça sua primeira conversa com criptografia ponta a ponta funcionar em menos de 10 minutos. Este guia mostra os passos essenciais.",
    "quickstart.overview.title": "Visão Geral",
    "quickstart.overview.text": "A plataforma ixblix conecta",
    "quickstart.overview.integrators": "integradores",
    "quickstart.overview.companies": "empresas",
    "quickstart.overview.flow": "com",
    "quickstart.overview.flowAfter": ". O fluxo é:",
    "quickstart.step.reg": "Registre-se como integrador",
    "quickstart.step.regDesc": "— obtenha suas credenciais de API",
    "quickstart.step.company": "Crie uma empresa",
    "quickstart.step.companyDesc": "— configure um negócio sob seu integrador",
    "quickstart.step.conversation": "Inicie uma conversa",
    "quickstart.step.conversationDesc":
      "— crie um chat e compartilhe o link com um cliente",
    "quickstart.step.messages": "Envie e receba mensagens",
    "quickstart.step.messagesDesc": "— criptografadas ponta a ponta",
    "quickstart.prereqs.title": "Pré-requisitos",
    "quickstart.prereq1":
      "Uma URL de callback onde o ixblix pode verificar seu registro de integrador (HTTPS obrigatório)",
    "quickstart.prereq2":
      "Uma URL de webhook onde o ixblix enviará eventos (HTTPS obrigatório)",
    "quickstart.prereq3": "Node.js 18+ (para o SDK) ou qualquer cliente HTTP",
    "quickstart.step1.title": "Passo 1 — Instale o SDK",
    "quickstart.step1.text": "Ou use a API REST diretamente. A URL base é",
    "quickstart.step2.title": "Passo 2 — Registre Seu Integrador",
    "quickstart.callout.callbackTitle": "Verificação de Callback",
    "quickstart.callout.callbackText": "O ixblix envia um POST para sua",
    "quickstart.callout.callbackWith": "com seu",
    "quickstart.callout.callbackAnd": "e",
    "quickstart.callout.callbackEnd": ". Seu endpoint deve retornar",
    "quickstart.callout.callbackConfirm": "para confirmar o recebimento.",
    "quickstart.step3.title": "Passo 3 — Crie uma Empresa",
    "quickstart.step3.plansText": "Primeiro, liste os planos disponíveis para escolher um:",
    "quickstart.step3.response": "Resposta",
    "quickstart.step3.registerText": "Agora registre a empresa com o plano selecionado:",
    "quickstart.step4.title": "Passo 4 — Ative e Configure",
    "quickstart.step4.text":
      "Após o pagamento, ative a empresa para receber sua chave de API:",
    "quickstart.step5.title": "Passo 5 — Inicie uma Conversa",
    "quickstart.step6.title": "Passo 6 — Envie uma Mensagem",
    "quickstart.step7.title": "Passo 7 — Receba Mensagens",
    "quickstart.step7.text":
      "Quando o cliente responder, o ixblix envia um webhook",
    "quickstart.step7.textAfter": "para seu endpoint:",
    "quickstart.callout.liveTitle": "Você está no ar!",
    "quickstart.callout.liveText":
      "Agora você tem uma conversa com criptografia ponta a ponta funcionando. Continue para os guias detalhados para saber mais sobre",
    "quickstart.callout.liveWebhooks": "webhooks",
    "quickstart.callout.liveRich": "mensagens ricas",
    "quickstart.callout.liveMedia": "anexos de mídia",
    "quickstart.callout.liveAnd": " e mais.",
    "quickstart.nextSteps.title": "Próximos Passos",
    "quickstart.nextSteps.integrator": "fluxo detalhado de registro",
    "quickstart.nextSteps.e2ee": "entenda o esquema de criptografia",
    "quickstart.nextSteps.webhooks": "todos os tipos de eventos e verificação",
    "quickstart.nextSteps.sdk": "referência completa do SDK",
    "quickstart.api.title": "API Direta (cURL)",
    "quickstart.api.text":
      "Prefere chamadas REST? Aqui estão os comandos cURL equivalentes para cada passo.",
    "quickstart.api.regTitle": "Registrar Integrador",
    "quickstart.api.companyTitle": "Criar Empresa",
    "quickstart.api.activateTitle": "Ativar Empresa",
    "quickstart.api.webhookTitle": "Definir URL do Webhook",
    "quickstart.api.conversationTitle": "Criar Conversa",
    "quickstart.api.sendMessageTitle": "Enviar Mensagem",

    // IntegratorRegistration
    "integrator.title": "Registro de Integrador",
    "integrator.lead":
      "Registre seu aplicativo (CRM, help desk, sistema de tickets) como integrador para acessar a API do ixblix.",
    "integrator.howItWorks.title": "Como Funciona",
    "integrator.howItWorks.text": "O registro de integrador usa um fluxo de",
    "integrator.howItWorks.bold": "verificação por callback",
    "integrator.howItWorks.textAfter":
      ". Você fornece uma URL e o ixblix envia suas credenciais para essa URL. Isso prova que você controla o endpoint antes de qualquer segredo ser trocado.",
    "integrator.step1": "Você chama",
    "integrator.step1After":
      "com o nome do seu aplicativo, URL de callback e email de contato.",
    "integrator.step2":
      "O ixblix cria sua conta de integrador e envia uma requisição POST para sua URL de callback com seu",
    "integrator.step2And": "e",
    "integrator.step2End": ".",
    "integrator.step3": "Seu endpoint de callback deve responder com",
    "integrator.step3After": "para confirmar o recebimento.",
    "integrator.step4":
      "Armazene as credenciais com segurança — você as usará para todas as chamadas de API subsequentes.",
    "integrator.regRequest.title": "Requisição de Registro",
    "integrator.requestBody.title": "Corpo da Requisição",
    "integrator.table.field": "Campo",
    "integrator.table.type": "Tipo",
    "integrator.table.required": "Obrigatório",
    "integrator.table.description": "Descrição",
    "integrator.table.nameDesc": "Nome de exibição do seu aplicativo",
    "integrator.table.callbackUrlDesc":
      "URL HTTPS onde o ixblix entregará suas credenciais",
    "integrator.table.contactEmailDesc": "Email de contato administrativo",
    "integrator.callbackPayload.title": "Payload do Callback",
    "integrator.callbackPayload.text": "O ixblix envia um",
    "integrator.callbackPayload.to": "para sua",
    "integrator.callbackPayload.with": "com este corpo JSON:",
    "integrator.callout.storeTitle": "Armazene as Credenciais com Segurança",
    "integrator.callout.storeText": "O",
    "integrator.callout.storeOnce":
      "é mostrado apenas uma vez durante a verificação do callback. Armazene-o em um cofre seguro ou banco de dados criptografado. Se perdido, entre em contato com o suporte para rotação.",
    "integrator.handling.title": "Tratando o Callback",
    "integrator.authAfter.title": "Autenticação Após o Registro",
    "integrator.authAfter.text":
      "Após o registro, autentique todas as requisições de API usando",
    "integrator.authAfter.bold": "HTTP Basic Auth",
    "integrator.authAfter.colon": ":",
    "integrator.authAfter.username": "O nome de usuário é seu",
    "integrator.authAfter.and": "e a senha é seu",
    "integrator.authAfter.end": ".",
    "integrator.sdk.title": "Usando o SDK",
    "integrator.profile.title": "Obter Seu Perfil",
    "integrator.profile.response": "Resposta:",
    "integrator.errors.title": "Respostas de Erro",
    "integrator.errors.table.status": "Status",
    "integrator.errors.table.meaning": "Significado",
    "integrator.errors.400":
      "Corpo da requisição inválido (campos ausentes, formato de URL incorreto)",
    "integrator.errors.409":
      "URL de callback já registrada para outro integrador",
    "integrator.errors.422": "URL de callback inacessível ou não retornou 200",
    "integrator.table.yes": "Sim",
    "integrator.table.no": "Não",

    // CompanyRegistration
    "company.title": "Registro de Empresa",
    "company.lead":
      "Crie e ative empresas sob sua conta de integrador. Cada empresa recebe sua própria chave de API, marca e espaço de conversas.",
    "company.overview.title": "Visão Geral",
    "company.overview.text":
      "Empresas são os negócios que usam seu integrador para falar com seus clientes. O ciclo de vida é:",
    "company.step.reg": "Registrar",
    "company.step.regDesc":
      "— crie o registro da empresa e gere uma transação de pagamento",
    "company.step.pay": "Pagar",
    "company.step.payDesc":
      "— o proprietário da empresa completa o pagamento via checkout hospedado",
    "company.step.activate": "Ativar",
    "company.step.activateDesc": "— receba a chave de API da empresa",
    "company.step.configure": "Configurar",
    "company.step.configureDesc":
      "— defina URL de webhook, chave de criptografia e marca",
    "company.step1.title": "Passo 1 — Listar Planos Disponíveis",
    "company.step1.text":
      "Antes de registrar uma empresa, busque os planos disponíveis para escolher um:",
    "company.step2.title": "Passo 2 — Registrar a Empresa",
    "company.requestBody.title": "Corpo da Requisição",
    "company.table.nameDesc": "Nome de exibição da empresa",
    "company.table.planIdDesc": "ID do plano para assinar",
    "company.table.handleDesc": "Slug único para perfil público (ex.:",
    "company.table.websiteDesc": "URL do site da empresa",
    "company.table.field": "Campo",
    "company.table.type": "Tipo",
    "company.table.required": "Obrigatório",
    "company.table.description": "Descrição",
    "company.table.yes": "Sim",
    "company.table.no": "Não",
    "company.response.title": "Resposta",
    "company.callout.checkoutTitle": "URL do Checkout",
    "company.callout.checkoutText":
      "Redirecione o proprietário da empresa para",
    "company.callout.checkoutEnd":
      "para completar o pagamento. A página de checkout suporta cartão de crédito e Pix Automático.",
    "company.step3.title": "Passo 3 — Ativar a Empresa",
    "company.step3.text":
      "Após a confirmação do pagamento, ative a empresa para receber sua chave de API:",
    "company.callout.apiKeyTitle": "Chave de API — Exibição Única",
    "company.callout.apiKeyText": "A",
    "company.callout.apiKeyOnce":
      "é retornada apenas na ativação. Armazene-a com segurança. A empresa também pode recuperá-la depois via",
    "company.callout.apiKeyEnd": "(usando a própria chave de API).",
    "company.step4.title": "Passo 4 — Configurar a Empresa",
    "company.step4.text":
      "Após a ativação, use a chave de API da empresa para configurar webhooks, criptografia e marca.",
    "company.webhook.title": "Definir URL do Webhook",
    "company.webhook.response": "A resposta inclui o",
    "company.webhook.for": "para verificar assinaturas de webhook:",
    "company.encKey.title": "Registrar Chave de Criptografia",
    "company.encKey.text":
      "Registre a chave pública RSA do seu operador para criptografia ponta a ponta:",
    "company.list.title": "Listar Suas Empresas",
    "company.sdk.title": "Usando o SDK",

    // Messaging
    "messaging.title": "Enviar e Receber Mensagens",
    "messaging.lead":
      "Crie conversas, troque mensagens criptografadas ponta a ponta e gerencie o ciclo de vida completo da conversa.",
    "messaging.lifecycle.title": "Ciclo de Vida da Conversa",
    "messaging.lifecycle.create": "Criar conversa",
    "messaging.lifecycle.createDesc":
      "— seu sistema cria uma conversa e obtém um deeplink",
    "messaging.lifecycle.share": "Compartilhar deeplink",
    "messaging.lifecycle.shareDesc":
      "— envie o link ao cliente via WhatsApp, SMS, email, etc.",
    "messaging.lifecycle.join": "Cliente entra",
    "messaging.lifecycle.joinDesc":
      "— o cliente abre o link e registra sua chave de criptografia",
    "messaging.lifecycle.exchange": "Trocar mensagens",
    "messaging.lifecycle.exchangeDesc":
      "— ambos os lados criptografam/descriptografam com RSA + AES-256-GCM",
    "messaging.lifecycle.close": "Fechar conversa",
    "messaging.lifecycle.closeDesc": "— qualquer lado encerra o chat",
    "messaging.create.title": "Criar uma Conversa",
    "messaging.requestBody.title": "Corpo da Requisição",
    "messaging.table.field": "Campo",
    "messaging.table.type": "Tipo",
    "messaging.table.required": "Obrigatório",
    "messaging.table.description": "Descrição",
    "messaging.table.yes": "Sim",
    "messaging.table.no": "Não",
    "messaging.table.contactNameDesc": "Nome de exibição do cliente",
    "messaging.table.contactExternalIdDesc": "Seu ID interno para este contato",
    "messaging.table.originChannelDesc": "Canal de origem:",
    "messaging.table.metadataDesc":
      "Dados arbitrários chave-valor armazenados com a conversa",
    "messaging.response.title": "Resposta",
    "messaging.callout.deeplinkTitle": "Deeplink",
    "messaging.callout.deeplinkText": "Envie o",
    "messaging.callout.deeplinkEnd":
      "ao seu cliente. Quando ele abrir, verá uma interface de chat white-label com a marca da empresa.",
    "messaging.joins.title": "Cliente Entra",
    "messaging.joins.text":
      "Quando o cliente abre o deeplink e o app web carrega, ele gera um par de chaves RSA e registra a chave pública. Você recebe um webhook",
    "messaging.joins.webhook": ":",
    "messaging.callout.storeKeyTitle": "Armazene a Chave Pública do Cliente",
    "messaging.callout.storeKeyText":
      "Você precisa desta chave para criptografar todas as mensagens enviadas a este cliente. Armazene-a associada à conversa.",
    "messaging.send.title": "Enviar uma Mensagem (Empresa → Cliente)",
    "messaging.send.text":
      "Todas as mensagens são criptografadas no cliente. Use a chave pública do cliente (do webhook",
    "messaging.send.webhook": ") para criptografar:",
    "messaging.send.table.conversationIdDesc":
      "Conversa para enviar a mensagem",
    "messaging.send.table.encryptedContentDesc":
      "Mensagem criptografada com AES-256-GCM (base64)",
    "messaging.send.table.encryptedKeyDesc":
      "Chave AES envolvida com RSA-OAEP (base64)",
    "messaging.send.table.attachmentsDesc":
      "Anexos de mensagens ricas opcionais (também criptografados) — veja",
    "messaging.receive.title": "Receber uma Mensagem (Cliente → Empresa)",
    "messaging.receive.text":
      "Quando o cliente envia uma mensagem, você recebe um webhook",
    "messaging.receive.webhook": ":",
    "messaging.decrypt.title": "Descriptografar a Mensagem",
    "messaging.list.title": "Listar Mensagens",
    "messaging.list.text":
      "Retorna mensagens em ordem cronológica reversa. As mensagens são retornadas em sua forma criptografada — descriptografe-as no cliente.",
    "messaging.read.title": "Marcar Mensagens como Lidas",
    "messaging.read.operator": "Leitura do operador (lado da empresa)",
    "messaging.read.operatorText": "Isso envia um evento Socket.io",
    "messaging.read.operatorEnd": "ao cliente.",
    "messaging.read.customer": "Leitura do cliente (dispara webhook)",
    "messaging.read.customerText":
      "Quando o cliente lê suas mensagens, você recebe um webhook",
    "messaging.read.customerEnd": ":",
    "messaging.close.title": "Fechar uma Conversa",
    "messaging.close.text": "Isso dispara um webhook",
    "messaging.close.webhook":
      "para seu endpoint. A interface de chat do cliente mostrará a conversa como fechada.",
    "messaging.erase.title": "Apagar uma Conversa (LGPD)",
    "messaging.erase.text":
      "Para cumprir regulamentações de proteção de dados, você pode apagar permanentemente todos os dados da conversa:",
    "messaging.callout.irreversibleTitle": "Ação Irreversível",
    "messaging.callout.irreversibleText":
      "Apagar uma conversa exclui permanentemente todas as mensagens, mídias e dados de contato. Isso não pode ser desfeito.",

    // Webhooks
    "webhooks.title": "Webhooks",
    "webhooks.lead":
      "Receba eventos em tempo real do ixblix via webhooks HTTP assinados. Cada ação de conversa, mensagem e alteração de presença é entregue ao seu endpoint.",
    "webhooks.setup.title": "Configurando Webhooks",
    "webhooks.setup.text":
      "Configure sua URL de webhook por empresa usando a chave de API da empresa:",
    "webhooks.setup.response": "Resposta:",
    "webhooks.callout.storeTitle": "Armazene o Segredo",
    "webhooks.callout.storeText": "O",
    "webhooks.callout.storeEnd":
      "é retornado apenas quando a URL é definida ou rotacionada. Use-o para verificar assinaturas de webhook.",
    "webhooks.verify.title": "Verificando Assinaturas",
    "webhooks.verify.text": "Cada requisição de webhook inclui um cabeçalho",
    "webhooks.verify.header":
      "contendo uma assinatura HMAC-SHA256 do corpo da requisição. Sempre verifique esta assinatura antes de processar o evento.",
    "webhooks.verify.sdkTitle": "Usando o SDK",
    "webhooks.verify.manualTitle": "Verificação Manual",
    "webhooks.events.title": "Tipos de Eventos",
    "webhooks.events.table.event": "Evento",
    "webhooks.events.table.when": "Quando",
    "webhooks.events.table.payload": "Campos Principais do Payload",
    "webhooks.events.messageReceived": "Cliente envia uma mensagem",
    "webhooks.events.messageRead": "Cliente lê mensagens da empresa",
    "webhooks.events.customerJoined": "Cliente abre o chat e registra a chave",
    "webhooks.events.conversationClosed": "Conversa é fechada",
    "webhooks.events.typing": "Cliente começa a digitar",
    "webhooks.events.stoppedTyping": "Cliente para de digitar",
    "webhooks.events.recording": "Cliente começa a gravar áudio",
    "webhooks.events.chatClosed": "Cliente fecha a janela do chat",
    "webhooks.events.balanceLow": "Saldo de créditos da empresa está baixo",
    "webhooks.payload.title": "Estrutura do Payload do Evento",
    "webhooks.payload.text":
      "Todos os eventos de webhook seguem esta estrutura:",
    "webhooks.headers.title": "Cabeçalhos da Requisição",
    "webhooks.headers.table.header": "Cabeçalho",
    "webhooks.headers.table.description": "Descrição",
    "webhooks.headers.signatureDesc":
      "Assinatura HMAC-SHA256 do corpo da requisição",
    "webhooks.headers.eventIdDesc":
      "ID único do evento para deduplicação (chave de idempotência)",
    "webhooks.delivery.title": "Garantias de Entrega",
    "webhooks.delivery.atLeastOnce": "Entrega pelo menos uma vez",
    "webhooks.delivery.atLeastOnceDesc":
      "— eventos são persistidos em um outbox antes da entrega e repetidos em caso de falha.",
    "webhooks.delivery.backoff": "Backoff exponencial",
    "webhooks.delivery.backoffDesc":
      "— entregas com falha são repetidas até 8 vezes com intervalos crescentes.",
    "webhooks.delivery.idempotency": "Idempotência",
    "webhooks.delivery.idempotencyDesc": "— use o cabeçalho",
    "webhooks.delivery.idempotencyEnd":
      "para deduplicar eventos. Seu handler deve ser idempotente.",
    "webhooks.delivery.timeout": "Timeout",
    "webhooks.delivery.timeoutDesc":
      "— seu endpoint deve responder em até 30 segundos. Processe eventos assincronamente se necessário.",
    "webhooks.callout.respondTitle": "Responda Rapidamente",
    "webhooks.callout.respondText": "Sempre responda com",
    "webhooks.callout.respondEnd":
      "o mais rápido possível. Se seu processamento demorar mais, enfileire o evento e processe-o em um worker em background.",
    "webhooks.rotate.title": "Rotacionando o Segredo do Webhook",
    "webhooks.rotate.text":
      "Para rotacionar seu segredo de webhook, chame o mesmo endpoint com uma nova URL (ou a mesma URL):",
    "webhooks.rotate.end": "Um novo",
    "webhooks.rotate.returned":
      "é retornado. O segredo antigo é invalidado imediatamente.",

    // E2EEncryption
    "e2ee.title": "Criptografia Ponta a Ponta",
    "e2ee.lead":
      "Todas as mensagens no ixblix são criptografadas no cliente usando um esquema híbrido RSA + AES-256-GCM. O servidor nunca vê conteúdo em texto plano.",
    "e2ee.scheme.title": "Esquema de Criptografia",
    "e2ee.scheme.text": "O ixblix usa uma abordagem de criptografia híbrida:",
    "e2ee.scheme.rsa": "para troca de chaves",
    "e2ee.scheme.aes": "para criptografia do conteúdo da mensagem",
    "e2ee.scheme.fresh":
      "Cada mensagem recebe uma chave AES aleatória e fresca. A chave AES é então criptografada (envolvida) com a chave pública RSA do destinatário.",
    "e2ee.how.title": "Como Funciona",
    "e2ee.how.operator": "Operador gera par de chaves RSA",
    "e2ee.how.operatorDesc":
      "na primeira configuração e registra a chave pública no ixblix.",
    "e2ee.how.customer": "Cliente gera par de chaves RSA",
    "e2ee.how.customerDesc":
      "quando abre o chat pela primeira vez e registra sua chave pública.",
    "e2ee.how.send": "Para enviar uma mensagem",
    "e2ee.how.sendDesc": ", o remetente:",
    "e2ee.how.genAes": "Gera uma chave AES-256 aleatória",
    "e2ee.how.encryptMsg": "Criptografa o conteúdo da mensagem com AES-256-GCM",
    "e2ee.how.wrapRecipient":
      "Envolve a chave AES com a chave pública RSA do destinatário",
    "e2ee.how.wrapSelf":
      "Também envolve a chave AES com sua própria chave pública (para auto-leitura)",
    "e2ee.how.sendApi":
      "Envia o conteúdo criptografado + chaves envolvidas para a API",
    "e2ee.how.read": "Para ler uma mensagem",
    "e2ee.how.readDesc": ", o destinatário:",
    "e2ee.how.unwrap": "Desenvolve a chave AES usando sua chave privada RSA",
    "e2ee.how.decrypt": "Descriptografa o conteúdo com AES-256-GCM",
    "e2ee.gen.title": "Gerando um Par de Chaves do Operador",
    "e2ee.gen.nodeTitle": "Usando Node.js Crypto Diretamente",
    "e2ee.register.title": "Registrando Sua Chave Pública",
    "e2ee.encrypt.title": "Criptografando uma Mensagem",
    "e2ee.decrypt.title": "Descriptografando uma Mensagem",
    "e2ee.media.title": "Criptografando Mídia",
    "e2ee.media.text":
      "Arquivos de mídia (imagens, áudio, documentos) usam o mesmo esquema híbrido. O SDK fornece auxiliares dedicados:",
    "e2ee.keyMgmt.title": "Gerenciamento de Chaves",
    "e2ee.keyMgmt.storeTitle": "Armazenando Chaves com Segurança",
    "e2ee.keyMgmt.storeText":
      "Sua chave privada do operador deve ser armazenada com segurança. Opções:",
    "e2ee.keyMgmt.env": "Variável de ambiente",
    "e2ee.keyMgmt.envDesc": "— para implantações simples",
    "e2ee.keyMgmt.db": "Campo criptografado no banco de dados",
    "e2ee.keyMgmt.dbDesc": "— criptografe o PEM com uma chave mestra",
    "e2ee.keyMgmt.vault": "Cofre / KMS",
    "e2ee.keyMgmt.vaultDesc": "— AWS KMS, HashiCorp Vault, etc.",
    "e2ee.callout.neverTitle": "Nunca Exponha Chaves Privadas",
    "e2ee.callout.neverText":
      "A chave privada do operador descriptografa todas as mensagens da empresa. Se comprometida, todas as mensagens passadas e futuras podem ser lidas. Nunca a registre em logs, incorpore em código client-side ou envie por canais não criptografados.",
    "e2ee.keyMgmt.retrieveTitle": "Recuperando Sua Chave Registrada",
    "e2ee.keyMgmt.convKeysTitle": "Obtendo Chaves da Conversa",
    "e2ee.keyMgmt.convKeysText":
      "Para recuperar as chaves públicas do operador e do cliente de uma conversa:",
    "e2ee.security.title": "Propriedades de Segurança",
    "e2ee.security.forward": "Sigilo encaminhamento por mensagem",
    "e2ee.security.forwardDesc":
      "— cada mensagem usa uma chave AES fresca, então comprometer uma chave não afeta outras.",
    "e2ee.security.server": "Servidor não pode ler mensagens",
    "e2ee.security.serverDesc":
      "— o backend armazena apenas ciphertext e chaves envolvidas.",
    "e2ee.security.auth": "Autenticação via GCM",
    "e2ee.security.authDesc":
      "— AES-GCM fornece confidencialidade e integridade.",
    "e2ee.security.selfRead": "Capacidade de auto-leitura",
    "e2ee.security.selfReadDesc":
      "— o remetente envolve a chave AES para sua própria chave, permitindo ler mensagens enviadas.",

    // RichMessages
    "rich.title": "Mensagens Ricas",
    "rich.lead":
      "Aprimore conversas com botões interativos: respostas rápidas, URLs, copiar para clipboard, códigos Pix, cartões de contato e localizações.",
    "rich.overview.title": "Visão Geral",
    "rich.overview.text": "Mensagens ricas são enviadas como",
    "rich.overview.attachments": "anexos",
    "rich.overview.alongside":
      "junto com o conteúdo criptografado da sua mensagem. Anexos são criptografados com a mesma chave AES do corpo da mensagem.",
    "rich.overview.operator": "Apenas o",
    "rich.overview.operatorBold": "operador (empresa)",
    "rich.overview.operatorEnd":
      "pode enviar mensagens ricas. Clientes só podem responder tocando em botões (que envia o rótulo como mensagem de texto).",
    "rich.types.title": "Tipos de Anexo",
    "rich.types.quickReply.title": "Resposta Rápida",
    "rich.types.quickReply.text": "Mostra um botão que envia o",
    "rich.types.quickReply.end": "como resposta de texto quando tocado.",
    "rich.types.url.title": "Botão URL",
    "rich.types.url.text": "Abre uma URL no navegador do cliente.",
    "rich.types.copy.title": "Copiar para Clipboard",
    "rich.types.copy.text":
      "Copia um valor para o clipboard do cliente quando tocado.",
    "rich.types.pix.title": "Código Pix",
    "rich.types.pix.text":
      "Igual ao copiar, mas com um ícone Pix para indicar que é um código de pagamento.",
    "rich.types.vcard.title": "vCard (Cartão de Contato)",
    "rich.types.vcard.text":
      "Exibe um cartão de contato com nome, telefone e organização.",
    "rich.types.location.title": "Localização",
    "rich.types.location.text":
      "Mostra um link de mapa com as coordenadas fornecidas.",
    "rich.sending.title": "Enviando Mensagens Ricas",
    "rich.sending.text":
      "Inclua anexos na sua requisição de mensagem. Eles são criptografados junto com o conteúdo da mensagem:",
    "rich.rendering.title": "Regras de Exibição",
    "rich.rendering.inline": "≤ 3 botões",
    "rich.rendering.inlineDesc": "— exibidos inline abaixo da mensagem",
    "rich.rendering.modal": "&gt; 3 botões",
    "rich.rendering.modalDesc": "— exibidos em um modal/overlay",
    "rich.rendering.order": "Botões são exibidos na ordem em que são enviados",
    "rich.rendering.reply": "Apenas botões",
    "rich.rendering.replyEnd": "disparam uma mensagem de volta ao operador",
    "rich.rendering.url": "botões abrem no navegador do sistema",
    "rich.rendering.copy": "e",
    "rich.rendering.copyEnd":
      "botões copiam para o clipboard e mostram um toast de confirmação",
    "rich.mixing.title": "Misturando Tipos de Anexo",
    "rich.mixing.text":
      "Você pode misturar diferentes tipos em uma única mensagem:",
    "rich.api.title": "API Direta (cURL)",
    "rich.api.text":
      "O comando cURL equivalente para enviar mensagens ricas. Anexos são enviados como um array JSON junto com o conteúdo criptografado:",

    // Media
    "media.title": "Anexos de Mídia",
    "media.lead":
      "Envie e receba imagens, áudio, vídeo e documentos — tudo criptografado ponta a ponta.",
    "media.how.title": "Como Funciona a Criptografia de Mídia",
    "media.how.text":
      "Arquivos de mídia seguem o mesmo esquema de criptografia híbrida das mensagens:",
    "media.how.step1": "Uma chave AES-256 fresca é gerada para o arquivo",
    "media.how.step2": "O arquivo é criptografado com AES-256-GCM",
    "media.how.step3":
      "A chave AES é envolvida com a chave pública RSA do destinatário",
    "media.how.step4":
      "O arquivo criptografado é enviado ao armazenamento de objetos do ixblix",
    "media.how.step5":
      "O ID da mídia e a chave envolvida são enviados como parte da mensagem",
    "media.upload.title": "Enviar Mídia (Empresa → Cliente)",
    "media.uploadCustomer.title": "Enviar Mídia (Cliente → Empresa)",
    "media.uploadCustomer.text":
      "Clientes enviam mídia pela interface do chat. Você recebe um webhook",
    "media.uploadCustomer.webhook": "com o",
    "media.uploadCustomer.end": ":",
    "media.download.title": "Baixar Mídia",
    "media.download.company": "Empresa baixando mídia do cliente",
    "media.download.decryptTitle": "Descriptografar o Arquivo Baixado",
    "media.types.title": "Tipos de Mídia",
    "media.types.table.type": "Tipo",
    "media.types.table.formats": "Formatos Suportados",
    "media.types.table.maxSize": "Tamanho Máximo",
    "media.metadata.title": "Metadados da Mídia",
    "media.api.uploadTitle": "Enviar via cURL",
    "media.api.uploadText":
      "Envie mídia criptografada diretamente com cURL. O arquivo já deve estar criptografado com AES-256-GCM:",

    // Presence
    "presence.title": "Indicadores de Presença e Digitação",
    "presence.lead":
      "Mostre indicadores em tempo real de digitação, gravação e status do chat entre operadores e clientes.",
    "presence.types.title": "Tipos de Presença",
    "presence.types.table.type": "Tipo",
    "presence.types.table.direction": "Direção",
    "presence.types.table.description": "Descrição",
    "presence.types.both": "Ambos",
    "presence.types.customerOperator": "Cliente → Operador",
    "presence.types.typingDesc": "Usuário está digitando uma mensagem de texto",
    "presence.types.recordingDesc":
      "Cliente está gravando uma mensagem de áudio",
    "presence.types.chatClosedDesc": "Cliente fechou a janela/aba do chat",
    "presence.operator.title": "Presença do Operador (Empresa → Cliente)",
    "presence.operator.text":
      "Envie presença do operador via API. Isso é entregue ao cliente em tempo real via Socket.io.",
    "presence.operator.ui":
      'A interface de chat do cliente mostra "Agente está digitando..." quando recebe este evento.',
    "presence.operator.identityTitle": "Definir Identidade do Operador",
    "presence.operator.identityText":
      "Opcionalmente associe um nome/avatar do operador à conversa:",
    "presence.customer.title": "Presença do Cliente (Cliente → Operador)",
    "presence.customer.text":
      "Quando o cliente digita ou grava áudio, você recebe webhooks:",
    "presence.customer.typingTitle": "Webhook de Digitação",
    "presence.customer.recordingTitle": "Webhook de Gravação",
    "presence.customer.chatClosedTitle": "Webhook de Chat Fechado",
    "presence.relay.title": "Presença do Cliente (Operador → API)",
    "presence.relay.text":
      "Se você está retransmitindo presença do canal original (ex.: WhatsApp), use a rota unificada de presença com o token do deeplink:",
    "presence.relay.end": "Quando chamado",
    "presence.relay.without": "sem",
    "presence.relay.an": "um",
    "presence.relay.and":
      "e com um token de deeplink como ref, isso emite um webhook",
    "presence.relay.webhook": "ao operador.",
    "presence.best.title": "Boas Práticas",
    "presence.best.typing": "Envie",
    "presence.best.typingEnd":
      "quando o operador começar a compor e pare quando enviar a mensagem ou pausar por mais de 5 segundos.",
    "presence.best.throttle":
      "Limite atualizações de presença para evitar sobrecarga — a interface do cliente oculta automaticamente o indicador após alguns segundos de inatividade.",
    "presence.best.recording": "Use",
    "presence.best.recordingEnd":
      "apenas quando o cliente estiver ativamente gravando áudio (não apenas segurando o botão).",

    // KeyTransfer
    "keytransfer.title": "Transferência de Chave",
    "keytransfer.lead":
      "Permita que clientes transfiram seu par de chaves de criptografia entre dispositivos (ex.: do PWA para um app mobile nativo) com segurança.",
    "keytransfer.when.title": "Quando Usar",
    "keytransfer.when.text":
      "Um cliente começa a conversar no web (PWA) e depois quer continuar no app do telefone. Como cada dispositivo gera seu próprio par de chaves RSA, a chave deve ser transferida para manter a continuidade da conversa.",
    "keytransfer.how.title": "Como Funciona",
    "keytransfer.how.step1": "Dispositivo de origem",
    "keytransfer.how.step1Desc":
      "criptografa o par de chaves com uma chave derivada do PIN (PBKDF2-SHA256, 200k iterações) e envia o ciphertext.",
    "keytransfer.how.step2": "Dispositivo de origem",
    "keytransfer.how.step2Desc":
      "exibe o PIN e um link de transferência ou QR code.",
    "keytransfer.how.step3": "Dispositivo de destino",
    "keytransfer.how.step3Desc":
      "abre o link, busca o payload criptografado e solicita o PIN ao usuário.",
    "keytransfer.how.step4": "Dispositivo de destino",
    "keytransfer.how.step4Desc":
      "deriva a mesma chave do PIN, descriptografa o par de chaves e o armazena com segurança.",
    "keytransfer.how.step5": "Dispositivo de destino",
    "keytransfer.how.step5Desc":
      "confirma a transferência e o dispositivo de origem pode opcionalmente excluir sua chave local.",
    "keytransfer.security.title": "Propriedades de Segurança",
    "keytransfer.security.ttl": "TTL de 5 minutos",
    "keytransfer.security.ttlDesc": "— transferências expiram após 5 minutos",
    "keytransfer.security.attempts": "Máximo de 5 tentativas",
    "keytransfer.security.attemptsDesc":
      "— tentativas de PIN incorreto são limitadas",
    "keytransfer.security.kek": "KEK derivado do PIN",
    "keytransfer.security.kekDesc": "— PBKDF2-SHA256 com 200k iterações",
    "keytransfer.security.spki": "Validação SPKI",
    "keytransfer.security.spkiDesc":
      "— a chave descriptografada é validada antes do armazenamento",
    "keytransfer.security.onetime": "Uso único",
    "keytransfer.security.onetimeDesc":
      "— uma vez confirmada, a transferência é consumida",
    "keytransfer.create.title":
      "Criar uma Transferência (Dispositivo de Origem)",
    "keytransfer.retrieve.title":
      "Recuperar uma Transferência (Dispositivo de Destino)",
    "keytransfer.poll.title": "Consultar Status da Transferência",
    "keytransfer.poll.text":
      "O dispositivo de origem pode consultar para saber quando a transferência está completa:",
    "keytransfer.delete.title": "Excluir uma Transferência",
    "keytransfer.delete.text":
      "Cancele uma transferência antes de ser consumida:",
    "keytransfer.callout.autoTitle": "Limpeza Automática",
    "keytransfer.callout.autoText":
      "Transferências são automaticamente excluídas após 5 minutos ou após 5 tentativas de PIN incorretas. Você não precisa limpar manualmente.",
    "keytransfer.api.createTitle": "Criar Transferência via cURL",
    "keytransfer.api.createText":
      "O comando cURL equivalente para criar uma transferência de chave. O payload criptografado deve ser gerado no cliente usando criptografia derivada do PIN:",
    "keytransfer.api.retrieveTitle": "Recuperar Transferência via cURL",
    "keytransfer.api.retrieveText":
      "Busque o payload criptografado da transferência:",

    // AuthReference
    "auth.title": "Referência de Autenticação",
    "auth.lead":
      "O ixblix usa três métodos de autenticação dependendo de quem está fazendo a requisição.",
    "auth.methods.title": "Métodos de Autenticação",
    "auth.methods.table.method": "Método",
    "auth.methods.table.who": "Quem",
    "auth.methods.table.header": "Cabeçalho",
    "auth.methods.table.format": "Formato",
    "auth.methods.basic": "HTTP Basic Auth",
    "auth.methods.integrators": "Integradores",
    "auth.methods.apiKey": "Chave de API",
    "auth.methods.companies": "Empresas",
    "auth.methods.none": "Nenhum",
    "auth.methods.customers": "Clientes / Público",
    "auth.methods.publicDesc": "Endpoints públicos usam tokens de conversa",
    "auth.integrator.title": "Autenticação de Integrador (Basic Auth)",
    "auth.integrator.text":
      "Usado para operações no escopo do integrador: registrar empresas, listar empresas, ver perfil do integrador.",
    "auth.integrator.username": "O nome de usuário é seu",
    "auth.integrator.and": "e a senha é seu",
    "auth.integrator.end": ".",
    "auth.integrator.endpointsTitle": "Endpoints que Exigem Basic Auth",
    "auth.company.title": "Autenticação de Empresa (Chave de API)",
    "auth.company.text":
      "Usado para todas as operações no escopo da empresa: conversas, mensagens, webhooks, chaves de criptografia, etc.",
    "auth.company.formatTitle": "Formato da Chave de API",
    "auth.company.prefix": "Prefixo:",
    "auth.company.length": "Comprimento: 32 caracteres após o prefixo",
    "auth.company.generated": "Gerada na ativação da empresa",
    "auth.company.once": "Retornada apenas uma vez — armazene com segurança",
    "auth.public.title": "Endpoints Públicos (Sem Auth)",
    "auth.public.text":
      "Estes endpoints usam tokens de conversa ou IDs de transferência para controle de acesso em vez de cabeçalhos de autenticação:",
    "auth.public.table.endpoint": "Endpoint",
    "auth.public.table.access": "Controle de Acesso",
    "auth.public.convToken": "Token de deeplink da conversa",
    "auth.public.convId": "ID da conversa no corpo",
    "auth.public.handle": "Handle público da empresa",
    "auth.public.public": "Público",
    "auth.admin.title": "Autenticação Admin (JWT)",
    "auth.admin.text":
      "O console admin usa tokens bearer JWT. Estes não estão disponíveis para integradores ou empresas — endpoints admin são apenas para operadores da plataforma.",
    "auth.best.title": "Boas Práticas de Segurança",
    "auth.best.never":
      "Nunca exponha chaves de API ou tokens de acesso em código client-side",
    "auth.best.rotate": "Rotacione segredos de webhook periodicamente",
    "auth.best.store":
      "Armazene credenciais em cofres criptografados ou variáveis de ambiente",
    "auth.best.https":
      "Use HTTPS para todas as chamadas de API e endpoints de webhook",
    "auth.best.verify":
      "Verifique assinaturas de webhook antes de processar eventos",

    // ErrorHandling
    "errors.title": "Tratamento de Erros",
    "errors.lead":
      "Entenda as respostas de erro do ixblix, códigos de status e como tratá-los graciosamente.",
    "errors.format.title": "Formato da Resposta de Erro",
    "errors.format.text":
      "Todos os erros da API retornam uma estrutura JSON consistente:",
    "errors.status.title": "Códigos de Status HTTP",
    "errors.status.table.code": "Código",
    "errors.status.table.meaning": "Significado",
    "errors.status.table.cause": "Causa Comum",
    "errors.status.400": "Requisição Inválida",
    "errors.status.400cause":
      "Corpo da requisição inválido, campos obrigatórios ausentes",
    "errors.status.401": "Não Autorizado",
    "errors.status.401cause": "Autenticação ausente ou inválida",
    "errors.status.403": "Proibido",
    "errors.status.403cause": "Auth válida mas permissões insuficientes",
    "errors.status.404": "Não Encontrado",
    "errors.status.404cause": "Recurso não existe ou foi excluído",
    "errors.status.409": "Conflito",
    "errors.status.409cause": "Recurso duplicado (ex.: handle já em uso)",
    "errors.status.422": "Entidade Não Processável",
    "errors.status.422cause":
      "JSON válido mas semanticamente inválido (ex.: URL incorreta)",
    "errors.status.429": "Muitas Requisições",
    "errors.status.429cause": "Limite de taxa excedido",
    "errors.status.500": "Erro Interno do Servidor",
    "errors.status.500cause": "Erro inesperado do servidor — tente com backoff",
    "errors.codes.title": "Códigos de Erro",
    "errors.codes.table.code": "Código",
    "errors.codes.table.description": "Descrição",
    "errors.codes.validation": "Corpo da requisição falhou na validação",
    "errors.codes.authRequired": "Nenhuma autenticação fornecida",
    "errors.codes.invalidCreds":
      "Chave de API ou credenciais Basic Auth incorretas",
    "errors.codes.notActive": "Empresa não completou pagamento/ativação",
    "errors.codes.notFound": "Conversa não existe ou expirou",
    "errors.codes.closed":
      "Não é possível enviar mensagens em uma conversa fechada",
    "errors.codes.encryption": "Cliente ainda não registrou sua chave pública",
    "errors.codes.balance": "Empresa não tem créditos restantes",
    "errors.codes.webhook": "URL do webhook não respondeu com 200",
    "errors.codes.rateLimit": "Muitas requisições em um curto período",
    "errors.codes.internal": "Erro inesperado do servidor",
    "errors.sdk.title": "Tratando Erros no SDK",
    "errors.retry.title": "Estratégia de Retry",
    "errors.retry.text": "Para erros",
    "errors.retry.end": ", implemente backoff exponencial:",
    "errors.webhook.title": "Tratamento de Erros de Webhook",
    "errors.webhook.text":
      "Se seu endpoint de webhook retornar um status diferente de 200 ou expirar (30s), o ixblix repete a entrega:",
    "errors.webhook.retries": "Até 8 tentativas de retry",
    "errors.webhook.backoff": "Backoff exponencial entre tentativas",
    "errors.webhook.dedup": "Use o cabeçalho",
    "errors.webhook.dedupEnd": "para deduplicação",
    "errors.callout.respondTitle": "Sempre Responda 200",
    "errors.callout.respondText":
      "Mesmo que não possa processar o evento imediatamente, responda com",
    "errors.callout.respondEnd":
      "e enfileire o evento para processamento assíncrono. Isso previne retries desnecessários.",

    // SdkReference
    "sdk.title": "SDK JavaScript",
    "sdk.lead": "Pacote oficial",
    "sdk.leadEnd":
      "— cliente HTTP tipado, auxiliares de criptografia, persistência de par de chaves e verificação de webhooks.",
    "sdk.install.title": "Instalação",
    "sdk.client.title": "IxblixClient",
    "sdk.client.text":
      "O cliente HTTP principal. Suporta os três modos de autenticação.",
    "sdk.client.optionsTitle": "Opções do Construtor",
    "sdk.client.integratorTitle": "Métodos do Integrador",
    "sdk.client.companyTitle": "Métodos de Gerenciamento de Empresas",
    "sdk.client.conversationTitle": "Métodos de Conversa",
    "sdk.client.messageTitle": "Métodos de Mensagem",
    "sdk.client.configTitle": "Métodos de Configuração da Empresa",
    "sdk.crypto.title": "Auxiliares de Criptografia",
    "sdk.keypair.title": "Persistência de Par de Chaves",
    "sdk.webhook.title": "Auxiliares de Webhook",
    "sdk.error.title": "Classe de Erro",

    // SampleIntegrator
    "sample.title": "Integrador de Exemplo",
    "sample.lead":
      "Uma implementação de referência completa de uma integração de help desk com o ixblix. Este exemplo mostra como conectar tudo.",
    "sample.arch.title": "Arquitetura",
    "sample.arch.text":
      "O integrador de exemplo é uma aplicação Node.js/Express que:",
    "sample.arch.reg": "Registra-se como integrador e trata o callback",
    "sample.arch.company": "Cria empresas e gerencia seu ciclo de vida",
    "sample.arch.webhooks":
      "Recebe webhooks para mensagens e eventos recebidos",
    "sample.arch.encrypt":
      "Criptografa mensagens enviadas e descriptografa as recebidas",
    "sample.arch.persist":
      "Persiste o par de chaves do operador e as chaves públicas dos clientes",
    "sample.setup.title": "Configuração do Projeto",
    "sample.complete.title": "Exemplo Completo",
    "sample.running.title": "Executando o Exemplo",
    "sample.ngrok.title": "Testando com ngrok",
    "sample.ngrok.text":
      "Para testar webhooks localmente, use ngrok para expor seu servidor:",
    "sample.takeaways.title": "Pontos Principais",
    "sample.takeaways.store": "Armazene credenciais com segurança",
    "sample.takeaways.storeDesc":
      "— tokens de integrador, chaves de API e segredos de webhook devem estar em um banco de dados ou cofre, não em memória.",
    "sample.takeaways.verify": "Sempre verifique webhooks",
    "sample.takeaways.verifyDesc": "— use",
    "sample.takeaways.verifyEnd": "antes de processar qualquer evento.",
    "sample.takeaways.handle": "Trate CUSTOMER_JOINED",
    "sample.takeaways.handleDesc":
      "— é quando você recebe a chave pública do cliente e pode começar a enviar mensagens criptografadas.",
    "sample.takeaways.respond": "Responda 200 rapidamente",
    "sample.takeaways.respondDesc":
      "— processe eventos de webhook assincronamente se demorarem.",
    "sample.takeaways.sdk": "Use o SDK",
    "sample.takeaways.sdkDesc":
      "— ele cuida da criptografia, descriptografia e tipagem para você.",

    // Common
    "common.prev": "← Anterior",
    "common.next": "Próximo →",
    "common.copy": "Copiar",
    "common.copied": "Copiado!",
  },
  es: {
    // Nav
    "nav.gettingStarted": "Primeros Pasos",
    "nav.quickStart": "Inicio Rápido",
    "nav.integratorRegistration": "Registro de Integrador",
    "nav.companyRegistration": "Registro de Empresa",
    "nav.messaging": "Enviar y Recibir Mensajes",
    "nav.guides": "Guías",
    "nav.webhooks": "Webhooks",
    "nav.e2eEncryption": "Cifrado de Extremo a Extremo",
    "nav.richMessages": "Mensajes Ricos",
    "nav.media": "Archivos Adjuntos",
    "nav.presence": "Presencia y Escritura",
    "nav.keyTransfer": "Transferencia de Clave",
    "nav.reference": "Referencia",
    "nav.auth": "Autenticación",
    "nav.errors": "Manejo de Errores",
    "nav.sdk": "SDK JavaScript",
    "nav.sampleIntegrator": "Integrador de Ejemplo",
    "nav.apiReference": "Referencia de API ↗",
    "nav.github": "GitHub ↗",

    // Home
    "home.tagline":
      "Plataforma independiente de mensajería comercial. Integre conversaciones seguras y white-label en su CRM o help desk con cifrado de extremo a extremo.",
    "home.cta.start": "Guía de Inicio Rápido",
    "home.cta.api": "Referencia de API",
    "home.features.title": "Todo lo que necesitas para integrar",
    "home.features.e2ee.title": "Cifrado de Extremo a Extremo",
    "home.features.e2ee.desc":
      "Cifrado híbrido RSA + AES-256-GCM. Los mensajes se cifran en el cliente — el servidor nunca ve el texto plano.",
    "home.features.webhooks.title": "Orientado a Webhooks",
    "home.features.webhooks.desc":
      "Reciba eventos en tiempo real vía webhooks firmados. Mensajes, presencia, acuses de lectura — todo entregado a su endpoint.",
    "home.features.whitelabel.title": "White-Label",
    "home.features.whitelabel.desc":
      "Su marca, su experiencia. Personalice colores, logos y dominio para cada empresa.",
    "home.features.rich.title": "Mensajes Ricos",
    "home.features.rich.desc":
      "Respuestas rápidas, URLs, copiar al portapapeles, códigos Pix, vCards y compartir ubicación — todo cifrado.",
    "home.features.multiplatform.title": "Multi-Plataforma",
    "home.features.multiplatform.desc":
      "Los clientes chatean vía PWA, iOS o Android. Los operadores se integran vía API REST y webhooks.",
    "home.features.sdk.title": "SDK JavaScript",
    "home.features.sdk.desc":
      "Paquete oficial @ixblix/sdk-js con cliente HTTP tipado, auxiliares de criptografía y verificación de webhooks.",
    "home.ctaSection.title": "¿Listo para integrar?",
    "home.ctaSection.desc":
      "Comience con la guía de inicio rápido y tenga su primera conversación funcionando en minutos.",
    "home.ctaSection.button": "Comenzar",

    // AI Agent Skills
    "home.skills.title": "Skills para Agentes de IA",
    "home.skills.desc": "Agregue estos archivos de skill a su agente de IA (Claude, ChatGPT, Copilot, etc.) para habilitar capacidades completas de integración con ixblix.",
    "home.skills.api.title": "Skill REST API",
    "home.skills.api.desc": "Guía completa de integración usando llamadas HTTP/cURL directas. Sin SDK necesario.",
    "home.skills.api.download": "Descargar Skill API",
    "home.skills.sdk.title": "Skill JavaScript SDK",
    "home.skills.sdk.desc": "Guía completa de integración usando el paquete oficial @ixblix/sdk-js TypeScript.",
    "home.skills.sdk.download": "Descargar Skill SDK",
    "home.skills.instructions.title": "Cómo Agregar Skills a Su Agente de IA",
    "home.skills.instructions.claude.title": "Claude (Anthropic)",
    "home.skills.instructions.claude.step1": "Descargue el archivo de skill arriba",
    "home.skills.instructions.claude.step2": "Abra Claude y vaya a Projects",
    "home.skills.instructions.claude.step3": "Cree un nuevo proyecto o edite uno existente",
    "home.skills.instructions.claude.step4": "Haga clic en \"Add Knowledge\" → \"Upload file\"",
    "home.skills.instructions.claude.step5": "Suba el archivo .md descargado",
    "home.skills.instructions.claude.step6": "Claude ahora tiene conocimiento completo de integración ixblix",
    "home.skills.instructions.chatgpt.title": "ChatGPT (OpenAI)",
    "home.skills.instructions.chatgpt.step1": "Descargue el archivo de skill arriba",
    "home.skills.instructions.chatgpt.step2": "Abra ChatGPT y vaya a \"Create a GPT\"",
    "home.skills.instructions.chatgpt.step3": "En la pestaña \"Configure\", baje hasta \"Knowledge\"",
    "home.skills.instructions.chatgpt.step4": "Haga clic en \"Upload\" y seleccione el archivo .md",
    "home.skills.instructions.chatgpt.step5": "Su GPT personalizado ahora conoce la integración ixblix",
    "home.skills.instructions.copilot.title": "GitHub Copilot",
    "home.skills.instructions.copilot.step1": "Descargue el archivo de skill arriba",
    "home.skills.instructions.copilot.step2": "Colóquelo en la carpeta <code>.github/instructions/</code> de su proyecto",
    "home.skills.instructions.copilot.step3": "O agréguelo a su <code>.github/copilot-instructions.md</code>",
    "home.skills.instructions.copilot.step4": "Copilot lo referenciará al responder preguntas sobre ixblix",
    "home.skills.instructions.cursor.title": "Cursor / Windsurf / Otros IDEs",
    "home.skills.instructions.cursor.step1": "Descargue el archivo de skill arriba",
    "home.skills.instructions.cursor.step2": "Colóquelo en la raíz de su proyecto o en la carpeta <code>.cursor/rules/</code>",
    "home.skills.instructions.cursor.step3": "Referéncielo en el system prompt o archivo de reglas de su agente",
    "home.skills.instructions.cursor.step4": "El agente lo usará como contexto para tareas de integración ixblix",

    // QuickStart
    "quickstart.title": "Inicio Rápido",
    "quickstart.lead":
      "Haga funcionar su primera conversación con cifrado de extremo a extremo en menos de 10 minutos. Esta guía le muestra los pasos esenciales.",
    "quickstart.overview.title": "Descripción General",
    "quickstart.overview.text": "La plataforma ixblix conecta",
    "quickstart.overview.integrators": "integradores",
    "quickstart.overview.companies": "empresas",
    "quickstart.overview.flow": "con",
    "quickstart.overview.flowAfter": ". El flujo es:",
    "quickstart.step.reg": "Regístrese como integrador",
    "quickstart.step.regDesc": "— obtenga sus credenciales de API",
    "quickstart.step.company": "Cree una empresa",
    "quickstart.step.companyDesc": "— configure un negocio bajo su integrador",
    "quickstart.step.conversation": "Inicie una conversación",
    "quickstart.step.conversationDesc":
      "— cree un chat y comparta el enlace con un cliente",
    "quickstart.step.messages": "Envíe y reciba mensajes",
    "quickstart.step.messagesDesc": "— cifrados de extremo a extremo",
    "quickstart.prereqs.title": "Requisitos Previos",
    "quickstart.prereq1":
      "Una URL de callback donde ixblix pueda verificar su registro de integrador (HTTPS requerido)",
    "quickstart.prereq2":
      "Una URL de webhook donde ixblix enviará eventos (HTTPS requerido)",
    "quickstart.prereq3": "Node.js 18+ (para el SDK) o cualquier cliente HTTP",
    "quickstart.step1.title": "Paso 1 — Instale el SDK",
    "quickstart.step1.text": "O use la API REST directamente. La URL base es",
    "quickstart.step2.title": "Paso 2 — Registre Su Integrador",
    "quickstart.callout.callbackTitle": "Verificación de Callback",
    "quickstart.callout.callbackText": "ixblix envía un POST a su",
    "quickstart.callout.callbackWith": "con su",
    "quickstart.callout.callbackAnd": "y",
    "quickstart.callout.callbackEnd": ". Su endpoint debe devolver",
    "quickstart.callout.callbackConfirm": "para confirmar la recepción.",
    "quickstart.step3.title": "Paso 3 — Cree una Empresa",
    "quickstart.step3.plansText": "Primero, liste los planes disponibles para elegir uno:",
    "quickstart.step3.response": "Respuesta",
    "quickstart.step3.registerText": "Ahora registre la empresa con el plan seleccionado:",
    "quickstart.step4.title": "Paso 4 — Active y Configure",
    "quickstart.step4.text":
      "Después del pago, active la empresa para recibir su clave de API:",
    "quickstart.step5.title": "Paso 5 — Inicie una Conversación",
    "quickstart.step6.title": "Paso 6 — Envíe un Mensaje",
    "quickstart.step7.title": "Paso 7 — Reciba Mensajes",
    "quickstart.step7.text":
      "Cuando el cliente responda, ixblix envía un webhook",
    "quickstart.step7.textAfter": "a su endpoint:",
    "quickstart.callout.liveTitle": "¡Está en línea!",
    "quickstart.callout.liveText":
      "Ahora tiene una conversación con cifrado de extremo a extremo funcionando. Continúe con las guías detalladas para aprender sobre",
    "quickstart.callout.liveWebhooks": "webhooks",
    "quickstart.callout.liveRich": "mensajes ricos",
    "quickstart.callout.liveMedia": "archivos adjuntos",
    "quickstart.callout.liveAnd": " y más.",
    "quickstart.nextSteps.title": "Próximos Pasos",
    "quickstart.nextSteps.integrator": "flujo de registro detallado",
    "quickstart.nextSteps.e2ee": "entienda el esquema de cifrado",
    "quickstart.nextSteps.webhooks":
      "todos los tipos de eventos y verificación",
    "quickstart.nextSteps.sdk": "referencia completa del SDK",
    "quickstart.api.title": "API Directa (cURL)",
    "quickstart.api.text":
      "¿Prefiere llamadas REST? Aquí están los comandos cURL equivalentes para cada paso.",
    "quickstart.api.regTitle": "Registrar Integrador",
    "quickstart.api.companyTitle": "Crear Empresa",
    "quickstart.api.activateTitle": "Activar Empresa",
    "quickstart.api.webhookTitle": "Definir URL del Webhook",
    "quickstart.api.conversationTitle": "Crear Conversación",
    "quickstart.api.sendMessageTitle": "Enviar Mensaje",

    // IntegratorRegistration
    "integrator.title": "Registro de Integrador",
    "integrator.lead":
      "Registre su aplicación (CRM, help desk, sistema de tickets) como integrador para acceder a la API de ixblix.",
    "integrator.howItWorks.title": "Cómo Funciona",
    "integrator.howItWorks.text": "El registro de integrador usa un flujo de",
    "integrator.howItWorks.bold": "verificación por callback",
    "integrator.howItWorks.textAfter":
      ". Usted proporciona una URL y ixblix envía sus credenciales a esa URL. Esto demuestra que controla el endpoint antes de que se intercambien secretos.",
    "integrator.step1": "Usted llama a",
    "integrator.step1After":
      "con el nombre de su aplicación, URL de callback y email de contacto.",
    "integrator.step2":
      "ixblix crea su cuenta de integrador y envía una solicitud POST a su URL de callback con su",
    "integrator.step2And": "y",
    "integrator.step2End": ".",
    "integrator.step3": "Su endpoint de callback debe responder con",
    "integrator.step3After": "para confirmar la recepción.",
    "integrator.step4":
      "Almacene las credenciales de forma segura — las usará para todas las llamadas de API posteriores.",
    "integrator.regRequest.title": "Solicitud de Registro",
    "integrator.requestBody.title": "Cuerpo de la Solicitud",
    "integrator.table.field": "Campo",
    "integrator.table.type": "Tipo",
    "integrator.table.required": "Obligatorio",
    "integrator.table.description": "Descripción",
    "integrator.table.nameDesc": "Nombre de visualización de su aplicación",
    "integrator.table.callbackUrlDesc":
      "URL HTTPS donde ixblix entregará sus credenciales",
    "integrator.table.contactEmailDesc": "Email de contacto administrativo",
    "integrator.callbackPayload.title": "Payload del Callback",
    "integrator.callbackPayload.text": "ixblix envía un",
    "integrator.callbackPayload.to": "a su",
    "integrator.callbackPayload.with": "con este cuerpo JSON:",
    "integrator.callout.storeTitle":
      "Almacene las Credenciales de Forma Segura",
    "integrator.callout.storeText": "El",
    "integrator.callout.storeOnce":
      "se muestra solo una vez durante la verificación del callback. Almacénelo en una bóveda segura o base de datos cifrada. Si se pierde, contacte al soporte para rotación.",
    "integrator.handling.title": "Manejando el Callback",
    "integrator.authAfter.title": "Autenticación Después del Registro",
    "integrator.authAfter.text":
      "Después del registro, autentique todas las solicitudes de API usando",
    "integrator.authAfter.bold": "HTTP Basic Auth",
    "integrator.authAfter.colon": ":",
    "integrator.authAfter.username": "El nombre de usuario es su",
    "integrator.authAfter.and": "y la contraseña es su",
    "integrator.authAfter.end": ".",
    "integrator.sdk.title": "Usando el SDK",
    "integrator.profile.title": "Obtener Su Perfil",
    "integrator.profile.response": "Respuesta:",
    "integrator.errors.title": "Respuestas de Error",
    "integrator.errors.table.status": "Estado",
    "integrator.errors.table.meaning": "Significado",
    "integrator.errors.400":
      "Cuerpo de solicitud inválido (campos faltantes, formato de URL incorrecto)",
    "integrator.errors.409":
      "URL de callback ya registrada para otro integrador",
    "integrator.errors.422": "URL de callback inaccesible o no devolvió 200",
    "integrator.table.yes": "Sí",
    "integrator.table.no": "No",

    // CompanyRegistration
    "company.title": "Registro de Empresa",
    "company.lead":
      "Cree y active empresas bajo su cuenta de integrador. Cada empresa recibe su propia clave de API, marca y espacio de conversaciones.",
    "company.overview.title": "Descripción General",
    "company.overview.text":
      "Las empresas son los negocios que usan su integrador para hablar con sus clientes. El ciclo de vida es:",
    "company.step.reg": "Registrar",
    "company.step.regDesc":
      "— cree el registro de la empresa y genere una transacción de pago",
    "company.step.pay": "Pagar",
    "company.step.payDesc":
      "— el propietario de la empresa completa el pago mediante el checkout alojado",
    "company.step.activate": "Activar",
    "company.step.activateDesc": "— reciba la clave de API de la empresa",
    "company.step.configure": "Configurar",
    "company.step.configureDesc":
      "— defina URL de webhook, clave de cifrado y marca",
    "company.step1.title": "Paso 1 — Listar Planes Disponibles",
    "company.step1.text":
      "Antes de registrar una empresa, obtenga los planes disponibles para elegir uno:",
    "company.step2.title": "Paso 2 — Registrar la Empresa",
    "company.requestBody.title": "Cuerpo de la Solicitud",
    "company.table.nameDesc": "Nombre de visualización de la empresa",
    "company.table.planIdDesc": "ID del plan a suscribirse",
    "company.table.handleDesc": "Slug único para perfil público (ej.:",
    "company.table.websiteDesc": "URL del sitio web de la empresa",
    "company.table.field": "Campo",
    "company.table.type": "Tipo",
    "company.table.required": "Obligatorio",
    "company.table.description": "Descripción",
    "company.table.yes": "Sí",
    "company.table.no": "No",
    "company.response.title": "Respuesta",
    "company.callout.checkoutTitle": "URL del Checkout",
    "company.callout.checkoutText": "Redirija al propietario de la empresa a",
    "company.callout.checkoutEnd":
      "para completar el pago. La página de checkout admite tarjeta de crédito y Pix Automático.",
    "company.step3.title": "Paso 3 — Activar la Empresa",
    "company.step3.text":
      "Después de confirmar el pago, active la empresa para recibir su clave de API:",
    "company.callout.apiKeyTitle": "Clave de API — Visualización Única",
    "company.callout.apiKeyText": "La",
    "company.callout.apiKeyOnce":
      "se devuelve solo en la activación. Almacénela de forma segura. La empresa también puede recuperarla después mediante",
    "company.callout.apiKeyEnd": "(usando la propia clave de API).",
    "company.step4.title": "Paso 4 — Configurar la Empresa",
    "company.step4.text":
      "Después de la activación, use la clave de API de la empresa para configurar webhooks, cifrado y marca.",
    "company.webhook.title": "Definir URL del Webhook",
    "company.webhook.response": "La respuesta incluye el",
    "company.webhook.for": "para verificar firmas de webhook:",
    "company.encKey.title": "Registrar Clave de Cifrado",
    "company.encKey.text":
      "Registre la clave pública RSA de su operador para cifrado de extremo a extremo:",
    "company.list.title": "Listar Sus Empresas",
    "company.sdk.title": "Usando el SDK",

    // Messaging
    "messaging.title": "Enviar y Recibir Mensajes",
    "messaging.lead":
      "Cree conversaciones, intercambie mensajes cifrados de extremo a extremo y maneje el ciclo de vida completo de la conversación.",
    "messaging.lifecycle.title": "Ciclo de Vida de la Conversación",
    "messaging.lifecycle.create": "Crear conversación",
    "messaging.lifecycle.createDesc":
      "— su sistema crea una conversación y obtiene un deeplink",
    "messaging.lifecycle.share": "Compartir deeplink",
    "messaging.lifecycle.shareDesc":
      "— envíe el enlace al cliente vía WhatsApp, SMS, email, etc.",
    "messaging.lifecycle.join": "El cliente se une",
    "messaging.lifecycle.joinDesc":
      "— el cliente abre el enlace y registra su clave de cifrado",
    "messaging.lifecycle.exchange": "Intercambiar mensajes",
    "messaging.lifecycle.exchangeDesc":
      "— ambos lados cifran/descifran con RSA + AES-256-GCM",
    "messaging.lifecycle.close": "Cerrar conversación",
    "messaging.lifecycle.closeDesc":
      "— cualquiera de los lados termina el chat",
    "messaging.create.title": "Crear una Conversación",
    "messaging.requestBody.title": "Cuerpo de la Solicitud",
    "messaging.table.field": "Campo",
    "messaging.table.type": "Tipo",
    "messaging.table.required": "Obligatorio",
    "messaging.table.description": "Descripción",
    "messaging.table.yes": "Sí",
    "messaging.table.no": "No",
    "messaging.table.contactNameDesc": "Nombre de visualización del cliente",
    "messaging.table.contactExternalIdDesc": "Su ID interno para este contacto",
    "messaging.table.originChannelDesc": "Canal de origen:",
    "messaging.table.metadataDesc":
      "Datos arbitrarios clave-valor almacenados con la conversación",
    "messaging.response.title": "Respuesta",
    "messaging.callout.deeplinkTitle": "Deeplink",
    "messaging.callout.deeplinkText": "Envíe el",
    "messaging.callout.deeplinkEnd":
      "a su cliente. Cuando lo abra, verá una interfaz de chat white-label con la marca de la empresa.",
    "messaging.joins.title": "El Cliente se Une",
    "messaging.joins.text":
      "Cuando el cliente abre el deeplink y la app web carga, genera un par de claves RSA y registra la clave pública. Usted recibe un webhook",
    "messaging.joins.webhook": ":",
    "messaging.callout.storeKeyTitle": "Almacene la Clave Pública del Cliente",
    "messaging.callout.storeKeyText":
      "Necesita esta clave para cifrar todos los mensajes enviados a este cliente. Almacénela asociada a la conversación.",
    "messaging.send.title": "Enviar un Mensaje (Empresa → Cliente)",
    "messaging.send.text":
      "Todos los mensajes se cifran en el cliente. Use la clave pública del cliente (del webhook",
    "messaging.send.webhook": ") para cifrar:",
    "messaging.send.table.conversationIdDesc":
      "Conversación para enviar el mensaje",
    "messaging.send.table.encryptedContentDesc":
      "Mensaje cifrado con AES-256-GCM (base64)",
    "messaging.send.table.encryptedKeyDesc":
      "Clave AES envuelta con RSA-OAEP (base64)",
    "messaging.send.table.attachmentsDesc":
      "Adjuntos de mensajes ricos opcionales (también cifrados) — vea",
    "messaging.receive.title": "Recibir un Mensaje (Cliente → Empresa)",
    "messaging.receive.text":
      "Cuando el cliente envía un mensaje, usted recibe un webhook",
    "messaging.receive.webhook": ":",
    "messaging.decrypt.title": "Descifrar el Mensaje",
    "messaging.list.title": "Listar Mensajes",
    "messaging.list.text":
      "Devuelve mensajes en orden cronológico inverso. Los mensajes se devuelven en su forma cifrada — descifrelos en el cliente.",
    "messaging.read.title": "Marcar Mensajes como Leídos",
    "messaging.read.operator": "Lectura del operador (lado empresa)",
    "messaging.read.operatorText": "Esto envía un evento Socket.io",
    "messaging.read.operatorEnd": "al cliente.",
    "messaging.read.customer": "Lectura del cliente (dispara webhook)",
    "messaging.read.customerText":
      "Cuando el cliente lee sus mensajes, usted recibe un webhook",
    "messaging.read.customerEnd": ":",
    "messaging.close.title": "Cerrar una Conversación",
    "messaging.close.text": "Esto dispara un webhook",
    "messaging.close.webhook":
      "a su endpoint. La interfaz de chat del cliente mostrará la conversación como cerrada.",
    "messaging.erase.title": "Borrar una Conversación (LGPD)",
    "messaging.erase.text":
      "Para cumplir con las regulaciones de protección de datos, puede borrar permanentemente todos los datos de la conversación:",
    "messaging.callout.irreversibleTitle": "Acción Irreversible",
    "messaging.callout.irreversibleText":
      "Borrar una conversación elimina permanentemente todos los mensajes, archivos y datos de contacto. Esto no se puede deshacer.",

    // Webhooks
    "webhooks.title": "Webhooks",
    "webhooks.lead":
      "Reciba eventos en tiempo real de ixblix vía webhooks HTTP firmados. Cada acción de conversación, mensaje y cambio de presencia se entrega a su endpoint.",
    "webhooks.setup.title": "Configurando Webhooks",
    "webhooks.setup.text":
      "Configure su URL de webhook por empresa usando la clave de API de la empresa:",
    "webhooks.setup.response": "Respuesta:",
    "webhooks.callout.storeTitle": "Almacene el Secreto",
    "webhooks.callout.storeText": "El",
    "webhooks.callout.storeEnd":
      "se devuelve solo cuando la URL se establece o rota. Úselo para verificar firmas de webhook.",
    "webhooks.verify.title": "Verificando Firmas",
    "webhooks.verify.text": "Cada solicitud de webhook incluye un encabezado",
    "webhooks.verify.header":
      "que contiene una firma HMAC-SHA256 del cuerpo de la solicitud. Siempre verifique esta firma antes de procesar el evento.",
    "webhooks.verify.sdkTitle": "Usando el SDK",
    "webhooks.verify.manualTitle": "Verificación Manual",
    "webhooks.events.title": "Tipos de Eventos",
    "webhooks.events.table.event": "Evento",
    "webhooks.events.table.when": "Cuándo",
    "webhooks.events.table.payload": "Campos Principales del Payload",
    "webhooks.events.messageReceived": "El cliente envía un mensaje",
    "webhooks.events.messageRead": "El cliente lee mensajes de la empresa",
    "webhooks.events.customerJoined":
      "El cliente abre el chat y registra la clave",
    "webhooks.events.conversationClosed": "La conversación se cierra",
    "webhooks.events.typing": "El cliente comienza a escribir",
    "webhooks.events.stoppedTyping": "El cliente deja de escribir",
    "webhooks.events.recording": "El cliente comienza a grabar audio",
    "webhooks.events.chatClosed": "El cliente cierra la ventana del chat",
    "webhooks.events.balanceLow": "El saldo de créditos de la empresa es bajo",
    "webhooks.payload.title": "Estructura del Payload del Evento",
    "webhooks.payload.text":
      "Todos los eventos de webhook siguen esta estructura:",
    "webhooks.headers.title": "Encabezados de la Solicitud",
    "webhooks.headers.table.header": "Encabezado",
    "webhooks.headers.table.description": "Descripción",
    "webhooks.headers.signatureDesc":
      "Firma HMAC-SHA256 del cuerpo de la solicitud",
    "webhooks.headers.eventIdDesc":
      "ID único del evento para deduplicación (clave de idempotencia)",
    "webhooks.delivery.title": "Garantías de Entrega",
    "webhooks.delivery.atLeastOnce": "Entrega al menos una vez",
    "webhooks.delivery.atLeastOnceDesc":
      "— los eventos se persisten en un outbox antes de la entrega y se reintentan en caso de fallo.",
    "webhooks.delivery.backoff": "Backoff exponencial",
    "webhooks.delivery.backoffDesc":
      "— las entregas fallidas se reintentan hasta 8 veces con intervalos crecientes.",
    "webhooks.delivery.idempotency": "Idempotencia",
    "webhooks.delivery.idempotencyDesc": "— use el encabezado",
    "webhooks.delivery.idempotencyEnd":
      "para deduplicar eventos. Su handler debe ser idempotente.",
    "webhooks.delivery.timeout": "Timeout",
    "webhooks.delivery.timeoutDesc":
      "— su endpoint debe responder en 30 segundos. Procese eventos de forma asíncrona si es necesario.",
    "webhooks.callout.respondTitle": "Responda Rápidamente",
    "webhooks.callout.respondText": "Siempre responda con",
    "webhooks.callout.respondEnd":
      "lo más rápido posible. Si su procesamiento tarda más, encole el evento y procéselo en un worker en segundo plano.",
    "webhooks.rotate.title": "Rotando el Secreto del Webhook",
    "webhooks.rotate.text":
      "Para rotar su secreto de webhook, llame al mismo endpoint con una nueva URL (o la misma URL):",
    "webhooks.rotate.end": "Se devuelve un nuevo",
    "webhooks.rotate.returned":
      ". El secreto anterior se invalida inmediatamente.",

    // E2EEncryption
    "e2ee.title": "Cifrado de Extremo a Extremo",
    "e2ee.lead":
      "Todos los mensajes en ixblix se cifran en el cliente usando un esquema híbrido RSA + AES-256-GCM. El servidor nunca ve contenido en texto plano.",
    "e2ee.scheme.title": "Esquema de Cifrado",
    "e2ee.scheme.text": "ixblix usa un enfoque de cifrado híbrido:",
    "e2ee.scheme.rsa": "para intercambio de claves",
    "e2ee.scheme.aes": "para cifrado del contenido del mensaje",
    "e2ee.scheme.fresh":
      "Cada mensaje recibe una clave AES aleatoria y fresca. La clave AES se cifra (envuelve) con la clave pública RSA del destinatario.",
    "e2ee.how.title": "Cómo Funciona",
    "e2ee.how.operator": "El operador genera un par de claves RSA",
    "e2ee.how.operatorDesc":
      "en la primera configuración y registra la clave pública en ixblix.",
    "e2ee.how.customer": "El cliente genera un par de claves RSA",
    "e2ee.how.customerDesc":
      "cuando abre el chat por primera vez y registra su clave pública.",
    "e2ee.how.send": "Para enviar un mensaje",
    "e2ee.how.sendDesc": ", el remitente:",
    "e2ee.how.genAes": "Genera una clave AES-256 aleatoria",
    "e2ee.how.encryptMsg": "Cifra el contenido del mensaje con AES-256-GCM",
    "e2ee.how.wrapRecipient":
      "Envuelve la clave AES con la clave pública RSA del destinatario",
    "e2ee.how.wrapSelf":
      "También envuelve la clave AES con su propia clave pública (para auto-lectura)",
    "e2ee.how.sendApi":
      "Envía el contenido cifrado + claves envueltas a la API",
    "e2ee.how.read": "Para leer un mensaje",
    "e2ee.how.readDesc": ", el destinatario:",
    "e2ee.how.unwrap": "Desenvuelve la clave AES usando su clave privada RSA",
    "e2ee.how.decrypt": "Descifra el contenido con AES-256-GCM",
    "e2ee.gen.title": "Generando un Par de Claves del Operador",
    "e2ee.gen.nodeTitle": "Usando Node.js Crypto Directamente",
    "e2ee.register.title": "Registrando Su Clave Pública",
    "e2ee.encrypt.title": "Cifrando un Mensaje",
    "e2ee.decrypt.title": "Descifrando un Mensaje",
    "e2ee.media.title": "Cifrando Archivos",
    "e2ee.media.text":
      "Los archivos de medios (imágenes, audio, documentos) usan el mismo esquema híbrido. El SDK proporciona auxiliares dedicados:",
    "e2ee.keyMgmt.title": "Gestión de Claves",
    "e2ee.keyMgmt.storeTitle": "Almacenando Claves de Forma Segura",
    "e2ee.keyMgmt.storeText":
      "Su clave privada del operador debe almacenarse de forma segura. Opciones:",
    "e2ee.keyMgmt.env": "Variable de entorno",
    "e2ee.keyMgmt.envDesc": "— para implementaciones simples",
    "e2ee.keyMgmt.db": "Campo cifrado en la base de datos",
    "e2ee.keyMgmt.dbDesc": "— cifre el PEM con una clave maestra",
    "e2ee.keyMgmt.vault": "Bóveda / KMS",
    "e2ee.keyMgmt.vaultDesc": "— AWS KMS, HashiCorp Vault, etc.",
    "e2ee.callout.neverTitle": "Nunca Exponga Claves Privadas",
    "e2ee.callout.neverText":
      "La clave privada del operador descifra todos los mensajes de la empresa. Si se compromete, todos los mensajes pasados y futuros pueden ser leídos. Nunca la registre en logs, incorpore en código del lado del cliente o envíe por canales no cifrados.",
    "e2ee.keyMgmt.retrieveTitle": "Recuperando Su Clave Registrada",
    "e2ee.keyMgmt.convKeysTitle": "Obteniendo Claves de la Conversación",
    "e2ee.keyMgmt.convKeysText":
      "Para recuperar las claves públicas del operador y del cliente de una conversación:",
    "e2ee.security.title": "Propiedades de Seguridad",
    "e2ee.security.forward": "Secreto hacia adelante por mensaje",
    "e2ee.security.forwardDesc":
      "— cada mensaje usa una clave AES fresca, así que comprometer una clave no afecta a otras.",
    "e2ee.security.server": "El servidor no puede leer mensajes",
    "e2ee.security.serverDesc":
      "— el backend solo almacena texto cifrado y claves envueltas.",
    "e2ee.security.auth": "Autenticación vía GCM",
    "e2ee.security.authDesc":
      "— AES-GCM proporciona confidencialidad e integridad.",
    "e2ee.security.selfRead": "Capacidad de auto-lectura",
    "e2ee.security.selfReadDesc":
      "— el remitente envuelve la clave AES a su propia clave, permitiéndole leer mensajes enviados.",

    // RichMessages
    "rich.title": "Mensajes Ricos",
    "rich.lead":
      "Mejore conversaciones con botones interactivos: respuestas rápidas, URLs, copiar al portapapeles, códigos Pix, tarjetas de contacto y ubicaciones.",
    "rich.overview.title": "Descripción General",
    "rich.overview.text": "Los mensajes ricos se envían como",
    "rich.overview.attachments": "adjuntos",
    "rich.overview.alongside":
      "junto con el contenido cifrado de su mensaje. Los adjuntos se cifran con la misma clave AES del cuerpo del mensaje.",
    "rich.overview.operator": "Solo el",
    "rich.overview.operatorBold": "operador (empresa)",
    "rich.overview.operatorEnd":
      "puede enviar mensajes ricos. Los clientes solo pueden responder tocando botones (que envía la etiqueta como mensaje de texto).",
    "rich.types.title": "Tipos de Adjunto",
    "rich.types.quickReply.title": "Respuesta Rápida",
    "rich.types.quickReply.text": "Muestra un botón que envía el",
    "rich.types.quickReply.end": "como respuesta de texto cuando se toca.",
    "rich.types.url.title": "Botón URL",
    "rich.types.url.text": "Abre una URL en el navegador del cliente.",
    "rich.types.copy.title": "Copiar al Portapapeles",
    "rich.types.copy.text":
      "Copia un valor al portapapeles del cliente cuando se toca.",
    "rich.types.pix.title": "Código Pix",
    "rich.types.pix.text":
      "Igual que copiar, pero con un ícono Pix para indicar que es un código de pago.",
    "rich.types.vcard.title": "vCard (Tarjeta de Contacto)",
    "rich.types.vcard.text":
      "Muestra una tarjeta de contacto con nombre, teléfono y organización.",
    "rich.types.location.title": "Ubicación",
    "rich.types.location.text":
      "Muestra un enlace de mapa con las coordenadas dadas.",
    "rich.sending.title": "Enviando Mensajes Ricos",
    "rich.sending.text":
      "Incluya adjuntos en su solicitud de mensaje. Se cifran junto con el contenido del mensaje:",
    "rich.rendering.title": "Reglas de Visualización",
    "rich.rendering.inline": "≤ 3 botones",
    "rich.rendering.inlineDesc": "— se muestran en línea debajo del mensaje",
    "rich.rendering.modal": "&gt; 3 botones",
    "rich.rendering.modalDesc": "— se muestran en un modal/overlay",
    "rich.rendering.order":
      "Los botones se muestran en el orden en que se envían",
    "rich.rendering.reply": "Solo los botones",
    "rich.rendering.replyEnd": "disparan un mensaje de vuelta al operador",
    "rich.rendering.url": "botones se abren en el navegador del sistema",
    "rich.rendering.copy": "y",
    "rich.rendering.copyEnd":
      "botones copian al portapapeles y muestran un toast de confirmación",
    "rich.mixing.title": "Mezclando Tipos de Adjunto",
    "rich.mixing.text": "Puede mezclar diferentes tipos en un solo mensaje:",
    "rich.api.title": "API Directa (cURL)",
    "rich.api.text":
      "El comando cURL equivalente para enviar mensajes ricos. Los adjuntos se envían como un array JSON junto con el contenido cifrado:",

    // Media
    "media.title": "Archivos Adjuntos",
    "media.lead":
      "Envíe y reciba imágenes, audio, video y documentos — todo cifrado de extremo a extremo.",
    "media.how.title": "Cómo Funciona el Cifrado de Archivos",
    "media.how.text":
      "Los archivos siguen el mismo esquema de cifrado híbrido que los mensajes:",
    "media.how.step1": "Se genera una clave AES-256 fresca para el archivo",
    "media.how.step2": "El archivo se cifra con AES-256-GCM",
    "media.how.step3":
      "La clave AES se envuelve con la clave pública RSA del destinatario",
    "media.how.step4":
      "El archivo cifrado se sube al almacenamiento de objetos de ixblix",
    "media.how.step5":
      "El ID del archivo y la clave envuelta se envían como parte del mensaje",
    "media.upload.title": "Subir Archivo (Empresa → Cliente)",
    "media.uploadCustomer.title": "Subir Archivo (Cliente → Empresa)",
    "media.uploadCustomer.text":
      "Los clientes suben archivos a través de la interfaz del chat. Usted recibe un webhook",
    "media.uploadCustomer.webhook": "con el",
    "media.uploadCustomer.end": ":",
    "media.download.title": "Descargar Archivo",
    "media.download.company": "Empresa descargando archivo del cliente",
    "media.download.decryptTitle": "Descifrar el Archivo Descargado",
    "media.types.title": "Tipos de Archivo",
    "media.types.table.type": "Tipo",
    "media.types.table.formats": "Formatos Soportados",
    "media.types.table.maxSize": "Tamaño Máximo",
    "media.metadata.title": "Metadatos del Archivo",
    "media.api.uploadTitle": "Subir vía cURL",
    "media.api.uploadText":
      "Suba archivos cifrados directamente con cURL. El archivo ya debe estar cifrado con AES-256-GCM:",

    // Presence
    "presence.title": "Indicadores de Presencia y Escritura",
    "presence.lead":
      "Muestre indicadores en tiempo real de escritura, grabación y estado del chat entre operadores y clientes.",
    "presence.types.title": "Tipos de Presencia",
    "presence.types.table.type": "Tipo",
    "presence.types.table.direction": "Dirección",
    "presence.types.table.description": "Descripción",
    "presence.types.both": "Ambos",
    "presence.types.customerOperator": "Cliente → Operador",
    "presence.types.typingDesc":
      "El usuario está escribiendo un mensaje de texto",
    "presence.types.recordingDesc":
      "El cliente está grabando un mensaje de audio",
    "presence.types.chatClosedDesc":
      "El cliente cerró la ventana/pestaña del chat",
    "presence.operator.title": "Presencia del Operador (Empresa → Cliente)",
    "presence.operator.text":
      "Envíe presencia del operador vía API. Esto se entrega al cliente en tiempo real vía Socket.io.",
    "presence.operator.ui":
      'La interfaz de chat del cliente muestra "El agente está escribiendo..." cuando recibe este evento.',
    "presence.operator.identityTitle": "Definir Identidad del Operador",
    "presence.operator.identityText":
      "Opcionalmente asocie un nombre/avatar del operador a la conversación:",
    "presence.customer.title": "Presencia del Cliente (Cliente → Operador)",
    "presence.customer.text":
      "Cuando el cliente escribe o graba audio, usted recibe webhooks:",
    "presence.customer.typingTitle": "Webhook de Escritura",
    "presence.customer.recordingTitle": "Webhook de Grabación",
    "presence.customer.chatClosedTitle": "Webhook de Chat Cerrado",
    "presence.relay.title": "Presencia del Cliente (Operador → API)",
    "presence.relay.text":
      "Si está retransmitiendo presencia del canal original (ej., WhatsApp), use la ruta unificada de presencia con el token del deeplink:",
    "presence.relay.end": "Cuando se llama",
    "presence.relay.without": "sin",
    "presence.relay.an": "un",
    "presence.relay.and":
      "y con un token de deeplink como ref, esto emite un webhook",
    "presence.relay.webhook": "al operador.",
    "presence.best.title": "Mejores Prácticas",
    "presence.best.typing": "Envíe",
    "presence.best.typingEnd":
      "cuando el operador comience a componer y pare cuando envíe el mensaje o pause por más de 5 segundos.",
    "presence.best.throttle":
      "Limite las actualizaciones de presencia para evitar saturación — la interfaz del cliente oculta automáticamente el indicador después de unos segundos de inactividad.",
    "presence.best.recording": "Use",
    "presence.best.recordingEnd":
      "solo cuando el cliente esté activamente grabando audio (no solo sosteniendo el botón).",

    // KeyTransfer
    "keytransfer.title": "Transferencia de Clave",
    "keytransfer.lead":
      "Permita que los clientes transfieran su par de claves de cifrado entre dispositivos (ej., del PWA a una app móvil nativa) de forma segura.",
    "keytransfer.when.title": "Cuándo Usar",
    "keytransfer.when.text":
      "Un cliente comienza a chatear en la web (PWA) y luego quiere continuar en la app del teléfono. Como cada dispositivo genera su propio par de claves RSA, la clave debe transferirse para mantener la continuidad de la conversación.",
    "keytransfer.how.title": "Cómo Funciona",
    "keytransfer.how.step1": "Dispositivo de origen",
    "keytransfer.how.step1Desc":
      "cifra el par de claves con una clave derivada del PIN (PBKDF2-SHA256, 200k iteraciones) y sube el texto cifrado.",
    "keytransfer.how.step2": "Dispositivo de origen",
    "keytransfer.how.step2Desc":
      "muestra el PIN y un enlace de transferencia o código QR.",
    "keytransfer.how.step3": "Dispositivo de destino",
    "keytransfer.how.step3Desc":
      "abre el enlace, obtiene el payload cifrado y solicita el PIN al usuario.",
    "keytransfer.how.step4": "Dispositivo de destino",
    "keytransfer.how.step4Desc":
      "deriva la misma clave del PIN, descifra el par de claves y lo almacena de forma segura.",
    "keytransfer.how.step5": "Dispositivo de destino",
    "keytransfer.how.step5Desc":
      "confirma la transferencia y el dispositivo de origen puede opcionalmente eliminar su clave local.",
    "keytransfer.security.title": "Propiedades de Seguridad",
    "keytransfer.security.ttl": "TTL de 5 minutos",
    "keytransfer.security.ttlDesc":
      "— las transferencias expiran después de 5 minutos",
    "keytransfer.security.attempts": "Máximo 5 intentos",
    "keytransfer.security.attemptsDesc":
      "— los intentos de PIN incorrecto son limitados",
    "keytransfer.security.kek": "KEK derivado del PIN",
    "keytransfer.security.kekDesc": "— PBKDF2-SHA256 con 200k iteraciones",
    "keytransfer.security.spki": "Validación SPKI",
    "keytransfer.security.spkiDesc":
      "— la clave descifrada se valida antes del almacenamiento",
    "keytransfer.security.onetime": "Uso único",
    "keytransfer.security.onetimeDesc":
      "— una vez confirmada, la transferencia se consume",
    "keytransfer.create.title":
      "Crear una Transferencia (Dispositivo de Origen)",
    "keytransfer.retrieve.title":
      "Recuperar una Transferencia (Dispositivo de Destino)",
    "keytransfer.poll.title": "Consultar Estado de la Transferencia",
    "keytransfer.poll.text":
      "El dispositivo de origen puede consultar para saber cuándo se completa la transferencia:",
    "keytransfer.delete.title": "Eliminar una Transferencia",
    "keytransfer.delete.text":
      "Cancele una transferencia antes de que se consuma:",
    "keytransfer.callout.autoTitle": "Limpieza Automática",
    "keytransfer.callout.autoText":
      "Las transferencias se eliminan automáticamente después de 5 minutos o después de 5 intentos de PIN incorrectos. No necesita limpiar manualmente.",
    "keytransfer.api.createTitle": "Crear Transferencia vía cURL",
    "keytransfer.api.createText":
      "El comando cURL equivalente para crear una transferencia de clave. El payload cifrado debe generarse en el cliente usando cifrado derivado del PIN:",
    "keytransfer.api.retrieveTitle": "Recuperar Transferencia vía cURL",
    "keytransfer.api.retrieveText":
      "Obtenga el payload cifrado de la transferencia:",

    // AuthReference
    "auth.title": "Referencia de Autenticación",
    "auth.lead":
      "ixblix usa tres métodos de autenticación dependiendo de quién realiza la solicitud.",
    "auth.methods.title": "Métodos de Autenticación",
    "auth.methods.table.method": "Método",
    "auth.methods.table.who": "Quién",
    "auth.methods.table.header": "Encabezado",
    "auth.methods.table.format": "Formato",
    "auth.methods.basic": "HTTP Basic Auth",
    "auth.methods.integrators": "Integradores",
    "auth.methods.apiKey": "Clave de API",
    "auth.methods.companies": "Empresas",
    "auth.methods.none": "Ninguno",
    "auth.methods.customers": "Clientes / Público",
    "auth.methods.publicDesc":
      "Los endpoints públicos usan tokens de conversación",
    "auth.integrator.title": "Autenticación de Integrador (Basic Auth)",
    "auth.integrator.text":
      "Usado para operaciones en el ámbito del integrador: registrar empresas, listar empresas, ver perfil del integrador.",
    "auth.integrator.username": "El nombre de usuario es su",
    "auth.integrator.and": "y la contraseña es su",
    "auth.integrator.end": ".",
    "auth.integrator.endpointsTitle": "Endpoints que Requieren Basic Auth",
    "auth.company.title": "Autenticación de Empresa (Clave de API)",
    "auth.company.text":
      "Usado para todas las operaciones en el ámbito de la empresa: conversaciones, mensajes, webhooks, claves de cifrado, etc.",
    "auth.company.formatTitle": "Formato de la Clave de API",
    "auth.company.prefix": "Prefijo:",
    "auth.company.length": "Longitud: 32 caracteres después del prefijo",
    "auth.company.generated": "Generada en la activación de la empresa",
    "auth.company.once": "Devuelta solo una vez — almacene de forma segura",
    "auth.public.title": "Endpoints Públicos (Sin Auth)",
    "auth.public.text":
      "Estos endpoints usan tokens de conversación o IDs de transferencia para control de acceso en lugar de encabezados de autenticación:",
    "auth.public.table.endpoint": "Endpoint",
    "auth.public.table.access": "Control de Acceso",
    "auth.public.convToken": "Token de deeplink de la conversación",
    "auth.public.convId": "ID de conversación en el cuerpo",
    "auth.public.handle": "Handle público de la empresa",
    "auth.public.public": "Público",
    "auth.admin.title": "Autenticación Admin (JWT)",
    "auth.admin.text":
      "La consola de administración usa tokens bearer JWT. Estos no están disponibles para integradores o empresas — los endpoints de administración son solo para operadores de la plataforma.",
    "auth.best.title": "Mejores Prácticas de Seguridad",
    "auth.best.never":
      "Nunca exponga claves de API o tokens de acceso en código del lado del cliente",
    "auth.best.rotate": "Rote los secretos de webhook periódicamente",
    "auth.best.store":
      "Almacene credenciales en bóvedas cifradas o variables de entorno",
    "auth.best.https":
      "Use HTTPS para todas las llamadas de API y endpoints de webhook",
    "auth.best.verify": "Verifique firmas de webhook antes de procesar eventos",

    // ErrorHandling
    "errors.title": "Manejo de Errores",
    "errors.lead":
      "Comprenda las respuestas de error de ixblix, códigos de estado y cómo manejarlos correctamente.",
    "errors.format.title": "Formato de Respuesta de Error",
    "errors.format.text":
      "Todos los errores de la API devuelven una estructura JSON consistente:",
    "errors.status.title": "Códigos de Estado HTTP",
    "errors.status.table.code": "Código",
    "errors.status.table.meaning": "Significado",
    "errors.status.table.cause": "Causa Común",
    "errors.status.400": "Solicitud Incorrecta",
    "errors.status.400cause":
      "Cuerpo de solicitud inválido, campos obligatorios faltantes",
    "errors.status.401": "No Autorizado",
    "errors.status.401cause": "Autenticación faltante o inválida",
    "errors.status.403": "Prohibido",
    "errors.status.403cause": "Auth válida pero permisos insuficientes",
    "errors.status.404": "No Encontrado",
    "errors.status.404cause": "El recurso no existe o fue eliminado",
    "errors.status.409": "Conflicto",
    "errors.status.409cause": "Recurso duplicado (ej., handle ya en uso)",
    "errors.status.422": "Entidad No Procesable",
    "errors.status.422cause":
      "JSON válido pero semánticamente inválido (ej., URL incorrecta)",
    "errors.status.429": "Demasiadas Solicitudes",
    "errors.status.429cause": "Límite de tasa excedido",
    "errors.status.500": "Error Interno del Servidor",
    "errors.status.500cause":
      "Error inesperado del servidor — reintente con backoff",
    "errors.codes.title": "Códigos de Error",
    "errors.codes.table.code": "Código",
    "errors.codes.table.description": "Descripción",
    "errors.codes.validation": "El cuerpo de la solicitud falló la validación",
    "errors.codes.authRequired": "No se proporcionó autenticación",
    "errors.codes.invalidCreds":
      "Clave de API o credenciales Basic Auth incorrectas",
    "errors.codes.notActive": "La empresa no completó el pago/activación",
    "errors.codes.notFound": "La conversación no existe o expiró",
    "errors.codes.closed":
      "No se pueden enviar mensajes en una conversación cerrada",
    "errors.codes.encryption":
      "El cliente aún no ha registrado su clave pública",
    "errors.codes.balance": "La empresa no tiene créditos restantes",
    "errors.codes.webhook": "La URL del webhook no respondió con 200",
    "errors.codes.rateLimit": "Demasiadas solicitudes en un período corto",
    "errors.codes.internal": "Error inesperado del servidor",
    "errors.sdk.title": "Manejando Errores en el SDK",
    "errors.retry.title": "Estrategia de Reintentos",
    "errors.retry.text": "Para errores",
    "errors.retry.end": ", implemente backoff exponencial:",
    "errors.webhook.title": "Manejo de Errores de Webhook",
    "errors.webhook.text":
      "Si su endpoint de webhook devuelve un estado diferente de 200 o expira (30s), ixblix reintenta la entrega:",
    "errors.webhook.retries": "Hasta 8 intentos de reintento",
    "errors.webhook.backoff": "Backoff exponencial entre reintentos",
    "errors.webhook.dedup": "Use el encabezado",
    "errors.webhook.dedupEnd": "para deduplicación",
    "errors.callout.respondTitle": "Siempre Responda 200",
    "errors.callout.respondText":
      "Incluso si no puede procesar el evento inmediatamente, responda con",
    "errors.callout.respondEnd":
      "y encole el evento para procesamiento asíncrono. Esto previene reintentos innecesarios.",

    // SdkReference
    "sdk.title": "SDK JavaScript",
    "sdk.lead": "Paquete oficial",
    "sdk.leadEnd":
      "— cliente HTTP tipado, auxiliares de criptografía, persistencia de par de claves y verificación de webhooks.",
    "sdk.install.title": "Instalación",
    "sdk.client.title": "IxblixClient",
    "sdk.client.text":
      "El cliente HTTP principal. Soporta los tres modos de autenticación.",
    "sdk.client.optionsTitle": "Opciones del Constructor",
    "sdk.client.integratorTitle": "Métodos del Integrador",
    "sdk.client.companyTitle": "Métodos de Gestión de Empresas",
    "sdk.client.conversationTitle": "Métodos de Conversación",
    "sdk.client.messageTitle": "Métodos de Mensaje",
    "sdk.client.configTitle": "Métodos de Configuración de Empresa",
    "sdk.crypto.title": "Auxiliares de Criptografía",
    "sdk.keypair.title": "Persistencia de Par de Claves",
    "sdk.webhook.title": "Auxiliares de Webhook",
    "sdk.error.title": "Clase de Error",

    // SampleIntegrator
    "sample.title": "Integrador de Ejemplo",
    "sample.lead":
      "Una implementación de referencia completa de una integración de help desk con ixblix. Este ejemplo muestra cómo conectar todo.",
    "sample.arch.title": "Arquitectura",
    "sample.arch.text":
      "El integrador de ejemplo es una aplicación Node.js/Express que:",
    "sample.arch.reg": "Se registra como integrador y maneja el callback",
    "sample.arch.company": "Crea empresas y gestiona su ciclo de vida",
    "sample.arch.webhooks": "Recibe webhooks para mensajes y eventos entrantes",
    "sample.arch.encrypt": "Cifra mensajes salientes y descifra los entrantes",
    "sample.arch.persist":
      "Persiste el par de claves del operador y las claves públicas de los clientes",
    "sample.setup.title": "Configuración del Proyecto",
    "sample.complete.title": "Ejemplo Completo",
    "sample.running.title": "Ejecutando el Ejemplo",
    "sample.ngrok.title": "Probando con ngrok",
    "sample.ngrok.text":
      "Para probar webhooks localmente, use ngrok para exponer su servidor:",
    "sample.takeaways.title": "Puntos Clave",
    "sample.takeaways.store": "Almacene credenciales de forma segura",
    "sample.takeaways.storeDesc":
      "— tokens de integrador, claves de API y secretos de webhook deben estar en una base de datos o bóveda, no en memoria.",
    "sample.takeaways.verify": "Siempre verifique webhooks",
    "sample.takeaways.verifyDesc": "— use",
    "sample.takeaways.verifyEnd": "antes de procesar cualquier evento.",
    "sample.takeaways.handle": "Maneje CUSTOMER_JOINED",
    "sample.takeaways.handleDesc":
      "— es cuando recibe la clave pública del cliente y puede comenzar a enviar mensajes cifrados.",
    "sample.takeaways.respond": "Responda 200 rápidamente",
    "sample.takeaways.respondDesc":
      "— procese eventos de webhook de forma asíncrona si toman tiempo.",
    "sample.takeaways.sdk": "Use el SDK",
    "sample.takeaways.sdkDesc":
      "— se encarga del cifrado, descifrado y tipado por usted.",

    // Common
    "common.prev": "← Anterior",
    "common.next": "Siguiente →",
    "common.copy": "Copiar",
    "common.copied": "¡Copiado!",
  },
};
