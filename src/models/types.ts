import { Card } from './classes';
import { Phases, PIDs, Suits, Ranks, PassingDirections } from './constants';

export type PassingDirection =
  (typeof PassingDirections)[keyof typeof PassingDirections];

export type Phase = (typeof Phases)[keyof typeof Phases];

/** Represents the Player ID */
export type PID = (typeof PIDs)[keyof typeof PIDs];

export type Suit = (typeof Suits)[keyof typeof Suits];

export type Rank = (typeof Ranks)[number];

export type Hands = Record<PID, Card[]>;

export type HandCard = {
  id: string;
  suit: Suit;
  rank: Rank;
  playable?: boolean;
};
