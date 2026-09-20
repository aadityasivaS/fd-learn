# FD Learn

An interactive Next.js app for learning and practicing functional dependencies.

# .env file config

```
# Server-only Gemini configuration
GEMINI_API_KEY=
# Use a long random value; never expose this as NEXT_PUBLIC_*
QUIZ_SIGNING_SECRET=
```

you can generate one signing secret with powershell

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Requirements

- Node.js 20 or newer
- pnpm 10.20.0 or newer

## Run Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other Commands

```bash
pnpm lint
pnpm test
pnpm build
pnpm start
```
