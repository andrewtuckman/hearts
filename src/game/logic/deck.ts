import { Card } from '../types/classes';
import { PIDs, Ranks, Suits } from '../types/constants';
import { Hands } from '../types/types';

export function createDeck(): Card[] {
  let deck: Card[] = [];
  for (const suit of Object.values(Suits)) {
    for (const rank of Ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealCardsToHands(deck: Card[], hands: Hands): Hands {
  for (let i = 0; i < deck.length; i++) {
    const pid = Object.values(PIDs)[i % 4];
    hands[pid].push(deck[i]);
  }
  return hands;
}
