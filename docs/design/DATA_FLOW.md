# Data Flow

## Game State Management

### State Hierarchy

```
GameRoot (main orchestrator)
├── playerHand: HandCard[]
├── opponentHands: { north, east, west }
├── trick: TrickState
├── scores: Record<PID, number>
├── bloodDrawn: boolean
├── round: number
└── phase: 'playing' | 'scoring' | 'dealing'
```

## Flow Diagrams

### Turn Flow (Single Trick)

```
Player Plays Card
    │
    ├─ Validate move
    ├─ Remove from playerHand
    ├─ Add to trick
    │
    └─> Check if trick complete? (south !== undefined)
            │
            ├─ NO: Wait for input
            │
            └─ YES: Play bot cards in order
                    │
                    ├─ Bot 1 (west)
                    │   ├─ getValidCards()
                    │   ├─ SimpleBot.chooseCard()
                    │   ├─ Add to trick
                    │   └─ Update opponentHands
                    │
                    ├─ Bot 2 (north)
                    │   ├─ getValidCards()
                    │   ├─ SimpleBot.chooseCard()
                    │   ├─ Add to trick
                    │   └─ Update opponentHands
                    │
                    └─ Bot 3 (east)
                        ├─ getValidCards()
                        ├─ SimpleBot.chooseCard()
                        ├─ Add to trick
                        └─ Update opponentHands
                        │
                        └─> Trick Complete (4 cards)
                            │
                            ├─ resolveTrick()
                            │   └─ Returns { winningPID, points }
                            │
                            ├─ Update scores
                            │
                            └─ Reset trick
                                └─> Next trick...
```

### Game Round Flow

```
New Round
    │
    ├─ Deal 13 cards to each player
    │
    ├─ Passing Phase (3 cards per player)
    │
    ├─ Set bloodDrawn = false
    │
    └─> Play 13 tricks
        │
        ├─ Trick 1: South must play 2♣ as lead
        │
        ├─ Tricks 2-13: Winner of previous trick leads
        │
        └─> End of round
            ├─ Calculate scores
            ├─ Check if anyone reached 100+ points
            └─ If not: New round


Game Over (someone ≥ 100 points)
    └─ Lowest score wins
```

## State Update Sequences

### Sequence 1: Player Plays Card

```
Initial State:
  playerHand: [2♠, 3♠, 4♥, ...]
  trick: {north: ..., west: ..., east: ...}

Action: handlePlayCard({suit: '♠', rank: '3'})

Step 1: Validate
  - Is 3♠ in hand? YES
  - Can play it? (follow suit, no points on first trick, etc.) YES

Step 2: Update playerHand
  playerHand = playerHand.filter(c => !(c.suit === '♠' && c.rank === '3'))
  Result: [2♠, 4♥, ...]

Step 3: Update trick
  trick = { ...trick, south: {suit: '♠', rank: '3'} }
  Result: {north: ..., west: ..., east: ..., south: {suit: '♠', rank: '3'}}

Step 4: Check if trick complete?
  Object.keys(trick).length === 4? YES → Play bots
```

### Sequence 2: Bot Plays Card

```
For each bot (west, north, east):

Step 1: Get valid cards
  validCards = getValidCards(
    hand: hands[pid],
    trick: trick,
    bloodDrawn: bloodDrawn
  )

Step 2: Choose card
  chosenCard = simpleBot.chooseCard(
    hand: hands[pid],
    trick: trick,
    bloodDrawn: bloodDrawn
  )

Step 3: Validate choice
  // Should always be valid
  assert(validCards.includes(chosenCard))

Step 4: Update trick
  trick = { ...trick, [pid]: chosenCard }

Step 5: Update opponent hand
  opponentHands[pid] = opponentHands[pid] - 1

Step 6: Display delay (500ms for UX)
  await new Promise(resolve => setTimeout(resolve, 500))
```

### Sequence 3: Trick Resolution

```
Trigger: trick has all 4 cards

Step 1: Convert to game format
  gameFormatTrick = {
    leaderPID: 'west',
    cards: {
      west: {suit: '♠', rank: 'K'},
      north: {suit: '♠', rank: 'Q'},
      east: {suit: '♠', rank: 'A'},
      south: {suit: '♠', rank: '3'}
    }
  }

Step 2: Resolve winner
  { winningPID, points } = resolveTrick(gameFormatTrick)
  Example: { winningPID: 'east', points: 13 }
  // East played A♠ (highest of lead suit) and took Q♠ (13 points)

Step 3: Update scores
  scores[east] += 13
  bloodDrawn = true (because points were taken)

Step 4: Reset trick
  trick = {}

Step 5: Determine next leader
  nextLeader = winningPID (east)

Step 6: Check if trick 13 complete?
  tricksPlayed >= 13? 
    YES: End round, calculate totals
    NO: Continue to next trick
```

## Component Data Flow

### GameRoot → Hand

```
GameRoot State:
  playerHand: [
    { id: '2♠', suit: '♠', rank: '2', playable: true },
    { id: '3♠', suit: '♠', rank: '3', playable: true },
    ...
  ]
      │
      ├─ Pass: cards={playerHand}
      │
      ├─ Pass: onPlayCard={handlePlayCard}
      │
      └─> Hand Component
          ├─ Renders each card
          ├─ Adds hover/click effects
          └─ Calls onPlayCard when clicked
              └─> GameRoot updates trick & hands
```

### GameRoot → Trick

```
GameRoot State:
  trick: {
    north: { suit: '♠', rank: 'K' },
    west: { suit: '♠', rank: 'Q' },
    east: { suit: '♠', rank: 'A' },
    south: { suit: '♠', rank: '3' }
  }
  leaderPID: 'west'
      │
      ├─ Pass: trick={trick}
      │
      ├─ Pass: leaderPID={'west'}
      │
      └─> Trick Component
          ├─ useEffect watches trick
          ├─ When all 4 cards: resolveTrick()
          ├─ Determines winningPID
          ├─ Highlights winning card
          └─ Updates winningPID state
```

### GameRoot → OpponentHand

```
GameRoot State:
  opponentHands: {
    north: [
      { id: 'n-0' },
      { id: 'n-1' },
      ..., (13 total)
    ],
    east: [...],
    west: [...]
  }
      │
      ├─ Pass: cards={opponentHands.north}
      │
      ├─ Pass: pid={'north'}
      │
      └─> OpponentHand Component
          ├─ Renders card-back for each card
          ├─ Scaled and positioned
          └─ Shows only count, not actual cards
```

## Type Flow

```
Card (base type)
├─ interface Card { suit: Suit, rank: Rank }
│
├─ HandCard (UI specific)
│  extends Card
│  ├─ id: string
│  └─ playable: boolean
│
└─ TrickState (display format)
   Record<PID, Card | undefined>
   ├─ Partial record (not all keys required)
   └─ Cards displayed directly
```

## Async Operations

```
Player Action (sync)
    │
    ├─ Update state immediately
    │
    └─> Trigger bot sequence (async)
        │
        ├─ Wait 500ms (UX feedback)
        ├─ Play bot 1
        ├─ Wait 500ms
        ├─ Play bot 2
        ├─ Wait 500ms
        ├─ Play bot 3
        │
        └─> Trick complete
            ├─ Show winner highlight
            ├─ Wait for user acknowledgement OR 2s timeout
            └─> Next trick
```

## Performance Considerations

- State updates are batched when possible
- Trick resolution happens synchronously (< 1ms)
- Bot decision making target: < 50ms
- UI updates are optimized with React.memo
- CSS animations use GPU acceleration (transforms)
