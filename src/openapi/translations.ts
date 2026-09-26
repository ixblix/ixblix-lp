import type { OpenAPIV3 } from "openapi-types";

export type SupportedLanguage = "en" | "pt" | "es";

export const defaultLanguage: SupportedLanguage = "en";

export const supportedLanguages: SupportedLanguage[] = ["en", "pt", "es"];

export function resolveLanguage(input?: string): SupportedLanguage {
  if (!input) return defaultLanguage;
  const normalized = input.split("-")[0].toLowerCase() as SupportedLanguage;
  return supportedLanguages.includes(normalized) ? normalized : defaultLanguage;
}

export const apiMessages = {
  errors: {
    UNAUTHORIZED: "Chave de API inválida ou ausente.",
    FORBIDDEN: "Empresa não está ativa.",
    NOT_FOUND: "Recurso não encontrado.",
    VALIDATION_ERROR: "Dados enviados são inválidos.",
    INTERNAL_ERROR: "Erro interno do servidor.",
    CONVERSATION_CLOSED: "A conversa não está mais ativa.",
    COMPANY_KEY_MISSING:
      "A empresa ainda não registrou uma chave de criptografia.",
    MINIMUM_DEPOSIT_NOT_MET:
      "O valor informado é menor que o aporte mínimo do plano da empresa.",
    PLAN_EXPIRED:
      "O período do plano da empresa terminou. Renove ou atribua um novo plano para continuar.",
  },
};

interface TranslationStrings {
  info: {
    title: string;
    description: string;
  };
  tags: Record<string, string>;
  tagDescriptions: Record<string, string>;
  paths: Record<
    string,
    {
      summary?: string;
      description?: string;
    }
  >;
  schemas: Record<
    string,
    {
      description?: string;
    }
  >;
}

