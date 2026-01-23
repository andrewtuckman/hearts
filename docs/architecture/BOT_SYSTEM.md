# Hearts Bot System Implementation Plan

## Overview

The bot system enables three AI-controlled opponents (north, east, west) to play Hearts with intelligent decision-making. The implementation is split into reusable utilities and strategic decision logic.

## Architecture

### 1. botUtils.ts - Core Utilities

Pure utility functions that evaluate cards and game state. No dependencies on game flow.

#### Card Validation

```typescript
/**
 * Get all valid cards a player can play given current game state
 * Enforces Hearts rules:
 * - Must follow lead suit if possible
 * - Cannot play hearts/QS before blood is drawn
 * - Cannot lead hearts/QS on first trick
 */
export function getValidCards(
  hand: Card[],
  trick: Trick,
  bloodDrawn: boolean,
  isFirstTrick: boolean
): Card[]

/**
 * Check if a specific card can be legally played
 */
export function canPlayCard(
  card: Card,
  hand: Card[],
  trick: Trick,
  bloodDrawn: boolean,
  isFirstTrick: boolean
): boolean
```

#### Card Strength Evaluation

```typescript
/**
 * Rate a card's strength (0-14) within its suit
 * Returns 0 if card doesn't match lead suit
 * Used to determine if a card can win the trick
 */
export function getCardStrength(
  card: Card,
  leadSuit: Suit | null
): number

/**
 * Predict which player will win the trick with current cards
 * Returns null if trick incomplete
 */
export function predictTrickWinner(
  trick: Trick,
  leaderPID: PID
): PID | null

/**
 * Check if playing a specific card would win the current trick
 */
export function wouldWinTrick(
  card: Card,
  trick: Trick,
  leaderPID: PID
): boolean

/**
 * Calculate total points in the current trick
 */
export function getTrickPoints(trick: Trick): number
```

#### Hand Analysis

```typescript
/**
 * Count cards of a specific suit in hand
 */
export function countSuitCards(hand: Card[], suit: Suit): number

/**
 * Check if all remaining cards of a suit are high
 */
export function hasOnlyHighCards(
  hand: Card[],
  suit: Suit,
  threshold: number = 10
): boolean

/**
 * Get point value of a card
 */
export function getCardValue(card: Card): number
// hearts = 1, queen of spades = 13, others = 0

/**
 * Check if hand contains queen of spades
 */
export function hasQueenOfSpades(hand: Card[]): boolean

/**
 * Count total points in hand
 */
export function countHandPoints(hand: Card[]): number
```

### 2. simpleBot.ts - Decision Making

Strategic decision logic that uses botUtils to choose cards.

```typescript
class SimpleBot {
  id: PID
  name: string

  constructor(id: PID, name: string)

  /**
   * Main decision method - returns card to play
   */
  chooseCard(
    hand: Card[],
    trick: Trick,
    bloodDrawn: boolean,
    isFirstTrick: boolean,
    gameState?: GameStateContext
  ): Card
}
```

#### Strategy

The bot uses a priority-based strategy:

1. **Avoid Taking Tricks** (highest priority if empty-handed)
   - Play lowest card that doesn't win
   - Falls back to lowest card if forced to take

2. **Protect Queen of Spades**
   - Never lead QS
   - Only play QS when forced to take trick anyway
   - Play safer cards first

3. **Control Hearts**
   - Don't play hearts early unless forced
   - Save low hearts for forced situations
   - Track when blood is drawn

4. **Intelligent Dumping**
   - If trick has high points, might take it with high card
   - Better to control points than get surprised

5. **Follow Suit Intelligence**
   - If following suit, play lowest possible
   - If not following, evaluate what to throw away

#### Decision Algorithm

```typescript
chooseCard(hand, trick, bloodDrawn, isFirstTrick):
  1. Get valid cards
  2. If trick is empty (you lead):
     - Avoid points if possible
     - Play safe mid-range card
  3. If trick has cards:
     - Check if you can win
     - If can win cheaply: take it
     - If cannot win: play lowest
     - If would be forced to take: take with lowest winning card
  4. Return chosen card
```

## GameRoot Integration

### Short-term Implementation

