import { Phases, PIDs, Suits, Ranks } from "./constants";

export type Phase = typeof Phases[keyof typeof Phases];

/** Represents the Player ID */
export type PID = typeof PIDs[keyof typeof PIDs];


export type Suit = typeof Suits[keyof typeof Suits];


export type Rank = typeof Ranks[keyof typeof Ranks];