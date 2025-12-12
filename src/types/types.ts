const Phases = {
    DEALING: 'dealing',
    BIDDING: 'bidding',
    PLAYING: 'playing',
    SCORING: 'scoring',
}
export type Phase = typeof Phases[keyof typeof Phases];

const PlayerIds = {
    NORTH: 'north',
    EAST: 'east',
    SOUTH: 'south',
    WEST: 'west',
}
export type PlayerId = typeof PlayerIds[keyof typeof PlayerIds];

const Suits = {
    HEARTS: 'hearts',
    DIAMONDS: 'diamonds',
    CLUBS: 'clubs',
    SPADES: 'spades',
}
export type Suit = typeof Suits[keyof typeof Suits];

const Ranks = {
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    JACK: 'J',
    QUEEN: 'Q',
    KING: 'K',
    ACE: 'A',
}
export type Rank = typeof Ranks[keyof typeof Ranks];