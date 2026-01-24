import { Trick } from '../../../src/models/classes';
import { Suits, PIDs } from '../../../src/models/constants';
import * as botUtils from '../../../src/game/ai/botUtils';
import { Card } from '../../../src/models/classes';

// Helper to create cards with proper typing
const card = (suit: string, rank: string): Card => ({ suit: suit as any, rank: rank as any });

describe('botUtils', () => {
  let emptyTrick: Trick;

  beforeEach(() => {
    emptyTrick = new Trick();
  });

  describe('getCardValue', () => {
    it('should return 1 for hearts', () => {
      const heart: Card = { suit: Suits.HEARTS, rank: '5' as const };
      expect(botUtils.getCardValue(heart)).toBe(1);
    });

    it('should return 13 for Queen of Spades', () => {
      const queenOfSpades: Card = { suit: Suits.SPADES, rank: 'Q' as const };
      expect(botUtils.getCardValue(queenOfSpades)).toBe(13);
    });

    it('should return 0 for other cards', () => {
      const club: Card = { suit: Suits.CLUBS, rank: '7' as const };
      expect(botUtils.getCardValue(club)).toBe(0);

      const diamond: Card = { suit: Suits.DIAMONDS, rank: 'K' as const };
      expect(botUtils.getCardValue(diamond)).toBe(0);

      const spade: Card = { suit: Suits.SPADES, rank: 'A' as const };
      expect(botUtils.getCardValue(spade)).toBe(0);
    });
  });

  describe('hasQueenOfSpades', () => {
    it('should return true when hand contains Queen of Spades', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.SPADES, 'Q'),
        card(Suits.CLUBS, '3'),
      ];
      expect(botUtils.hasQueenOfSpades(hand)).toBe(true);
    });

    it('should return false when hand does not contain Queen of Spades', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.SPADES, 'A'),
        card(Suits.CLUBS, '3'),
      ];
      expect(botUtils.hasQueenOfSpades(hand)).toBe(false);
    });

    it('should return false for empty hand', () => {
      expect(botUtils.hasQueenOfSpades([])).toBe(false);
    });
  });

  describe('countHandPoints', () => {
    it('should count all hearts and Queen of Spades', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.HEARTS, 'K'),
        card(Suits.HEARTS, '2'),
        card(Suits.SPADES, 'Q'),
        card(Suits.CLUBS, '3'),
      ];
      // 3 hearts + 13 for QS = 16
      expect(botUtils.countHandPoints(hand)).toBe(16);
    });

    it('should return 0 for hand with no points', () => {
      const hand: Card[] = [
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '7'),
      ];
      expect(botUtils.countHandPoints(hand)).toBe(0);
    });
  });

  describe('countSuitCards', () => {
    it('should count cards of a specific suit', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.HEARTS, 'K'),
        card(Suits.CLUBS, '3'),
        card(Suits.HEARTS, '2'),
      ];
      expect(botUtils.countSuitCards(hand, Suits.HEARTS)).toBe(3);
      expect(botUtils.countSuitCards(hand, Suits.CLUBS)).toBe(1);
      expect(botUtils.countSuitCards(hand, Suits.DIAMONDS)).toBe(0);
    });
  });

  describe('hasOnlyHighCards', () => {
    it('should return true when all cards of suit are high', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, 'J'), // 11
        card(Suits.HEARTS, 'Q'), // 12
        card(Suits.HEARTS, 'K'), // 13
        card(Suits.CLUBS, '3'),
      ];
      expect(botUtils.hasOnlyHighCards(hand, Suits.HEARTS, 10)).toBe(true);
    });

    it('should return false when not all cards are high', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'), // 5
        card(Suits.HEARTS, 'K'), // 13
      ];
      expect(botUtils.hasOnlyHighCards(hand, Suits.HEARTS, 10)).toBe(false);
    });

    it('should return false for empty suit in hand', () => {
      const hand: Card[] = [
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '7'),
      ];
      expect(botUtils.hasOnlyHighCards(hand, Suits.HEARTS, 10)).toBe(false);
    });
  });

  describe('getCardStrength', () => {
    it('should return rank order for cards matching lead suit', () => {
      expect(botUtils.getCardStrength(card(Suits.HEARTS, 'A'), Suits.HEARTS)).toBe(14);
      expect(botUtils.getCardStrength(card(Suits.HEARTS, 'K'), Suits.HEARTS)).toBe(13);
      expect(botUtils.getCardStrength(card(Suits.HEARTS, '2'), Suits.HEARTS)).toBe(2);
    });

    it('should return 0 for cards not matching lead suit', () => {
      expect(botUtils.getCardStrength(card(Suits.SPADES, 'A'), Suits.HEARTS)).toBe(0);
    });

    it('should return 0 when no lead suit', () => {
      expect(botUtils.getCardStrength(card(Suits.HEARTS, 'A'), null)).toBe(0);
    });
  });

  describe('getTrickPoints', () => {
    it('should calculate total points in trick', () => {
      const trick = new Trick();
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, '5');
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, 'K');
      trick.cards[PIDs.NORTH] = card(Suits.SPADES, 'Q');
      trick.cards[PIDs.EAST] = card(Suits.CLUBS, '3');

      // 1 + 1 + 13 + 0 = 15
      expect(botUtils.getTrickPoints(trick)).toBe(15);
    });

    it('should return 0 for trick with no points', () => {
      const trick = new Trick();
      trick.cards[PIDs.SOUTH] = card(Suits.CLUBS, '3');
      trick.cards[PIDs.WEST] = card(Suits.DIAMONDS, '7');
      trick.cards[PIDs.NORTH] = card(Suits.SPADES, 'K');
      trick.cards[PIDs.EAST] = card(Suits.CLUBS, 'A');

      expect(botUtils.getTrickPoints(trick)).toBe(0);
    });
  });

  describe('getValidCards - Must Follow Suit', () => {
    it('should require following suit when possible', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.HEARTS, 'K'),
        card(Suits.CLUBS, '3'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '7');

      const validCards = botUtils.getValidCards(hand, trick, true, false);

      // Should only include hearts
      expect(validCards).toHaveLength(2);
      expect(validCards.every((c: Card) => c.suit === Suits.HEARTS)).toBe(true);
    });

    it('should allow any valid card when cannot follow suit', () => {
      const hand: Card[] = [
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '9'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '7');

      const validCards = botUtils.getValidCards(hand, trick, true, false);

      // Should include both cards
      expect(validCards).toHaveLength(2);
    });
  });

  describe('getValidCards - Blood Drawn Restrictions', () => {
    it('should prevent hearts before blood drawn', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '9'),
      ];

      const trick = new Trick();
      // No lead, so we are leading
      const validCards = botUtils.getValidCards(hand, trick, false, false);

      // Hearts should not be valid
      expect(validCards.every((c: Card) => c.suit !== Suits.HEARTS)).toBe(true);
    });

    it('should prevent Queen of Spades before blood drawn', () => {
      const hand: Card[] = [
        card(Suits.SPADES, 'Q'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '9'),
      ];

      const trick = new Trick();
      const validCards = botUtils.getValidCards(hand, trick, false, false);

      // Queen of Spades should not be valid
      expect(validCards.every((c: Card) => !(c.rank === 'Q' && c.suit === Suits.SPADES))).toBe(true);
    });
  });

  describe('getValidCards - First Trick Restrictions', () => {
    it('should prevent leading with hearts on first trick', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '9'),
      ];

      const trick = new Trick();
      const validCards = botUtils.getValidCards(hand, trick, true, true);

      // Hearts should not be valid on first trick
      expect(validCards.every((c: Card) => c.suit !== Suits.HEARTS)).toBe(true);
    });

    it('should prevent leading with Queen of Spades on first trick', () => {
      const hand: Card[] = [
        card(Suits.SPADES, 'Q'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '9'),
      ];

      const trick = new Trick();
      const validCards = botUtils.getValidCards(hand, trick, true, true);

      // Queen of Spades should not be valid on first trick
      expect(validCards.every((c: Card) => !(c.rank === 'Q' && c.suit === Suits.SPADES))).toBe(true);
    });
  });

  describe('canPlayCard', () => {
    it('should return true for valid card', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.CLUBS, '3'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '7');

      expect(botUtils.canPlayCard(card(Suits.HEARTS, '5'), hand, trick, true, false)).toBe(true);
    });

    it('should return false for invalid card', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.CLUBS, '3'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '7');

      expect(botUtils.canPlayCard(card(Suits.CLUBS, '3'), hand, trick, true, false)).toBe(false);
    });
  });

  describe('wouldWinTrick', () => {
    it('should return true when card would win', () => {
      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '5');
      trick.cards[PIDs.NORTH] = card(Suits.HEARTS, '7');

      expect(botUtils.wouldWinTrick(card(Suits.HEARTS, 'A'), trick, PIDs.WEST)).toBe(true);
    });

    it('should return false when card would lose', () => {
      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, 'K');
      trick.cards[PIDs.NORTH] = card(Suits.HEARTS, 'A');

      expect(botUtils.wouldWinTrick(card(Suits.HEARTS, 'Q'), trick, PIDs.WEST)).toBe(false);
    });

    it('should return false when card does not match lead suit', () => {
      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '5');

      expect(botUtils.wouldWinTrick(card(Suits.CLUBS, 'A'), trick, PIDs.WEST)).toBe(false);
    });
  });

  describe('predictTrickWinner', () => {
    it('should correctly predict winner', () => {
      const trick = new Trick();
      trick.leaderPID = PIDs.WEST;
      trick.cards[PIDs.WEST] = card(Suits.HEARTS, '5');
      trick.cards[PIDs.NORTH] = card(Suits.HEARTS, 'K');
      trick.cards[PIDs.EAST] = card(Suits.HEARTS, '7');
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, 'A');

      // South has Ace, should win
      expect(botUtils.predictTrickWinner(trick)).toBe(PIDs.SOUTH);
    });

    it('should return null for empty trick', () => {
      const trick = new Trick();
      expect(botUtils.predictTrickWinner(trick)).toBeNull();
    });
  });
});
