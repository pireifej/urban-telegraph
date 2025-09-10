# Overview

Urban-Telegraph is a personal blog and review platform built with React and Express.js. The application provides a public-facing website for readers to browse articles and an administrative interface for content management. The system supports both local article creation and integration with external blog content, making it a flexible content aggregation and publishing platform.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application uses React with TypeScript, built on a modern component-based architecture:

- **Routing**: Uses `wouter` for lightweight client-side routing
- **State Management**: Combines React Context API with TanStack Query for server state management
- **UI Framework**: Built with Radix UI components and Tailwind CSS for consistent, accessible design
- **Component Structure**: Organized into reusable UI components, page components, and business logic contexts

The application follows a clear separation between public and admin interfaces, with shared components for common functionality like navigation and article display.

## Backend Architecture
The server uses Express.js with TypeScript in a REST API architecture:

- **API Design**: RESTful endpoints for article CRUD operations and external data integration
- **Database Integration**: Uses Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Pattern**: Implements a storage interface pattern for flexible data persistence
- **Development Setup**: Includes Vite integration for hot module replacement during development

## Data Layer
The application uses a PostgreSQL database with Drizzle ORM:

- **Schema Definition**: Centralized schema definitions in `shared/schema.ts` for type safety across frontend and backend
- **Database Management**: Uses Drizzle Kit for migrations and schema management
- **Type Safety**: Leverages Zod for runtime validation and TypeScript for compile-time safety

Key database entities include articles with metadata (title, content, category, status, featured images) and users for authentication.

## Authentication & Authorization
The system includes basic user management infrastructure:

- **User Schema**: Supports username/password authentication model
- **Session Management**: Uses PostgreSQL-backed sessions with `connect-pg-simple`
- **Route Protection**: Backend routes are designed to handle authentication (though frontend auth UI is not implemented)

## External Service Integration
The application integrates with external blog content:

- **External API**: Fetches articles from `prayoverus.com` via POST requests
- **Timezone Support**: Handles timezone-aware content fetching
- **Data Aggregation**: Combines local and external content in the frontend interface

This architecture provides flexibility to display both self-authored content and curated external articles in a unified interface.

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern React patterns
- **Express.js**: Backend web framework for API development
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server with HMR support

## Database & ORM
- **PostgreSQL**: Primary database (configured via Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **@neondatabase/serverless**: Serverless PostgreSQL connection handling

## UI & Styling
- **Radix UI**: Comprehensive component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide Icons**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system built on Radix UI and Tailwind

## State Management & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight routing library for React applications
- **React Hook Form**: Form state management with validation

## Development & Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **tsx**: TypeScript execution for development server

## External APIs
- **prayoverus.com**: External blog content provider accessed via REST API
- **WebSocket support**: Via `ws` library for real-time database connections