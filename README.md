# Readme.md

# Portfolio25 🚀

**Next.js AI-Powered Portfolio with GPT Integration & Notion CMS**

Full Information can be found in [/docs/Product_Requirements.md]
## 📝 Overview

Portfolio25 represents a cutting-edge **Next.js (v14)** application that transforms traditional professional portfolios into dynamic, interactive experiences. This innovative platform seamlessly integrates **GPT-driven chat interactions** for natural conversation flows, **Notion-based content management** for effortless updates and organization, and a sophisticated **user-friendly project interest tracking system** that enables meaningful engagement with portfolio content.

The platform elevates the standard portfolio experience by masterfully combining three core elements: cutting-edge AI technology that facilitates intelligent interactions, a robust and secure authentication system that ensures data privacy, and an expertly crafted intuitive design that makes navigation and exploration effortless for visitors.

## 🌟 Features

- 🔑 **Supabase Authentication** – Passwordless, secure login system
- 💬 **Conversational UI** – AI-powered chat for onboarding & project discovery
- 🧠 **Thread-based AI Memory** – Persistent chat history using OpenAI's GPT
- 📖 **Notion CMS Integration** – Dynamic project management via Notion
- ⭐ **Interest Tracking** – Save and follow favorite projects
- 🔐 **Protected Routes & Middleware** – Enhanced security via session validation
- 🎨 **Beautiful UI** – Styled with **TailwindCSS**, **ShadCN/UI**, and **Framer Motion**
- 📊 **Analytics Dashboard** – User engagement tracking.

## 🏗️ Tech Stack

| Technology | Purpose | Version | Key Features |
| --- | --- | --- | --- |
| **Next.js 14** | Frontend framework | 14.0.0 | Server components, App Router, React Server Components |
| **Supabase** | Authentication & Database | 2.39.0 | PostgreSQL, Row Level Security, Real-time subscriptions |
| **OpenAI API** | AI-powered chat | GPT-4 | Thread management, Context awareness, Natural language processing |
| **Notion API** | Portfolio content | 2024-01 | Page management, Database integration, Rich text support |
| **TailwindCSS** | Styling | 3.4.0 | Utility-first CSS, JIT compiler, Responsive design |
| **ShadCN/UI** | UI components | 0.5.0 | Accessible components, Customizable themes, Modern design |
| **Framer Motion** | Animations | 10.16.0 | Gesture support, Layout animations, Variants system |

---

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**

```bash
git clone <https://github.com/yourusername/portfolio25.git>
cd portfolio25

```

### 2️⃣ **Install Dependencies**

```bash
bash
CopyEdit
npm install
# or
yarn install

```

### 3️⃣ **Set Up Environment Variables**

Create a `.env.local` file and fill in the necessary credentials (refer to `.env.local.example`).

```
plaintext
CopyEdit
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NOTION_API_KEY=your_notion_api_key

```

### 4️⃣ **Run the Development Server**

```bash
bash
CopyEdit
npm run dev

```

Open [http://localhost:3000](http://localhost:3000/) in your browser.

---

## 📂 Project Structure

```
bash
CopyEdit
📂 datainvest23-my-portfolio25/
├── 📂 components/            # UI Components
│   ├── Layout.tsx           # Page Layout
│   ├── ChatWindow.tsx       # GPT Chat Interface
│   ├── PortfolioCard.tsx    # Portfolio Project Card
│   ├── Sidebar.tsx          # Sidebar Navigation
│   ├── InterestButton.tsx   # "Interested" button component
│   └── ui/                  # Custom UI elements (buttons, inputs, etc.)
├── 📂 src/
│   ├── 📂 app/
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Main Layout
│   │   ├── (auth)/          # Authentication pages
│   │   │   ├── login/page.tsx    # Login page
│   │   │   ├── callback/route.ts # Authentication callback
│   │   ├── portfolio/[id]/page.tsx  # Portfolio project details
│   │   ├── interested/page.tsx     # User's interested projects
│   │   ├── conversation/page.tsx   # AI Chat interaction
│   │   ├── api/
│   │   │   ├── gpt/message/route.ts  # GPT Message API
│   │   │   ├── gpt/thread/route.ts   # GPT Thread API
│   │   │   ├── notion/project/[id]/route.ts  # Notion Project Fetch API
│   │   │   ├── interested/route.ts   # Interest tracking API
│   │   │   ├── auth/callback/route.ts # Supabase Auth Callback
│   │   ├── middleware.ts       # API security middleware
│   ├── 📂 lib/
│   │   ├── notion.ts         # Notion API helpers
│   │   ├── openai.ts         # OpenAI API handlers
│   │   ├── supabaseClient.ts # Supabase client setup
│   │   ├── utils.ts          # General utility functions
├── 📜 LICENSE
├── 📜 README.md
├── 📜 package.json
├── 📜 next.config.js
└── 📜 tailwind.config.js

```

---

## 🔌 API Endpoints

### 🎤 **GPT Chat API**

**Endpoint:** `POST /api/gpt/message/`

Handles user messages and retains conversation **thread ID**.

---

### 📖 **Notion Portfolio API**

**Endpoint:** `GET /api/notion/project/[id]`

Fetches project details from Notion.

---

### ⭐ **Interested Projects API**

**Endpoint:** `POST /api/interested/`

Saves projects as "interested."

---

## 🔒 Authentication & Security

- 🔹 **Supabase Authentication**: Magic link for passwordless login.
- 🔹 **Session-Based Middleware**: Routes are protected using session validation.
- 🔹 **JWT Token Handling**: Supabase stores secure authentication tokens.

---

## 🛠️ Deployment

Portfolio25 is **Vercel-ready**. Deploy instantly:

### 🏗️ **Manual Deployment**

1. **Build the Project**:
    
    ```bash
    npm run build
    
    ```
    
2. **Start the Server**:
    
    ```bash
    npm start
    
    ```
    

---

## 👥 Contributing

We welcome contributions! Follow these steps:

1. Fork the repo.
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Added new feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request 🎉

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🎯 Roadmap

🚀 Future Enhancements:

- 🌍 **Multilingual Support**
- 🏆 **Gamification Features**
- 📊 **Advanced User Analytics**
- 🔄 **Automated Notion Syncing**

---

## 💬 Feedback & Support

- 📧 **Email**: support@dataInvest.guru
- 💬 **Join Discord**: Portfolio25 Community

---

### ⭐ **If you like this project, consider giving it a star!** ⭐

---

Made with ❤️ by **Marc Muller / DataInvest.guru**.

Full Information can be found in [/docs/Product_Requirements.md]