src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── api/
│   │   ├── assistant/
│   │   │   └── route.ts
│   │   ├── auth/
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
│   │   │   ├── project/[id]/
│   │   │   │   └── route.ts
│   │   │   └── projects/[slug]/
│   │   │       └── route.ts
│   │   └── auth/
│   │       ├── callback/
│   │       │   └── route.ts
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
│   ├── portfolio/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── project/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── blocks/
│   ├── charts/
│   ├── hooks/
│   ├── ui/
│   │   ├── AnimatedHeaderCard.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── DataFetcher.tsx
│   │   ├── InterestButton.tsx
│   │   ├── LayoutWrapper.tsx
│   │   ├── LoginForm.tsx
│   │   ├── NotionBlockRenderer.tsx
│   │   ├── Portfolio.tsx
│   │   ├── PortfolioCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RelatedProjectCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── TableOfContents.tsx
│
├── lib/
│   ├── analytics.ts
│   ├── config.ts
│   ├── logger.ts
│   ├── supabaseClient.ts
│   ├── utils.ts
│   ├── notion.ts
│   ├── openai.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── types.ts
│
├── providers/
│   ├── SupabaseProvider.tsx
│   └── ToastProvider.tsx
│
├── services/
│   ├── notion/
│   │   └── getProjects.ts
│
├── types/
│   ├── notion.ts
│   └── supabase.ts
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── placeholder-image.jpg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json


----

## Folder Structure Analysis in Context of PRD

---

### Root Directory

- **`.next/`**  
  Build output directory for Next.js, containing cached files, optimized assets, and build artifacts.  
  **PRD Context**: Supports deployment on Vercel, optimizing build and runtime performance.

- **`contexts/`**  
  Contains global context providers for React.  
  - `AuthContext.tsx`: Manages authentication state globally.  
  **PRD Context**: Integral for **Passwordless Supabase Auth** and securing routes.

- **`docs/`**  
  Documentation for project reference.  
  - `Folder_Structure.md`: Documents folder organization.  
  - `Product_Requirements.md`: Product Requirements Document with detailed project goals.  
  **PRD Context**: Provides architectural and requirement documentation for development.

- **`lib/`**  
  Shared logic and configurations.  
  - `analytics.ts`: Likely for tracking user interactions.  
  - `config.ts`: Application-wide configuration.  
  - `logger.ts`: Logs errors, warnings, or information.  
  - `supabaseClient.ts`: Supabase database and auth integration.  
  - `utils.ts`: Utility functions for common tasks.  
  **PRD Context**: Essential for **Supabase**, **error handling**, and **analytics**.

- **`node_modules/`**  
  Contains npm dependencies.  
  **PRD Context**: Supports libraries like Next.js, Supabase, and TailwindCSS.

- **`public/`**  
  Static assets accessible via URLs.  
  - Icons (`file.svg`, `globe.svg`), images, etc.  
  **PRD Context**: Supports UI elements such as icons in chat interfaces.

---

### `src/` Directory

#### `app/`

- **`(auth)/`**  
  Handles authentication flows.  
  - `login/page.tsx`: Chat-based login interface.  
  - `layout.tsx`: Authentication page layout.  
  **PRD Context**: Implements **Passwordless Supabase Auth**.

- **`analytics/`**  
  - `page.tsx`: Likely displays user or admin analytics.  
  **PRD Context**: For tracking **performance metrics** and user interactions.

- **`api/`**  
  Backend API routes.  
  - `assistant/route.ts`: GPT-powered assistant routes.  
  - `auth/route.ts`: Authentication endpoints.  
  - `chat/route.ts`: Manages GPT-based chat.  
  - `gpt/message/route.ts` & `thread/route.ts`: GPT conversation management.  
  - `log/route.ts`: Logs activities or errors.  
  - `notion/project/[id]/route.ts`: Fetch project data by ID.  
  - `projects/[slug]/route.ts`: Fetch project listings by slug.  
  **PRD Context**: Covers **API endpoints** for chat, interest tracking, and Notion integration.

- **Feature-Specific Pages**  
  - `auth-test/page.tsx`: Testing authentication features.  
  - `connect/page.tsx`: Possibly for integrations.  
  - `conversation/page.tsx`: Chat interface management.  
  - `interested/page.tsx`: Displays user-marked projects.  
  - `portfolio/[slug]/page.tsx`: Project detail view.  
  - `project/[slug]/page.tsx`: Secondary project view.  
  **PRD Context**: Supports **portfolio views** and **interest tracking**.

---

### `components/`

Reusable React components.

- **`blocks/`, `charts/`, `hooks/`**  
  Likely additional UI elements or logic (details not provided).

- **`ui/`**  
  UI components.  
  - `AnimatedHeaderCard.tsx`, `ChatInterface.tsx`: Chat and UI elements.  
  - `InterestButton.tsx`: Marks projects as “interested.”  
  - `NotionBlockRenderer.tsx`: Renders Notion content.  
  - `ProtectedRoute.tsx`: Restricts access to protected routes.  
  **PRD Context**: Facilitates **chat UI**, **portfolio display**, and **protected routes**.

---

### `lib/`

Utility and configuration files.

- **`config.ts`**: Central configuration.  
- **`notion.ts`**: Notion API integration.  
- **`openai.ts`**: OpenAI GPT integration.  
- **`supabase/`**:  
  - `client.ts`: Supabase client setup.  
  - `middleware.ts`: Middleware for session checks.  
  - `server.ts`: Server-side utilities.  
- **`utils.ts`**: General utilities.  
**PRD Context**: Core for **Supabase**, **GPT**, and **Notion** functionalities.

---

### `providers/`

React context providers.

- **`SupabaseProvider.tsx`**: Context for Supabase.  
- **`ToastProvider.tsx`**: Provides toast notifications.  
**PRD Context**: Supports **authentication**, **data fetching**, and **UX enhancements**.

---

### `services/`

Service-specific logic.

- **`notion/getProjects.ts`**: Fetches projects from Notion.  
**PRD Context**: Enables **Notion-based portfolio data**.

---

### `types/`

TypeScript definitions.

- **`notion.ts`**: Notion data types.  
- **`supabase.ts`**: Supabase data types.  
**PRD Context**: Ensures type safety in API and database interactions.

---

### Miscellaneous

- **`.env.local` & `.env.local.example`**: Environment configurations.  
- **`.eslintrc.json`**: Linting for code quality.  
- **`tailwind.config.ts`**: TailwindCSS configuration.  
**PRD Context**: Facilitates **development standards** and **Vercel deployment**.

