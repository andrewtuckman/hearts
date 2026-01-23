# :hearts: Hearts :hearts:

Welcome to **Hearts**, a classic trick-taking card game brought to life in this digital implementation! Gather your friends (or AI opponents) and enjoy the strategic and competitive gameplay of Hearts, where the goal is to avoid certain cards—or embrace them to "shoot the moon" and turn the tables on your opponents.

:warning: This game is a work in progress! :warning:

## 📚 Documentation

**Start here**: [Complete Architecture Documentation](./docs/ARCHITECTURE.md)

Key documents:
- [System Overview](./docs/architecture/SYSTEM_OVERVIEW.md) - High-level design and components
- [Data Flow](./docs/design/DATA_FLOW.md) - State management and game flow
- [Bot System Plan](./docs/architecture/BOT_SYSTEM.md) - AI implementation details
- [Bot Implementation Guide](./docs/implementation/BOT_IMPLEMENTATION_GUIDE.md) - Step-by-step development
- [Development Setup](./docs/implementation/SETUP.md) - Getting started

## Project Structure

For detailed architecture, see [SYSTEM_OVERVIEW.md](./docs/architecture/SYSTEM_OVERVIEW.md).

- **`/src/game`** - TypeScript game engine (rules, logic, AI)
- **`/src/components`** - React UI components
- **`/src/utils`** - Utility functions
- **`/docs`** - Complete documentation
- **`/src/hooks`** - WIP
- **`/src/context`** - WIP
- **`/public/cards`** -
Static resources including card SVGs.  
This game uses images from [The Public Domain Review](https://publicdomainreview.org/).
* Hearts: [The Lens of Desire: Eye Miniatures (ca. 1790–1810)](https://publicdomainreview.org/collection/eye-miniatures/)
* Spades: [Prophecies of apocalypse (ca. 1827–61)](https://pdimagearchive.org/images/63261fca-78ba-4b7e-b2f0-ab4505c4d35e/)
* Diamonds: [The Cat’s Maew: Thai Treatise on Auspicious Felines (19th Century)](https://publicdomainreview.org/collection/tamra-maew/)

## Game Rules

- **Objective**: Score the fewest points by the end of the game. The game ends when a player reaches 100 points, and the player with the lowest score wins.
- **Card Values**:
  - Each heart :hearts: is worth 1 point.
  - The Queen of Spades :spades: is worth 13 points.
- **Gameplay**:
  1. Players are dealt 13 cards each.
  2. At the start of each round, players pass 3 cards to another player (left, right, across, or hold, depending on the round).
  3. The player with the 2 of Clubs :clubs: plays first.
  4. Players take turns playing one card per trick, following the suit of the first card played if possible.
  5. The player who wins the trick collects all cards and starts the next trick.
  6. Hearts :hearts: and the Queen of Spades :spades: cannot be played on the first trick.
- **Scoring**:
  - At the end of each round, players tally their points based on the cards they collected.
  - If a player collects all hearts :hearts: and the Queen of Spades :spades:, they "shoot the moon," giving 26 points to all other players instead of themselves.

Are you ready to outwit your opponents and master the art of Hearts? Let the game begin!

## Getting Started

For development setup, see [SETUP.md](./docs/implementation/SETUP.md).