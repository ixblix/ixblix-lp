# ixblix — Developer Documentation

Landing page and progressive integration guide for the **ixblix** platform.

Published at [github.com/ixblix/ixblix-lp](https://github.com/ixblix/ixblix-lp).

## Quick Links

- **API Endpoint**: `https://api.ixblix.app`
- **Interactive API Docs (Scalar)**: `https://dev.ixblix.app`
- **JavaScript SDK**: `@ixblix/sdk-js`

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushes to `main` are automatically deployed to GitHub Pages via the workflow in
`.github/workflows/deploy.yml`.

## Structure

```
src/
├── pages/
│   ├── Home.tsx                    # Landing page
│   └── docs/
│       ├── QuickStart.tsx          # 10-minute walkthrough
│       ├── IntegratorRegistration.tsx
│       ├── CompanyRegistration.tsx
│       ├── Messaging.tsx           # Send & receive messages
│       ├── Webhooks.tsx
│       ├── E2EEncryption.tsx
│       ├── RichMessages.tsx
│       ├── Media.tsx
│       ├── Presence.tsx
│       ├── KeyTransfer.tsx
│       ├── AuthReference.tsx
│       ├── ErrorHandling.tsx
│       ├── SdkReference.tsx
│       └── SampleIntegrator.tsx
├── components/
│   ├── DocsLayout.tsx              # Sidebar + content layout
│   ├── CodeBlock.tsx               # Syntax-highlighted code
│   └── PageNav.tsx                 # Prev/next navigation
├── App.tsx
├── router.tsx
├── main.tsx
└── index.css
```

## License

Private — all rights reserved.
