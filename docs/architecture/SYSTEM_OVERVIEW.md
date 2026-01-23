# System Overview

## Game Architecture

The Hearts game is organized into three main layers:

### 1. Game Logic Layer
Pure TypeScript logic separated from UI, responsible for game rules and state management.

**Location**: `src/game/`

```
game/
├── models/
│   ├── classes.ts      (Game, Trick, Player, Card, Scoreboard)
│   ├── constants.ts    (Suits, Ranks, PIDs, Phases)
│   └── types.ts        (Type definitions)
├── logic/
│   ├── deck.ts         (Card creation, shuffling, dealing)
│   ├── hand.ts         (Card manipulation in hands)
│   ├── trick.ts        (Trick resolution, winner determination)
│   ├── pass.ts         (Card passing logic)
│   └── scoreboard.ts   (Score tracking)
└── ai/
    ├── botUtils.ts     (Card validation, evaluation utilities)
    └── simpleBot.ts    (AI decision-making)
```

### 2. UI Component Layer
React components that render game state and handle user interaction.

**Location**: `src/components/`

```
components/
├── GameRoot.tsx        (Main game orchestrator, state management)
├── Card/
│   ├── Card.tsx        (Individual card display)
│   └── CardBack.tsx    (Face-down card)
├── Hand/
│   ├── Hand.tsx        (Player's hand with selection)
│   ├── OpponentHand.tsx (Opponent cards display)
│   └── HandBase.tsx    (Base hand layout logic)
└── Trick/
    └── Trick.tsx       (Central trick display with winner)
```

### 3. Utilities Layer
Helper functions and data transformations.

**Location**: `src/utils/`

## Data Flow

### Game State (in GameRoot)
```typescript
playerHand: HandCard[]           // Player's cards
opponentHands: {                 // Opponent cards (count only)
  north: OpponentCard[]
  east: OpponentCard[]
  west: OpponentCard[]
}
trick: TrickState                // Current trick {pid: Card}
```

### State Updates
1. **Player plays card** → `handlePlayCard()`
2. **Bot plays** → `playBotCard()` (triggered automatically)
3. **Trick complete** → `resolveTrick()` calculates winner
4. **Score updated** → Reset for next trick

## Component Hierarchy

```
GameRoot
├── OpponentHand (north)
├── OpponentHand (west)
├── OpponentHand (east)
├── Trick
│   └── Card (winner highlighted)
└── Hand
    └── Card[] (clickable)
```

## Type Safety

All card-related types are strongly typed:

```typescript
// Card definition
interface Card {
  suit: Suit        // 'hearts' | 'diamonds' | 'spades' | 'clubs'
  rank: Rank        // '2' | '3' | ... | 'K' | 'A'
}

// Player identifiers
type PID = 'north' | 'east' | 'south' | 'west'

// Game hands
type Hands = Record<PID, Card[]>
```

This prevents invalid card combinations and ensures compile-time correctness.

## Key Design Decisions

1. **Separation of Concerns**: Game logic is completely independent of UI
   - Logic can be tested without React
   - Logic can be reused in other UIs (CLI, web, etc.)

2. **Immutability in UI**: React state updates create new objects
   - Prevents accidental mutations
   - Enables proper change detection

3. **Mutation in Game Logic**: Hand manipulation functions mutate arrays
   - Simpler, cleaner code for game rules
   - Component layer handles immutability

4. **Type-driven Development**: Extensive use of TypeScript types
   - Catches errors at compile time
   - Self-documenting code
   - Better IDE support

## Hearts Rules Enforced

1. **Lead Suit Must Follow**: Must play the led suit if you have it
2. **Points Cannot Lead**: First trick cannot have hearts or queen of spades
3. **Blood Must Be Drawn**: Hearts cannot be played until someone plays a heart
4. **Queen of Spades Penalty**: Worth 13 points
5. **Winner Selection**: Highest card of lead suit wins
6. **Shoot the Moon**: Taking all 26 points scores 0 instead

See `src/game/logic/` for implementation details.

## Error Handling

- Game logic throws descriptive errors for invalid moves
- Component layer catches errors and logs them
- UI disables invalid card selections (for future implementation)

## Performance Considerations

- Card rendering uses React.memo for optimization
- Hand animations use CSS transforms (GPU-accelerated)
- Bot decisions are synchronous (keep <50ms)
- State updates batch multiple changes when possible