const translations: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    info: {
      title: "ixblix - Message Overflow API",
      description:
        "Independent commercial messaging overflow system. Allows customer service platforms to seamlessly transfer conversations from original channels (WhatsApp, Instagram, etc.) to a branded web/mobile experience.",
    },
    tags: {
      Health: "Health",
      Installation: "Installation",
      Companies: "Companies",
      Plans: "Plans",
      Payment: "Payment",
      Conversations: "Conversations",
      Messages: "Messages",
      Media: "Media",
      Contacts: "Contacts",
      Webhooks: "Webhooks",
      "Admin Plans": "Admin Plans",
      "Admin Payment Providers": "Admin Payment Providers",
      "Key Transfer": "Key Transfer",
      Integrators: "Integrators",
    },
    tagDescriptions: {
      Health: "Service health checks",
      Installation: "Instance-wide branding and legal configuration",
      Companies: "Company registration, billing and customization",
      Plans: "Public subscription plans",
      Payment: "Payment providers",
      "Admin Payment Providers": "Payment provider configuration",
      Conversations: "Overflow conversation management",
      Messages: "Send and list messages",
      Media: "Encrypted media file upload and download",
      Contacts: "Contact information and consent",
      Webhooks: "Original channel integration",
      "Admin Plans": "Subscription plan management",
      "Key Transfer":
        "Relay used to move the customer's end-to-end encryption keypair between devices",
      Integrators:
        "Third-party platform registration and authentication. Integrators use HTTP Basic Auth with integratorId:accessToken.",
    },
    paths: {
      "/installation": {
        summary: "Get installation configuration",
        description:
          "Returns instance-wide branding and legal configuration, including the service owner name and privacy terms URL shown to customers during consent.",
      },
      "/health": {
        summary: "Health check",
        description:
          "Backwards-compatible alias for the readiness probe. Redirects to `/health/ready`.",
      },
      "/health/live": {
        summary: "Liveness probe",
        description:
          "Reports whether the process is running. Never checks PostgreSQL or Valkey, so a dependency outage does not cause the orchestrator to restart healthy instances.",
      },
      "/health/ready": {
        summary: "Readiness probe",
        description:
          "Reports whether the instance can serve traffic. Checks PostgreSQL and Valkey with a short timeout and returns `503` when either dependency is unreachable, so the load balancer drains the instance.",
      },
      "/companies/encryption-key": {
        summary: "Register or rotate company encryption key",
        description:
          "Registers a new company-level RSA public key used for end-to-end encryption. The previous active key is retired so existing conversations keep working, and new conversations snapshot the fresh key.",
      },
      "/conversations": {
        summary: "Create overflow conversation",
        description:
          "Creates a new overflow conversation for a contact and returns a deeplink. The conversation uses the company's currently active encryption key.",
      },
      "/conversations/{conversationId}/operator": {
        summary: "Update conversation operator",
        description:
          "Updates the operator identity (uuid, name, image and/or gravatar hash) attached to a conversation. Only the provided fields are updated; omitted fields keep their current value. Pass `null` to clear a field. The operator can be updated at any moment during the conversation.",
      },
      "/key-transfer": {
        summary: "Create key transfer",
        description:
          "Stores an encrypted keypair envelope so it can be retrieved by another device. The payload is encrypted on the source device with a PIN-derived key; the PIN is never sent to the server. Unauthenticated by design, because the source is the customer's web client, which holds no company API key.",
      },
      "/key-transfer/{transferId}": {
        summary: "Retrieve or delete key transfer",
        description:
          "`GET` returns the encrypted envelope and transitions the transfer to `RETRIEVED`; the payload can only be fetched once. Unknown, expired and already-retrieved ids all return the same `404`. `DELETE` explicitly removes a transfer and returns `204` whether or not it existed.",
      },
      "/key-transfer/{transferId}/confirm": {
        summary: "Confirm key transfer",
        description:
          "Called by the receiving device after it has imported and stored the transferred key. The provided public key must match the key that was uploaded, so a mismatched import cannot be reported as success. Once confirmed, the ciphertext is dropped and only the status survives.",
      },
      "/key-transfer/{transferId}/status": {
        summary: "Get key transfer status",
        description:
          "Returns the current status of a transfer so the source device can learn that the receiving device succeeded. Unknown and expired ids both resolve to `EXPIRED`.",
      },
      "/payment/checkout/{transactionId}/options": {
        summary: "Get checkout payment options",
        description:
          "Returns the payment instruments the ixblix-hosted checkout may offer for the plan behind a registration transaction. Pix Automático is only offered for plans billed by `PERIOD`, because the Banco Central regulates the periodicity of the charges.",
      },
      "/payment/checkout/{transactionId}/card": {
        summary: "Pay a registration with a credit card",
        description:
          "Charges a card supplied on the ixblix-hosted checkout and activates the company. The gateway tokenizes the card in the same call, so the resulting token is stored as the company's payment method and later renewals and overage are billed off-session without asking for the card again.",
      },
      "/payment/checkout/{transactionId}/pix-automatic": {
        summary: "Pay a registration with Pix Automático",
        description:
          "Starts a Pix Automático authorization for a periodic plan and returns the QR Code the payer scans. The first QR Code both collects the payer's consent for future debits and pays the first period, so its value is the plan price. The recurrence cycle is derived from the plan period and the retry policy allows three attempts inside the plan's grace window.",
      },
      "/payment/checkout/{transactionId}/status": {
        summary: "Get checkout payment status",
        description:
          "Polls the gateway for the authoritative status of a registration payment and settles it when the gateway confirms. Used by the checkout while it waits for the webhook, so the payer is not left waiting when the callback is delayed.",
      },
      "/integrators/register": {
        summary: "Register a new integrator",
        description:
          "Registers a new integrator platform in three phases: challenge the callback URL with the hostname, require the callback to return the original registration payload, then deliver the credentials and require the callback to echo them back.",
      },
    },
    schemas: {
      RegisterIntegratorRequest: {
        description:
          "Payload used to register a new integrator platform. The callback URL must be able to receive the challenge and credentials callbacks.",
      },
      RegisterIntegratorResponse: {
        description: "Result of a successful integrator registration.",
      },
      IntegratorChallenge: {
        description:
          "Challenge object sent to the integrator callback. The callback must respond with the exact registration payload originally sent by the client.",
      },
      CheckoutProviderPublic: {
        description:
          "Public provider data required by frontend SDKs to tokenize or authorize payments. For Efí it contains the payee code and environment needed by the browser library.",
      },
      CheckoutPaymentOptions: {
        description:
          "Payment instruments the ixblix-hosted checkout may offer for the plan behind a registration transaction. Pix Automático is restricted to periodic plans because the Banco Central regulates the periodicity of the charges.",
      },
      CheckoutCardPaymentRequest: {
        description:
          "Card data collected on the ixblix-hosted checkout. The gateway tokenizes the card in the same call, so the resulting token can be reused for off-session charges. The holder address is pre-filled from the postal code through ViaCEP, but every field stays editable.",
      },
      CheckoutCardPaymentResponse: {
        description:
          "Result of a card charge made on the ixblix-hosted checkout. `COMPLETED` means the company was activated; `PENDING` means the charge was accepted but not yet settled.",
      },
      CheckoutPixAutomaticPaymentRequest: {
        description:
          "Payer identity collected for Pix Automático. Asaas requires a CPF/CNPJ to create the customer before the authorization can be created.",
      },
      CheckoutPixAutomaticResponse: {
        description:
          "Pix Automático authorization created for a periodic plan, including the QR Code the payer scans to authorize future debits and pay the first period.",
      },
      CheckoutPaymentStatus: {
        description:
          "Authoritative status of a registration payment, as reported by the gateway.",
      },
      InstallationConfig: {
        description:
          "Instance-wide branding and legal configuration exposed to customers during the consent flow.",
      },
      CompanyCustomization: {
        description:
          "Visual white-label customization of a company, including brand name, logos, primary color, favicon, website URL and welcome message.",
      },
      CompanyEncryptionKey: {
        description:
          "Versioned RSA public key registered by a company for end-to-end encryption. Only one key is active at a time; retired keys are kept so existing conversations remain decryptable.",
      },
      RegisterCompanyEncryptionKeyRequest: {
        description:
          "Payload to register or rotate a company encryption key. The keyId must be unique within the company.",
      },
      Operator: {
        description:
          "Identity of the desk/CRM agent (operator) handling a conversation. The operator can be attached when the conversation is created and updated at any time via the company API. It is also embedded in every COMPANY-sent message so clients can render the sender avatar per message.",
      },
      CustomerConversation: {
        description:
          "A conversation linked to the customer's keypair, including the company branding, the operator identity and the agent that last replied.",
      },
      Media: {
        description:
          "Metadata of a media file attached to a message. The file bytes are stored encrypted in the object store; the envelope fields describe how to decrypt them. The backend never sees the plaintext. `storageClass` selects the bucket: `TRANSIENT` files may be expired by the bucket lifecycle policy and are erased by the retention job, while `PERMANENT` files are kept indefinitely.",
      },
      KeyTransferEnvelope: {
        description:
          "Opaque encrypted keypair envelope. All binary fields are base64. The AES-GCM authentication tag is appended to the ciphertext.",
      },
      CreateKeyTransferRequest: {
        description:
          "Encrypted keypair envelope plus the public key it contains, so the backend can later verify that the receiving device imported the same key.",
      },
      CreateKeyTransferResponse: {
        description: "Identifier and expiry of a newly created key transfer.",
      },
      ConfirmKeyTransferRequest: {
        description:
          "Public key that the receiving device actually stored. Must match the key that was uploaded.",
      },
      KeyTransferStatusResponse: {
        description:
          "Current status of a key transfer: `PENDING`, `RETRIEVED`, `CONFIRMED` or `EXPIRED`.",
      },
      KeyTransferKdf: {
        description:
          "Key derivation parameters used to derive the key-encryption key from the PIN. Included so the receiving device can validate support before attempting decryption.",
      },
    },
  },
  pt: {
    info: {
      title: "ixblix - API de Transbordo de Mensagens",
      description:
        "Sistema independente de transbordo de mensagens comerciais. Permite que plataformas de atendimento transfiram conversas de canais originais (WhatsApp, Instagram, etc.) para uma experiência web/mobile personalizada.",
    },
    tags: {
      Health: "Health",
      Installation: "Instalação",
      Companies: "Companies",
      Conversations: "Conversations",
      Messages: "Messages",
      Media: "Media",
      Contacts: "Contacts",
      Webhooks: "Webhooks",
      "Admin Plans": "Planos Admin",
      "Admin Payment Providers": "Provedores de Pagamento Admin",
      "Key Transfer": "Transferência de Chave",
      Integrators: "Integradores",
    },
    tagDescriptions: {
      Health: "Verificação de saúde do serviço",
      Installation: "Configuração de marca e termos legais da instalação",
      Companies: "Perfil e personalização da empresa",
      Conversations: "Gerenciamento de conversas de transbordo",
      Messages: "Envio e listagem de mensagens",
      Media: "Upload e download de arquivos de mídia criptografados",
      Contacts: "Informações do contato e consentimento",
      Webhooks: "Integração com o canal original",
      "Admin Plans": "Gerenciamento de planos de assinatura",
      "Admin Payment Providers": "Configuração dos provedores de pagamento",
      "Key Transfer":
        "Relay usado para mover o par de chaves de criptografia de ponta a ponta do cliente entre dispositivos",
      Integrators:
        "Registro e autenticação de plataformas de terceiros. Integradores usam HTTP Basic Auth com integratorId:accessToken.",
    },
    paths: {
      "/installation": {
        summary: "Obter configuração da instalação",
        description:
          "Retorna a configuração de marca e termos legais da instalação, incluindo o nome do proprietário do serviço e a URL dos termos de privacidade exibidos ao cliente durante o consentimento.",
      },
      "/health": {
        summary: "Verificação de saúde",
        description:
          "Alias retrocompatível do probe de prontidão. Redireciona para `/health/ready`.",
      },
      "/health/live": {
        summary: "Probe de vivacidade",
        description:
          "Informa se o processo está em execução. Nunca verifica PostgreSQL ou Valkey, para que uma indisponibilidade de dependência não faça o orquestrador reiniciar instâncias saudáveis.",
      },
      "/health/ready": {
        summary: "Probe de prontidão",
        description:
          "Informa se a instância pode receber tráfego. Verifica PostgreSQL e Valkey com timeout curto e retorna `503` quando alguma dependência está inacessível, para que o balanceador remova a instância.",
      },
      "/companies/profile": {
        summary: "Obter perfil da empresa",
        description:
          "Retorna o perfil e a personalização da empresa autenticada.",
      },
      "/companies/customization": {
        summary: "Atualizar personalização da empresa",
        description:
          "Atualiza a personalização visual (white-label) da empresa autenticada. Inclui nome da marca, logo retangular, ícone quadrado, cor primária, favicon, mensagem de boas-vindas e endereço do site.",
      },
      "/companies/branding": {
        summary: "Enviar ativos de marca da empresa",
        description:
          "Envia ativos de marca da empresa (um ícone quadrado e/ou um logo retangular, normalmente SVG) como multipart/form-data. Cada arquivo é armazenado no bucket público de marca e a URL de personalização correspondente (squareIconUrl / rectangularLogoUrl) é atualizada. Pelo menos um dos dois campos deve ser fornecido.",
      },
      "/companies/configuration": {
        summary: "Atualizar configuração da empresa",
        description:
          "Atualiza as configurações de identidade da empresa após o registro e pagamento. Permite alterar o nome da empresa, URL pública do site e identificador único (handle). O handle é normalizado para minúsculas e pode ser referenciado com o prefixo !! em links públicos.",
      },
      "/companies/public/{handle}": {
        summary: "Obter perfil público da empresa",
        description:
          "Retorna uma visão pública e não autenticada de uma empresa ativa pelo seu handle. O handle pode ser fornecido com ou sem o prefixo !! inicial. Inclui a personalização visual da empresa para renderização em uma página pública.",
      },
      "/companies/webhook": {
        summary: "Atualizar endpoint de webhook da empresa",
        description:
          "Define ou atualiza a URL de webhook onde a ixblix entrega eventos (mensagens recebidas, cliente conectado, conversa encerrada, metadados de presença). Quando a URL muda ou uma rotação de segredo é solicitada, um novo segredo HMAC é gerado e retornado uma única vez.",
      },
      "/companies/encryption-key": {
        summary: "Registrar ou rotacionar chave de criptografia da empresa",
        description:
          "Registra uma nova chave pública RSA no nível da empresa para criptografia de ponta a ponta. A chave ativa anterior é aposentada para que conversas existentes continuem funcionando, e novas conversas utilizam a nova chave ativa.",
      },
      "/companies/register": {
        summary: "Registrar nova empresa",
        description:
          "Cria uma nova conta de empresa sem chave de API. Retorna informações de pagamento e um id de transação usado para confirmar o pagamento e obter a chave de API.",
      },
      "/companies": {
        summary: "Listar empresas",
        description: "Retorna todas as empresas registradas.",
      },
      "/companies/{id}/activate/{transactionId}": {
        summary: "Ativar empresa após pagamento",
        description:
          "Confirma o pagamento de uma empresa pendente e retorna a chave de API gerada. A operação é idempotente: quando a empresa já está ativa (por exemplo, um plano gratuito liquidado no registro), a chave de API existente é retornada em vez de um conflito.",
      },
      "/companies/payment/{transactionId}": {
        summary: "Obter detalhes do pagamento de registro",
        description:
          "Endpoint público usado pela página de checkout hospedada na ixblix para renderizar um resumo de pagamento com a marca da empresa.",
      },
      "/companies/balance": {
        summary: "Obter saldo da empresa",
        description:
          "Retorna o saldo de créditos e o plano ativo da empresa autenticada.",
      },
      "/companies/credits/purchase": {
        summary: "Comprar créditos",
        description:
          "Compra créditos para a empresa autenticada usando um provedor de pagamento.",
      },
      "/companies/credits/purchases": {
        summary: "Listar compras de crédito",
        description:
          "Retorna o histórico de compras de crédito da empresa autenticada.",
      },
      "/companies/payment-methods/setup": {
        summary: "Iniciar o armazenamento de um método de pagamento",
        description:
          "Inicia o armazenamento de um cartão ou de uma autorização de Pix Automático para cobranças off-session futuras. O Stripe retorna um client secret de SetupIntent que deve ser confirmado pelo front-end com o Stripe.js; o Asaas retorna o id do cliente contra o qual o cartão deve ser tokenizado; a Efí retorna o QR Code do Pix Automático. A referência resultante é registrada em POST /companies/payment-methods. O ixblix nunca recebe os dados brutos do cartão.",
      },
      "/companies/payment-methods": {
        summary: "Registrar um método de pagamento armazenado",
        description:
          "Persiste um método de pagamento após a conclusão da configuração no gateway. Os dados autoritativos do cartão são consultados no gateway, portanto uma referência inexistente ou pertencente a outro cliente é rejeitada. O primeiro método registrado torna-se o padrão.",
      },
      "/companies/payment-methods/{id}/default": {
        summary: "Definir o método de pagamento padrão",
        description:
          "Marca um método de pagamento armazenado como padrão da empresa para cobranças off-session.",
      },
      "/companies/payment-methods/{id}": {
        summary: "Remover um método de pagamento armazenado",
        description:
          "Desvincula o método de pagamento no gateway e o marca como removido. Quando o método removido era o padrão, o método restante mais recente é promovido.",
      },
      "/companies/payment-change/options": {
        summary: "Obter opções de troca de pagamento",
        description:
          "Retorna os instrumentos de pagamento disponíveis para uma empresa com plano cancelado ou expirado, ou para uma empresa que deseja trocar o método de pagamento. Usado quando a empresa deseja reassinar ou trocar o método de pagamento enquanto o serviço ainda está ativo (antes da próxima data de vencimento).",
      },
      "/companies/payment-change/start": {
        summary: "Iniciar checkout de troca de pagamento",
        description:
          "Cria uma nova transação de pagamento para uma empresa com plano cancelado ou expirado, ou para uma empresa que deseja trocar o método de pagamento. O fluxo de checkout é idêntico ao registro inicial: cobrança de verificação de cartão + reembolso para teste, ou autorização de Pix Automático. O primeiro pagamento é agendado para a próxima data de vencimento ou fim do período de teste.",
      },
      "/payment/providers": {
        summary: "Listar provedores de pagamento",
        description:
          "Retorna os provedores de pagamento habilitados e totalmente configurados nesta instalação.",
      },
      "/payment/webhooks/{provider}": {
        summary: "Receber webhook do provedor de pagamento",
        description:
          "Endpoint de callback chamado pelo gateway de pagamento. O payload é autenticado pelo adaptador do provedor (assinatura do Stripe ou token compartilhado do Asaas) e liquida a cobrança de empresa ou a compra de crédito correspondente. A liquidação é idempotente, portanto reenvios do gateway são seguros. Este endpoint não deve ser chamado por integradores.",
      },
      "/conversations": {
        summary: "Criar conversa de transbordo",
        description:
          "Cria uma nova conversa de transbordo para um contato e retorna um deeplink. A conversa utiliza a chave de criptografia ativa da empresa.",
      },
      "/conversations/by-key": {
        summary: "Listar conversas do cliente por chave pública",
        description:
          "Retorna todas as conversas registradas com a chave pública RSA do cliente. Permite que um navegador descubra todos os chats vinculados ao mesmo par de chaves, incluindo links independentes criados pela mesma empresa para diferentes tópicos ou atendentes.",
      },
      "/conversations/{token}": {
        summary: "Obter conversa pelo token",
        description:
          "Retorna uma conversa e suas mensagens usando o token do deeplink.",
      },
      "/conversations/{token}/close": {
        summary: "Encerrar conversa",
        description: "Marca uma conversa como encerrada.",
      },
      "/conversations/{token}/key": {
        summary: "Registrar chave pública do cliente",
        description:
          "Registra a chave pública RSA do cliente para uma conversa, estabelecendo a criptografia de ponta a ponta. O cliente é autenticado pelo token do deeplink.",
      },
      "/conversations/{token}/erase": {
        summary: "Apagar conteúdo da conversa",
        description:
          "Exclui todo o conteúdo criptografado das mensagens de uma conversa (solicitação de exclusão de dados do cliente). A chave pública do cliente é mantida para que a conversa possa continuar.",
      },
      "/conversations/{ref}/presence": {
        summary: "Reportar presença",
        description:
          "Repassa um evento de presença/metadados (digitando, parou de digitar, gravando ou janela de chat fechada). Quando autenticado com a chave de API da empresa, `ref` é o id da conversa e o evento é repassado ao chat do cliente via Socket.io. Quando não autenticado, `ref` é o token de deeplink do cliente e o evento é repassado ao operador via webhook.",
      },
      "/conversations/{conversationId}/keys": {
        summary: "Obter chaves públicas da conversa",
        description:
          "Retorna as chaves públicas do operador e do cliente de uma conversa para que o operador possa criptografar mensagens para o cliente.",
      },
      "/conversations/{conversationId}/operator": {
        summary: "Atualizar operador da conversa",
        description:
          "Atualiza a identidade do operador (uuid, nome, imagem e/ou hash do gravatar) associada a uma conversa. Apenas os campos fornecidos são atualizados; campos omitidos mantêm o valor atual. Passe `null` para limpar um campo. O operador pode ser atualizado a qualquer momento durante a conversa.",
      },
      "/messages/company": {
        summary: "Enviar mensagem da empresa",
        description: "Envia uma mensagem da empresa para o contato.",
      },
      "/messages/company/delivered": {
        summary: "Marcar mensagem como entregue à empresa",
        description:
          "Marca uma mensagem enviada pelo contato como entregue ao dispositivo do operador (o cliente do operador recebeu a mensagem, mas ainda não a leu). Emite um evento `message_delivered` via Socket.io para o chat do cliente para que ele veja o recibo de entrega. Idempotente e sem efeito quando a mensagem já foi lida.",
      },
      "/messages/company/read": {
        summary: "Marcar mensagem como lida pela empresa",
        description:
          "Marca uma mensagem enviada pelo contato como lida pelo operador. Emite um evento `message_read` via Socket.io para o chat do cliente para que ele veja o recibo de leitura. Os clientes só devem reportar leitura quando a janela do chat estiver em foco e a mensagem estiver visível na viewport. Marcar como lida também registra a entrega quando ela ainda não ocorreu.",
      },
      "/messages/contact": {
        summary: "Enviar mensagem do contato",
        description:
          "Envia uma mensagem do contato usando o token do deeplink.",
      },
      "/messages/contact/delivered": {
        summary: "Marcar mensagem como entregue ao contato",
        description:
          "Marca uma mensagem enviada pela empresa como entregue ao dispositivo do cliente (o cliente recebeu a mensagem, mas ainda não a leu). Emite um webhook `MESSAGE_DELIVERED` ao operador para que o sistema de atendimento saiba que o dispositivo do cliente recebeu a mensagem. Idempotente e sem efeito quando a mensagem já foi lida.",
      },
      "/messages/contact/read": {
        summary: "Marcar mensagem como lida pelo contato",
        description:
          "Marca uma mensagem enviada pela empresa como lida pelo cliente. Emite um webhook `MESSAGE_READ` ao operador para que o sistema de atendimento saiba que o cliente leu a mensagem. Os clientes só devem reportar leitura quando a janela do chat estiver em foco e a mensagem estiver visível na viewport. Marcar como lida também registra a entrega quando ela ainda não ocorreu.",
      },
      "/messages/{conversationId}": {
        summary: "Listar mensagens da conversa",
        description:
          "Lista todas as mensagens de uma conversa, incluindo a mensagem respondida (um nível). Reações são mensagens criptografadas com contentType 'react' e replyToId apontando para a mensagem alvo; o cliente calcula o conjunto atual de reações a partir da lista.",
      },
      "/contacts/{token}": {
        summary: "Obter contato pelo token da conversa",
        description:
          "Retorna as informações do contato associadas ao token da conversa.",
      },
      "/contacts/{token}/consent": {
        summary: "Atualizar consentimento do contato",
        description:
          "Atualiza o status de consentimento LGPD do contato da conversa. O consentimento é memorizado por empresa: uma vez concedido, é reutilizado por todas as conversas com a mesma empresa e o cliente não é questionado novamente. O carimbo de data/hora da primeira concessão é preservado nas concessões seguintes.",
      },
      "/webhooks/original-channel": {
        summary: "Receber mensagem do canal original",
        description:
          "Webhook usado por sistemas de atendimento para repassar mensagens recebidas pelo canal original.",
      },
      "/admin/companies/{id}/plan": {
        summary: "Atribuir plano à empresa",
        description:
          "Atribui ou remove um plano de assinatura para uma empresa.",
      },
      "/admin/companies/{id}/customization": {
        summary: "Atualizar personalização da empresa",
        description:
          "Atualiza a personalização white-label de uma empresa. Requer papel SUPER_ADMIN ou ADMIN.",
      },
      "/admin/plans": {
        summary: "Listar planos",
        description: "Retorna todos os planos de assinatura.",
      },
      "/admin/plans/{id}": {
        summary: "Obter plano por ID",
        description: "Retorna um único plano de assinatura.",
      },
      "/plans": {
        summary: "Listar planos",
        description:
          "Retorna os planos de assinatura disponíveis para o integrador autenticado. Quando o provedor de pagamento do integrador possui um plano forçado, apenas esse plano é retornado (mesmo que seja privado).",
      },
      "/key-transfer": {
        summary: "Criar transferência de chave",
        description:
          "Armazena um envelope criptografado do par de chaves para que ele possa ser recuperado por outro dispositivo. O payload é criptografado no dispositivo de origem com uma chave derivada do PIN; o PIN nunca é enviado ao servidor. Sem autenticação por definição, pois a origem é o cliente web do cliente final, que não possui chave de API da empresa.",
      },
      "/key-transfer/{transferId}": {
        summary: "Recuperar ou excluir transferência de chave",
        description:
          "O `GET` retorna o envelope criptografado e transiciona a transferência para `RETRIEVED`; o payload só pode ser obtido uma vez. Ids desconhecidos, expirados e já recuperados retornam o mesmo `404`. O `DELETE` remove explicitamente uma transferência e retorna `204` independentemente de ela existir.",
      },
      "/key-transfer/{transferId}/confirm": {
        summary: "Confirmar transferência de chave",
        description:
          "Chamado pelo dispositivo de destino após importar e armazenar a chave transferida. A chave pública informada deve corresponder à chave enviada, para que uma importação divergente não seja reportada como sucesso. Após a confirmação, o texto cifrado é descartado e apenas o status permanece.",
      },
      "/key-transfer/{transferId}/status": {
        summary: "Obter status da transferência de chave",
        description:
          "Retorna o status atual de uma transferência para que o dispositivo de origem saiba que o dispositivo de destino concluiu. Ids desconhecidos e expirados resultam em `EXPIRED`.",
      },
      "/payment/checkout/{transactionId}/options": {
        summary: "Obter opções de pagamento do checkout",
        description:
          "Retorna os instrumentos de pagamento que o checkout hospedado na ixblix pode oferecer para o plano da transação de registro. O Pix Automático só é oferecido para planos cobrados por `PERIOD`, pois o Banco Central regula a periodicidade das cobranças.",
      },
      "/payment/checkout/{transactionId}/card": {
        summary: "Pagar um registro com cartão de crédito",
        description:
          "Cobra um cartão informado no checkout hospedado na ixblix e ativa a empresa. O gateway tokeniza o cartão na mesma chamada, portanto o token resultante é armazenado como método de pagamento da empresa e as renovações e excedentes passam a ser cobrados off-session sem pedir o cartão novamente.",
      },
      "/payment/checkout/{transactionId}/pix-automatic": {
        summary: "Pagar um registro com Pix Automático",
        description:
          "Inicia uma autorização de Pix Automático para um plano periódico e retorna o QR Code que o pagador deve ler. O primeiro QR Code coleta o consentimento do pagador para débitos futuros e paga o primeiro período, portanto seu valor é o preço do plano. A periodicidade é derivada do período do plano e a política de retentativa permite três tentativas dentro do período de carência.",
      },
      "/payment/checkout/{transactionId}/status": {
        summary: "Obter status do pagamento do checkout",
        description:
          "Consulta o gateway para obter o status autoritativo de um pagamento de registro e o liquida quando o gateway confirma. Usado pelo checkout enquanto aguarda o webhook, para que o pagador não fique esperando quando o callback atrasa.",
      },
      "/integrators/register": {
        summary: "Registrar novo integrador",
        description:
          "Registra uma nova plataforma integradora em três fases: envia o hostname como desafio para a URL de callback, exige que o callback retorne o payload de registro original e, então, entrega as credenciais exigindo que o callback as ecoe de volta.",
      },
    },
    schemas: {
      RegisterIntegratorRequest: {
        description:
          "Payload usado para registrar uma nova plataforma integradora. A URL de callback deve ser capaz de receber os callbacks de desafio e de credenciais.",
      },
      RegisterIntegratorResponse: {
        description: "Resultado de um registro de integrador bem-sucedido.",
      },
      IntegratorChallenge: {
        description:
          "Objeto de desafio enviado ao callback do integrador. O callback deve responder com o payload de registro exato enviado originalmente pelo cliente.",
      },
      CheckoutProviderPublic: {
        description:
          "Dados públicos do provedor necessários aos SDKs de frontend para tokenizar ou autorizar pagamentos. Para a Efí, contém o código do recebedor e o ambiente exigidos pela biblioteca do navegador.",
      },
      CheckoutPaymentOptions: {
        description:
          "Instrumentos de pagamento que o checkout hospedado na ixblix pode oferecer para o plano da transação de registro. O Pix Automático é restrito a planos periódicos porque o Banco Central regula a periodicidade das cobranças.",
      },
      CheckoutCardPaymentRequest: {
        description:
          "Dados do cartão coletados no checkout hospedado na ixblix. O gateway tokeniza o cartão na mesma chamada, portanto o token resultante pode ser reutilizado para cobranças off-session. O endereço do titular é preenchido a partir do CEP via ViaCEP, mas todos os campos permanecem editáveis.",
      },
      CheckoutCardPaymentResponse: {
        description:
          "Resultado de uma cobrança de cartão feita no checkout hospedado na ixblix. `COMPLETED` significa que a empresa foi ativada; `PENDING` significa que a cobrança foi aceita mas ainda não foi liquidada.",
      },
      CheckoutPixAutomaticPaymentRequest: {
        description:
          "Identidade do pagador coletada para o Pix Automático. A Asaas exige um CPF/CNPJ para criar o cliente antes que a autorização possa ser criada.",
      },
      CheckoutPixAutomaticResponse: {
        description:
          "Autorização de Pix Automático criada para um plano periódico, incluindo o QR Code que o pagador lê para autorizar débitos futuros e pagar o primeiro período.",
      },
      CheckoutPaymentStatus: {
        description:
          "Status autoritativo de um pagamento de registro, conforme reportado pelo gateway.",
      },
      InstallationConfig: {
        description:
          "Configuração de marca e termos legais da instalação exibida ao cliente durante o fluxo de consentimento.",
      },
      Company: {
        description: "Empresa registrada no sistema.",
      },
      RegisterCompanyRequest: {
        description: "Dados para registro de uma nova empresa.",
      },
      RegisterCompanyResponse: {
        description:
          "Empresa registrada e informações de pagamento para ativação.",
      },
      ActivateCompanyResponse: {
        description: "Chave de API gerada após confirmação do pagamento.",
      },
      PaymentChangeOptionsResponse: {
        description:
          "Opções de pagamento disponíveis para uma empresa com plano cancelado ou expirado, ou para uma empresa que deseja trocar o método de pagamento. Usado quando a empresa deseja reassinar ou trocar o método de pagamento enquanto o serviço ainda está ativo (antes da próxima data de vencimento).",
      },
      StartPaymentChangeRequest: {
        description:
          "Dados para iniciar o checkout de troca de pagamento de uma empresa com plano cancelado ou expirado, ou para trocar o método de pagamento.",
      },
      StartPaymentChangeResponse: {
        description:
          "Transação de pagamento criada para troca de pagamento, incluindo URL do checkout.",
      },
      CompanyBalance: {
        description:
          "Saldo de créditos e plano ativo da empresa, incluindo o aporte mínimo aceito pelo plano atual.",
      },
      CompanyCustomization: {
        description:
          "Personalização visual da empresa (white-label), incluindo nome da marca, logos, cor primária, favicon, URL do site e mensagem de boas-vindas.",
      },
      CompanyEncryptionKey: {
        description:
          "Chave pública RSA versionada registrada por uma empresa para criptografia de ponta a ponta. Apenas uma chave está ativa por vez; chaves aposentadas são mantidas para que conversas existentes continuem descriptografáveis.",
      },
      RegisterCompanyEncryptionKeyRequest: {
        description:
          "Payload para registrar ou rotacionar uma chave de criptografia da empresa. O keyId deve ser único dentro da empresa.",
      },
      Operator: {
        description:
          "Identidade do agente (operador) do sistema de atendimento/CRM responsável por uma conversa. O operador pode ser vinculado na criação da conversa e atualizado a qualquer momento pela API da empresa. Também é embutido em toda mensagem enviada pela empresa, para que os clientes possam renderizar o avatar do remetente por mensagem.",
      },
      CustomerConversation: {
        description:
          "Uma conversa vinculada ao par de chaves do cliente, incluindo a identidade visual da empresa, a identidade do operador e o agente que respondeu por último.",
      },
      Media: {
        description:
          "Metadados de um arquivo de mídia anexado a uma mensagem. Os bytes do arquivo são armazenados criptografados no object store; os campos de envelope descrevem como descriptografá-los. O backend nunca vê o texto claro. O `storageClass` seleciona o bucket: arquivos `TRANSIENT` podem ser expirados pela política de ciclo de vida do bucket e são apagados pelo job de retenção, enquanto arquivos `PERMANENT` são mantidos indefinidamente.",
      },
      CreditPurchaseRequest: {
        description:
          "Dados para compra de créditos. O valor deve respeitar o `minimumDepositCents` do plano da empresa, quando definido.",
      },
      CreditPurchase: {
        description: "Registro de compra de créditos.",
      },
      PaymentProvidersResponse: {
        description: "Lista de provedores de pagamento disponíveis.",
      },
      PaymentMethod: {
        description:
          "Método de pagamento armazenado para cobrança off-session. Pode ser um cartão (`CARD`) ou uma autorização de Pix Automático (`PIX_AUTOMATIC_AUTHORIZATION`).",
      },
      PaymentMethodSetupRequest: {
        description:
          "Inicia o armazenamento de um método de pagamento. Stripe retorna um `clientSecret` para confirmação com Stripe.js; Asaas retorna o identificador do cliente para tokenização de cartão ou os dados do QR Code para uma autorização de Pix Automático; Efí retorna o QR Code do Pix Automático usando a Jornada 3.",
      },
      PaymentMethodSetupResponse: {
        description:
          "Resposta do início de armazenamento de método de pagamento. Para Pix Automático inclui o payload e a imagem do QR Code que o pagador deve ler para autorizar débitos futuros.",
      },
      RegisterPaymentMethodRequest: {
        description:
          "Registra um método de pagamento após a conclusão do fluxo no gateway. O gateway é consultado para validar a referência, impedindo que seja persistido um token ou autorização inexistente.",
      },
      Contact: {
        description:
          "Informações do contato que está conversando com a empresa.",
      },
      Conversation: {
        description: "Conversa de transbordo criada para um contato.",
      },
      Message: {
        description:
          "Mensagem trocada dentro de uma conversa. Inclui a mensagem respondida (`replyTo`, um nível). Reações são mensagens criptografadas com contentType 'react' e replyToId apontando para a mensagem alvo; o cliente calcula o conjunto atual a partir da lista. Mensagens enviadas pelo contato carregam `clientMessageId`, a chave de idempotência gerada pelo cliente que permite reconciliar o balão otimista com a mensagem criada no servidor. Mensagens da empresa podem incluir `attachments`, um JSON criptografado com botões, vcard ou localização.",
      },
      Plan: {
        description:
          "Plano de assinatura com cotas e tarifação. `billingType` é `MESSAGES`, `CONVERSATIONS` ou `PERIOD`; `PERIOD` é um valor fixo pelo período do plano. `period` define a duração do período (`DAILY`, `WEEKLY`, `MONTHLY` ou `CUSTOM`, que usa `durationDays`). Ao final de cada período o plano é renovado automaticamente cobrando `priceCents` do método de pagamento armazenado. `minimumDepositCents` é o menor aporte de créditos aceito para empresas neste plano. `maxDebtCents` é o limite de dívida não paga que uma empresa pode ter antes de as operações serem rejeitadas. `graceDays` é o número de dias após o vencimento do plano em que a empresa pode continuar usando o sistema enquanto a cobrança de renovação é tentada. `currency` é o código ISO 4217 no qual o plano é precificado.",
      },
      CreatePlanRequest: {
        description:
          "Dados para criação de um plano de assinatura. `currency` assume `BRL` quando omitido e `period` assume `MONTHLY`.",
      },
      UpdatePlanRequest: {
        description: "Dados para atualização de um plano de assinatura.",
      },
      SetCompanyPlanRequest: {
        description: "Dados para atribuição de plano a uma empresa.",
      },
      KeyTransferEnvelope: {
        description:
          "Envelope opaco e criptografado do par de chaves. Todos os campos binários são base64. A tag de autenticação AES-GCM é anexada ao texto cifrado.",
      },
      CreateKeyTransferRequest: {
        description:
          "Envelope criptografado do par de chaves mais a chave pública que ele contém, para que o backend possa verificar depois que o dispositivo de destino importou a mesma chave.",
      },
      CreateKeyTransferResponse: {
        description:
          "Identificador e expiração de uma transferência de chave recém-criada.",
      },
      ConfirmKeyTransferRequest: {
        description:
          "Chave pública que o dispositivo de destino realmente armazenou. Deve corresponder à chave enviada.",
      },
      KeyTransferStatusResponse: {
        description:
          "Status atual de uma transferência de chave: `PENDING`, `RETRIEVED`, `CONFIRMED` ou `EXPIRED`.",
      },
      KeyTransferKdf: {
        description:
          "Parâmetros de derivação de chave usados para derivar a chave de criptografia de chave a partir do PIN. Incluídos para que o dispositivo de destino valide o suporte antes de tentar descriptografar.",
      },
    },
  },
  es: {
    info: {
      title: "ixblix - API de Desbordamiento de Mensajes",
      description:
        "Sistema independiente de desbordamiento de mensajes comerciales. Permite que las plataformas de atención al cliente transfieran conversaciones desde canales originales (WhatsApp, Instagram, etc.) a una experiencia web/móvil personalizada.",
    },
    tags: {
      Health: "Health",
      Installation: "Instalación",
      Companies: "Companies",
      Plans: "Planes",
      Conversations: "Conversations",
      Messages: "Messages",
      Media: "Media",
      Contacts: "Contacts",
      Webhooks: "Webhooks",
      "Admin Plans": "Planes Admin",
      "Admin Payment Providers": "Proveedores de Pago Admin",
      "Key Transfer": "Transferencia de Clave",
      Integrators: "Integradores",
    },
    tagDescriptions: {
      Health: "Verificación de salud del servicio",
      Installation:
        "Configuración de marca y términos legales de la instalación",
      Companies: "Perfil y personalización de la empresa",
      Plans: "Planes de suscripción públicos",
      Conversations: "Gestión de conversaciones de desbordamiento",
      Messages: "Envío y listado de mensajes",
      Media: "Carga y descarga de archivos multimedia cifrados",
      Contacts: "Información del contacto y consentimiento",
      Webhooks: "Integración con el canal original",
      "Admin Plans": "Gestión de planes de suscripción",
      "Admin Payment Providers": "Configuración de los proveedores de pago",
      "Key Transfer":
        "Relay utilizado para mover el par de claves de cifrado de extremo a extremo del cliente entre dispositivos",
      Integrators:
        "Registro y autenticación de plataformas de terceros. Los integradores usan HTTP Basic Auth con integratorId:accessToken.",
    },
    paths: {
      "/installation": {
        summary: "Obtener configuración de la instalación",
        description:
          "Devuelve la configuración de marca y términos legales de la instalación, incluyendo el nombre del propietario del servicio y la URL de los términos de privacidad mostrados al cliente durante el consentimiento.",
      },
      "/health": {
        summary: "Verificación de salud",
        description:
          "Alias retrocompatible del probe de preparación. Redirige a `/health/ready`.",
      },
      "/health/live": {
        summary: "Probe de vida",
        description:
          "Indica si el proceso está en ejecución. Nunca verifica PostgreSQL ni Valkey, para que una indisponibilidad de dependencia no haga que el orquestador reinicie instancias sanas.",
      },
      "/health/ready": {
        summary: "Probe de preparación",
        description:
          "Indica si la instancia puede recibir tráfico. Verifica PostgreSQL y Valkey con un timeout corto y devuelve `503` cuando alguna dependencia es inaccesible, para que el balanceador retire la instancia.",
      },
      "/companies/profile": {
        summary: "Obtener perfil de la empresa",
        description:
          "Devuelve el perfil y la personalización de la empresa autenticada.",
      },
      "/companies/customization": {
        summary: "Actualizar personalización de la empresa",
        description:
          "Actualiza la personalización visual (white-label) de la empresa autenticada. Incluye nombre de marca, logo rectangular, icono cuadrado, colores primario y de fondo, favicon, mensaje de bienvenida y dirección del sitio web.",
      },
      "/companies/branding": {
        summary: "Subir activos de marca de la empresa",
        description:
          "Sube activos de marca de la empresa (un icono cuadrado y/o un logo rectangular, normalmente SVG) como multipart/form-data. Cada archivo se almacena en el bucket público de marca y se actualiza la URL de personalización correspondiente (squareIconUrl / rectangularLogoUrl). Debe proporcionarse al menos uno de los dos campos.",
      },
      "/companies/configuration": {
        summary: "Actualizar configuración de la empresa",
        description:
          "Actualiza la configuración de identidad de la empresa tras el registro y pago. Permite cambiar el nombre de la empresa, la URL pública del sitio web y el identificador único (handle). El handle se normaliza a minúsculas y puede referenciarse con el prefijo !! en enlaces públicos.",
      },
      "/companies/public/{handle}": {
        summary: "Obtener perfil público de la empresa",
        description:
          "Devuelve una vista pública y no autenticada de una empresa activa por su handle. El handle puede proporcionarse con o sin el prefijo !! inicial. Incluye la personalización visual de la empresa para renderizar en una página pública.",
      },
      "/companies/webhook": {
        summary: "Actualizar endpoint de webhook de la empresa",
        description:
          "Establece o actualiza la URL de webhook donde ixblix entrega eventos (mensajes recibidos, cliente conectado, conversación cerrada, metadatos de presencia). Cuando la URL cambia o se solicita una rotación de secreto, se genera y devuelve una vez un nuevo secreto HMAC.",
      },
      "/companies/encryption-key": {
        summary: "Registrar o rotar clave de cifrado de la empresa",
        description:
          "Registra una nueva clave pública RSA a nivel de empresa para el cifrado de extremo a extremo. La clave activa anterior se retira para que las conversaciones existentes sigan funcionando, y las nuevas conversaciones usan la nueva clave activa.",
      },
      "/companies/register": {
        summary: "Registrar nueva empresa",
        description:
          "Crea una nueva cuenta de empresa sin clave de API. Devuelve información de pago y un id de transacción usado para confirmar el pago y obtener la clave de API.",
      },
      "/companies": {
        summary: "Listar empresas",
        description: "Devuelve todas las empresas registradas.",
      },
      "/companies/{id}/activate/{transactionId}": {
        summary: "Activar empresa tras el pago",
        description:
          "Confirma el pago de una empresa pendiente y devuelve la clave de API generada. La operación es idempotente: cuando la empresa ya está activa (por ejemplo, un plan gratuito liquidado durante el registro), se devuelve la clave de API existente en lugar de un conflicto.",
      },
      "/companies/payment/{transactionId}": {
        summary: "Obtener detalles del pago de registro",
        description:
          "Endpoint público usado por la página de checkout alojada en ixblix para mostrar un resumen de pago con la marca de la empresa.",
      },
      "/companies/balance": {
        summary: "Obtener saldo de la empresa",
        description:
          "Devuelve el saldo de créditos y el plan activo de la empresa autenticada.",
      },
      "/companies/credits/purchase": {
        summary: "Comprar créditos",
        description:
          "Compra créditos para la empresa autenticada usando un proveedor de pagos.",
      },
      "/companies/credits/purchases": {
        summary: "Listar compras de crédito",
        description:
          "Devuelve el historial de compras de crédito de la empresa autenticada.",
      },
      "/companies/payment-methods/setup": {
        summary: "Iniciar el almacenamiento de un método de pago",
        description:
          "Inicia el almacenamiento de una tarjeta o de una autorización de Pix Automático para futuros cobros off-session. Stripe devuelve un client secret de SetupIntent que el front-end debe confirmar con Stripe.js; Asaas devuelve el id del cliente contra el que se debe tokenizar la tarjeta; Efí devuelve el código QR de Pix Automático. La referencia resultante se registra en POST /companies/payment-methods. ixblix nunca recibe los datos brutos de la tarjeta.",
      },
      "/companies/payment-methods": {
        summary: "Registrar un método de pago almacenado",
        description:
          "Persiste un método de pago tras completarse la configuración en la pasarela. Los datos autoritativos de la tarjeta se consultan en la pasarela, por lo que se rechaza una referencia inexistente o perteneciente a otro cliente. El primer método registrado pasa a ser el predeterminado.",
      },
      "/companies/payment-methods/{id}/default": {
        summary: "Establecer el método de pago predeterminado",
        description:
          "Marca un método de pago almacenado como predeterminado de la empresa para cobros off-session.",
      },
      "/companies/payment-methods/{id}": {
        summary: "Eliminar un método de pago almacenado",
        description:
          "Desvincula el método de pago en la pasarela y lo marca como eliminado. Cuando el método eliminado era el predeterminado, se promueve el método restante más reciente.",
      },
      "/companies/payment-change/options": {
        summary: "Obtener opciones de cambio de pago",
        description:
          "Devuelve los instrumentos de pago disponibles para una empresa con plan cancelado o expirado, o para una empresa que desea cambiar el método de pago. Se usa cuando la empresa desea volver a suscribirse o cambiar el método de pago mientras el servicio aún está activo (antes de la próxima fecha de vencimiento).",
      },
      "/companies/payment-change/start": {
        summary: "Iniciar checkout de cambio de pago",
        description:
          "Crea una nueva transacción de pago para una empresa con plan cancelado o expirado, o para una empresa que desea cambiar el método de pago. El flujo de checkout es idéntico al registro inicial: cargo de verificación de tarjeta + reembolso para prueba, o autorización de Pix Automático. El primer pago se programa para la próxima fecha de vencimiento o fin del período de prueba.",
      },

      "/payment/providers": {
        summary: "Listar proveedores de pagos",
        description:
          "Devuelve los proveedores de pago habilitados y totalmente configurados en esta instalación.",
      },
      "/payment/webhooks/{provider}": {
        summary: "Recibir webhook del proveedor de pago",
        description:
          "Endpoint de callback invocado por la pasarela de pago. El payload se autentica mediante el adaptador del proveedor (firma de Stripe o token compartido de Asaas) y liquida el pago de empresa o la compra de crédito correspondiente. La liquidación es idempotente, por lo que los reintentos de la pasarela son seguros. Los integradores no deben llamar a este endpoint.",
      },
      "/conversations": {
        summary: "Crear conversación de desbordamiento",
        description:
          "Crea una nueva conversación de desbordamiento para un contacto y devuelve un deeplink. La conversación usa la clave de cifrado activa de la empresa.",
      },
      "/conversations/by-key": {
        summary: "Listar conversaciones del cliente por clave pública",
        description:
          "Devuelve todas las conversaciones registradas con la clave pública RSA del cliente. Permite que un navegador descubra todos los chats vinculados al mismo par de claves, incluidos los enlaces independientes creados por la misma empresa para diferentes temas u operadores.",
      },
      "/conversations/{token}": {
        summary: "Obtener conversación por token",
        description:
          "Devuelve una conversación y sus mensajes usando el token del deeplink.",
      },
      "/conversations/{token}/close": {
        summary: "Cerrar conversación",
        description: "Marca una conversación como cerrada.",
      },
      "/conversations/{token}/key": {
        summary: "Registrar clave pública del cliente",
        description:
          "Registra la clave pública RSA del cliente para una conversación, estableciendo el cifrado de extremo a extremo. El cliente se autentica mediante el token del deeplink.",
      },
      "/conversations/{token}/erase": {
        summary: "Borrar contenido de la conversación",
        description:
          "Elimina todo el contenido cifrado de los mensajes de una conversación (solicitud de borrado de datos del cliente). Se conserva la clave pública del cliente para que la conversación pueda continuar.",
      },
      "/conversations/{ref}/presence": {
        summary: "Reportar presencia",
        description:
          "Reenvía un evento de presencia/metadatos (escribiendo, dejó de escribir, grabando o ventana de chat cerrada). Cuando se autentica con la clave de API de la empresa, `ref` es el id de la conversación y el evento se reenvía al chat del cliente mediante Socket.io. Cuando no se autentica, `ref` es el token de deeplink del cliente y el evento se reenvía al operador mediante webhook.",
      },
      "/conversations/{conversationId}/keys": {
        summary: "Obtener claves públicas de la conversación",
        description:
          "Devuelve las claves públicas del operador y del cliente de una conversación para que el operador pueda cifrar mensajes al cliente.",
      },
      "/conversations/{conversationId}/operator": {
        summary: "Actualizar operador de la conversación",
        description:
          "Actualiza la identidad del operador (uuid, nombre, imagen y/o hash de gravatar) asociada a una conversación. Solo se actualizan los campos proporcionados; los campos omitidos conservan su valor actual. Pase `null` para limpiar un campo. El operador puede actualizarse en cualquier momento durante la conversación.",
      },
      "/messages/company": {
        summary: "Enviar mensaje de la empresa",
        description: "Envía un mensaje de la empresa al contacto.",
      },
      "/messages/company/delivered": {
        summary: "Marcar mensaje como entregado a la empresa",
        description:
          "Marca un mensaje enviado por el contacto como entregado al dispositivo del operador (el cliente del operador recibió el mensaje, pero aún no lo leyó). Emite un evento `message_delivered` mediante Socket.io al chat del cliente para que vea el recibo de entrega. Idempotente y sin efecto cuando el mensaje ya fue leído.",
      },
      "/messages/company/read": {
        summary: "Marcar mensaje como leído por la empresa",
        description:
          "Marca un mensaje enviado por el contacto como leído por el operador. Emite un evento `message_read` mediante Socket.io al chat del cliente para que vea el recibo de lectura. Los clientes solo deben reportar lectura cuando la ventana del chat esté enfocada y el mensaje esté visible en el viewport. Marcar como leído también registra la entrega cuando aún no ocurrió.",
      },
      "/messages/contact": {
        summary: "Enviar mensaje del contacto",
        description:
          "Envía un mensaje del contacto usando el token del deeplink.",
      },
      "/messages/contact/delivered": {
        summary: "Marcar mensaje como entregado al contacto",
        description:
          "Marca un mensaje enviado por la empresa como entregado al dispositivo del cliente (el cliente recibió el mensaje, pero aún no lo leyó). Emite un webhook `MESSAGE_DELIVERED` al operador para que el sistema de atención sepa que el dispositivo del cliente recibió el mensaje. Idempotente y sin efecto cuando el mensaje ya fue leído.",
      },
      "/messages/contact/read": {
        summary: "Marcar mensaje como leído por el contacto",
        description:
          "Marca un mensaje enviado por la empresa como leído por el cliente. Emite un webhook `MESSAGE_READ` al operador para que el sistema de atención sepa que el cliente leyó el mensaje. Los clientes solo deben reportar lectura cuando la ventana del chat esté enfocada y el mensaje esté visible en el viewport. Marcar como leído también registra la entrega cuando aún no ocurrió.",
      },
      "/messages/{conversationId}": {
        summary: "Listar mensajes de la conversación",
        description:
          "Lista todos los mensajes de una conversación, incluido el mensaje respondido (un nivel). Las reacciones son mensajes cifrados con contentType 'react' y replyToId apuntando al mensaje objetivo; el cliente calcula el conjunto actual de reacciones a partir de la lista.",
      },
      "/contacts/{token}": {
        summary: "Obtener contacto por token de conversación",
        description:
          "Devuelve la información del contacto asociada al token de la conversación.",
      },
      "/contacts/{token}/consent": {
        summary: "Actualizar consentimiento del contacto",
        description:
          "Actualiza el estado de consentimiento LGPD del contacto de la conversación. El consentimiento se memoriza por empresa: una vez concedido, se reutiliza en todas las conversaciones con la misma empresa y no se vuelve a preguntar al cliente. La marca de tiempo de la primera concesión se conserva en las concesiones posteriores.",
      },
      "/webhooks/original-channel": {
        summary: "Recibir mensaje del canal original",
        description:
          "Webhook utilizado por sistemas de atención para retransmitir mensajes recibidos por el canal original.",
      },
      "/admin/companies/{id}/plan": {
        summary: "Asignar plan a la empresa",
        description:
          "Asigna o elimina un plan de suscripción para una empresa.",
      },
      "/admin/companies/{id}/customization": {
        summary: "Actualizar personalización de la empresa",
        description:
          "Actualiza la personalización white-label de una empresa. Requiere rol SUPER_ADMIN o ADMIN.",
      },
      "/admin/plans": {
        summary: "Listar planes",
        description: "Devuelve todos los planes de suscripción.",
      },
      "/admin/plans/{id}": {
        summary: "Obtener plan por ID",
        description: "Devuelve un único plano de suscripción.",
      },
      "/plans": {
        summary: "Listar planes",
        description:
          "Devuelve los planes de suscripción disponibles para el integrador autenticado. Cuando el proveedor de pago del integrador tiene un plan forzado, solo se devuelve ese plan (incluso si es privado).",
      },
      "/key-transfer": {
        summary: "Crear transferencia de clave",
        description:
          "Almacena un sobre cifrado del par de claves para que pueda ser recuperado por otro dispositivo. El payload se cifra en el dispositivo de origen con una clave derivada del PIN; el PIN nunca se envía al servidor. Sin autenticación por diseño, porque el origen es el cliente web del cliente final, que no posee clave de API de la empresa.",
      },
      "/key-transfer/{transferId}": {
        summary: "Recuperar o eliminar transferencia de clave",
        description:
          "El `GET` devuelve el sobre cifrado y transiciona la transferencia a `RETRIEVED`; el payload solo puede obtenerse una vez. Los ids desconocidos, expirados y ya recuperados devuelven el mismo `404`. El `DELETE` elimina explícitamente una transferencia y devuelve `204` exista o no.",
      },
      "/key-transfer/{transferId}/confirm": {
        summary: "Confirmar transferencia de clave",
        description:
          "Llamado por el dispositivo receptor después de importar y almacenar la clave transferida. La clave pública proporcionada debe coincidir con la clave enviada, para que una importación divergente no se reporte como éxito. Una vez confirmada, el texto cifrado se descarta y solo sobrevive el estado.",
      },
      "/key-transfer/{transferId}/status": {
        summary: "Obtener estado de la transferencia de clave",
        description:
          "Devuelve el estado actual de una transferencia para que el dispositivo de origen sepa que el dispositivo receptor tuvo éxito. Los ids desconocidos y expirados resuelven a `EXPIRED`.",
      },
      "/payment/checkout/{transactionId}/options": {
        summary: "Obtener opciones de pago del checkout",
        description:
          "Devuelve los instrumentos de pago que el checkout alojado en ixblix puede ofrecer para el plan de la transacción de registro. Pix Automático solo se ofrece para planes cobrados por `PERIOD`, porque el Banco Central regula la periodicidad de los cobros.",
      },
      "/payment/checkout/{transactionId}/card": {
        summary: "Pagar un registro con tarjeta de crédito",
        description:
          "Cobra una tarjeta proporcionada en el checkout alojado en ixblix y activa la empresa. La pasarela tokeniza la tarjeta en la misma llamada, por lo que el token resultante se almacena como método de pago de la empresa y las renovaciones y excedentes se cobran off-session sin volver a pedir la tarjeta.",
      },
      "/payment/checkout/{transactionId}/pix-automatic": {
        summary: "Pagar un registro con Pix Automático",
        description:
          "Inicia una autorización de Pix Automático para un plan periódico y devuelve el código QR que el pagador debe escanear. El primer código QR recoge el consentimiento del pagador para débitos futuros y paga el primer período, por lo que su valor es el precio del plan. La periodicidad se deriva del período del plan y la política de reintentos permite tres intentos dentro del período de gracia.",
      },
      "/payment/checkout/{transactionId}/status": {
        summary: "Obtener estado del pago del checkout",
        description:
          "Consulta la pasarela para obtener el estado autoritativo de un pago de registro y lo liquida cuando la pasarela confirma. Lo usa el checkout mientras espera el webhook, para que el pagador no quede esperando cuando la devolución de llamada se retrasa.",
      },
      "/integrators/register": {
        summary: "Registrar nuevo integrador",
        description:
          "Registra una nueva plataforma integradora en tres fases: envía el hostname como desafío a la URL de callback, exige que el callback devuelva el payload de registro original y luego entrega las credenciales exigiendo que el callback las haga eco.",
      },
    },
    schemas: {
      RegisterIntegratorRequest: {
        description:
          "Payload usado para registrar una nueva plataforma integradora. La URL de callback debe poder recibir los callbacks de desafío y de credenciales.",
      },
      RegisterIntegratorResponse: {
        description: "Resultado de un registro de integrador exitoso.",
      },
      IntegratorChallenge: {
        description:
          "Objeto de desafío enviado al callback del integrador. El callback debe responder con el payload de registro exacto enviado originalmente por el cliente.",
      },
      CheckoutProviderPublic: {
        description:
          "Datos públicos del proveedor necesarios para los SDKs de frontend para tokenizar o autorizar pagos. Para Efí, contiene el código de beneficiario y el entorno requeridos por la biblioteca del navegador.",
      },
      CheckoutPaymentOptions: {
        description:
          "Instrumentos de pago que el checkout alojado en ixblix puede ofrecer para el plan de la transacción de registro. Pix Automático se limita a planes periódicos porque el Banco Central regula la periodicidad de los cobros.",
      },
      CheckoutCardPaymentRequest: {
        description:
          "Datos de la tarjeta recogidos en el checkout alojado en ixblix. La pasarela tokeniza la tarjeta en la misma llamada, por lo que el token resultante puede reutilizarse para cobros off-session. La dirección del titular se completa a partir del código postal mediante ViaCEP, pero todos los campos siguen siendo editables.",
      },
      CheckoutCardPaymentResponse: {
        description:
          "Resultado de un cobro con tarjeta realizado en el checkout alojado en ixblix. `COMPLETED` significa que la empresa fue activada; `PENDING` significa que el cobro fue aceptado pero aún no se ha liquidado.",
      },
      CheckoutPixAutomaticPaymentRequest: {
        description:
          "Identidad del pagador recogida para Pix Automático. Asaas requiere un CPF/CNPJ para crear el cliente antes de que se pueda crear la autorización.",
      },
      CheckoutPixAutomaticResponse: {
        description:
          "Autorización de Pix Automático creada para un plan periódico, incluido el código QR que el pagador escanea para autorizar débitos futuros y pagar el primer período.",
      },
      CheckoutPaymentStatus: {
        description:
          "Estado autoritativo de un pago de registro, según lo reportado por la pasarela.",
      },
      InstallationConfig: {
        description:
          "Configuración de marca y términos legales de la instalación mostrada al cliente durante el flujo de consentimiento.",
      },
      Company: {
        description: "Empresa registrada en el sistema.",
      },
      RegisterCompanyRequest: {
        description: "Datos para registrar una nueva empresa.",
      },
      RegisterCompanyResponse: {
        description:
          "Empresa registrada e información de pago para activación.",
      },
      ActivateCompanyResponse: {
        description: "Clave de API generada tras la confirmación del pago.",
      },
      PaymentChangeOptionsResponse: {
        description:
          "Opciones de pago disponibles para una empresa con plan cancelado o expirado, o para una empresa que desea cambiar el método de pago. Se usa cuando la empresa desea volver a suscribirse o cambiar el método de pago mientras el servicio aún está activo (antes de la próxima fecha de vencimiento).",
      },
      StartPaymentChangeRequest: {
        description:
          "Datos para iniciar el checkout de cambio de pago de una empresa con plan cancelado o expirado, o para cambiar el método de pago.",
      },
      StartPaymentChangeResponse: {
        description:
          "Transacción de pago creada para el cambio de pago, incluyendo la URL del checkout.",
      },
      CompanyBalance: {
        description:
          "Saldo de créditos y plan activo de la empresa, incluido el aporte mínimo aceptado por el plan actual.",
      },
      CompanyCustomization: {
        description:
          "Personalización visual de la empresa (white-label), incluyendo nombre de marca, logos, color primario, favicon, URL del sitio y mensaje de bienvenida.",
      },
      CompanyEncryptionKey: {
        description:
          "Clave pública RSA versionada registrada por una empresa para el cifrado de extremo a extremo. Solo una clave está activa a la vez; las claves retiradas se conservan para que las conversaciones existentes sigan descifrables.",
      },
      RegisterCompanyEncryptionKeyRequest: {
        description:
          "Payload para registrar o rotar una clave de cifrado de la empresa. El keyId debe ser único dentro de la empresa.",
      },
      Operator: {
        description:
          "Identidad del agente (operador) del sistema de atención/CRM responsable de una conversación. El operador puede vincularse al crear la conversación y actualizarse en cualquier momento mediante la API de la empresa. También se incluye en cada mensaje enviado por la empresa, para que los clientes puedan renderizar el avatar del remitente por mensaje.",
      },
      CustomerConversation: {
        description:
          "Una conversación vinculada al par de claves del cliente, incluida la identidad visual de la empresa, la identidad del operador y el agente que respondió por última vez.",
      },
      Media: {
        description:
          "Metadatos de un archivo multimedia adjunto a un mensaje. Los bytes del archivo se almacenan cifrados en el almacén de objetos; los campos de envoltura describen cómo descifrarlos. El backend nunca ve el texto plano. `storageClass` selecciona el bucket: los archivos `TRANSIENT` pueden expirar por la política de ciclo de vida del bucket y son borrados por el job de retención, mientras que los archivos `PERMANENT` se conservan indefinidamente.",
      },
      CreditPurchaseRequest: {
        description:
          "Datos para comprar créditos. El importe debe respetar el `minimumDepositCents` del plan de la empresa, cuando esté definido.",
      },
      CreditPurchase: {
        description: "Registro de compra de créditos.",
      },
      PaymentProvidersResponse: {
        description: "Lista de proveedores de pago disponibles.",
      },
      PaymentMethod: {
        description:
          "Método de pago almacenado para cobros off-session. Puede ser una tarjeta (`CARD`) o una autorización de Pix Automático (`PIX_AUTOMATIC_AUTHORIZATION`).",
      },
      PaymentMethodSetupRequest: {
        description:
          "Inicia el almacenamiento de un método de pago. Stripe devuelve un `clientSecret` para confirmar con Stripe.js; Asaas devuelve el identificador del cliente para tokenizar la tarjeta o los datos del QR Code para una autorización de Pix Automático; Efí devuelve el QR Code de Pix Automático usando la Jornada 3.",
      },
      PaymentMethodSetupResponse: {
        description:
          "Respuesta del inicio de almacenamiento de método de pago. Para Pix Automático incluye el payload y la imagen del QR Code que el pagador debe leer para autorizar débitos futuros.",
      },
      RegisterPaymentMethodRequest: {
        description:
          "Registra un método de pago tras la finalización del flujo en la gateway. Se consulta a la gateway para validar la referencia, evitando que se persista un token o autorización inexistente.",
      },
      Contact: {
        description: "Información del contacto que conversa con la empresa.",
      },
      Conversation: {
        description: "Conversación de desbordamiento creada para un contacto.",
      },
      Message: {
        description:
          "Mensaje intercambiado dentro de una conversación. Incluye el mensaje respondido (`replyTo`, un nivel). Las reacciones son mensajes cifrados con contentType 'react' y replyToId apuntando al mensaje objetivo; el cliente calcula el conjunto actual a partir de la lista. Los mensajes enviados por el contacto incluyen `clientMessageId`, la clave de idempotencia generada por el cliente que permite reconciliar el globo optimista con el mensaje creado en el servidor. Los mensajes de la empresa pueden incluir `attachments`, un JSON cifrado con botones, vcard o ubicación.",
      },
      Plan: {
        description:
          "Plan de suscripción con cuotas y tarifas. `billingType` es `MESSAGES`, `CONVERSATIONS` o `PERIOD`; `PERIOD` es una tarifa plana por el período del plan. `period` define la duración del período (`DAILY`, `WEEKLY`, `MONTHLY` o `CUSTOM`, que usa `durationDays`). Al final de cada período el plan se renueva automáticamente cobrando `priceCents` al método de pago almacenado. `minimumDepositCents` es el aporte de créditos mínimo aceptado para empresas en este plan. `maxDebtCents` es el límite de deuda no pagada que una empresa puede tener antes de que las operaciones sean rechazadas. `graceDays` es la cantidad de días después del vencimiento del plan en los que la empresa puede seguir usando el sistema mientras se intenta el cobro de la renovación. `currency` es el código ISO 4217 en el que se cotiza el plan.",
      },
      CreatePlanRequest: {
        description:
          "Datos para crear un plan de suscripción. `currency` toma `BRL` cuando se omite y `period` toma `MONTHLY`.",
      },
      UpdatePlanRequest: {
        description: "Datos para actualizar un plan de suscripción.",
      },
      SetCompanyPlanRequest: {
        description: "Datos para asignar un plan a una empresa.",
      },
      KeyTransferEnvelope: {
        description:
          "Sobre cifrado opaco del par de claves. Todos los campos binarios son base64. La etiqueta de autenticación AES-GCM se añade al texto cifrado.",
      },
      CreateKeyTransferRequest: {
        description:
          "Sobre cifrado del par de claves más la clave pública que contiene, para que el backend pueda verificar después que el dispositivo receptor importó la misma clave.",
      },
      CreateKeyTransferResponse: {
        description:
          "Identificador y expiración de una transferencia de clave recién creada.",
      },
      ConfirmKeyTransferRequest: {
        description:
          "Clave pública que el dispositivo receptor realmente almacenó. Debe coincidir con la clave enviada.",
      },
      KeyTransferStatusResponse: {
        description:
          "Estado actual de una transferencia de clave: `PENDING`, `RETRIEVED`, `CONFIRMED` o `EXPIRED`.",
      },
      KeyTransferKdf: {
        description:
          "Parámetros de derivación de clave usados para derivar la clave de cifrado de clave a partir del PIN. Se incluyen para que el dispositivo receptor valide el soporte antes de intentar descifrar.",
      },
    },
  },
};

