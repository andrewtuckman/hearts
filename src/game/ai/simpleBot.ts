import { Card, Trick } from '../../models/classes';
import { PID } from '../../models/types';
import { RanksOrder, Suits } from '../../models/constants';
import * as botUtils from './botUtils';

export interface GameStateContext {
  // Optional game state information for advanced strategies
  round?: number;
  scores?: Record<PID, number>;
}

export class SimpleBot {
  id: PID;
  name: string;

  constructor(id: PID, name: string) {
    this.id = id;
    this.name = name;
  }

  /**
   * Main decision method - returns card to play
   * Strategy prioritizes:
   * 1. Avoiding tricks when possible
   * 2. Protecting Queen of Spades
   * 3. Managing hearts carefully
   * 4. Smart dumping when forced to take
   */
  chooseCard(
    hand: Card[],
    trick: Trick,
    bloodDrawn: boolean,
    isFirstTrick: boolean,
    gameState?: GameStateContext
  ): Card {
    const validCards = botUtils.getValidCards(
      hand,
      trick,
      bloodDrawn,
      isFirstTrick
    );

    if (validCards.length === 0) {
      throw new Error('No valid cards to play');
    }

    // Determine if we are leading (starting the trick)
    const isLeading = trick.leaderPID === null;

    if (isLeading) {
      return this.chooseLeadCard(validCards, hand, trick);
    } else {
      return this.chooseFollowCard(validCards, trick);
    }
  }

  /**
   * Choose a card to lead with
   * Strategy: Play safe, avoid points
   */
  private chooseLeadCard(validCards: Card[], hand: Card[], trick: Trick): Card {
    // If we have no points in hand, play very safely
    const handPoints = botUtils.countHandPoints(hand);
    if (handPoints === 0) {
      // Play lowest card overall - safe to lose
      return this.findLowestCard(validCards);
    }

    // Prefer to lead non-point cards
    const nonPointCards = validCards.filter(
      (c) => botUtils.getCardValue(c) === 0
    );
    if (nonPointCards.length > 0) {
      // Among non-point cards, lead a mid-range card (not too high)
      return this.findMidRangeCard(nonPointCards);
    }

    // Forced to lead with points - play low to minimize damage
    return this.findLowestCard(validCards);
  }

  /**
   * Choose a card to play when following
   * Strategy: Avoid winning if possible, else take with low card
   */
  private chooseFollowCard(validCards: Card[], trick: Trick): Card {
    // First, check if we can avoid winning
    const nonWinningCards = validCards.filter(
      (card) => !botUtils.wouldWinTrick(card, trick, trick.leaderPID!)
    );

    if (nonWinningCards.length > 0) {
      // We can avoid winning - play the lowest non-winning card
      return this.findLowestCard(nonWinningCards);
    }

    // We're forced to win the trick
    // Play the lowest winning card (to minimize points taken)
    const winningCards = validCards.filter((card) =>
      botUtils.wouldWinTrick(card, trick, trick.leaderPID!)
    );

    if (winningCards.length > 0) {
      return this.findLowestCard(winningCards);
    }

    // Fallback: shouldn't happen, but return lowest valid card
    return this.findLowestCard(validCards);
  }

  /**
   * Find the lowest card in a set of cards
   * Used when we want to minimize what we're giving up or taking
   */
  private findLowestCard(cards: Card[]): Card {
    if (cards.length === 0)
      throw new Error('Cannot find lowest card in empty array');

    let lowest = cards[0];
    for (const card of cards) {
      if (this.compareCards(card, lowest) < 0) {
        lowest = card;
      }
    }
    return lowest;
  }

  /**
   * Find a mid-range card from a set
   * Avoids both very low cards (that might be needed later) and very high cards (that might win)
   */
  private findMidRangeCard(cards: Card[]): Card {
    if (cards.length <= 2) return cards[0];

    // Sort cards and pick something in the middle-ish range
    const sorted = [...cards].sort((a, b) => this.compareCards(a, b));
    const midIndex = Math.floor(sorted.length / 2);
    return sorted[midIndex];
  }

  /**
   * Compare two cards for ordering
   * Returns: negative if a < b, 0 if equal, positive if a > b
   * Ordering: by rank first (lowest to highest)
   */
  private compareCards(a: Card, b: Card): number {
    const aRank = RanksOrder[a.rank] || 0;
    const bRank = RanksOrder[b.rank] || 0;
    if (aRank !== bRank) return aRank - bRank;

    // Same rank - shouldn't happen in normal play
    return 0;
  }
}
