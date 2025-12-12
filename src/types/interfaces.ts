import { Phase, PlayerId } from "./types";

export interface Game {
    players: Player[];
    hands: Record<PlayerId, Card[]>;
    trick: { leader: PlayerId, cards: Record<PlayerId, Card | null> };
    scores: Record<PlayerId, number>;
    round: number;
    bloodDrawn: boolean;
    phase: Phase;
}

export interface Player {
    id: PlayerId;
    name: string;
    isHuman: boolean;
}

export interface Card {
    suit: string;
    rank: string;
}