```typescript
// In GameRoot.tsx state initialization
const [botPlayers] = useState({
  north: new SimpleBot('north', 'North Bot'),
  east: new SimpleBot('east', 'East Bot'),
  west: new SimpleBot('west', 'West Bot'),
});

const [playOrder] = useState<PID[]>(['west', 'north', 'east']);

// After player plays a card
useEffect(() => {
  if (trick.south !== undefined) {
    playRemainingCards();
  }
}, [trick.south]);

// Play remaining cards in turn order
const playRemainingCards = async () => {
  for (const pid of playOrder) {
    if (!trick[pid]) {
      const bot = botPlayers[pid];
      const chosenCard = bot.chooseCard(
        hands[pid],
        trick,
        bloodDrawn,
        isTrickNumber === 0
      );
      
      setTrick(prev => ({ ...prev, [pid]: chosenCard }));
      setOpponentHands(prev => ({
        ...prev,
        [pid]: prev[pid].filter(c => c.id !== generateCardId(chosenCard))
      }));
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
};

// When all 4 cards are played
useEffect(() => {
  if (Object.keys(trick).length === 4) {
    const { winningPID, points } = resolveTrick(
      convertTrickToGameTrick(trick)
    );
    
    // Update scores
    setScores(prev => ({
      ...prev,
      [winningPID]: prev[winningPID] + points
    }));
    
    // Reset for next trick
    resetTrick();
  }
}, [trick]);
```

## Implementation Phases

### Phase 1: botUtils Foundation (1-2 hours)
- [ ] Implement all utility functions
- [ ] Add unit tests for each utility
- [ ] Validate against real Hearts rules
- **Deliverable**: Tested utility library

### Phase 2: SimpleBot Strategy (2-3 hours)
- [ ] Create SimpleBot class
- [ ] Implement basic decision logic
- [ ] Test against various scenarios
- [ ] Refine heuristics through play-testing
- **Deliverable**: Working bot that makes valid plays

### Phase 3: GameRoot Integration (1-2 hours)
- [ ] Initialize bots for each opponent
- [ ] Implement card play flow
- [ ] Add trick resolution and scoring
- [ ] Handle game rounds and dealing
- **Deliverable**: Fully playable game with AI

### Phase 4: Polish & Testing (1-2 hours)
- [ ] Add difficulty levels
- [ ] Improve decision quality
- [ ] Performance optimization
- [ ] Comprehensive testing
- **Deliverable**: Production-ready bot system

## Testing Strategy

### Unit Tests (botUtils)
```typescript
test('getValidCards respects lead suit', () => {
  // Must follow suit if have it
})

test('getValidCards prevents point play first trick', () => {
  // Cannot lead with hearts or QS
})

test('predictTrickWinner finds correct winner', () => {
  // Correctly identifies highest card of lead suit
})
```

### Integration Tests (SimpleBot)
```typescript
test('bot never plays invalid cards', () => {
  // Validate all bot choices against getValidCards
})

test('bot avoids queen of spades when possible', () => {
  // QS only played when necessary
})

test('bot plays complete games without errors', () => {
  // Full game simulation with bot vs bot
})
```

## Future Enhancements

1. **Advanced Strategy**
   - Track played cards and adjust decisions
   - Model opponent hands based on play history
   - Simulate future tricks to evaluate moves

2. **Difficulty Levels**
   - Easy: Play random valid cards
   - Medium: Current simple bot strategy
   - Hard: Advanced simulation and learning

3. **Passing Strategy**
   - Analyze starting hand for optimal passing
   - Pass dangerous cards early
   - Different passing strategies per difficulty

4. **Machine Learning** (Advanced)
   - Train neural network on optimal play
   - Learn from play history
   - Adaptive difficulty

## Code Organization

```
src/game/ai/
├── botUtils.ts
│   ├── Card validation
│   ├── Card strength
│   ├── Trick prediction
│   └── Hand analysis
├── simpleBot.ts
│   ├── SimpleBot class
│   └── Decision algorithm
└── types.ts (bot-specific types if needed)
```

## Success Criteria

✅ Bots play valid moves according to Hearts rules
✅ Bots make reasonable strategic decisions
✅ Game flow is smooth with bot plays
✅ All code is thoroughly tested
✅ Decision-making is documented and understandable
✅ Easy to adjust difficulty or strategy
