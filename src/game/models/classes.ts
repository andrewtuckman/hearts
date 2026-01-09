import { createDeck, dealCardsToHands, shuffle } from '../logic/deck';
import { createPlayerDict } from '../../utils/utils';
import { Phases } from './constants';
import { Hands, Phase, PID } from './types';

export class Game {
  readonly deck: Card[] = createDeck();
  readonly players: Player[];
  readonly scores: Scoreboard = new Scoreboard();
  phase: Phase = Phases.DEALING;
  round: number = 0;
  hands: Hands = createPlayerDict([]);
  trick: Trick = new Trick();
  bloodDrawn: boolean = false;

  constructor(players: Player[]) {
    this.players = players;
    const shuffledDeck = shuffle(this.deck);
    this.hands = dealCardsToHands(shuffledDeck, this.hands);
  }

  startNewRound() {
    this.phase = Phases.DEALING;
    this.round += 1;
    const shuffledDeck = shuffle(this.deck);
    this.hands = dealCardsToHands(shuffledDeck, this.hands);
    this.trick = new Trick();
    this.bloodDrawn = false;
  }
}

export class Trick {
  leaderPID: PID | null = null;
  cards: Record<PID, Card | null> = createPlayerDict(null);
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

export class Scoreboard {
  roundScores: Record<PID, number>;
  gameScores: Record<PID, number>;

  constructor() {
    this.roundScores = createPlayerDict(0);
    this.gameScores = createPlayerDict(0);
  }
}
