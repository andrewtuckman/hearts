# Bot Implementation Guide

Comprehensive guide to implementing AI bots for the three opponent players (north, east, west) that play Hearts according to game rules and strategy.

## Prerequisites

- Understanding of Hearts game rules
- Familiarity with the codebase (see SYSTEM_OVERVIEW.md)
- TypeScript knowledge
- Read BOT_SYSTEM.md for architecture overview

## Architecture Overview

### Data Flow

```
Player plays card
    ↓
updateTrick(south)
    ↓
Trigger bot plays (west → north → east)
    ↓
For each bot:
  - getValidCards() from botUtils
  - chooseCard() from SimpleBot
  - updateTrick(pid) with chosen card
    ↓
Check if trick complete (4 cards played)
    ↓
resolveTrick() → get winner + points
    ↓
Update scores
    ↓
Reset trick for next round
```

### Key Rules to Enforce

- **First trick**: Can only play 2♣
- **Before blood drawn**: Cannot play Hearts or Queen of Spades
- **Must follow suit**: If you have the lead suit, must play it
- **Can't play points on first trick**: Cannot play Hearts or QS on first trick
- **Shoot the moon**: QS + all Hearts in one hand = 26 points = 0 points

### Implementation Phases

1. **botUtils** (Foundation) - Card validation and analysis functions
2. **simpleBot** (AI Logic) - Decision-making strategy
3. **GameRoot Integration** - Connecting bots to the game UI
4. **Polish & Testing** - Refining strategy and handling edge cases

## Step 1: Implement botUtils.ts

**Time estimate**: 1-2 hours

### 1.1 Create the file

Create `src/game/ai/botUtils.ts` with the following functions:

```typescript
// Card Validation Functions
export function getValidCards(hand: Card[], trick: Trick, bloodDrawn: boolean): Card[]
  // Returns cards that can legally be played based on Hearts rules

export function canPlayCard(card: Card, hand: Card[], trick: Trick, bloodDrawn: boolean): boolean
  // Checks if a specific card is a valid play

// Card Strength Functions
export function getCardStrength(card: Card, leadSuit: Suit | null): number
  // Ranks card 0-14 based on rank within its suit
  // Returns 0 if card doesn't match lead suit

export function getTrickWinner(trick: Trick): PID | null
  // Predicts who will win the trick with current plays

export function wouldCardWinTrick(card: Card, trick: Trick): boolean
  // Checks if playing this card would win the trick

export function getTrickPoints(trick: Trick): number
  // Calculates total points in trick if completed

// Hand Analysis Functions
export function countSuitInHand(hand: Card[], suit: Suit): number
  // Returns how many cards of a suit are in hand

export function hasOnlyHighCards(hand: Card[], suit: Suit, threshold: number): boolean
  // Checks if all cards of a suit are above threshold

export function getCardValue(card: Card): number
  // Returns point value (hearts = 1, queen of spades = 13, others = 0)

export function hasQueenOfSpades(hand: Card[]): boolean
  // Checks if hand contains Queen of Spades

export function countHandPoints(hand: Card[]): number
  // Calculates total points in hand
```

### 1.2 Implementation checklist

- [ ] `getValidCards` - Enforce all Hearts rules
  - [ ] Must follow lead suit if possible
  - [ ] Cannot play hearts before blood drawn
  - [ ] Cannot play Queen of Spades before blood drawn
  - [ ] Cannot lead with points on first trick

- [ ] `predictTrickWinner` - Calculate who wins
  - [ ] Find lead card from leader
  - [ ] Check each card in trick
  - [ ] Return player with highest lead suit card

- [ ] Hand analysis functions - Simple utility functions
  - [ ] All are straightforward array operations

### 1.3 Testing

```bash
# Create tests in tests/game/ai/botUtils.test.ts
npm test -- botUtils.test.ts

# Test each function independently
# Test combinations (e.g., valid cards when hearts not drawn)
```

**Success criteria**: All utility functions tested and working correctly

---

## Step 2: Implement simpleBot.ts

**Time estimate**: 2-3 hours

### 2.1 Create the file

