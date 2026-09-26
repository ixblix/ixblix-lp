import type { OpenAPIV3 } from "openapi-types";

export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "ixblix - Message Overflow API",
    description:
      "Independent commercial messaging overflow system. Allows customer service platforms to seamlessly transfer conversations from original channels (WhatsApp, Instagram, etc.) to a branded web/mobile experience.",
    version: "0.1.0",
    contact: {
      name: "ixblix Support",
      email: "support@ixblix.example.com",
    },
    license: {
      name: "Proprietary",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Development server",
    },
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    {
      name: "Installation",
      description: "Instance-wide branding and legal configuration",
    },
    {
      name: "Companies",
      description: "Company registration, billing and customization",
    },
    { name: "Plans", description: "Public subscription plans" },
    { name: "Payment", description: "Payment providers" },
    { name: "Conversations", description: "Overflow conversation management" },
    { name: "Messages", description: "Send and list messages" },
    { name: "Media", description: "Encrypted media file upload and download" },
    { name: "Contacts", description: "Contact information and consent" },
    { name: "Webhooks", description: "Original channel integration" },
    {
      name: "Key Transfer",
      description:
        "Relay used to move the customer's end-to-end encryption keypair between devices",
    },
    {
      name: "Integrators",
      description:
        "Third-party platform registration and authentication. Integrators use HTTP Basic Auth with integratorId:accessToken.",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "API key provided to each company using the system.",
      },
      BasicAuth: {
        type: "http",
        scheme: "basic",
        description:
          "HTTP Basic Auth using integratorId as username and accessToken as password. Used by integrator endpoints.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          code: { type: "string" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
        required: ["error", "code"],
      },
      Company: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          handle: { type: "string" },
          apiKey: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["PENDING_PAYMENT", "ACTIVE", "SUSPENDED"],
          },
          balanceCents: { type: "integer" },
          planId: { type: "string", format: "uuid", nullable: true },
          planExpiresAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          integratorId: {
            type: "string",
            format: "uuid",
            nullable: true,
            description:
              "Internal ID of the integrator that registered this company. Null for companies created directly or before integrator auth.",
          },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "name",
          "handle",
          "status",
          "balanceCents",
          "isActive",
          "createdAt",
        ],
      },
      CompanyCustomization: {
        type: "object",
        properties: {
          brandName: { type: "string" },
          logoUrl: { type: "string", format: "uri" },
          rectangularLogoUrl: { type: "string", format: "uri" },
          squareIconUrl: { type: "string", format: "uri" },
          primaryColor: { type: "string" },
          faviconUrl: { type: "string", format: "uri" },
          websiteUrl: { type: "string", format: "uri" },
          welcomeMessage: { type: "string" },
        },
      },
      CompanyEncryptionKey: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          keyId: {
            type: "string",
            description:
              "Stable identifier of this public key. Sent in message envelopes so the recipient can locate the matching private key.",
          },
          publicKey: {
            type: "string",
            description: "Base64 SPKI RSA public key of the company.",
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "RETIRED"],
          },
          activatedAt: { type: "string", format: "date-time" },
          retiredAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "keyId",
          "publicKey",
          "status",
          "activatedAt",
          "createdAt",
        ],
      },
      RegisterCompanyEncryptionKeyRequest: {
        type: "object",
        properties: {
          keyId: {
            type: "string",
            description:
              "Stable identifier for the new public key. Must be unique within the company.",
          },
          publicKey: {
            type: "string",
            description: "Base64 SPKI RSA public key of the company.",
          },
        },
        required: ["keyId", "publicKey"],
      },
      Operator: {
        type: "object",
        description:
          "Identity of the desk/CRM agent (operator) handling a conversation. The operator can be attached when the conversation is created and updated at any time via the company API. It is also embedded in every COMPANY-sent message so clients can render the sender avatar per message.",
        properties: {
          uuid: {
            type: "string",
            description:
              "Stable identifier of the operator in the desk/CRM. Used to attribute messages and to look up operator details on the client.",
          },
          name: {
            type: "string",
            description: "Display name of the operator.",
          },
          image: {
            type: "string",
            format: "uri",
            description: "URL of the operator's avatar image.",
          },
          gravatarHash: {
            type: "string",
            description:
              "MD5 hash of the operator's email, used to build a Gravatar URL.",
          },
        },
      },
      UpdateOperatorRequest: {
        type: "object",
        description:
          "Payload to update the operator identity of a conversation. Only the provided fields are updated; omitted fields keep their current value. Pass `null` to clear a field.",
        properties: {
          operator: {
            type: "object",
            properties: {
              uuid: { type: "string", nullable: true },
              name: { type: "string", nullable: true },
              image: { type: "string", format: "uri", nullable: true },
              gravatarHash: { type: "string", nullable: true },
            },
          },
        },
      },
      PublicCompany: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          handle: { type: "string" },
          websiteUrl: { type: "string", format: "uri", nullable: true },
          customizations: { $ref: "#/components/schemas/CompanyCustomization" },
        },
        required: ["id", "name", "handle", "customizations"],
      },
      InstallationConfig: {
        type: "object",
        properties: {
          serviceOwnerName: {
            type: "string",
            description:
              "Name of the ixblix installation owner shown in the customer consent flow.",
          },
          privacyTermsUrl: {
            type: "string",
            format: "uri",
            nullable: true,
            description:
              "URL of the privacy terms for this ixblix installation. Customers can read them without leaving the app.",
          },
        },
        required: ["serviceOwnerName"],
      },
      UpdateCompanyConfigurationRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          websiteUrl: { type: "string", format: "uri" },
          handle: { type: "string" },
        },
      },
      RegisterCompanyRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          handle: { type: "string" },
          planId: {
            type: "string",
            format: "uuid",
            description:
              "Subscription plan to assign. The plan's currency determines the payment provider: Stripe for non-BRL plans, Asaas/Efí for BRL plans.",
          },
          confirmationWebhookUrl: { type: "string", format: "uri" },
          email: {
            type: "string",
            format: "email",
            description:
              "Contact e-mail forwarded to the payment gateway as the checkout customer e-mail.",
          },
          taxId: {
            type: "string",
            description:
              "Tax id (CPF/CNPJ) required by some gateways such as Asaas.",
          },
        },
        required: ["name", "handle", "planId"],
      },
      RegisterCompanyResponse: {
        type: "object",
        properties: {
          company: { $ref: "#/components/schemas/Company" },
          payment: {
            type: "object",
            properties: {
              transactionId: { type: "string" },
              provider: { type: "string" },
              amountCents: { type: "integer" },
              currency: { type: "string" },
              confirmationUrl: { type: "string" },
              status: { type: "string" },
              checkoutUrl: {
                type: "string",
                format: "uri",
                description:
                  "ixblix-hosted checkout URL the customer must visit to complete payment. The desk/CRM only needs to hand this URL to the end user; ixblix renders the checkout and collects the payment itself, either by charging a card or by starting a Pix Automático authorization.",
              },
            },
            required: [
              "transactionId",
              "provider",
              "amountCents",
              "currency",
              "confirmationUrl",
              "status",
            ],
          },
        },
        required: ["company", "payment"],
      },
      ActivateCompanyResponse: {
        type: "object",
        properties: {
          apiKey: { type: "string" },
          status: { type: "string" },
        },
        required: ["apiKey", "status"],
      },
      RegisterIntegratorRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Display name of the integrator platform.",
          },
          hostname: {
            type: "string",
            description:
              "Unique hostname for this integrator. Must be unique across all integrators.",
          },
          callbackUrl: {
            type: "string",
            format: "uri",
            description:
              "URL where ixblix will POST the registration challenge and, after the challenge succeeds, the integrator credentials. Must be reachable from the ixblix server.",
          },
          force: {
            type: "boolean",
            description:
              "If true, allows replacing an existing verified hostname registration. Defaults to false.",
          },
          subscriptionId: {
            type: "string",
            description:
              "Subscription id in the format `{paymentProvider}:{id}`. The `id` portion is opaque to the API and interpreted by the payment provider internally. Required when the integrator's assigned payment provider needs a subscription reference.",
          },
        },
        required: ["name", "hostname", "callbackUrl"],
      },
      RegisterIntegratorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Whether the registration was successful.",
          },
          message: {
            type: "string",
            description: "Registration result message.",
          },
        },
        required: ["success", "message"],
      },
      IntegratorChallenge: {
        type: "object",
        properties: {
          challenge: {
            type: "string",
            description:
              "Hostname being registered. The callback must respond with the exact registration payload originally sent to POST /api/integrators/register.",
          },
        },
        required: ["challenge"],
      },
      IntegratorProfile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          hostname: { type: "string" },
          integratorId: { type: "string" },
          status: { type: "string" },
          callbackUrl: { type: "string", format: "uri" },
          verified: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          verifiedAt: { type: "string", format: "date-time", nullable: true },
        },
        required: [
          "id",
          "name",
          "hostname",
          "integratorId",
          "status",
          "callbackUrl",
          "verified",
          "createdAt",
        ],
      },
      PaymentChangeOptionsResponse: {
        type: "object",
        properties: {
          card: {
            type: "boolean",
            description: "Whether card payment is available",
          },
          pixAutomatic: {
            type: "boolean",
            description: "Whether Pix Automático is available for the plan",
          },
          pixAutomaticCycle: {
            type: "string",
            nullable: true,
            description: "Recurrence cycle (e.g., MENSAL, TRIMESTRAL)",
          },
          pixAutomaticUnavailableReason: {
            type: "string",
            nullable: true,
            description: "Why Pix Automático is unavailable (if applicable)",
          },
          currentPlanExpiresAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Current plan expiration date",
          },
          stillActive: {
            type: "boolean",
            description:
              "Whether the company is still active (before next due date)",
          },
          currentPaymentMethodType: {
            type: "string",
            nullable: true,
            enum: ["CARD", "PIX_AUTOMATIC_AUTHORIZATION"],
            description: "Current payment method type, if any",
          },
        },
        required: [
          "card",
          "pixAutomatic",
          "pixAutomaticCycle",
          "pixAutomaticUnavailableReason",
          "currentPlanExpiresAt",
          "stillActive",
          "currentPaymentMethodType",
        ],
      },
      StartPaymentChangeRequest: {
        type: "object",
        properties: {
          planId: {
            type: "string",
            format: "uuid",
            description:
              "Subscription plan to re-subscribe to or switch to. If not provided, uses the current plan.",
          },
        },
      },
      StartPaymentChangeResponse: {
        type: "object",
        properties: {
          transactionId: {
            type: "string",
            description: "Unique transaction identifier",
          },
          provider: {
            type: "string",
            description: "Payment provider (e.g., efi, asaas, stripe)",
          },
          amountCents: {
            type: "integer",
            description: "Plan price in cents",
          },
          currency: {
            type: "string",
            description: "Currency code (e.g., BRL, USD)",
          },
          confirmationUrl: {
            type: "string",
            description: "URL to confirm activation after payment",
          },
          status: {
            type: "string",
            description: "Payment status (always PENDING initially)",
          },
          checkoutUrl: {
            type: "string",
            format: "uri",
            description: "URL to redirect the customer for payment",
          },
        },
        required: [
          "transactionId",
          "provider",
          "amountCents",
          "currency",
          "confirmationUrl",
          "status",
          "checkoutUrl",
        ],
      },
      CompanyPaymentDetails: {
        type: "object",
        properties: {
          transactionId: { type: "string" },
          status: { type: "string" },
          provider: { type: "string" },
          amountCents: { type: "integer" },
          currency: { type: "string" },
          plan: {
            type: "object",
            nullable: true,
            description:
              "Plan configuration the checkout must respect. `billingType` and `period` decide whether Pix Automático is offered, `priceCents` is the first charge, and `graceDays` is the window during which a failed renewal is retried.",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              billingType: {
                type: "string",
                enum: ["MESSAGES", "CONVERSATIONS", "PERIOD"],
              },
              period: {
                type: "string",
                enum: ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"],
              },
              durationDays: { type: "integer", nullable: true },
              priceCents: { type: "integer" },
              currency: { type: "string" },
              minimumDepositCents: { type: "integer", nullable: true },
              maxDebtCents: { type: "integer", nullable: true },
              graceDays: { type: "integer", nullable: true },
            },
            required: ["id", "name", "billingType", "period", "priceCents"],
          },
          company: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              handle: { type: "string" },
              customizations: {
                $ref: "#/components/schemas/CompanyCustomization",
              },
            },
            required: ["id", "name", "handle", "customizations"],
          },
        },
        required: [
          "transactionId",
          "status",
          "provider",
          "amountCents",
          "currency",
          "company",
        ],
      },
      CheckoutProviderPublic: {
        type: "object",
        description:
          "Public provider data required by frontend SDKs to tokenize or authorize payments.",
        properties: {
          name: {
            type: "string",
            description: "Payment provider identifier (e.g., `efi`).",
          },
          mode: {
            type: "string",
            enum: ["sandbox", "production"],
            description: "Gateway environment the frontend must target.",
          },
          public: {
            type: "object",
            description:
              "Provider-specific public values. For Efí this contains the `payeeCode` used by the browser library to scope card tokens.",
            additionalProperties: true,
          },
        },
        required: ["name", "mode", "public"],
      },
      CheckoutPaymentOptions: {
        type: "object",
        description:
          "Payment instruments the ixblix-hosted checkout may offer for the plan behind a registration transaction.",
        properties: {
          card: {
            type: "boolean",
            description: "Whether credit card payment is available.",
          },
          pixAutomatic: {
            type: "boolean",
            description:
              "Whether Pix Automático is available. Only periodic plans qualify, because the Banco Central regulates the periodicity of the charges.",
          },
          pixAutomaticCycle: {
            type: "string",
            nullable: true,
            enum: [
              "WEEKLY",
              "BIWEEKLY",
              "MONTHLY",
              "BIMONTHLY",
              "QUARTERLY",
              "SEMIANNUALLY",
              "YEARLY",
              null,
            ],
            description:
              "Recurrence cycle derived from the plan period, shown to the payer. Null when Pix Automático is unavailable.",
          },
          pixAutomaticUnavailableReason: {
            type: "string",
            nullable: true,
            enum: [
              "NO_PLAN",
              "PLAN_NOT_PERIODIC",
              "PERIOD_NOT_SUPPORTED",
              null,
            ],
            description:
              "Why Pix Automático is unavailable, when it is. `PLAN_NOT_PERIODIC` means the plan is billed by usage; `PERIOD_NOT_SUPPORTED` means the period has no legal Pix Automático equivalent.",
          },
          provider: {
            $ref: "#/components/schemas/CheckoutProviderPublic",
            description:
              "Public provider configuration required by frontend SDKs (e.g., Efí payee code and environment).",
          },
        },
        required: ["card", "pixAutomatic", "pixAutomaticCycle", "provider"],
      },
      CheckoutCardPaymentRequest: {
        type: "object",
        description:
          "Card data collected on the ixblix-hosted checkout. The gateway tokenizes the card in the same call, so the resulting token can be reused for off-session charges.",
        properties: {
          card: {
            type: "object",
            properties: {
              holderName: { type: "string" },
              number: {
                type: "string",
                description: "Card number, digits only.",
              },
              expiryMonth: { type: "string", example: "12" },
              expiryYear: { type: "string", example: "2030" },
              ccv: { type: "string" },
            },
            required: [
              "holderName",
              "number",
              "expiryMonth",
              "expiryYear",
              "ccv",
            ],
          },
          holder: {
            type: "object",
            description:
              "Card holder identity. Required by the gateway for risk analysis. The address fields are pre-filled from the postal code through ViaCEP on the checkout, but every field stays editable.",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              cpfCnpj: { type: "string" },
              postalCode: {
                type: "string",
                description: "Postal code, digits only.",
              },
              address: {
                type: "string",
                description: "Street name.",
              },
              addressNumber: { type: "string" },
              addressComplement: { type: "string" },
              province: {
                type: "string",
                description: "Neighbourhood.",
              },
              city: { type: "string" },
              state: {
                type: "string",
                description: "Two-letter state code.",
              },
              phone: { type: "string" },
              mobilePhone: { type: "string" },
            },
            required: [
              "name",
              "email",
              "cpfCnpj",
              "postalCode",
              "addressNumber",
            ],
          },
          saveCard: {
            type: "boolean",
            default: true,
            description:
              "Store the tokenized card as the company's default method so renewals and overage can be billed off-session.",
          },
        },
        required: ["card", "holder"],
      },
      CheckoutCardPaymentResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["COMPLETED", "PENDING", "FAILED"],
            description:
              "`COMPLETED` means the company was activated. `PENDING` means the charge was accepted but not yet settled; poll the status endpoint. `FAILED` means the card was declined.",
          },
          providerPaymentId: { type: "string" },
          apiKey: {
            type: "string",
            description:
              "Company API key, present only when the charge activated the company.",
          },
          error: { type: "string" },
        },
        required: ["status", "providerPaymentId"],
      },
      CheckoutPixAutomaticPaymentRequest: {
        type: "object",
        description:
          "Payer identity collected for Pix Automático. Asaas requires a CPF/CNPJ to create the customer before the authorization can be created.",
        properties: {
          holder: {
            type: "object",
            description:
              "Payer identity. The CPF/CNPJ is mandatory because the gateway uses it to create the customer that owns the Pix Automático authorization.",
            properties: {
              name: { type: "string" },
              cpfCnpj: {
                type: "string",
                description: "CPF or CNPJ, digits only.",
              },
              email: { type: "string", format: "email" },
              phone: { type: "string" },
            },
            required: ["name", "cpfCnpj"],
          },
        },
        required: ["holder"],
      },
      CheckoutPixAutomaticResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "FAILED"],
            description:
              "`PENDING` means the payer must scan the QR Code. The webhook settles the payment once it is paid.",
          },
          authorizationId: { type: "string" },
          qrCodePayload: {
            type: "string",
            description:
              "Pix Automático QR Code payload the payer scans to authorize future debits and pay the first period.",
          },
          qrCodeImage: {
            type: "string",
            description: "QR Code image as a base64 data URI.",
          },
          expiresAt: { type: "string", format: "date-time", nullable: true },
          error: { type: "string" },
        },
        required: ["status", "authorizationId"],
      },
      CheckoutPaymentStatus: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
          },
          activated: {
            type: "boolean",
            description: "Whether the company is active.",
          },
          apiKey: {
            type: "string",
            description: "Company API key, present once the company is active.",
          },
        },
        required: ["status", "activated"],
      },
      Plan: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          billingType: {
            type: "string",
            enum: ["MESSAGES", "CONVERSATIONS", "PERIOD"],
          },
          includedConversations: { type: "integer", nullable: true },
          includedMessages: { type: "integer", nullable: true },
          period: {
            type: "string",
            enum: ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"],
            description:
              "Length of one billing period. `CUSTOM` uses `durationDays`.",
          },
          durationDays: { type: "integer", nullable: true },
          priceCents: { type: "integer" },
          currency: { type: "string", example: "BRL" },
          overagePriceCents: { type: "integer", nullable: true },
          minimumDepositCents: {
            type: "integer",
            nullable: true,
            description:
              "Smallest prepaid credit top-up accepted for companies on this plan. `null` means no plan-specific floor.",
          },
          maxDebtCents: {
            type: "integer",
            nullable: true,
            description:
              "Maximum unpaid debt allowed before operations are rejected. `null` means no debt limit.",
          },
          graceDays: {
            type: "integer",
            nullable: true,
            description:
              "Number of days after the plan expires that the company may continue using the system while renewal payment is retried. `null` or `0` means no grace period.",
          },
          isActive: { type: "boolean" },
          isPublic: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "name",
          "billingType",
          "period",
          "priceCents",
          "currency",
          "isActive",
          "isPublic",
          "createdAt",
        ],
      },
      CompanyBalance: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          balanceCents: { type: "integer" },
          planId: { type: "string", format: "uuid" },
          planExpiresAt: { type: "string", format: "date-time" },
          minimumDepositCents: {
            type: "integer",
            nullable: true,
            description:
              "Smallest prepaid credit top-up accepted for the company's current plan. `null` when the company has no plan or the plan defines no floor.",
          },
        },
        required: ["id", "name", "balanceCents"],
      },
      CreditPurchaseRequest: {
        type: "object",
        properties: {
          amountCents: {
            type: "integer",
            minimum: 1,
            description:
              "Amount to top up. Must be at least the company's plan `minimumDepositCents` when the plan defines one.",
          },
          currency: { type: "string", default: "BRL" },
          provider: { type: "string", example: "stripe" },
          metadata: { type: "object" },
          paymentMethodId: {
            type: "string",
            format: "uuid",
            description:
              "Id of a stored payment method to charge off-session. When omitted the company's default method for the provider is used. When the company has no stored method, the customer is redirected to a hosted checkout instead.",
          },
          useCheckout: {
            type: "boolean",
            description:
              "Force the hosted checkout even when a stored payment method exists.",
          },
          customer: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              taxId: { type: "string" },
            },
            required: ["name"],
          },
        },
        required: ["amountCents", "provider"],
      },
      PaymentMethod: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          provider: { type: "string", example: "stripe" },
          type: {
            type: "string",
            enum: ["CARD", "PIX_AUTOMATIC_AUTHORIZATION"],
          },
          brand: { type: "string", nullable: true, example: "visa" },
          last4: { type: "string", nullable: true, example: "4242" },
          expMonth: { type: "integer", nullable: true },
          expYear: { type: "integer", nullable: true },
          holderName: { type: "string", nullable: true },
          isDefault: { type: "boolean" },
          status: { type: "string", enum: ["ACTIVE", "DETACHED"] },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "provider",
          "type",
          "isDefault",
          "status",
          "createdAt",
        ],
      },
      PaymentMethodSetupRequest: {
        type: "object",
        properties: {
          provider: { type: "string", example: "stripe" },
          type: {
            type: "string",
            enum: ["CARD", "PIX_AUTOMATIC_AUTHORIZATION"],
            default: "CARD",
            description:
              "Instrument type to store. Pix Automático is supported by Asaas and Efí.",
          },
          customer: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              taxId: {
                type: "string",
                description:
                  "CPF/CNPJ. Required by Asaas to create the customer that owns the card token or Pix Automático authorization. Also used by Efí as the Pix debtor.",
              },
            },
            required: ["name"],
          },
          pixAutomaticCycle: {
            type: "string",
            description:
              "Recurrence cycle for Pix Automático. Required when type is PIX_AUTOMATIC_AUTHORIZATION. Efí accepts SEMANAL, MENSAL, TRIMESTRAL, SEMESTRAL or ANUAL.",
          },
          pixAutomaticAmountCents: {
            type: "integer",
            description:
              "Value of the first QR Code for Pix Automático, in cents.",
          },
          pixAutomaticDescription: {
            type: "string",
            description:
              "Description shown to the payer on the Pix Automático authorization.",
          },
        },
        required: ["provider", "customer"],
      },
      PaymentMethodSetupResponse: {
        type: "object",
        properties: {
          provider: { type: "string" },
          providerCustomerId: { type: "string" },
          providerSetupId: { type: "string" },
          clientSecret: {
            type: "string",
            description:
              "Stripe SetupIntent client secret, to be confirmed by the front end with Stripe.js. Absent for providers that tokenize server-side.",
          },
          setupUrl: {
            type: "string",
            format: "uri",
            description:
              "Hosted page the customer must visit, when the provider uses one.",
          },
          qrCodePayload: {
            type: "string",
            description:
              "Pix Automático QR Code payload copied by the payer to authorize future debits.",
          },
          qrCodeImage: {
            type: "string",
            format: "byte",
            description: "Pix Automático QR Code image as a base64 data URI.",
          },
          status: {
            type: "string",
            enum: ["COMPLETED", "PENDING", "FAILED", "REFUNDED"],
          },
        },
        required: [
          "provider",
          "providerCustomerId",
          "providerSetupId",
          "status",
        ],
      },
      RegisterPaymentMethodRequest: {
        type: "object",
        properties: {
          provider: { type: "string", example: "stripe" },
          providerMethodId: {
            type: "string",
            description:
              "Gateway reference produced by the setup flow (Stripe `pm_...`, Asaas credit-card token or Asaas Pix Automático authorization id).",
          },
          providerCustomerId: { type: "string" },
          type: {
            type: "string",
            enum: ["CARD", "PIX_AUTOMATIC_AUTHORIZATION"],
            description:
              "Instrument type. Required for Asaas Pix Automático so the authorization can be validated.",
          },
          setDefault: { type: "boolean" },
          details: {
            type: "object",
            description:
              "Optional display details. The gateway is always asked for the authoritative values.",
            properties: {
              brand: { type: "string" },
              last4: { type: "string" },
              expMonth: { type: "integer" },
              expYear: { type: "integer" },
              holderName: { type: "string" },
            },
          },
        },
        required: ["provider", "providerMethodId"],
      },
      CreditPurchase: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          companyId: { type: "string", format: "uuid" },
          amountCents: { type: "integer" },
          currency: { type: "string" },
          provider: { type: "string" },
          providerTransactionId: { type: "string" },
          status: {
            type: "string",
            enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
          },
          metadata: { type: "object" },
          purchasedAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "companyId",
          "amountCents",
          "currency",
          "provider",
          "status",
          "purchasedAt",
          "createdAt",
        ],
      },
      PaymentProvidersResponse: {
        type: "object",
        properties: {
          providers: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["providers"],
      },
      Contact: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          externalId: { type: "string" },
          name: { type: "string" },
          metadata: { type: "object" },
          consentStatus: {
            type: "string",
            enum: ["PENDING", "GRANTED", "DENIED", "REVOKED"],
            description:
              "LGPD consent status. Consent is memorized per company: once GRANTED, it is reused by every conversation with the same company and the customer is not asked again.",
          },
          consentedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            description:
              "Timestamp of the first time the customer granted consent for this company. Null when consent was never granted.",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "externalId", "consentStatus"],
      },
      Conversation: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          token: { type: "string" },
          status: {
            type: "string",
            enum: ["ACTIVE", "CLOSED", "EXPIRED"],
          },
          keyStatus: {
            type: "string",
            enum: ["AWAITING_OPERATOR", "AWAITING_CUSTOMER", "ACTIVE"],
          },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "token", "status", "keyStatus", "createdAt"],
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          conversationId: { type: "string", format: "uuid" },
          senderType: {
            type: "string",
            enum: ["CONTACT", "COMPANY", "SYSTEM"],
          },
          content: { type: "string" },
          contentType: { type: "string" },
          contentEncrypted: { type: "boolean" },
          keyId: { type: "string", nullable: true },
          iv: { type: "string", nullable: true },
          authTag: { type: "string", nullable: true },
          encryptedKey: { type: "string", nullable: true },
          selfEncryptedKey: { type: "string", nullable: true },
          mediaId: { type: "string", format: "uuid", nullable: true },
          media: { $ref: "#/components/schemas/Media" },
          clientMessageId: {
            type: "string",
            nullable: true,
            description:
              "Client-generated idempotency key echoed back for contact-sent messages. Clients use it to reconcile the optimistic balloon they rendered with the server-assigned message.",
          },
          operatorUuid: {
            type: "string",
            nullable: true,
            description:
              "Identifier of the operator that sent this message (only present on COMPANY-sent messages).",
          },
          operator: { $ref: "#/components/schemas/Operator" },
          replyToId: {
            type: "string",
            format: "uuid",
            nullable: true,
            description:
              "Identifier of the message this one replies to or reacts to. Reactions are encrypted messages with contentType 'react' and the target message id here. Clients compute the current reaction per reactor from the latest matching react message.",
          },
          replyTo: {
            type: "object",
            nullable: true,
            description:
              "The replied-to message (one level deep), so clients can render a quote without an extra request. Null when the message is not a reply or the original was deleted.",
            allOf: [{ $ref: "#/components/schemas/Message" }],
          },
          attachments: {
            type: "string",
            nullable: true,
            description:
              "Encrypted JSON string containing rich message attachments (buttons, vcard, location). Only present on COMPANY-sent messages. The client decrypts and parses it to render interactive elements.",
          },
          sentAt: { type: "string", format: "date-time" },
          deliveredAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            description:
              "Timestamp when the recipient's device acknowledged receipt of the message. Null until delivered. Always set once `readAt` is set, since reading implies delivery.",
          },
          readAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            description:
              "Timestamp when the recipient read the message. Null until read.",
          },
        },
        required: [
          "id",
          "conversationId",
          "senderType",
          "content",
          "contentEncrypted",
          "sentAt",
        ],
      },
      Media: {
        type: "object",
        description:
          "Metadata of a media file attached to a message. The file bytes are stored encrypted in the object store; the envelope fields describe how to decrypt them. The backend never sees the plaintext.",
        properties: {
          id: { type: "string", format: "uuid" },
          companyId: { type: "string", format: "uuid" },
          conversationId: { type: "string", format: "uuid" },
          messageId: { type: "string", format: "uuid", nullable: true },
          mimeType: { type: "string" },
          fileName: { type: "string" },
          sizeBytes: { type: "integer" },
          storageClass: {
            type: "string",
            enum: ["TRANSIENT", "PERMANENT"],
            description:
              "Bucket the object lives in. `TRANSIENT` files are stored in the bucket whose lifecycle policy expires them after a period and are erased by the retention job. `PERMANENT` files are stored in the bucket that keeps them indefinitely and are preserved by the retention job.",
          },
          iv: { type: "string", nullable: true },
          authTag: { type: "string", nullable: true },
          encryptedKey: { type: "string", nullable: true },
          selfEncryptedKey: { type: "string", nullable: true },
          keyId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "companyId",
          "conversationId",
          "mimeType",
          "fileName",
          "sizeBytes",
          "storageClass",
          "createdAt",
        ],
      },
      CreateConversationRequest: {
        type: "object",
        properties: {
          contact: {
            type: "object",
            properties: {
              externalId: { type: "string" },
              name: { type: "string" },
              metadata: { type: "object" },
            },
            required: ["externalId"],
          },
          welcomeMessage: { type: "string" },
          operator: {
            type: "object",
            description:
              "Identity of the operator (desk/CRM agent) handling this conversation.",
            properties: {
              uuid: {
                type: "string",
                description:
                  "Stable identifier of the operator in the desk/CRM.",
              },
              name: { type: "string" },
              image: { type: "string", format: "uri" },
              gravatarHash: { type: "string" },
            },
          },
        },
        required: ["contact"],
      },
      CreateConversationResponse: {
        type: "object",
        properties: {
          conversation: { $ref: "#/components/schemas/Conversation" },
          contact: { $ref: "#/components/schemas/Contact" },
          deeplink: { type: "string", format: "uri" },
          company: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              customizations: {
                $ref: "#/components/schemas/CompanyCustomization",
              },
            },
            required: ["id", "name"],
          },
          operator: { $ref: "#/components/schemas/Operator" },
          operatorKeyId: {
            type: "string",
            nullable: true,
            description:
              "Identifier of the company encryption key used by this conversation.",
          },
          operatorPublicKey: { type: "string", nullable: true },
          customerPublicKey: { type: "string", nullable: true },
        },
        required: ["conversation", "contact", "deeplink", "company"],
      },
      RegisterCustomerKeyRequest: {
        type: "object",
        properties: {
          publicKey: {
            type: "string",
            description:
              "Base64 SPKI RSA public key generated by the customer's browser.",
          },
        },
        required: ["publicKey"],
      },
      KeyTransferKdf: {
        type: "object",
        description:
          "Key derivation parameters used to derive the key-encryption key from the PIN. Included so the receiving device can validate support before attempting decryption.",
        properties: {
          alg: { type: "string", enum: ["PBKDF2-SHA256"] },
          iterations: {
            type: "integer",
            minimum: 100000,
            maximum: 1000000,
          },
        },
        required: ["alg", "iterations"],
      },
      KeyTransferEnvelope: {
        type: "object",
        description:
          "Opaque encrypted keypair envelope. All binary fields are base64. The AES-GCM authentication tag is appended to the ciphertext.",
        properties: {
          ciphertext: {
            type: "string",
            maxLength: 8192,
            description:
              "Base64 AES-256-GCM ciphertext of the deflated keypair payload.",
          },
          iv: {
            type: "string",
            description: "Base64 AES-GCM initialization vector (12 bytes).",
          },
          salt: {
            type: "string",
            description: "Base64 PBKDF2 salt (16 bytes).",
          },
          kdf: { $ref: "#/components/schemas/KeyTransferKdf" },
        },
        required: ["ciphertext", "iv", "salt", "kdf"],
      },
      CreateKeyTransferRequest: {
        type: "object",
        description:
          "Encrypted keypair envelope plus the public key it contains, so the backend can later verify that the receiving device imported the same key.",
        properties: {
          ciphertext: {
            type: "string",
            maxLength: 8192,
            description:
              "Base64 AES-256-GCM ciphertext of the deflated keypair payload.",
          },
          iv: {
            type: "string",
            description: "Base64 AES-GCM initialization vector (12 bytes).",
          },
          salt: {
            type: "string",
            description: "Base64 PBKDF2 salt (16 bytes).",
          },
          kdf: { $ref: "#/components/schemas/KeyTransferKdf" },
          publicKeySpki: {
            type: "string",
            description:
              "Base64 SPKI RSA public key contained in the encrypted payload. Not secret; used to validate the confirmation.",
          },
        },
        required: ["ciphertext", "iv", "salt", "kdf", "publicKeySpki"],
      },
      CreateKeyTransferResponse: {
        type: "object",
        properties: {
          transferId: { type: "string", format: "uuid" },
          expiresAt: { type: "string", format: "date-time" },
        },
        required: ["transferId", "expiresAt"],
      },
      ConfirmKeyTransferRequest: {
        type: "object",
        properties: {
          publicKeySpki: {
            type: "string",
            description:
              "Base64 SPKI RSA public key that the receiving device actually stored. Must match the key that was uploaded.",
          },
        },
        required: ["publicKeySpki"],
      },
      KeyTransferStatusResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "RETRIEVED", "CONFIRMED", "EXPIRED"],
          },
        },
        required: ["status"],
      },
      ConversationKeysResponse: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
          keyStatus: {
            type: "string",
            enum: ["AWAITING_OPERATOR", "AWAITING_CUSTOMER", "ACTIVE"],
          },
          operatorPublicKey: { type: "string", nullable: true },
          operatorKeyId: {
            type: "string",
            nullable: true,
            description:
              "Identifier of the company encryption key used by this conversation. The operator uses it to locate the matching private key.",
          },
          customerPublicKey: { type: "string", nullable: true },
        },
        required: ["conversationId", "keyStatus"],
      },
      EraseConversationResponse: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
          deletedMessages: { type: "integer" },
        },
        required: ["conversationId", "deletedMessages"],
      },
      ListConversationsByCustomerKeyRequest: {
        type: "object",
        properties: {
          publicKey: {
            type: "string",
            description:
              "Base64 SPKI RSA public key registered by the customer's browser.",
          },
        },
        required: ["publicKey"],
      },
      CustomerConversation: {
        type: "object",
        properties: {
          conversation: { $ref: "#/components/schemas/Conversation" },
          contact: { $ref: "#/components/schemas/Contact" },
          company: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              customizations: {
                $ref: "#/components/schemas/CompanyCustomization",
              },
            },
            required: ["id", "name"],
          },
          operatorPublicKey: { type: "string", nullable: true },
          operatorKeyId: {
            type: "string",
            nullable: true,
            description:
              "Identifier of the company encryption key used by this conversation.",
          },
          customerPublicKey: { type: "string", nullable: true },
          operator: { $ref: "#/components/schemas/Operator" },
          lastOperator: {
            type: "object",
            nullable: true,
            description:
              "Identity of the operator that last replied to the customer. Falls back to the conversation's current operator when no company message has been sent yet. Used by the conversation list to show the agent that last interacted with the customer.",
            properties: {
              uuid: { type: "string", nullable: true },
              name: { type: "string", nullable: true },
              image: { type: "string", format: "uri", nullable: true },
              gravatarHash: { type: "string", nullable: true },
            },
          },
          unreadCount: { type: "integer" },
          lastMessageAt: { type: "string", format: "date-time" },
          lastMessageSenderType: {
            type: "string",
            nullable: true,
            enum: ["CONTACT", "COMPANY", null],
            description:
              "Sender type of the last message. Used by the client to decide whether to prefix the preview with the customer label.",
          },
        },
        required: ["conversation", "contact", "company", "unreadCount"],
      },
      CustomerConversationListResponse: {
        type: "object",
        properties: {
          conversations: {
            type: "array",
            items: { $ref: "#/components/schemas/CustomerConversation" },
          },
        },
        required: ["conversations"],
      },
      SendMessageRequest: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
          token: { type: "string" },
          content: {
            type: "string",
            minLength: 1,
            description:
              "Base64 AES-GCM ciphertext of the message content (end-to-end encrypted).",
          },
          contentType: {
            type: "string",
            default: "text",
            description:
              "MIME-like content type. Use 'react' for encrypted emoji reactions; the reaction target is replyToId.",
          },
          iv: {
            type: "string",
            description: "Base64 AES-GCM initialization vector.",
          },
          authTag: {
            type: "string",
            description: "Base64 AES-GCM authentication tag.",
          },
          encryptedKey: {
            type: "string",
            description:
              "Base64 per-message AES key wrapped to the recipient's RSA public key.",
          },
          selfEncryptedKey: {
            type: "string",
            description:
              "Base64 per-message AES key wrapped to the sender's own RSA public key, so the sender can read back its own message.",
          },
          keyId: {
            type: "string",
            description: "Identifier of the sender's public key.",
          },
          operatorUuid: {
            type: "string",
            description:
              "Identifier of the operator sending this message. When omitted, the conversation's current operator uuid is used.",
          },
          replyToId: {
            type: "string",
            format: "uuid",
            description:
              "Optional identifier of the message this one replies to or reacts to. Must belong to the same conversation. Reactions set contentType to 'react'.",
          },
          clientMessageId: {
            type: "string",
            maxLength: 128,
            description:
              "Optional client-generated idempotency key for contact-sent messages. The client renders an optimistic balloon before the request is answered and uses this id to reconcile it with the server-assigned message. Sending the same id twice returns the message created by the first attempt instead of creating a duplicate, which makes retries safe.",
          },
          attachments: {
            type: "string",
            description:
              "Encrypted JSON string containing rich message attachments (buttons, vcard, location). Only COMPANY-sent messages may include attachments. The client encrypts the JSON before sending; the backend stores it as-is.",
          },
        },
        required: [
          "content",
          "iv",
          "authTag",
          "encryptedKey",
          "selfEncryptedKey",
          "keyId",
        ],
      },
      UpdateConsentRequest: {
        type: "object",
        properties: {
          granted: { type: "boolean" },
        },
        required: ["granted"],
      },
      OriginalChannelMessageRequest: {
        type: "object",
        properties: {
          conversationId: { type: "string", format: "uuid" },
          content: { type: "string", minLength: 1 },
          iv: { type: "string" },
          authTag: { type: "string" },
          encryptedKey: { type: "string" },
          selfEncryptedKey: { type: "string" },
          keyId: { type: "string" },
          metadata: { type: "object" },
          replyToId: {
            type: "string",
            format: "uuid",
            description:
              "Optional identifier of the message this one replies to. Must belong to the same conversation.",
          },
        },
        required: ["conversationId", "content"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description:
          "Backwards-compatible alias for the readiness probe. Redirects to `/health/ready`.",
        operationId: "healthCheck",
        responses: {
          "307": {
            description: "Redirects to the readiness probe",
          },
        },
      },
    },
    "/health/live": {
      get: {
        tags: ["Health"],
        summary: "Liveness probe",
        description:
          "Reports whether the process is running. Never checks PostgreSQL or Valkey, so a dependency outage does not cause the orchestrator to restart healthy instances.",
        operationId: "healthLive",
        responses: {
          "200": {
            description: "Process is alive",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/health/ready": {
      get: {
        tags: ["Health"],
        summary: "Readiness probe",
        description:
          "Reports whether the instance can serve traffic. Checks PostgreSQL and Valkey with a short timeout and returns `503` when either dependency is unreachable, so the load balancer drains the instance.",
        operationId: "healthReady",
        responses: {
          "200": {
            description: "Instance is ready to serve traffic",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    checks: {
                      type: "object",
                      properties: {
                        database: { type: "boolean" },
                        valkey: { type: "boolean" },
                      },
                    },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "503": {
            description: "A dependency is unreachable",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "unavailable" },
                    checks: {
                      type: "object",
                      properties: {
                        database: { type: "boolean" },
                        valkey: { type: "boolean" },
                      },
                    },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/installation": {
      get: {
        tags: ["Installation"],
        summary: "Get installation configuration",
        description:
          "Returns instance-wide branding and legal configuration, including the service owner name and privacy terms URL shown to customers during consent.",
        operationId: "getInstallationConfig",
        responses: {
          "200": {
            description: "Installation configuration retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InstallationConfig",
                },
              },
            },
          },
        },
      },
    },
    "/companies/profile": {
      get: {
        tags: ["Companies"],
        summary: "Get company profile",
        description:
          "Returns the authenticated company profile and customization.",
        operationId: "getCompanyProfile",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Company profile retrieved successfully",
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/customization": {
      put: {
        tags: ["Companies"],
        summary: "Update company customization",
        description:
          "Updates the visual customization (white-label) for the authenticated company. Fields include brand name, rectangular logo, square icon, primary and background colors, favicon, welcome message and website URL.",
        operationId: "updateCompanyCustomization",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyCustomization" },
            },
          },
        },
        responses: {
          "200": {
            description: "Customization updated successfully",
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/branding": {
      post: {
        tags: ["Companies"],
        summary: "Upload company branding assets",
        description:
          "Uploads company branding assets (a square icon and/or a rectangular logo, typically SVG) as multipart/form-data. Each file is stored in the public branding bucket and the corresponding customization URL (squareIconUrl / rectangularLogoUrl) is updated. At least one of the two fields must be provided.",
        operationId: "uploadCompanyBranding",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  squareIcon: {
                    type: "string",
                    format: "binary",
                    description: "Square icon/logo file (SVG recommended).",
                  },
                  rectangularLogo: {
                    type: "string",
                    format: "binary",
                    description: "Rectangular logo file (SVG recommended).",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Branding assets uploaded and customization updated",
          },
          "400": {
            description: "No branding file provided or invalid file",
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/configuration": {
      put: {
        tags: ["Companies"],
        summary: "Update company configuration",
        description:
          "Updates company identity settings after registration and payment. Allows changing the company name, public website URL and unique handle. The handle is normalized to lowercase and can be referenced with the !! prefix on public links.",
        operationId: "updateCompanyConfiguration",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCompanyConfigurationRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Company configuration updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Company" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/companies/public/{handle}": {
      get: {
        tags: ["Companies"],
        summary: "Get public company profile",
        description:
          "Returns a public, unauthenticated view of an active company by its handle. The handle may be provided with or without the leading !! prefix. Includes the company's visual customization so it can be rendered on a public page.",
        operationId: "getPublicCompanyByHandle",
        parameters: [
          {
            name: "handle",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Company handle (with or without !! prefix).",
          },
        ],
        responses: {
          "200": {
            description: "Public company profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicCompany" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/companies/webhook": {
      put: {
        tags: ["Companies"],
        summary: "Update company webhook endpoint",
        description:
          "Sets or updates the webhook URL where ixblix delivers events (incoming messages, customer joined, conversation closed, presence metadata). When the URL changes or a secret rotation is requested, a fresh HMAC secret is generated and returned once.",
        operationId: "updateCompanyWebhook",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  webhookUrl: {
                    type: "string",
                    format: "uri",
                    nullable: true,
                    description:
                      "Webhook endpoint URL. Pass null to disable webhooks.",
                  },
                  rotateSecret: {
                    type: "boolean",
                    description:
                      "When true, generate a new HMAC secret for the current URL.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook endpoint updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    webhookUrl: {
                      type: "string",
                      format: "uri",
                      nullable: true,
                    },
                    webhookSecret: {
                      type: "string",
                      nullable: true,
                      description:
                        "HMAC secret used to verify webhook signatures. Only returned when created or rotated.",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/encryption-key": {
      put: {
        tags: ["Companies"],
        summary: "Register or rotate company encryption key",
        description:
          "Registers a new company-level RSA public key used for end-to-end encryption. The previous active key is retired (kept for decrypting existing conversations) and all new conversations snapshot the fresh key. The keyId must be unique within the company and is sent in message envelopes so the operator can locate the matching private key.",
        operationId: "registerCompanyEncryptionKey",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterCompanyEncryptionKeyRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Encryption key registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyEncryptionKey",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
      get: {
        tags: ["Companies"],
        summary: "Get company encryption key",
        description:
          "Returns the currently active company encryption key. Conversations created after this key was activated use it for end-to-end encryption.",
        operationId: "getCompanyEncryptionKey",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Encryption key retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyEncryptionKey",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/companies/register": {
      post: {
        tags: ["Companies"],
        summary: "Register a new company",
        description:
          "Creates a new company account without an API key. Returns payment information and a transaction id used to confirm payment and obtain the API key. Requires integrator authentication.",
        operationId: "registerCompany",
        security: [{ BasicAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterCompanyRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Company registered successfully, awaiting payment",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterCompanyResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/companies": {
      get: {
        tags: ["Companies"],
        summary: "List companies",
        description:
          "Returns all registered companies. Requires integrator authentication.",
        operationId: "listCompanies",
        security: [{ BasicAuth: [] }],
        responses: {
          "200": {
            description: "Companies listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Company" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/{id}/activate/{transactionId}": {
      post: {
        tags: ["Companies"],
        summary: "Activate company after payment",
        description:
          "Confirms payment for a pending company and returns the generated API key. This operation is idempotent: when the company is already active (for example a free plan settled during registration), the existing API key is returned instead of a conflict. Requires integrator authentication.",
        operationId: "activateCompany",
        security: [{ BasicAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Company activated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ActivateCompanyResponse",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "402": { $ref: "#/components/responses/PaymentRequired" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/companies/payment/{transactionId}": {
      get: {
        tags: ["Companies"],
        summary: "Get company registration payment details",
        description:
          "Returns payment details for a company registration transaction. Public endpoint - safe because the transactionId is a unique, unguessable identifier.",
        operationId: "getCompanyPayment",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Payment details returned",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyPaymentDetails",
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/companies/balance": {
      get: {
        tags: ["Companies"],
        summary: "Get company balance",
        description:
          "Returns the authenticated company credit balance and active plan.",
        operationId: "getCompanyBalance",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Balance retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CompanyBalance" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/plans": {
      get: {
        tags: ["Plans"],
        summary: "List plans",
        description:
          "Returns subscription plans available to the authenticated integrator. When the integrator's payment provider has a forced plan, only that plan is returned (even if it is private).",
        operationId: "listPublicPlans",
        security: [{ BasicAuth: [] }],
        responses: {
          "200": {
            description: "Plans listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Plan" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/credits/purchase": {
      post: {
        tags: ["Companies"],
        summary: "Purchase credits",
        description:
          "Purchases credits for the authenticated company using a payment provider.",
        operationId: "purchaseCredits",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreditPurchaseRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Credit purchase processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    purchase: { $ref: "#/components/schemas/CreditPurchase" },
                    result: {
                      type: "object",
                      properties: {
                        success: { type: "boolean" },
                        transactionId: { type: "string" },
                        provider: { type: "string" },
                        error: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "402": { $ref: "#/components/responses/PaymentRequired" },
        },
      },
    },
    "/companies/credits/purchases": {
      get: {
        tags: ["Companies"],
        summary: "List credit purchases",
        description:
          "Returns credit purchase history for the authenticated company.",
        operationId: "listCreditPurchases",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Credit purchases listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CreditPurchase" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/payment-methods/setup": {
      post: {
        tags: ["Companies"],
        summary: "Start storing a payment method",
        description:
          "Begins storing a card or Pix Automático authorization for later off-session charges. Stripe returns a SetupIntent client secret to be confirmed by the front end with Stripe.js; Asaas returns the customer id the card must be tokenized against; Efí returns the Pix Automático QR Code. The resulting reference is registered with POST /companies/payment-methods. ixblix never receives raw card data.",
        operationId: "startPaymentMethodSetup",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaymentMethodSetupRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Setup started",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaymentMethodSetupResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/payment-methods": {
      post: {
        tags: ["Companies"],
        summary: "Register a stored payment method",
        description:
          "Persists a payment method after the gateway setup completed. The gateway is queried for the authoritative card details, so a reference that does not exist or belongs to another customer is rejected. The first method registered becomes the default.",
        operationId: "registerPaymentMethod",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterPaymentMethodRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Payment method registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaymentMethod" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": {
            description: "The same card is already registered",
          },
        },
      },
      get: {
        tags: ["Companies"],
        summary: "List stored payment methods",
        description:
          "Returns the authenticated company's active payment methods, default first.",
        operationId: "listPaymentMethods",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Payment methods listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PaymentMethod" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/companies/payment-methods/{id}/default": {
      put: {
        tags: ["Companies"],
        summary: "Set the default payment method",
        description:
          "Marks a stored payment method as the company's default for off-session charges.",
        operationId: "setDefaultPaymentMethod",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Default payment method updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaymentMethod" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/companies/payment-methods/{id}": {
      delete: {
        tags: ["Companies"],
        summary: "Remove a stored payment method",
        description:
          "Detaches the payment method at the gateway and marks it as removed. When the removed method was the default, the most recently added remaining method is promoted.",
        operationId: "deletePaymentMethod",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Payment method removed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "502": {
            description: "The gateway refused to detach the payment method",
          },
        },
      },
    },
    "/companies/payment-change/options": {
      get: {
        tags: ["Companies"],
        summary: "Get payment change options",
        description:
          "Returns the available payment instruments for a company with a cancelled or expired plan, or for a company wanting to switch payment methods. Used when the company wants to re-subscribe or change payment method while the service is still running (before the next due date).",
        operationId: "getPaymentChangeOptions",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Payment change options retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaymentChangeOptionsResponse",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/companies/payment-change/start": {
      post: {
        tags: ["Companies"],
        summary: "Start payment change checkout",
        description:
          "Creates a new payment transaction for a company with a cancelled or expired plan, or for a company wanting to switch payment methods. The checkout flow is identical to initial registration: card verification charge + refund for trial, or Pix Automático authorization. The first payment is scheduled for the next due date or end of trial.",
        operationId: "startPaymentChange",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StartPaymentChangeRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Payment change checkout started successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StartPaymentChangeResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/payment/providers": {
      get: {
        tags: ["Payment"],
        summary: "List payment providers",
        description:
          "Returns the payment providers that are enabled and fully configured on this installation.",
        operationId: "listPaymentProviders",
        responses: {
          "200": {
            description: "Payment providers listed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaymentProvidersResponse",
                },
              },
            },
          },
        },
      },
    },
    "/payment/checkout/{transactionId}/options": {
      get: {
        tags: ["Payment"],
        summary: "Get checkout payment options",
        description:
          "Returns the payment instruments the ixblix-hosted checkout may offer for the plan behind a registration transaction. Pix Automático is only offered for plans billed by `PERIOD`, because the Banco Central regulates the periodicity of the charges. Public by design: the payer has no API key yet, and the `transactionId` is the capability that authorizes the operation.",
        operationId: "getCheckoutPaymentOptions",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Payment options returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckoutPaymentOptions" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/payment/checkout/{transactionId}/card": {
      post: {
        tags: ["Payment"],
        summary: "Pay a registration with a credit card",
        description:
          "Charges a card supplied on the ixblix-hosted checkout and activates the company. The gateway tokenizes the card in the same call, so the resulting token is stored as the company's payment method and later renewals and overage are billed off-session without asking for the card again. Rate limited per IP because it hits the gateway. Public by design: the payer has no API key yet.",
        operationId: "payCheckoutWithCard",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CheckoutCardPaymentRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Card charge processed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CheckoutCardPaymentResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/payment/checkout/{transactionId}/pix-automatic": {
      post: {
        tags: ["Payment"],
        summary: "Pay a registration with Pix Automático",
        description:
          "Starts a Pix Automático authorization for a periodic plan and returns the QR Code the payer scans. The first QR Code both collects the payer's consent for future debits and pays the first period, so its value is the plan price. The recurrence cycle is derived from the plan period and the retry policy allows three attempts inside the plan's grace window. Rejected with `PIX_AUTOMATIC_NOT_AVAILABLE` when the plan is not billed by period. Public by design: the payer has no API key yet.",
        operationId: "payCheckoutWithPixAutomatic",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CheckoutPixAutomaticPaymentRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Pix Automático authorization created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CheckoutPixAutomaticResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/payment/checkout/{transactionId}/status": {
      get: {
        tags: ["Payment"],
        summary: "Get checkout payment status",
        description:
          "Polls the gateway for the authoritative status of a registration payment and settles it when the gateway confirms. Used by the checkout while it waits for the webhook, so the payer is not left waiting when the callback is delayed. Settlement is idempotent, so polling and the webhook can race safely.",
        operationId: "getCheckoutPaymentStatus",
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Payment status returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckoutPaymentStatus" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/payment/webhooks/{provider}": {
      post: {
        tags: ["Payment"],
        summary: "Receive a payment provider webhook",
        description:
          "Callback endpoint invoked by the payment gateway. The payload is authenticated by the provider adapter (Stripe signature or Asaas shared token) and settles the matching company payment or credit purchase. Settlement is idempotent, so gateway retries are safe. Any query parameters are accepted without validation. This endpoint is not meant to be called by integrators.",
        operationId: "receivePaymentWebhook",
        parameters: [
          {
            name: "provider",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["stripe", "asaas", "efi"] },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          "200": {
            description: "Webhook processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    received: { type: "boolean" },
                    handled: { type: "boolean" },
                    kind: {
                      type: "string",
                      enum: ["company_payment", "credit_purchase", "none"],
                    },
                  },
                  required: ["received", "handled"],
                },
              },
            },
          },
          "202": {
            description: "Webhook acknowledged but not handled",
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/conversations": {
      post: {
        tags: ["Conversations"],
        summary: "Create overflow conversation",
        description:
          "Creates a new overflow conversation for a contact and returns a deeplink. The conversation uses the company's currently active encryption key; the customer can encrypt messages to it once they register their own public key.",
        operationId: "createConversation",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateConversationRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conversation created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateConversationResponse",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/conversations/by-key": {
      post: {
        tags: ["Conversations"],
        summary: "List customer conversations by public key",
        description:
          "Returns every conversation that has been registered with the customer's RSA public key. This lets a browser discover all chats linked to the same keypair, including independent links created by the same company for different topics or operators.",
        operationId: "listConversationsByCustomerKey",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ListConversationsByCustomerKeyRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Conversations listed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CustomerConversationListResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{token}": {
      get: {
        tags: ["Conversations"],
        summary: "Get conversation by token",
        description:
          "Returns a conversation and its messages using the deeplink token.",
        operationId: "getConversationByToken",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation retrieved successfully",
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{token}/close": {
      post: {
        tags: ["Conversations"],
        summary: "Close conversation",
        description: "Marks a conversation as closed.",
        operationId: "closeConversation",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation closed successfully",
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{token}/key": {
      post: {
        tags: ["Conversations"],
        summary: "Register customer public key",
        description:
          "Registers the customer's RSA public key for a conversation, establishing end-to-end encryption. The customer is authenticated by the deeplink token. Registering a new key replaces the previous one.",
        operationId: "registerCustomerKey",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterCustomerKeyRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Customer key registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    conversationId: { type: "string", format: "uuid" },
                    keyStatus: {
                      type: "string",
                      enum: [
                        "AWAITING_OPERATOR",
                        "AWAITING_CUSTOMER",
                        "ACTIVE",
                      ],
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/conversations/{token}/erase": {
      post: {
        tags: ["Conversations"],
        summary: "Erase conversation content",
        description:
          "Deletes all encrypted message content of a conversation (customer data-erasure request). The customer's public key is kept so the conversation can continue.",
        operationId: "eraseConversationContent",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation content erased successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/EraseConversationResponse",
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{ref}/presence": {
      post: {
        tags: ["Conversations"],
        summary: "Report presence",
        description:
          "Relays a presence/metadata event (typing, recording, stopped typing, or chat window closed). When authenticated with a company API key, `ref` is the conversation id and the event is relayed to the customer's chat app via Socket.io. When unauthenticated, `ref` is the customer's deeplink token and the event is relayed to the operator via webhook.",
        operationId: "reportPresence",
        parameters: [
          {
            name: "ref",
            in: "path",
            required: true,
            schema: { type: "string" },
            description:
              "Conversation id (company auth) or deeplink token (customer auth).",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["typing", "recording", "stopped", "chat_closed"],
                  },
                },
                required: ["type"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Presence event accepted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{conversationId}/keys": {
      get: {
        tags: ["Conversations"],
        summary: "Get conversation public keys",
        description:
          "Returns the operator and customer public keys of a conversation so the operator can encrypt messages to the customer.",
        operationId: "getConversationKeys",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "conversationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation keys retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ConversationKeysResponse",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/conversations/{conversationId}/operator": {
      put: {
        tags: ["Conversations"],
        summary: "Update conversation operator",
        description:
          "Updates the operator identity (uuid, name, image and/or gravatar hash) attached to a conversation. Only the provided fields are updated; omitted fields keep their current value. Pass `null` to clear a field. The operator can be updated at any moment during the conversation.",
        operationId: "updateConversationOperator",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "conversationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateOperatorRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Operator updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    operator: {
                      $ref: "#/components/schemas/Operator",
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/messages/company": {
      post: {
        tags: ["Messages"],
        summary: "Send company message",
        description:
          "Sends a message from the company to the contact. Supports both text messages (application/json) and media messages (multipart/form-data with file). For media messages, the `content` field becomes the encrypted caption.",
        operationId: "sendCompanyMessage",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/SendMessageRequest" },
                  { required: ["conversationId", "content"] },
                ],
              },
            },
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  conversationId: { type: "string", format: "uuid" },
                  content: {
                    type: "string",
                    description:
                      "Encrypted caption/description for media messages (base64 AES-GCM ciphertext).",
                  },
                  file: {
                    type: "string",
                    format: "binary",
                    description:
                      "The encrypted file bytes (for media messages).",
                  },
                  contentType: {
                    type: "string",
                    description:
                      "Message content type. Defaults to 'text'. For media, the backend infers from MIME type.",
                  },
                  contentIv: {
                    type: "string",
                    description:
                      "AES-GCM IV for the caption ciphertext (distinct from the media IV). Shares the same AES key as the media.",
                  },
                  contentAuthTag: {
                    type: "string",
                    description:
                      "AES-GCM auth tag for the caption ciphertext (distinct from the media auth tag).",
                  },
                  iv: {
                    type: "string",
                    description:
                      "AES-GCM IV for the media file ciphertext. Shares the same AES key as the caption.",
                  },
                  authTag: {
                    type: "string",
                    description:
                      "AES-GCM auth tag for the media file ciphertext.",
                  },
                  encryptedKey: {
                    type: "string",
                    description:
                      "RSA-OAEP-wrapped AES key (to the recipient). Shared by caption, media, and attachments.",
                  },
                  selfEncryptedKey: {
                    type: "string",
                    description:
                      "RSA-OAEP-wrapped AES key (to the sender, for self-read). Shared by caption, media, and attachments.",
                  },
                  keyId: { type: "string" },
                  operatorUuid: {
                    type: "string",
                    description:
                      "Identifier of the operator sending this message. When omitted, the conversation's current operator uuid is used.",
                  },
                  replyToId: {
                    type: "string",
                    format: "uuid",
                    description:
                      "Optional identifier of the message this message replies to. Must belong to the same conversation.",
                  },
                  attachments: {
                    type: "string",
                    description:
                      "Encrypted JSON string containing rich message attachments (buttons, vcard, location). Encrypted with the same AES key as caption and media.",
                  },
                  storageClass: {
                    type: "string",
                    enum: ["TRANSIENT", "PERMANENT"],
                    default: "TRANSIENT",
                    description:
                      "Destination bucket. `TRANSIENT` (default) stores the file in the bucket whose lifecycle policy expires objects after a period; the retention job erases it. `PERMANENT` stores it in the bucket that keeps it indefinitely and the retention job preserves it.",
                  },
                },
                required: [
                  "conversationId",
                  "file",
                  "iv",
                  "authTag",
                  "encryptedKey",
                  "selfEncryptedKey",
                  "keyId",
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message sent successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "413": {
            description: "File too large",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/messages/contact": {
      post: {
        tags: ["Messages"],
        summary: "Send contact message",
        description:
          "Sends a message from the contact using the deeplink token. Supports both text messages (application/json) and media messages (multipart/form-data with file). For media messages, the `content` field becomes the encrypted caption.",
        operationId: "sendContactMessage",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/SendMessageRequest" },
                  { required: ["token", "content"] },
                ],
              },
            },
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  content: {
                    type: "string",
                    description:
                      "Encrypted caption/description for media messages (base64 AES-GCM ciphertext).",
                  },
                  file: {
                    type: "string",
                    format: "binary",
                    description:
                      "The encrypted file bytes (for media messages).",
                  },
                  contentType: {
                    type: "string",
                    description:
                      "Message content type. Defaults to 'text'. For media, the backend infers from MIME type.",
                  },
                  contentIv: {
                    type: "string",
                    description:
                      "AES-GCM IV for the caption ciphertext (distinct from the media IV). Shares the same AES key as the media.",
                  },
                  contentAuthTag: {
                    type: "string",
                    description:
                      "AES-GCM auth tag for the caption ciphertext (distinct from the media auth tag).",
                  },
                  iv: {
                    type: "string",
                    description:
                      "AES-GCM IV for the media file ciphertext. Shares the same AES key as the caption.",
                  },
                  authTag: {
                    type: "string",
                    description:
                      "AES-GCM auth tag for the media file ciphertext.",
                  },
                  encryptedKey: {
                    type: "string",
                    description:
                      "RSA-OAEP-wrapped AES key (to the recipient). Shared by caption, media, and attachments.",
                  },
                  selfEncryptedKey: {
                    type: "string",
                    description:
                      "RSA-OAEP-wrapped AES key (to the sender, for self-read). Shared by caption, media, and attachments.",
                  },
                  keyId: { type: "string" },
                  replyToId: {
                    type: "string",
                    format: "uuid",
                    description:
                      "Optional identifier of the message this message replies to. Must belong to the same conversation.",
                  },
                  clientMessageId: {
                    type: "string",
                    description:
                      "Client-generated idempotency key. Sending the same id twice returns the message created by the first attempt instead of creating a duplicate.",
                  },
                  storageClass: {
                    type: "string",
                    enum: ["TRANSIENT", "PERMANENT"],
                    default: "TRANSIENT",
                    description:
                      "Destination bucket. `TRANSIENT` (default) stores the file in the bucket whose lifecycle policy expires objects after a period; the retention job erases it. `PERMANENT` stores it in the bucket that keeps it indefinitely and the retention job preserves it.",
                  },
                },
                required: [
                  "token",
                  "file",
                  "iv",
                  "authTag",
                  "encryptedKey",
                  "selfEncryptedKey",
                  "keyId",
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message sent successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
          "413": {
            description: "File too large",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/messages/company/delivered": {
      post: {
        tags: ["Messages"],
        summary: "Mark message delivered to company",
        description:
          "Marks a contact-sent message as delivered to the operator's device (the operator client received the message but has not read it yet). Emits a `message_delivered` Socket.io event to the customer's chat app so the customer sees the delivered receipt. Idempotent, and a no-op once the message is read.",
        operationId: "markCompanyMessageDelivered",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  conversationId: { type: "string", format: "uuid" },
                  messageId: { type: "string", format: "uuid" },
                },
                required: ["conversationId", "messageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message marked as delivered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messageId: { type: "string", format: "uuid" },
                    deliveredAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/messages/company/read": {
      post: {
        tags: ["Messages"],
        summary: "Mark message read by company",
        description:
          "Marks a contact-sent message as read by the operator. Emits a `message_read` Socket.io event to the customer's chat app so the customer sees the read receipt. Clients should only report a read when the chat window is focused and the message is visible in the viewport. Reading a message also records its delivery when it was not delivered yet.",
        operationId: "markCompanyMessageRead",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  conversationId: { type: "string", format: "uuid" },
                  messageId: { type: "string", format: "uuid" },
                },
                required: ["conversationId", "messageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messageId: { type: "string", format: "uuid" },
                    readAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/messages/contact/delivered": {
      post: {
        tags: ["Messages"],
        summary: "Mark message delivered to contact",
        description:
          "Marks a company-sent message as delivered to the customer's device (the customer client received the message but has not read it yet). Emits a `MESSAGE_DELIVERED` webhook to the operator so the desk/CRM knows the customer's device received the message. Idempotent, and a no-op once the message is read.",
        operationId: "markContactMessageDelivered",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  messageId: { type: "string", format: "uuid" },
                },
                required: ["token", "messageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message marked as delivered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messageId: { type: "string", format: "uuid" },
                    deliveredAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/messages/contact/read": {
      post: {
        tags: ["Messages"],
        summary: "Mark message read by contact",
        description:
          "Marks a company-sent message as read by the customer. Emits a `MESSAGE_READ` webhook to the operator so the desk/CRM knows the customer read the message. Clients should only report a read when the chat window is focused and the message is visible in the viewport. Reading a message also records its delivery when it was not delivered yet.",
        operationId: "markContactMessageRead",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                  messageId: { type: "string", format: "uuid" },
                },
                required: ["token", "messageId"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messageId: { type: "string", format: "uuid" },
                    readAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/messages/{conversationId}": {
      get: {
        tags: ["Messages"],
        summary: "List conversation messages",
        description: "Lists all messages from a conversation.",
        operationId: "listMessages",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "conversationId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Messages listed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Message" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/media/{mediaId}": {
      get: {
        tags: ["Media"],
        summary: "Get media metadata (company)",
        description:
          "Returns the metadata (envelope + file info) of a media file. Authenticated with the company API key.",
        operationId: "getCompanyMedia",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "mediaId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Media metadata retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Media" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/media/contact/{mediaId}": {
      get: {
        tags: ["Media"],
        summary: "Get media metadata (contact)",
        description:
          "Returns the metadata (envelope + file info) of a media file belonging to a conversation the contact can access via its deeplink token.",
        operationId: "getContactMedia",
        parameters: [
          {
            name: "mediaId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Media metadata retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Media" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/media/{mediaId}/content": {
      get: {
        tags: ["Media"],
        summary: "Download media content (company)",
        description:
          "Streams the raw (encrypted) bytes of a media file. The decryption envelope is returned in the X-Media-* response headers. Authenticated with the company API key.",
        operationId: "downloadCompanyMedia",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "mediaId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Encrypted media bytes",
            content: {
              "application/octet-stream": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/media/contact/{mediaId}/content": {
      get: {
        tags: ["Media"],
        summary: "Download media content (contact)",
        description:
          "Streams the raw (encrypted) bytes of a media file. The decryption envelope is returned in the X-Media-* response headers. Authenticated with the deeplink token.",
        operationId: "downloadContactMedia",
        parameters: [
          {
            name: "mediaId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Encrypted media bytes",
            content: {
              "application/octet-stream": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/contacts/{token}": {
      get: {
        tags: ["Contacts"],
        summary: "Get contact by conversation token",
        description:
          "Returns contact information associated with a conversation token.",
        operationId: "getContactByToken",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Contact retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Contact" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/contacts/{token}/consent": {
      post: {
        tags: ["Contacts"],
        summary: "Update contact consent",
        description:
          "Updates the LGPD consent status for the contact that owns the conversation. Consent is memorized per company: once granted, it is reused by every conversation with the same company and the customer is not asked again. The original grant timestamp is preserved on subsequent grants.",
        operationId: "updateContactConsent",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateConsentRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Consent updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Contact" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/webhooks/original-channel": {
      post: {
        tags: ["Webhooks"],
        summary: "Receive original channel message",
        description:
          "Webhook used by customer service systems to relay messages received through the original channel.",
        operationId: "receiveOriginalChannelMessage",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/OriginalChannelMessageRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message received successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/key-transfer": {
      post: {
        tags: ["Key Transfer"],
        summary: "Create key transfer",
        description:
          "Stores an encrypted keypair envelope so it can be retrieved by another device. The payload is encrypted on the source device with a PIN-derived key; the PIN is never sent to the server. Unauthenticated by design, because the source is the customer's web client, which holds no company API key.",
        operationId: "createKeyTransfer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateKeyTransferRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Transfer created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateKeyTransferResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/key-transfer/{transferId}": {
      get: {
        tags: ["Key Transfer"],
        summary: "Retrieve key transfer",
        description:
          "Returns the encrypted envelope of a transfer and transitions it to `RETRIEVED`. The payload can only be fetched once. Unknown, expired and already-retrieved ids all return the same `404` so the endpoint cannot be used to probe for valid ids.",
        operationId: "getKeyTransfer",
        parameters: [
          {
            name: "transferId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Transfer envelope",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/KeyTransferEnvelope" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
      delete: {
        tags: ["Key Transfer"],
        summary: "Delete key transfer",
        description:
          "Explicitly removes a transfer. Returns `204` whether or not the transfer existed.",
        operationId: "deleteKeyTransfer",
        parameters: [
          {
            name: "transferId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "204": { description: "Transfer removed" },
        },
      },
    },
    "/key-transfer/{transferId}/confirm": {
      post: {
        tags: ["Key Transfer"],
        summary: "Confirm key transfer",
        description:
          "Called by the receiving device after it has imported and stored the transferred key. The provided public key must match the key that was uploaded, so a mismatched import cannot be reported as success. Once confirmed, the ciphertext is dropped and only the status survives.",
        operationId: "confirmKeyTransfer",
        parameters: [
          {
            name: "transferId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ConfirmKeyTransferRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Transfer confirmed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/KeyTransferStatusResponse",
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "429": { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/key-transfer/{transferId}/status": {
      get: {
        tags: ["Key Transfer"],
        summary: "Get key transfer status",
        description:
          "Returns the current status of a transfer so the source device can learn that the receiving device succeeded. Unknown and expired ids both resolve to `EXPIRED`.",
        operationId: "getKeyTransferStatus",
        parameters: [
          {
            name: "transferId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Current transfer status",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/KeyTransferStatusResponse",
                },
              },
            },
          },
        },
      },
    },
    "/integrators/register": {
      post: {
        tags: ["Integrators"],
        summary: "Register a new integrator",
        description:
          'Registers a new integrator platform in three phases. Phase 1 accepts the registration payload. Phase 2 sends a challenge `{"challenge":"<hostname>"}` to the callback URL; the callback must respond with the exact registration payload from phase 1 to prove it controls the hostname. Phase 3 sends the credentials (`integratorId` and `accessToken`) to the same callback, which must echo them back. If any phase fails, returns 403 and the record is deleted. No credentials are returned in the HTTP response body. If the hostname is already registered and verified, use force=true to override.',
        operationId: "registerIntegrator",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterIntegratorRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Integrator registered and verified successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterIntegratorResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "403": {
            description:
              "Challenge or credentials verification failed. The callback URL did not return the original registration payload or did not echo the credentials payload correctly.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "409": {
            description:
              "Hostname already registered. Use force=true to override.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/integrators/profile": {
      get: {
        tags: ["Integrators"],
        summary: "Get integrator profile",
        description:
          "Returns the authenticated integrator's profile information.",
        operationId: "getIntegratorProfile",
        security: [{ BasicAuth: [] }],
        responses: {
          "200": {
            description: "Integrator profile retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/IntegratorProfile",
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
  },
} as unknown as OpenAPIV3.Document;

const specWithResponses = openApiSpec as unknown as Record<string, unknown>;
specWithResponses.components = {
  ...openApiSpec.components,
  responses: {
    Unauthorized: {
      description: "Unauthorized - API key is missing or invalid",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    BadRequest: {
      description: "Bad request - validation failed",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    NotFound: {
      description: "Resource not found",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    Conflict: {
      description: "Conflict - resource already exists",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    PaymentRequired: {
      description:
        "Payment required - insufficient balance or plan limits exceeded",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    TooManyRequests: {
      description: "Too many requests - rate limit or attempt limit exceeded",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
