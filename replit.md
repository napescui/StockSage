# StockAnalyzer Pro

## Overview

StockAnalyzer Pro is a comprehensive financial analysis platform built with React frontend and Express backend. It provides real-time financial data visualization, technical indicators, AI-powered insights, and interactive charts for stocks, indices, bonds, cryptocurrencies, and commodities. The application integrates with Yahoo Finance for financial data and uses Google's Gemini AI for intelligent analysis with emoji and markdown support.

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
- **Home Page**: Main dashboard with categories for stocks, indices, bonds, crypto, and commodities
- **Asset Detail Page**: Comprehensive analysis view for individual financial instruments
- **Stock Input**: Symbol search and period selection
- **Stock Overview**: Company information and key metrics display
- **Interactive Charts**: Real-time price charts with technical indicators
- **AI Chat**: Conversational interface with emoji and markdown support
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

#### Multi-Category Financial Platform
- **Problem**: Need to support multiple types of financial instruments beyond stocks
- **Solution**: Category-based navigation with hundreds of instruments across stocks, indices, bonds, crypto, and commodities
- **Rationale**: Comprehensive financial analysis platform covering all major asset classes
- **Date**: July 2025

#### Database Choice
- **Problem**: Need for structured data storage with relationships
- **Solution**: PostgreSQL with Drizzle ORM
- **Rationale**: Type safety, excellent TypeScript integration, and serverless compatibility
- **Alternatives**: SQLite (limited scalability), MongoDB (less structured)

#### AI Integration Enhancement
- **Problem**: Need for intelligent financial analysis with engaging presentation
- **Solution**: Google Gemini AI with emoji and markdown formatting support
- **Rationale**: Enhanced user experience with visual formatting and emoji support
- **Date**: July 2025

#### Routing Structure
- **Problem**: Need for scalable navigation between instrument categories and individual assets
- **Solution**: Home page with category selection, dedicated asset detail pages with dynamic routing
- **Rationale**: Clear separation of concerns and scalable navigation for hundreds of instruments
- **Date**: July 2025

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

### Recent Changes
- **July 2025**: Successfully migrated from Replit Agent to Replit environment with enhanced security
- **July 2025**: Configured Python environment with yfinance package for authentic stock data retrieval
- **July 2025**: Set up Gemini AI API key permanently for chatbot functionality
- **July 2025**: Fixed React duplicate key warnings by removing duplicate instruments from financial data
- **July 2025**: Verified client/server separation architecture maintains security best practices
- **July 2025**: Restructured application with main category page and individual asset detail pages
- **July 2025**: Added support for indices, bonds, cryptocurrencies, and commodities (200+ instruments)
- **July 2025**: Enhanced AI chat with emoji and markdown formatting support
- **July 2025**: Implemented Indonesian language interface for better user experience
- **July 2025**: Added financial data verification system requiring user approval before showing sensitive data
- **July 2025**: Implemented entity-specific news integration for each financial instrument
- **July 2025**: Fixed and enhanced Gemini AI chatbot with proper API key configuration and detailed error handling
- **July 2025**: Enhanced live charts with super detailed price movements for 15-second intervals showing current date (July 10, 2025)