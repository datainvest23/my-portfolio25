# Portfolio25 - PRD v2.1

# Product Requirements Document (PRD)

**Project:** Chat-Based Portfolio with GPT Integration & Notion CMS

**Date:** 1/22/2025

**Author:** (Marc Muller / DataInvest)

---

## 1. Product Overview

A **Next.js** application (v14) featuring:

- **Passwordless Supabase Auth** for user sign-up/login
- **GPT** integration (via OpenAI) for user-specific conversations (thread-based)
- **Notion-powered** portfolio data fetching
- An **Interested** feature allowing users to mark specific projects
- **Protected routes** and a chat-based UI for a unique onboarding experience

**Key Objectives**:

1. **Conversational Onboarding**: Chat-based collection of user details.
2. **GPT Thread Management**: Retain conversation context (`thread_id`).
3. **Notion Portfolio**: Display dynamic project data from Notion.
4. **Interest Tracking**: Let users store interesting projects in their “Interested” list.
5. **Security**: Protect sensitive routes via Supabase session checks and rate limiting middleware.

---

## 2. Architecture & Folder Structure

### 2.1 Folder Structure

```bash
bash
Copy
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Client Component (chat-based login)
│   │   ├── callback/
│   │   │   └── route.ts           # Server Component (auth callback)
│   │   └── layout.tsx             # Server Component (auth layout)
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts           # Server Component (POST /api/chat)
│   │   └── interested/
│   │       └── route.ts           # Server Component (POST/GET/DELETE /api/interested)
│   ├── portfolio/
│   │   ├── [id]/
│   │   │   └── page.tsx           # Server Component (project detail)
│   │   └── page.tsx               # Server Component (portfolio listing)
│   ├── interested/
│   │   └── page.tsx               # Server Component (displays user’s interests)
│   ├── layout.tsx                 # Server Component (main layout)
│   └── page.tsx                   # Server Component (homepage / chat interface)
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── ChatInterface.tsx          # Client Component
│   └── ProjectCard.tsx            # Client Component
├── lib/
│   ├── supabase/                  # Supabase client logic
│   └── utils.ts                   # Utility functions
└── services/
    ├── gpt/
    │   └── chat.ts                # GPT logic / openai calls
    └── notion/
        └── getProjects.ts         # Notion fetch logic

```

### 2.2 Key Dependencies & Versions

- **Next.js** 14.1.0
- **@supabase/supabase-js** ^2.39.3
- **@supabase/auth-helpers-nextjs** ^0.9.0
- **@notionhq/client** ^2.2.14
- **openai** ^4.26.0
- **framer-motion** ^11.0.3
- **tailwindcss** ^3.4.1
- **shadcn-ui** ^0.8.0

---

## 3. API Endpoints & Methods

### 3.1 Chat API

**Route**: `POST /api/chat`

- **Request**:
    
    ```
    ts
    Copy
    interface ChatRequest {
      message: string;
      thread_id?: string; // optional, if user already has a thread
    }
    
    ```
    
- **Response**:
    
    ```
    ts
    Copy
    interface ChatResponse {
      content: string;
      thread_id: string;
      error?: string;
    }
    
    ```
    
- **Sample**:
    
    ```json
    json
    Copy
    // Request
    {
      "message": "Tell me about your projects",
      "thread_id": "thread_abc123"
    }
    
    // Response
    {
      "content": "I'd be happy to tell you about...",
      "thread_id": "thread_abc123"
    }
    
    ```
    
- **Error Handling**:
    - Returns `{ error: 'Chat failed', code: 'CHAT_FAILED' }` with **500** if an internal error occurs.
    - Middleware enforces session (`401` if not logged in).

### 3.2 Interested API

**Route**: `POST /api/interested`

- **Description**: Create an “interested” record linking a user to a project.
- **Request**:
    
    ```
    ts
    Copy
    interface InterestedRequest {
      project_id: string;
    }
    
    ```
    
- **Response**:
    
    ```
    ts
    Copy
    interface InterestedResponse {
      success: boolean;
      interest_id: string;
    }
    
    ```
    
- **Error Handling**:
    - If insertion fails, returns `{ error: error.message }` with **400**.
    - `ALREADY_INTERESTED` could be a custom error code if user already saved the same project.

**Route**: `GET /api/interested`

- **Description**: Fetch user’s interests + joined project data.
- **Response**:
    
    ```
    ts
    Copy
    interface GetInterestsResponse {
      interests: {
        id: string;
        project_id: string;
        created_at: string;
        project: NotionProject;
      }[];
    }
    
    ```
    
- **Error Handling**:
    - `401 Unauthorized` if no session.
    - If DB query fails, return `status: 400 or 500` with an error message.

**Route**: `DELETE /api/interested`

- **Description**: Remove an interest record by `interest_id`.
- **Request**:
    
    ```
    ts
    Copy
    interface DeleteInterestRequest {
      interest_id: string;
    }
    
    ```
    
- **Response**: Typically `{ success: boolean }`, or error if no such record.

---

## 4. Error Handling & Status Codes

**Standard Error Structure**:

```
ts
Copy
interface ApiError {
  error: string;
  code?: string;
  status: number;
}

```

