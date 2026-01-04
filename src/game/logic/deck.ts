import { Card } from '../models/classes';
import { PIDs, Ranks, Suits } from '../models/constants';
import { Hands } from '../models/types';

/**
 * Uses the Ranks and Suits constants to create a 52-card deck
 * @returns An array of Card objects
 */
export function createDeck(): Card[] {
  let deck: Card[] = [];
  for (const suit of Object.values(Suits)) {
    for (const rank of Ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

/**
 * Shuffles the deck randomly
 * @param deck - The array of Card objects to shuffle
 * @returns The array of Card objects with its order randomized
 */
export function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Deals cards out to player's hands, round-robin style
 * @param deck - The array of Card objects to deal
 * @returns hands - Dictionary with PIDs as keys and an array of Card objects as values
 */
export function dealCardsToHands(deck: Card[], hands: Hands): Hands {
  for (let i = 0; i < deck.length; i++) {
    const pid = Object.values(PIDs)[i % 4];
    hands[pid].push(deck[i]);
  }
  return hands;
}
