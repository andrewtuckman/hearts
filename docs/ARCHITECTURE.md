# Hearts Game Architecture

Welcome to the comprehensive architecture documentation for the Hearts card game implementation. This project demonstrates clean code organization, React component design, and AI bot implementation.

## 📋 Documentation Map

### Architecture & Design
- **[SYSTEM_OVERVIEW.md](./architecture/SYSTEM_OVERVIEW.md)** - High-level system design and component interaction
- **[BOT_SYSTEM.md](./architecture/BOT_SYSTEM.md)** - Detailed AI bot implementation plan and strategy
- **[DATA_FLOW.md](./design/DATA_FLOW.md)** - Complete game state and data flow diagrams

### Implementation Guides
- **[BOT_IMPLEMENTATION_GUIDE.md](./implementation/BOT_IMPLEMENTATION_GUIDE.md)** - Step-by-step bot development
- **[SETUP.md](./implementation/SETUP.md)** - Development environment setup

## 🎮 Project Overview

Hearts is a React + TypeScript implementation of the classic card game with:
- Full game logic enforcement (valid moves, scoring, hearts rules)
- React component architecture for card display and UI
- AI opponents with strategic decision-making
- Type-safe card system with proper type definitions
- Comprehensive test coverage

## 🏗️ Core Systems

### Game Logic Layer (`src/game/`)
- **models/** - TypeScript types and classes (Card, Game, Trick, Player)
- **logic/** - Pure functions for game rules (trick resolution, card validation, passing)
- **ai/** - Bot implementation (utility functions and decision-making)

### UI Layer (`src/components/`)
- **Card** - Individual card display with rank and suit
- **Hand** - Player's hand with interactive selection
- **OpponentHand** - Face-down opponent card display
- **Trick** - Central trick display with winner highlighting
- **GameRoot** - Main game orchestration and state management

### Utilities (`src/utils/`)
- Helper functions for data transformations
- Player dictionary creation and manipulation

## 🤖 AI Bot System

The bot system is organized into modular, testable components:

1. **botUtils.ts** - Reusable card validation and evaluation functions
2. **simpleBot.ts** - Strategic decision-making implementation
3. **GameRoot integration** - Bot orchestration in the game flow

See [BOT_SYSTEM.md](./architecture/BOT_SYSTEM.md) for detailed specifications.

## 📦 Key Technologies

- **React 18** - UI framework
- **TypeScript 4.9** - Type safety
- **Jest** - Testing framework
- **ESLint & Prettier** - Code quality

## 🔄 Development Workflow

1. **Linting**: `npm run lint` - Checks code quality and formats
2. **Testing**: `npm test` - Runs test suite
3. **Building**: `npm run build` - Production build
4. **Development**: `npm start` - Dev server with hot reload

Pre-commit hooks enforce linting (and eventually testing) before commits.

## 📚 Understanding the Codebase

Start here based on your interest:
- **New to the project?** Read [SYSTEM_OVERVIEW.md](./architecture/SYSTEM_OVERVIEW.md)
- **Want to implement bots?** Jump to [BOT_SYSTEM.md](./architecture/BOT_SYSTEM.md)
- **Understanding data flow?** Check [DATA_FLOW.md](./design/DATA_FLOW.md)
- **Setting up for development?** See [SETUP.md](./implementation/SETUP.md)

## 🎯 Development Roadmap

See [BOT_SYSTEM.md](./architecture/BOT_SYSTEM.md) for the complete bot implementation roadmap with phases and milestones.
