# Development Setup

## Prerequisites

- Node.js 18+
- npm 9+
- Git
- Code editor (VS Code recommended)

## Installation

```bash
# Clone or navigate to project
cd hearts

# Install dependencies
npm install

# Verify installation
npm run lint
npm test
```

## Project Structure

```
hearts/
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md    # Start here
│   ├── architecture/      # Detailed architecture docs
│   ├── design/            # Design docs
│   └── implementation/    # Step-by-step guides
├── src/
│   ├── game/             # Game logic (non-React)
│   ├── components/       # React components
│   └── utils/            # Utility functions
├── tests/                # Test files
├── public/               # Static assets
└── package.json
```

## Development Workflow

### Running the development server

```bash
npm start
```

Server runs at `http://localhost:3000` with hot reload.

### Code quality

```bash
# Lint and format code
npm run lint

# Run tests
npm test

# Run all checks before commit (automatic)
# The pre-commit hook runs: npm run lint && npm test
```

### Building for production

```bash
npm run build

# Output in build/ directory
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server (port 3000) |
| `npm test` | Run Jest tests |
| `npm run lint` | Lint and format code |
| `npm run build` | Production build |

## Testing

### Running tests

```bash
# All tests
npm test

# Specific test file
npm test botUtils.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Writing tests

Tests go in `tests/` directory, mirroring `src/` structure:

```
tests/
├── game/
│   ├── logic/
│   │   ├── trick.test.ts
│   │   └── hand.test.ts
│   └── ai/
│       ├── botUtils.test.ts
│       └── simpleBot.test.ts
├── components/
│   └── (component tests)
└── setupTests.ts
```

## Code Style

- **Language**: TypeScript with strict mode
- **Formatter**: Prettier
- **Linter**: ESLint
- **Style**: Functional components with hooks

### TypeScript Configuration

- `src/tsconfig.json` - Strict type checking enabled
- All imports should have explicit types
- Avoid `any` types

### Naming Conventions

- **Components**: PascalCase (Hand, Card, GameRoot)
- **Functions**: camelCase (playCard, getValidCards)
- **Constants**: UPPER_SNAKE_CASE (LOSING_SCORE, Suits)
- **Types**: PascalCase interfaces, lowercase unions

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. React DevTools extension for component inspection
3. Console for error messages
4. Performance tab for optimization

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Chrome",
      "port": 9222,
      "pathMapping": {
        "/": "${workspaceRoot}/",
        "/static/js/bundle.js": "${workspaceRoot}/src"
      }
    }
  ]
}
```

## Git Workflow

Pre-commit hooks are configured with Husky:

```bash
# Automatic lint + test before commit
git commit -m "Your message"

# If tests fail, commit is blocked
# Fix the issues and try again
```

## Common Issues

### Port 3000 already in use

```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti :3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Test failures

```bash
# Clear Jest cache
npm test -- --clearCache

# Then run tests again
npm test
```

## Next Steps

1. Read [SYSTEM_OVERVIEW.md](../architecture/SYSTEM_OVERVIEW.md)
2. Explore [DATA_FLOW.md](../design/DATA_FLOW.md)
3. Check [BOT_SYSTEM.md](../architecture/BOT_SYSTEM.md)
4. Follow [BOT_IMPLEMENTATION_GUIDE.md](./BOT_IMPLEMENTATION_GUIDE.md)

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/)
- [Hearts Card Game Rules](https://www.pagat.com/reverse/hearts.html)

## Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review relevant test files for examples
3. Check Git history for context on decisions
