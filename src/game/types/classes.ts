import { LOSING_SCORE, Phases, PIDs, Ranks, RanksOrder, SHOOT_THE_MOON_SCORE, Suits } from "./constants";
import { Hands, Phase, PID } from "./types";

export class Game {
    players: Player[];
    phase: Phase = Phases.DEALING;
    scores: Scoreboard = new Scoreboard();
    round: number = 0;
    hands: Hands = createPlayerDict([]);
    trick: Trick = new Trick();
    bloodDrawn: boolean = false;

    constructor (players: Player[]) {
        this.players = players;
        for (const pid of Object.values(PIDs)) {
            this.hands[pid as PID] = [];
        }
        const shuffledDeck = new Deck().shuffle();
        this.dealCards(shuffledDeck);
    }

    dealCards(deck: Deck) {
        for (const player of this.players) {
            this.hands[player.id] = [];
        }
        // Deal cards one by one in a round-robin fashion
        for (let i = 0; i < deck.cards.length; i++) {
            const pid = this.players[i % this.players.length].id;
            this.hands[pid].push(deck.cards[i]);
        }
    }
}

export class Trick {
    leader: PID | null = null;
    cards: Record<PID, Card | null> = createPlayerDict(null);

    playCard (pid: PID, card: Card) {
        if (this.cards[pid] !== null) {
            throw new Error(`Player ${pid} has already played a card this trick.`);
        }
        this.cards[pid] = card;
    }

    resolveTrick (): PID {
        for (const card in Object.values(this.cards)) {
            if (card === null) {
                throw new Error("Not all players have played their cards yet.");
            }
        }
        if (this.leader === null) {
            throw new Error("Leader is not set for this trick.");
        }
        const leadCard = this.cards[this.leader];
        let winningPID = this.leader;
        for (const pid of Object.values(PIDs)) {
            const card = this.cards[pid];
            if (card && card.suit === leadCard!.suit) {
                if (RanksOrder[card.rank] > RanksOrder[leadCard!.rank]) {
                    winningPID = pid as PID;
                }
            }
        }
        return winningPID;
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

    shuffle () {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
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