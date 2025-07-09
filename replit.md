# StockAnalyzer Pro

## Overview

StockAnalyzer Pro is a comprehensive stock analysis platform built with React frontend and Express backend. It provides real-time stock data visualization, technical indicators, AI-powered insights, and interactive charts. The application integrates with Yahoo Finance for stock data and uses Google's Gemini AI for intelligent stock analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Plotly.js for interactive stock charts
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **External APIs**: Yahoo Finance (via Python script), Google Gemini AI
- **Session Management**: In-memory storage with optional database persistence
- **Development**: Hot module replacement with Vite middleware

## Key Components

### Data Layer
- **Database Schema**: Stock data and chat messages tables using Drizzle ORM
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database persistence
- **Data Validation**: Zod schemas for type-safe data handling

### Frontend Components
- **Stock Input**: Symbol search and period selection
- **Stock Overview**: Company information and key metrics display
- **Interactive Charts**: Real-time price charts with technical indicators
- **AI Chat**: Conversational interface for stock analysis
- **Data Table**: Filterable and sortable historical data view
- **Technical Indicators**: RSI, moving averages, and other technical analysis tools

### Backend Services
- **Yahoo Finance Service**: Python integration for real-time stock data fetching
- **Gemini AI Service**: Google AI integration for intelligent stock analysis
- **Stock Data API**: RESTful endpoints for stock information retrieval
- **Chat API**: Conversational AI endpoints for stock insights

## Data Flow

1. **Stock Data Retrieval**: User enters stock symbol → Backend calls Yahoo Finance API via Python → Data processed and stored → Frontend displays charts and metrics
2. **AI Analysis**: User asks question → Backend sends context to Gemini AI → AI response processed and returned → Frontend displays conversational response
3. **Real-time Updates**: Stock data refreshed on symbol/period change → Charts and indicators updated automatically
4. **Historical Data**: Stored in database for quick access and trend analysis

## External Dependencies

### APIs and Services
- **Yahoo Finance**: Real-time stock data, company information, and historical prices
- **Google Gemini AI**: Natural language processing for stock analysis and insights
- **Neon Database**: PostgreSQL hosting for production deployments

### Key Libraries
- **@neondatabase/serverless**: Database connectivity
- **@google/genai**: Google AI integration
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **plotly.js-dist**: Interactive charting
- **@radix-ui/***: Accessible UI components

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot module replacement
- **Database**: Local PostgreSQL or Neon serverless
- **Environment Variables**: DATABASE_URL, GEMINI_API_KEY

### Production Build
- **Frontend**: Vite production build with static asset optimization
- **Backend**: ESBuild compilation for Node.js deployment
- **Database**: Neon serverless PostgreSQL
- **Static Assets**: Served from Express with proper caching headers

### Architecture Decisions

#### Database Choice
- **Problem**: Need for structured data storage with relationships
- **Solution**: PostgreSQL with Drizzle ORM
- **Rationale**: Type safety, excellent TypeScript integration, and serverless compatibility
- **Alternatives**: SQLite (limited scalability), MongoDB (less structured)

#### AI Integration
- **Problem**: Need for intelligent stock analysis and insights
- **Solution**: Google Gemini AI with contextual prompting
- **Rationale**: Advanced language model with good performance and cost-effectiveness
- **Alternatives**: OpenAI GPT (more expensive), local models (resource intensive)

#### Frontend State Management
- **Problem**: Complex server state synchronization and caching
- **Solution**: TanStack Query for server state, local React state for UI
- **Rationale**: Automatic caching, background updates, and error handling
- **Alternatives**: Redux (overkill), SWR (less features), Context API (no caching)

#### Chart Library
- **Problem**: Need for interactive, professional-grade financial charts
- **Solution**: Plotly.js with dynamic imports
- **Rationale**: Comprehensive charting features, good performance, and financial chart support
- **Alternatives**: Chart.js (less features), D3.js (more complex), Recharts (limited financial features)

#### UI Component Strategy
- **Problem**: Need for accessible, consistent, and customizable UI components
- **Solution**: Radix UI primitives with shadcn/ui design system
- **Rationale**: Accessibility compliance, headless architecture, and Tailwind integration
- **Alternatives**: Material-UI (heavier), Chakra UI (less customizable), custom components (time-consuming)