**Status Codes**:

- `200 OK`
- `400 BAD_REQUEST`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `404 NOT_FOUND`
- `429 RATE_LIMITED`
- `500 SERVER_ERROR`

**Custom Error Codes**:

- `CHAT_FAILED`
- `INVALID_PROJECT`
- `ALREADY_INTERESTED`
- `SESSION_REQUIRED`

---

## 5. Authentication & Middleware

### 5.1 Authentication Flow

- **Passwordless** via Supabase.
- A custom callback in `app/(auth)/callback/route.ts` finalizes login.
- Protected routes rely on **middleware** checking user session via `supabase.auth.getSession()`.

### 5.2 Middleware Configuration

```
ts
Copy
export const config = {
  matcher: [
    '/api/chat',
    '/api/interested/:path*',
    '/interested'
  ]
};

export async function middleware(request: NextRequest) {
  const { supabase, response } = createRouteHandlerClient(request);
  const session = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'SESSION_REQUIRED' },
      { status: 401 }
    );
  }

  return response;
}

```

- Enforces that `chat` and `interested` endpoints (and pages) require a valid session.

### 5.3 Rate Limiting

- The same middleware or a layered approach checks for request count per IP:
    
    ```
    ts
    Copy
    if (rateLimit.remaining === 0) {
      return NextResponse.json(
        { error: 'Too many requests', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }
    
    ```
    

---

## 6. Database Schema & Tables

**Profiles**:

```sql
sql
Copy
create table profiles (
  id uuid references auth.users (id) primary key,
  email text,
  full_name text,
  gpt_thread_id text,
  created_at timestamptz default timezone('utc', now())
);

```

- Tied to `auth.users` in Supabase.

**Interests**:

```sql
sql
Copy
create table interests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles (id),
  project_id text,
  created_at timestamptz default timezone('utc', now())
);

```

- Each record links a `user_id` to a `project_id` from Notion or an internal ID.

---

## 7. GPT Integration

- **Endpoints**: `POST /api/chat` calls `openai.beta.threads.messages.create()` and subsequent `runs.create()`.
- The system uses an **OpenAI** assistant ID from `process.env.OPENAI_ASSISTANT_ID`.
- The response is polled with a helper function `waitForCompletion(run.id, response.thread_id)` to finalize the content.
- `thread_id` stored in `profiles.gpt_thread_id` for continuity across chat sessions.

---

## 8. Notion Integration

- Fetched via `services/notion/getProjects.ts`, retrieving a list of Notion pages or a single project by ID.
- No caching or ISR yet; each request fetches from Notion.
- Potential future: enable revalidation or a local cache for faster load times.

---

## 9. Portfolio & Interested Feature

- **Portfolio**:
    - `/portfolio` → List of projects (server component).
    - `/portfolio/[id]` → Detailed view with “Interested!” button or link.
    - Triggering “Interested!” calls `POST /api/interested` with `{ project_id }`.
- **Interested**:
    - `/interested` → Server component showing the user’s saved items (GET /api/interested).
    - Allows user to remove an item (DELETE /api/interested with `interest_id`).

---

## 10. Additional Utilities & Future Directions

- **No Cron/Background Tasks**: All requests are user-driven.
- **Utility Functions** in `lib/utils.ts` handle common ops.
- **Rate Limiting**: Basic approach in middleware. Could expand to persistent store if usage grows.
- **Potential**:
    - **OpenAPI/Swagger** docs for clarity on request/response shapes.
    - **Incremental Static Regeneration** or caching for Notion data.
    - **Expanded GPT** usage: store chat logs, advanced conversation management.

---

## 11. Deployment & Configuration

- **Deployed on Vercel**:
    - Auto-build from main branch.
    - Commands in `package.json`:
        
        ```json
        json
        Copy
        {
          "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
          }
        }
        
        ```
        
    - Environment variables (`SUPABASE_...`, `OPENAI_API_KEY`, `NOTION_API_KEY`) configured in Vercel’s dashboard.

**Notes**:

- Each push triggers a new build & deployment.
- All environment variables must be set for GPT, Notion, and Supabase to function.

---

## 12. Success Metrics

1. **Chat Interaction**: # of chat requests via `/api/chat`.
2. **Interest Rate**: # of times users mark a project “interested.”
3. **Auth Conversion**: # of sign-up completions vs. attempts.
4. **Error Rate**: Frequency of `CHAT_FAILED`, `SESSION_REQUIRED`, or `RATE_LIMITED` errors.
5. **Performance**: Time to fetch portfolio data from Notion, API response times.

---

## Conclusion

This **updated PRD** incorporates detailed **API request/response** structures, **error codes**, and **middleware** specifics to give a holistic view of the system. It clarifies how:

- **Chat** and **Interested** endpoints operate, including method, payload, and error handling.
- **Session** checks, **rate limiting**, and **Supabase** integration secure and shape each API call.
- **Notion** provides portfolio data, while **GPT** handles user-specific conversation threads.

With these details, your team can confidently develop, maintain, and extend the app—adding caching, advanced GPT features, or robust OpenAPI docs as next steps.