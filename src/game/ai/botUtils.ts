import { Card, Trick } from '../../models/classes';
import { PID, Suit, Rank } from '../../models/types';
import { Suits, RanksOrder, PIDs } from '../../models/constants';

/**
 * Get all valid cards a player can play given current game state
 * Enforces Hearts rules:
 * - Must follow lead suit if possible
 * - Cannot play hearts before blood is drawn
 * - Cannot play Queen of Spades before blood is drawn
 * - Cannot lead with hearts or Queen of Spades on first trick
 */
export function getValidCards(
  hand: Card[],
  trick: Trick,
  bloodDrawn: boolean,
  isFirstTrick: boolean
): Card[] {
  if (hand.length === 0) return [];

  // Get lead suit (null if trick is empty)
  const leadSuit = trick.leaderPID ? getLead(trick) : null;

  // If we need to follow suit
  if (leadSuit) {
    const sameSuit = hand.filter((card) => card.suit === leadSuit);
    if (sameSuit.length > 0) {
      // Must follow suit
      return filterInvalidCards(sameSuit, bloodDrawn, isFirstTrick, false);
    }
    // Cannot follow suit, can play anything (that's valid)
    return filterInvalidCards(hand, bloodDrawn, isFirstTrick, true);
  }

  // We are leading
  return filterInvalidCards(hand, bloodDrawn, isFirstTrick, true);
}

/**
 * Check if a specific card can be legally played
 */
export function canPlayCard(
  card: Card,
  hand: Card[],
  trick: Trick,
  bloodDrawn: boolean,
  isFirstTrick: boolean
): boolean {
  const validCards = getValidCards(hand, trick, bloodDrawn, isFirstTrick);
  return validCards.some((c) => c.suit === card.suit && c.rank === card.rank);
}

/**
 * Get the lead suit from the current trick
 */
function getLead(trick: Trick): Suit | null {
  if (!trick.leaderPID) return null;
  const leadCard = trick.cards[trick.leaderPID];
  return leadCard ? leadCard.suit : null;
}

/**
 * Filter out invalid cards based on Hearts rules
 * @param cards - Cards to filter
 * @param bloodDrawn - Whether hearts have been played
 * @param isFirstTrick - Whether this is the first trick
 * @param isLeading - Whether the player is leading this trick
 */
function filterInvalidCards(
  cards: Card[],
  bloodDrawn: boolean,
  isFirstTrick: boolean,
  isLeading: boolean
): Card[] {
  const filtered = cards.filter((card) => {
    // Cannot play hearts before blood is drawn
    if (!bloodDrawn && card.suit === Suits.HEARTS) {
      return false;
    }

    // Cannot play Queen of Spades before blood is drawn
    if (!bloodDrawn && isQueenOfSpades(card)) {
      return false;
    }

    // On first trick, cannot lead with points (hearts or QS)
    if (isFirstTrick && isLeading) {
      if (card.suit === Suits.HEARTS || isQueenOfSpades(card)) {
        return false;
      }
    }

    return true;
  });

  // If no legal cards, player must break blood
  if (filtered.length === 0) {
    return cards;
  }

  return filtered;
}

/**
 * Check if a card is the Queen of Spades
 */
function isQueenOfSpades(card: Card): boolean {
  return card.suit === Suits.SPADES && card.rank === 'Q';
}

/**
 * Rate a card's strength (0-14) within its suit
 * Returns 0 if card doesn't match lead suit
 * Used to determine if a card can win the trick
 */
export function getCardStrength(card: Card, leadSuit: Suit | null): number {
  if (!leadSuit || card.suit !== leadSuit) {
    return 0;
  }
  return RanksOrder[card.rank] || 0;
}

/**
 * Predict which player will win the trick with current cards
 * Returns null if trick incomplete
 */
export function predictTrickWinner(trick: Trick): PID | null {
  if (!trick.leaderPID) return null;

  const leadSuit = getLead(trick);
  if (!leadSuit) return null;

  // Check all cards in trick
  const allPIDs: PID[] = Object.values(PIDs);
  let winner: PID | null = null;
  let highestStrength = 0;

  for (const pid of allPIDs) {
    const card = trick.cards[pid];
    if (!card) continue;

    const strength = getCardStrength(card, leadSuit);
    if (strength > highestStrength) {
      highestStrength = strength;
      winner = pid;
    }
  }

  return winner;
}

/**
 * Check if playing a specific card would win the current trick
 */
export function wouldWinTrick(
  card: Card,
  trick: Trick,
  leaderPID: PID
): boolean {
  if (!trick.leaderPID) return false;

  const leadSuit = getLead(trick);
  if (!leadSuit) return false;

  // Card doesn't match lead suit, can't win
  if (card.suit !== leadSuit) {
    return false;
  }

  // Check if this card beats all others in trick
  const cardStrength = RanksOrder[card.rank];
  const allPIDs: PID[] = Object.values(PIDs);

  for (const pid of allPIDs) {
    const trickCard = trick.cards[pid];
    if (!trickCard) continue;

    const trickStrength = getCardStrength(trickCard, leadSuit);
    if (trickStrength > cardStrength) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate total points in the current trick
 */
export function getTrickPoints(trick: Trick): number {
  let points = 0;
  const allPIDs: PID[] = Object.values(PIDs);

  for (const pid of allPIDs) {
    const card = trick.cards[pid];
    if (card) {
      points += getCardValue(card);
    }
  }

  return points;
}

/**
 * Count cards of a specific suit in hand
 */
export function countSuitCards(hand: Card[], suit: Suit): number {
  return hand.filter((card) => card.suit === suit).length;
}

/**
 * Check if all remaining cards of a suit are high
 */
export function hasOnlyHighCards(
  hand: Card[],
  suit: Suit,
  threshold: number = 10
): boolean {
  const suitCards = hand.filter((card) => card.suit === suit);
  if (suitCards.length === 0) return false;

  return suitCards.every((card) => RanksOrder[card.rank] >= threshold);
}

/**
 * Get point value of a card
 * Hearts = 1 point each
 * Queen of Spades = 13 points
 * All others = 0 points
 */
export function getCardValue(card: Card): number {
  if (card.suit === Suits.HEARTS) {
    return 1;
  }
  if (isQueenOfSpades(card)) {
    return 13;
  }
  return 0;
}

/**
 * Check if hand contains Queen of Spades
 */
export function hasQueenOfSpades(hand: Card[]): boolean {
  return hand.some((card) => isQueenOfSpades(card));
}

/**
 * Count total points in hand
 */
export function countHandPoints(hand: Card[]): number {
  return hand.reduce((sum, card) => sum + getCardValue(card), 0);
}
