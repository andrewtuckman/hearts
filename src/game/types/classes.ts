import {
  LOSING_SCORE,
  Phases,
  PIDs,
  Ranks,
  SHOOT_THE_MOON_SCORE,
  Suits,
} from './constants';
import { Hands, Phase, PID } from './types';

export class Game {
  readonly players: Player[];
  readonly scores: Scoreboard = new Scoreboard();
  phase: Phase = Phases.DEALING;
  round: number = 0;
  hands: Hands = createPlayerDict([]);
  trick: Trick = new Trick();
  bloodDrawn: boolean = false;

  constructor(players: Player[]) {
    this.players = players;
    const shuffledDeck = new Deck().shuffle();
    this.hands = dealCardsToHands(shuffledDeck, players);
  }

  startNewRound() {
    this.phase = Phases.DEALING;
    this.round += 1;
    const shuffledDeck = new Deck().shuffle();
    this.hands = dealCardsToHands(shuffledDeck, this.players);
    this.trick = new Trick();
    this.bloodDrawn = false;
  }

  removeCardFromHand(pid: PID, card: Card): Card {
    const hand = this.hands[pid];
    if (hand.length <= 0) {
      throw new Error(`Player ${pid} has no cards in hand to remove.`);
    }
    const cardIndex = hand.findIndex(
      (c) => c.suit === card.suit && c.rank === card.rank
    );
    if (cardIndex === -1) {
      throw new Error(
        `Card ${card.rank} of ${card.suit} not found in player ${pid}'s hand.`
      );
    }
    const removedCards = hand.splice(cardIndex, 1);
    if (removedCards.length !== 1) {
      throw new Error(
        `Unexpected error removing card ${card.rank} of ${card.suit} from player ${pid}'s hand.`
      );
    }
    if (
      removedCards[0].suit !== card.suit ||
      removedCards[0].rank !== card.rank
    ) {
      throw new Error(
        `Removed card does not match the requested card for player ${pid}.`
      );
    }
    return removedCards[0];
  }
}

function initializeHands(players: Player[]): Hands {
  const hands: Hands = {} as Hands;
  for (const pid of players.map((player) => player.id)) {
    hands[pid] = [];
  }
  return hands;
}

function dealCardsToHands(deck: Deck, players: Player[]): Hands {
  const hands = initializeHands(players);
  for (let i = 0; i < deck.cards.length; i++) {
    const pid = players[i % players.length].id;
    hands[pid].push(deck.cards[i]);
  }
  return hands;
}

export class Trick {
  leaderPID: PID | null = null;
  cards: Record<PID, Card | null> = createPlayerDict(null);

  playCard(pid: PID, card: Card) {
    if (this.cards[pid] !== null) {
      throw new Error(`Player ${pid} has already played a card this trick.`);
    }
    this.cards[pid] = card;
  }
}

export class Player {
  id: PID;
  name: string;
  isHuman: boolean;

  constructor(id: PID, name: string, isHuman: boolean) {
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

  constructor() {
    for (const suit of Object.values(Suits)) {
      for (const rank of Ranks) {
        this.cards.push({ suit, rank });
      }
    }
  }

  shuffle() {
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

  constructor() {
    this.roundScores = createPlayerDict(0);
    this.gameScores = createPlayerDict(0);
  }

  updateRoundScore(pid: PID, points: number) {
    this.roundScores[pid] += points;
  }

  updateGameScore(roundScores: Record<PID, number>) {
    // Check for "shooting the moon"
    const shooter = Object.entries(roundScores).find(
      ([_, score]) => score === SHOOT_THE_MOON_SCORE
    );
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

  hasLoser(): boolean {
    return Object.values(this.gameScores).some(
      (score) => score >= LOSING_SCORE
    );
  }
}

function createPlayerDict(initValue: any): Record<PID, any> {
  return Object.values(PIDs).reduce((accum, pid) => {
    accum[pid as PID] = initValue;
    return accum;
  }, {} as Record<PID, any>);
}
