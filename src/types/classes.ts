import { LOSING_SCORE, Phases, PIDs, Ranks, SHOOT_THE_MOON_SCORE, Suits } from "./constants";
import { Phase, PID } from "./types";

export class Game {
    players: Player[];
    phase: Phase = Phases.DEALING;
    scores: Scoreboard = new Scoreboard();
    round: number = 0;
    hands: Record<PID, Card[]> = {};
    trick: Trick = new Trick(PIDs.NORTH);
    bloodDrawn: boolean = false;

    constructor (players: Player[]) {
        this.players = players;
        for (const pid of Object.values(PIDs)) {
            this.hands[pid as PID] = [];
        }
    }
}

export class Trick {
    leader: PID;
    cards: Record<PID, Card | null>;

    constructor (leader: PID) {
        this.leader = leader;
        this.cards = createPlayerDict(null);
    }
}

export class Player {
    id: PID;
    name: string;
    isHuman: boolean;

    constructor (id: PID, name: string, isHuman: boolean) {
        this.id = id;
        this.name = name;
        this.isHuman = isHuman;
    }
}

export interface Card {
    suit: string;
    rank: string;
}

export class Deck {
    cards: Card[] = [];

    constructor () {
        for (const suit of Object.values(Suits)) {
            for (const rank of Object.values(Ranks)) {
                this.cards.push({ suit, rank });
            }
        }
    }
}

export class Scoreboard {
    roundScores: Record<PID, number>;
    gameScores: Record<PID, number>;

    constructor () {
        this.roundScores = createPlayerDict(0);
        this.gameScores = createPlayerDict(0);
    }

    updateRoundScore (pid: PID, points: number) {
        this.roundScores[pid] += points;
    }

    updateGameScore (roundScores: Record<PID, number>) {
        // Check for "shooting the moon"
        const shooter = Object.entries(roundScores).find(([_, score]) => score === SHOOT_THE_MOON_SCORE);
        if (shooter) {
            const [shooterPID] = shooter;
            for (const pid of Object.values(PIDs)) {
                if (pid !== shooterPID) {
                    this.gameScores[pid as PID] += SHOOT_THE_MOON_SCORE;
                }
            }
        } else {
            for (const pid of Object.values(PIDs)) {
                this.gameScores[pid as PID] += roundScores[pid as PID];
            }
        }
        // Reset round scores
        this.roundScores = createPlayerDict(0);
    }

    hasLoser (): boolean {
        return Object.values(this.gameScores).some(score => score >= LOSING_SCORE);
    }
}

function createPlayerDict(initValue: any): Record<PID, any> {
    return Object.values(PIDs).reduce((accum, pid) => {
        accum[pid as PID] = initValue;
        return accum;
    }, {} as Record<PID, any>);
}