# 🎨 Leonardo Kiosk - Museum Experience

A self-contained, production-ready museum kiosk application that allows visitors to have conversations with a 21st-century reincarnation of Leonardo da Vinci. Built with React, Vite, and powered by Groq's fast LLM inference.

## ✨ Features

- **Interactive Conversation:** Talk with Leonardo da Vinci in real-time
- **Beautiful UI:** Renaissance-themed interface with parchment aesthetics
- **Fast Responses:** Powered by Groq API for quick inference
- **Fully Self-Contained:** No external platform dependencies
- **Vercel Ready:** Deploy in seconds with environment variables
- **Offline Fallback:** Mock responses for development mode
- **Responsive Design:** Works on kiosk screens and mobile devices

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  React Frontend (Vite + TailwindCSS)    │
│  - Welcome page                         │
│  - Conversation interface               │
│  - Farewell screen                      │
└──────────────┬──────────────────────────┘
               │ (REST API)
               ▼
┌──────────────────────────────────────────┐
│  Vercel Serverless Function (/api/chat)  │
│  - Request validation                    │
│  - Error handling & CORS                 │
└──────────────┬───────────────────────────┘
               │ (OpenAI-compatible format)
               ▼
┌──────────────────────────────────────────┐
│  Groq API                                │
│  - Fast LLM inference (mixtral-8x7b)     │
└──────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Groq API key (free at https://console.groq.com)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aashutosh2906/leonardo-kiosk.git
   cd leonardo-kiosk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Groq API key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## 📦 Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# You'll be prompted to add environment variables
# Add GROQ_API_KEY when asked
```

### Option 2: Using GitHub

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variables in the dashboard:
   - `GROQ_API_KEY` = your Groq API key
5. Click Deploy

### Option 3: Environment Variables in Vercel Dashboard

1. Go to your project on https://vercel.com/dashboard
2. Click Settings → Environment Variables
3. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your Groq API key
4. Redeploy

## 🎮 Development

### Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Run tests
npm run test
npm run test:watch
```

### Project Structure

```
leonardo-kiosk/
├── api/
│   └── chat.ts              # Vercel serverless function
├── src/
│   ├── components/          # React components
│   │   └── leonardo/        # Leonardo-specific UI components
│   ├── pages/               # Page components (Welcome, Conversation, Farewell)
│   ├── services/            # API client (leonardoApi.ts)
│   ├── config/              # Configuration (leonardo.ts)
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vercel.json              # Vercel deployment configuration
└── package.json             # Dependencies
```

## 🔧 Configuration

### Customizing Leonardo's Personality

Edit `src/config/leonardo.ts` to modify:
- System prompt (Leonardo's behavior and knowledge)
- Mock responses (fallback responses in dev mode)
- UI settings (typewriter speed, inactivity timeout, max turns)

### Changing the LLM Model

In `api/chat.ts`, change the model:

```typescript
const groqRequest: GroqRequest = {
  // ...
  model: "mixtral-8x7b-32768", // Change this
  // ...
};
```

Available Groq models:
- `mixtral-8x7b-32768` (default, fast and capable)
- `llama2-70b-4096` (more powerful)
- `gemma-7b-it` (lightweight)

## 🐛 Troubleshooting

### "GROQ_API_KEY not configured"

- Ensure `GROQ_API_KEY` is in `.env.local` (local dev)
- Ensure `GROQ_API_KEY` is in Vercel dashboard environment variables (production)

### API calls failing locally

- Check that your Groq API key is valid
- Verify your internet connection
- Check Groq API status at https://status.groq.com

### Build failing on Vercel

- Run `npm run build` locally to debug
- Check Vercel deployment logs for errors
- Ensure all environment variables are set in the Vercel dashboard

## 📝 License

MIT License - feel free to use and modify

---

**Made with ❤️ for museum visitors and Leonardo enthusiasts**
