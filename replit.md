# LegalOps AI - Legal Technology Platform

## Overview

LegalOps AI is a comprehensive legal technology platform designed to assist lawyers and law students with various legal tasks through AI-powered tools. The application provides features like contract generation, case law research, legal document summarization, and Q&A assistance specifically tailored for Indian law.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6 for client-side navigation
- **State Management**: TanStack Query for server state management
- **Styling**: Custom CSS variables with Ivo.ai design system

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Development**: tsx for TypeScript execution
- **API Design**: RESTful endpoints with /api prefix
- **Middleware**: Custom logging and error handling

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL 16 (configured via Neon serverless)
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Connection**: Neon serverless connection pooling

## Key Components

### AI Integration Layer
- **Primary AI Provider**: Google Gemini API (gemini-1.5-flash-latest model)
- **Backup AI Provider**: Puter.js AI chat interface
- **API Key Management**: Hardcoded Gemini API key for development
- **Text Processing**: Markdown rendering with marked.js library

### External Services Integration
- **Supabase**: Document processing edge functions
- **Indian Kanoon API**: Legal case law database integration
- **Web Speech API**: Voice recognition and dictation features

### Document Processing
- **File Upload**: Multi-format document upload (PDF, DOCX, TXT)
- **Text Extraction**: Automated content extraction from legal documents
- **Document Templates**: Pre-built legal document formats
- **Export Capabilities**: Multiple format support (PDF, DOCX, TXT)

### Feature Modules
1. **Contract Generator**: AI-powered legal contract creation
2. **Case Law Finder**: Indian Supreme Court and High Court case search
3. **Legal Q&A Bot (NyayaBot)**: Interactive legal question answering
4. **Section Explainer**: Detailed explanations of legal sections
5. **Voice Dictation**: Speech-to-legal-text conversion
6. **Multi-language Support**: Translation for Indian regional languages
7. **Hearing Tracker**: Calendar-based case management
8. **Citation Checker**: Legal citation validation

## Data Flow

### User Interaction Flow
1. User accesses feature through React Router navigation
2. Frontend component loads with TanStack Query for state management
3. User input is processed through form validation
4. AI API calls are made using Gemini or Puter.js
5. Results are rendered with Markdown parsing
6. Document operations use Supabase edge functions

### Document Processing Flow
1. Files uploaded through drag-and-drop interface
2. Supabase edge function processes document content
3. Text extraction returns structured data
4. Content is available for AI analysis and formatting
5. Results can be exported in multiple formats

### AI Processing Pipeline
1. System instructions define AI behavior per feature
2. User prompts are enhanced with legal context
3. Gemini API processes requests with Indian law focus
4. Responses are formatted for legal document standards
5. Error handling provides fallback to alternative AI providers

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### AI and Processing
- **marked**: Markdown to HTML conversion
- **@hookform/resolvers**: Form validation with Zod schemas
- **date-fns**: Date manipulation and formatting

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Development server and build tool
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 and PostgreSQL 16 modules
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Vite development server with HMR
- **Error Handling**: Runtime error overlay for development

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Process Management**: PM2 or similar for production deployment

### Database Management
- **Schema Updates**: `npm run db:push` applies Drizzle migrations
- **Connection**: Environment variable `DATABASE_URL` required
- **Backup Strategy**: Neon automated backups and point-in-time recovery

## Changelog
- June 25, 2025: Successfully migrated LegalOps AI from Lovable to Replit
  - Migrated from Supabase to PostgreSQL with Drizzle ORM
  - Implemented server-side document processing endpoints
  - Configured Indian Kanoon API authentication system
  - Set up Gemini AI integration for legal document analysis
  - All core features operational except Indian Kanoon API (requires proper private key format)

## User Preferences

Preferred communication style: Simple, everyday language.