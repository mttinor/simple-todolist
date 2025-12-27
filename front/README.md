# Todo List Frontend

Next.js frontend for the Todo List application.

## Features

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Authentication (sign in, sign up, anonymous)
- Todo management with recurring tasks
- Daily, Weekly, and Monthly views

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run dev

# production build
npm run build
npm start
```

The app will run on `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This should point to your NestJS backend URL.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components
- `lib/` - Utilities and API client
  - `api.ts` - API client for backend communication
  - `auth-context.tsx` - Authentication context provider