export function translateSpec(
  spec: OpenAPIV3.Document,
  language: SupportedLanguage,
): OpenAPIV3.Document {
  if (language === "en")
    return JSON.parse(JSON.stringify(spec)) as OpenAPIV3.Document;

  const translation = translations[language];
  const translated: OpenAPIV3.Document = JSON.parse(
    JSON.stringify(spec),
  ) as OpenAPIV3.Document;

  translated.info.title = translation.info.title;
  translated.info.description = translation.info.description;

  translated.tags = translated.tags?.map((tag) => ({
    name: tag.name,
    description: translation.tagDescriptions[tag.name] || tag.description,
  }));

  for (const [pathKey, pathItem] of Object.entries(translated.paths)) {
    const translatedPath = translation.paths[pathKey];
    if (!translatedPath) continue;

    for (const operation of Object.values(
      pathItem as OpenAPIV3.PathItemObject,
    )) {
      if (typeof operation === "object" && "summary" in operation) {
        const op = operation as OpenAPIV3.OperationObject;
        if (translatedPath.summary) op.summary = translatedPath.summary;
        if (translatedPath.description)
          op.description = translatedPath.description;
      }
    }
  }

  if (translated.components?.schemas) {
    for (const [schemaName, schema] of Object.entries(
      translated.components.schemas,
    )) {
      const schemaTranslation = translation.schemas[schemaName];
      if (
        schemaTranslation?.description &&
        schema &&
        typeof schema === "object"
      ) {
        (schema as OpenAPIV3.SchemaObject).description =
          schemaTranslation.description;
      }
    }
  }

  return translated;
}