Create `src/game/ai/simpleBot.ts`:

```typescript
import { Card, Trick } from '../models/classes';
import { PID } from '../models/types';
import * as botUtils from './botUtils';

export class SimpleBot {
  id: PID;
  name: string;

  constructor(id: PID, name: string) {
    this.id = id;
    this.name = name;
  }

  chooseCard(
    hand: Card[],
    trick: Trick,
    bloodDrawn: boolean,
    isFirstTrick: boolean
  ): Card {
    // Implementation here
  }
}
```

### 2.2 Implement decision logic

Strategy priority:

1. **If leading** (trick empty):
   - Prefer safe mid-range cards
   - Avoid hearts if possible
   - Avoid high cards that might get taken

2. **If following**:
   - Check if you can win: `wouldCardWinTrick()`
   - If can win cheaply (low card): Consider taking
   - If cannot win: Play lowest card
   - If forced to take: Take with lowest winning card

3. **Special rules**:
   - Never lead Queen of Spades
   - Minimize points taken when possible
   - Protect low cards for forced situations

**Bot Decision Modes:**

- **SAFE_MODE** (no points in hand): Play lowest card that's safe (doesn't take trick); if forced, play lowest card overall
- **AGGRESSIVE_MODE** (can safely take trick): Play lowest card that wins the trick; minimize points taken
- **DEFENSIVE_MODE** (avoid certain cards): Never play Queen of Spades unless forced; try to avoid Hearts early game
- **DUMPING_MODE** (when behind on strategy): Play high cards to take tricks and dump points strategically

### 2.3 Example implementation structure

```typescript
chooseCard(hand, trick, bloodDrawn, isFirstTrick): Card {
  const validCards = botUtils.getValidCards(
    hand, trick, bloodDrawn, isFirstTrick
  );

  const isLeading = Object.keys(trick).every(pid => trick[pid] === null);

  if (isLeading) {
    return this.chooseLeadCard(validCards, hand);
  } else {
    return this.chooseFollowCard(validCards, hand, trick);
  }
}

private chooseLeadCard(validCards: Card[], hand: Card[]): Card {
  // Prefer cards that are safe and not too high
  // Sort by some heuristic and return first
}

private chooseFollowCard(validCards: Card[], hand: Card[], trick: Trick): Card {
  // Check if can win
  // Decide whether to take or throw away
  // Return best choice
}
```

### 2.4 Testing

```typescript
// Test cases in tests/game/ai/simpleBot.test.ts

test('bot never plays invalid card', () => {
  // Random hands and tricks
  // Verify bot choice is in validCards
})

test('bot avoids taking trick when possible', () => {
  // Setup: bot can follow suit without winning
  // Verify: bot plays lowest card
})

test('bot protects queen of spades', () => {
  // Setup: trick with points but no QS
  // Verify: bot doesn't lead with QS
})
```

**Success criteria**: Bot plays reasonable, valid moves in all scenarios

---

## Step 3: Integrate with GameRoot

**Time estimate**: 1-2 hours

### 3.1 Update GameRoot.tsx

```typescript
import { SimpleBot } from '../../game/ai/simpleBot';

const [botPlayers] = useState({
  north: new SimpleBot('north', 'North Bot'),
  east: new SimpleBot('east', 'East Bot'),
  west: new SimpleBot('west', 'West Bot'),
});

const [playOrder] = useState<PID[]>(['west', 'north', 'east']);
```

### 3.2 Add bot play trigger

```typescript
// After player plays a card
useEffect(() => {
  if (trick.south !== undefined && isTrickIncomplete) {
    playRemainingCards();
  }
}, [trick.south]);

const playRemainingCards = async () => {
  for (const pid of playOrder) {
    if (!trick[pid]) {
      // Play bot card with delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const bot = botPlayers[pid];
      const chosenCard = bot.chooseCard(
        hands[pid],
        trick,
        bloodDrawn,
        trickNumber === 0
      );
      
      // Update trick
      setTrick(prev => ({ ...prev, [pid]: chosenCard }));
      
      // Update opponent hand count
      setOpponentHands(prev => ({
        ...prev,
        [pid]: prev[pid].slice(0, -1)
      }));
    }
  }
};
```

