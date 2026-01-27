import { PID } from './types';

export const LOSING_SCORE = 100;
export const SHOOT_THE_MOON_SCORE = 26;

export const Phases = {
  DEALING: 'dealing',
  PASSING: 'passing',
  PLAYING: 'playing',
  SCORING: 'scoring',
};

export const PIDs = {
  NORTH: 'north',
  EAST: 'east',
  SOUTH: 'south',
  WEST: 'west',
} as const;

export const TURN_ORDER: PID[] = [PIDs.NORTH, PIDs.EAST, PIDs.SOUTH, PIDs.WEST];

export const Ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
] as const;

export const RanksOrder: Record<string, number> = Ranks.reduce(
  (acc, r, idx) => {
    acc[r] = idx + 2; // numeric value mapping (2..14)
    return acc;
  },
  {} as Record<string, number>
);

export const Suits = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades',
};

export const PassingDirections = {
  LEFT: 'left',
  RIGHT: 'right',
  ACROSS: 'across',
  HOLD: 'hold',
} as const;
