# Your Week in Oahu, Hawaii

A curated travel guide for a 7-day Oahu itinerary. Built for a couple from Los Angeles, it combines a polished web experience with an AI concierge that answers questions about the itinerary, restaurants, beaches, and practical logistics.

## Features

- **7-Day Itinerary** — Day-by-day plan with morning, afternoon, and evening activities
- **Beach Guide** — Curated beaches with tips and conditions
- **Locations Guide** — Nature spots, shopping, and points of interest
- **Food Guide** — Restaurants, food trucks, and local eats
- **Practical Tips** — Parking, reservations, reef-safe sunscreen, and logistics
- **AI Chat Concierge** — Ask questions about the itinerary; responses are grounded in the guide content (English and Japanese)
- **Bilingual** — Full English and Japanese support via i18next
- **Entity Popovers** — Click beaches, restaurants, and locations for quick details and map links
- **Image Lightbox** — Expand photos from the guide

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4**
- **Framer Motion** — Animations and transitions
- **i18next** + **react-i18next** — Internationalization
- **OpenAI** — Chat API (GPT) for the concierge
- **Vercel** — Hosting and serverless API

## Project Structure

```
├── api/
│   └── chat.js          # Serverless chat endpoint (OpenAI)
├── src/
│   ├── components/      # Hero, Nav, Itinerary, guides, ChatWidget, etc.
│   ├── hooks/           # useChat
│   ├── locales/         # en.json, ja.json
│   ├── utils/           # entityMatch, mapsUrl
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vercel.json          # Vercel config (API routes, function timeout)
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` (or `.env`) with:

```
OPENAI_API_KEY=sk-...
```

The chat API requires this key. The frontend runs without it, but the chat widget will fail until the API is configured.

### Development

```bash
npm run dev
```

Runs the app at `http://localhost:5173`.

For the chat to work locally, you need either:

1. **Vercel dev** — `vercel dev` to run the API routes locally, or  
2. **Deployed API** — Point the app at a deployed Vercel instance that has `OPENAI_API_KEY` set.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment (Vercel)

The project is set up for Vercel:

- Static frontend from `dist/`
- Serverless API at `/api/chat` (30s max duration)
- Set `OPENAI_API_KEY` in Vercel project environment variables

## API

### `POST /api/chat`

Request body:

```json
{
  "messages": [{ "role": "user", "content": "What time does Duke's open?" }],
  "lang": "en"
}
```

Response:

```json
{
  "reply": "Duke's Waikiki is open daily..."
}
```

- **Rate limit**: 10 requests per minute per IP
- **Max message length**: 500 characters
- **CORS**: Allows localhost and `*.vercel.app` origins
