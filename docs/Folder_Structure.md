Directory structure:
└── datainvest23-my-portfolio25/
    ├── README.md
    ├── LICENSE
    ├── jsconfig.json
    ├── next.config.js
    ├── next.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.js
    ├── postcss.config.mjs
    ├── tailwind.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.local.example
    ├── .eslintrc.json
    ├── components/
    │   ├── Layout.tsx
    │   ├── LoginForm.tsx
    │   ├── NotionBlockRenderer.tsx
    │   ├── Sidebar.tsx
    │   ├── blocks/
    │   │   └── hero-with-orb-effect.tsx
    │   ├── charts/
    │   │   ├── BarChart.tsx
    │   │   └── LineChart.tsx
    │   └── ui/
    │       ├── ai-input-with-loading.tsx
    │       ├── avatar.tsx
    │       ├── button.tsx
    │       ├── input.tsx
    │       └── textarea.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── docs/
    │   └── Product_Requirements.md
    ├── lib/
    │   ├── analytics.ts
    │   ├── config.ts
    │   ├── logger.ts
    │   ├── supabaseClient.ts
    │   └── utils.ts
    ├── public/
    ├── scripts/
    │   ├── migrate-components.js
    │   └── migrate-components.ts
    └── src/
        ├── middleware.ts
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── (auth)/
        │   │   ├── layout.tsx
        │   │   └── login/
        │   │       └── page.tsx
        │   ├── analytics/
        │   │   └── page.tsx
        │   ├── api/
        │   │   ├── assistant/
        │   │   │   └── route.ts
        │   │   ├── chat/
        │   │   │   └── route.ts
        │   │   ├── gpt/
        │   │   │   ├── message/
        │   │   │   │   └── route.ts
        │   │   │   └── thread/
        │   │   │       └── route.ts
        │   │   ├── log/
        │   │   │   └── route.ts
        │   │   ├── notion/
        │   │   │   └── project/
        │   │   │       └── [id]/
        │   │   │           └── route.ts
        │   │   ├── projects/
        │   │   │   └── route.ts
        │   │   └── thread/
        │   │       └── route.ts
        │   ├── auth/
        │   │   └── callback/
        │   │       └── route.ts
        │   ├── auth-test/
        │   │   └── page.tsx
        │   ├── connect/
        │   │   └── page.tsx
        │   ├── contact/
        │   │   └── page.tsx
        │   ├── conversation/
        │   │   └── page.tsx
        │   ├── interested/
        │   │   └── page.tsx
        │   ├── lib/
        │   │   └── notion.ts
        │   └── project/
        │       └── [slug]/
        │           └── page.tsx
        ├── components/
        │   ├── AnimatedHeaderCard.tsx
        │   ├── ChatWindow.tsx
        │   ├── DataFetcher.tsx
        │   ├── InterestButton.tsx
        │   ├── LayoutWrapper.tsx
        │   ├── PortfolioCard.tsx
        │   ├── ProtectedRoute.tsx
        │   ├── RelatedProjectCard.tsx
        │   ├── Sidebar.tsx
        │   ├── TableOfContents.tsx
        │   ├── charts/
        │   │   ├── BarChart.tsx
        │   │   ├── LineChart.tsx
        │   │   └── index.ts
        │   ├── hooks/
        │   │   └── use-auto-resize-textarea.tsx
        │   └── ui/
        │       ├── 3d-button.tsx
        │       ├── ai-input-with-loading.tsx
        │       ├── animated-grid-pattern.tsx
        │       ├── button.tsx
        │       ├── chat-bubble.tsx
        │       ├── flip-card.tsx
        │       ├── flip-words.tsx
        │       ├── globe.tsx
        │       ├── hover-card.tsx
        │       ├── interesting-button.tsx
        │       ├── magnetize-button.tsx
        │       ├── message-loading.tsx
        │       ├── orb-effect.tsx
        │       ├── sidebar.tsx
        │       └── textarea.tsx
        ├── lib/
        │   ├── config.ts
        │   ├── notion.ts
        │   ├── openai.ts
        │   └── utils.ts
        ├── providers/
        │   ├── SupabaseProvider.tsx
        │   └── ToastProvider.tsx
        ├── services/
        │   └── notion/
        │       └── getProjects.ts
        └── types/
            ├── api.ts
            ├── notion.ts
            ├── openai.ts
            └── supabase.ts