### 3.3 Handle trick completion

```typescript
// When trick is complete
useEffect(() => {
  if (allCardsPlayed(trick)) {
    const { winningPID, points } = resolveTrick(trick);
    
    // Update scores
    setScores(prev => ({
      ...prev,
      [winningPID]: prev[winningPID] + points
    }));
    
    // Update blood drawn status
    if (points > 0) {
      setBloodDrawn(true);
    }
    
    // Reset for next trick
    setTrick({});
    setNextLeader(winningPID);
  }
}, [trick]);
```

### 3.4 Testing

```typescript
// Manual testing:
// 1. Start game
// 2. Play a card
// 3. Watch bots play in order
// 4. Verify trick resolves correctly
// 5. Play full hand (13 tricks)
// 6. Verify scores update correctly
```

**Success criteria**: Full game playable with bot opponents

---

## Step 4: Polish and Testing

**Time estimate**: 1-2 hours

### 4.1 Refine strategy

- Play test multiple games
- Note where bot makes questionable decisions
- Adjust heuristics based on observations
- Test edge cases (no valid cards, forced to take points, etc.)

### 4.2 Add difficulty levels (optional)

```typescript
enum Difficulty {
  EASY = 'easy',      // Random valid cards
  MEDIUM = 'medium',  // Current strategy
  HARD = 'hard'       // Advanced strategy
}

class SimpleBot {
  difficulty: Difficulty;
  
  chooseCard(...): Card {
    switch (this.difficulty) {
      case Difficulty.EASY:
        return this.randomChoice();
      case Difficulty.MEDIUM:
        return this.simpleStrategy();
      case Difficulty.HARD:
        return this.advancedStrategy();
    }
  }
}
```

### 4.3 Performance optimization

- Ensure bot decision time < 50ms
- Use memoization if needed
- Profile code with devtools

### 4.4 Final testing

```bash
# Run all tests
npm test

# Check linting
npm run lint

# Play multiple games
npm start
```

**Success criteria**: 
- ✅ All tests passing
- ✅ No lint errors
- ✅ Game plays smoothly
- ✅ Bots play reasonably
- ✅ Code is documented

---

## Checklist for Completion

### botUtils.ts
- [ ] All functions implemented
- [ ] Functions tested individually
- [ ] Hearts rules properly enforced
- [ ] Edge cases handled (empty hand, etc.)

### simpleBot.ts
- [ ] Class created with constructor
- [ ] chooseCard method implemented
- [ ] Strategy heuristics tuned
- [ ] Plays valid moves consistently
- [ ] Never violates Hearts rules

### GameRoot Integration
- [ ] Bots initialized on component mount
- [ ] Bot plays triggered after player move
- [ ] Trick resolution working
- [ ] Scores updating correctly
- [ ] Full game playable

### Testing & Polish
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] No lint errors
- [ ] Code properly documented
- [ ] Game plays smoothly

## Troubleshooting

**Issue**: Bot plays invalid card
- Check `getValidCards` implementation
- Verify bot only chooses from valid cards

**Issue**: Game gets stuck after bot plays
- Check trick resolution logic
- Ensure state updates are correct

**Issue**: Scores not updating
- Verify `resolveTrick` returns correct winner
- Check score update logic

**Issue**: Bot takes too long to decide
- Profile with browser devtools
- Optimize expensive operations

## Next Steps

After completing bot implementation:
1. Implement passing phase logic
2. Add multiple rounds/game over detection
3. Implement difficulty levels
4. Add game statistics tracking
5. Create lobby/player selection screen

## Future Enhancements

1. **Better Strategy**: Analyze opponent play patterns, remember cards
2. **Difficulty Levels**: Easy (random valid cards), Medium (simple strategy), Hard (advanced strategy with memory)
3. **Game History**: Track what cards have been played to improve decisions
4. **Passing Phase**: Implement strategic passing based on hand analysis
5. **Simulation**: Run simulations to evaluate card choices
