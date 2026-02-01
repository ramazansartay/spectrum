# FTC Spectrum

## Overview

FTC Spectrum is a marketplace web application for buying and selling FIRST Tech Challenge (FTC) robotics parts and components. The platform connects FTC teams to trade electronics, motors, servos, sensors, and other robotics equipment. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared for shared modules)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schema validation
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC)
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: shared/schema.ts (listings) and shared/models/auth.ts (users, sessions)
- **Migrations**: Drizzle Kit with push command (db:push)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn + custom)
│   ├── hooks/           # React Query hooks for API calls
│   ├── pages/           # Route pages (Home, Search, Profile, Chat, etc.)
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route handlers
│   ├── storage.ts       # Database operations
│   └── replit_integrations/auth/  # Replit Auth setup
├── shared/              # Shared between frontend and backend
│   ├── schema.ts        # Drizzle database schemas
│   ├── routes.ts        # API route definitions with Zod
│   └── models/auth.ts   # User and session schemas
└── attached_assets/     # Legacy HTML/CSS/JS reference files
```

### Key Design Patterns
- **Shared Route Definitions**: API contracts defined once in shared/routes.ts, consumed by both frontend hooks and backend handlers
- **Type Safety**: End-to-end TypeScript with Zod validation at API boundaries
- **Component Library**: shadcn/ui provides accessible, customizable primitives
- **Monorepo-lite**: Single package.json with path aliases connecting frontend, backend, and shared code

## External Dependencies

### Database
- **PostgreSQL**: Primary data store (provisioned via DATABASE_URL environment variable)
- **Required Tables**: users, sessions, listings

### Authentication
- **Replit Auth**: OIDC-based authentication requiring:
  - `ISSUER_URL` (defaults to https://replit.com/oidc)
  - `REPL_ID` (auto-set by Replit)
  - `SESSION_SECRET` for session encryption

### Development Tools
- **Vite Plugins**: 
  - @replit/vite-plugin-runtime-error-modal (error display)
  - @replit/vite-plugin-cartographer (dev navigation)
  - @replit/vite-plugin-dev-banner (development indicator)

### UI Dependencies
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling with CSS variables for theming

### Build & Runtime
- **TSX**: TypeScript execution for development
- **esbuild**: Server bundling for production
- **Vite**: Frontend bundling and dev server