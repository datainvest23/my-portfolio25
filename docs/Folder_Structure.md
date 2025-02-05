
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

