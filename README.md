# RisunicPower

**Industrial Power Supply Manufacturer** — Since 2014, Shenzhen.

POE power supplies · adapters · bare board power · UPS · inverters · portable power stations · micro inverters · all-in-one ESS · industrial power supplies. 59 products, 12 categories, OEM/ODM to 30+ countries.

🌐 **[risunicpower.com](https://risunicpower.com)**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (via Prisma ORM) |
| i18n | next-intl (9 locales: en/zh/ja/es/de/fr/pt/ar/ru) |
| Payments | Stripe |
| AI Chat | DeepSeek API |
| Deployment | Docker + Nginx reverse proxy |

## Quick Start

```bash
git clone https://github.com/Erichhsu/risunicpower.git
cd risunicpower
cp .env.example .env
# Edit .env with your configuration
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
# → http://localhost:3000
```

## Environment Variables

See `.env.example` for all required variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite or PostgreSQL connection URL |
| `NEXT_PUBLIC_SITE_URL` | Yes | Site base URL |
| `SMTP_*` | Yes | Outbound email for contact/inquiry forms |
| `STRIPE_*` | Optional | Payment processing |
| `DEEPSEEK_API_KEY` | Optional | AI chat assistant |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics |

## Production Build

```bash
npm run build
npm start
# → http://localhost:3000
```

## Docker Deployment

```bash
docker compose up -d --build
```

The stack includes:
- Next.js app (internal port 3000)
- Nginx reverse proxy (ports 80/443)
- Health check at `/api/health`
- Automatic SSL via mounted certificates (`./ssl/`)

### SSL Certificate

Mount your TLS certificates:

```
ssl/
├── fullchain.pem
└── privkey.pem
```

## i18n

9 locales, 148 translation keys each. Translation files live in `messages/`.

| Locale | Code | Coverage |
|--------|------|----------|
| English | en | 100% |
| 简体中文 | zh | 100% |
| 日本語 | ja | 100% |
| Español | es | 100% |
| Deutsch | de | 100% |
| Français | fr | 100% |
| Português | pt | 100% |
| العربية | ar | 100% |
| Русский | ru | 100% |

## Product Data

- 59 products across 12 categories
- Full 9-language translations for names, features, specs
- Seed data: `prisma/seed_data.json`
- Reseed: `npx tsx prisma/seed.ts`

## Project Structure

```
src/
├── app/[locale]/       # i18n-routed pages
│   ├── products/       # Product catalog (category → detail)
│   ├── blog/           # Blog posts
│   ├── case-studies/   # Client case studies
│   ├── contact/        # Contact form
│   └── cart/           # Shopping cart + checkout
├── components/         # Reusable UI components
├── lib/                # DB client, i18n config, utilities
messages/               # i18n JSON translation files
prisma/                 # Schema + seed data
public/images/products/ # Product images (1 folder per SKU)
```

## API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/health` | Health check |
| `/api/inquiry` | Contact/inquiry form submission |
| `/api/search` | Product search |
| `/api/reviews` | Product reviews |
| `/api/ai-chat` | AI customer assistant |
| `/api/stripe/*` | Stripe checkout + webhooks |
| `/api/exchange-rates` | Currency conversion |

## License

Proprietary. All rights reserved.
