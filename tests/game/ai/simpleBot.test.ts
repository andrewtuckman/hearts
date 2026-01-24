import { SimpleBot } from '../../../src/game/ai/simpleBot';
import { Trick } from '../../../src/models/classes';
import { PIDs, Suits } from '../../../src/models/constants';
import { Card } from '../../../src/models/classes';
import * as botUtils from '../../../src/game/ai/botUtils';

// Helper to create cards with proper typing
const card = (suit: string, rank: string): Card => ({
  suit: suit as any,
  rank: rank as any,
});

describe('SimpleBot', () => {
  let bot: SimpleBot;

  beforeEach(() => {
    bot = new SimpleBot(PIDs.WEST, 'West Bot');
  });

  describe('constructor', () => {
    it('should create a bot with given id and name', () => {
      expect(bot.id).toBe(PIDs.WEST);
      expect(bot.name).toBe('West Bot');
    });
  });

  describe('chooseCard - Leading', () => {
    it('should play lowest card when hand has no points', () => {
      const hand: Card[] = [
        card(Suits.CLUBS, '5'),
        card(Suits.CLUBS, '9'),
        card(Suits.DIAMONDS, 'K'),
      ];

      const trick = new Trick();
      const chosen = bot.chooseCard(hand, trick, true, false);

      // Should choose lowest: 5 of clubs
      expect(chosen.rank).toBe('5');
      expect(chosen.suit).toBe(Suits.CLUBS);
    });

    it('should prefer non-point cards when leading with points in hand', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.CLUBS, '7'),
        card(Suits.CLUBS, 'K'),
      ];

      const trick = new Trick();
      const chosen = bot.chooseCard(hand, trick, true, false);

      // Should choose a non-point card (clubs)
      expect([Suits.CLUBS, Suits.DIAMONDS, Suits.SPADES]).toContain(chosen.suit);
      expect(chosen.suit).not.toBe(Suits.HEARTS);
    });

    it('should only play valid cards (respects Hearts rules)', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '2'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '4'),
      ];

      const trick = new Trick();
      const chosen = bot.chooseCard(hand, trick, false, true);

      // On first trick with blood not drawn, cannot play hearts
      expect(chosen.suit).not.toBe(Suits.HEARTS);
    });
  });

  describe('chooseCard - Following', () => {
    it('should avoid winning trick when possible', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '5'),
        card(Suits.HEARTS, 'A'), // High card that would win
        card(Suits.CLUBS, '3'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.SOUTH;
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, '7');

      const chosen = bot.chooseCard(hand, trick, true, false);

      // Should not choose Ace (would win) - choose 5 or 3
      expect(chosen.rank).not.toBe('A');
    });

    it('should follow suit if required', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '2'),
        card(Suits.HEARTS, '9'),
        card(Suits.CLUBS, '3'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.SOUTH;
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, '7');

      const chosen = bot.chooseCard(hand, trick, true, false);

      // Must follow suit (hearts)
      expect(chosen.suit).toBe(Suits.HEARTS);
    });

    it('should throw error if no valid cards available', () => {
      const hand: Card[] = []; // Empty hand

      const trick = new Trick();
      trick.leaderPID = PIDs.SOUTH;
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, '7');

      expect(() => {
        bot.chooseCard(hand, trick, true, false);
      }).toThrow('No valid cards to play');
    });
  });

  describe('chooseCard - Returns valid card', () => {
    it('should return a card that is in the original hand', () => {
      const hand: Card[] = [
        card(Suits.CLUBS, '3'),
        card(Suits.CLUBS, '5'),
        card(Suits.CLUBS, '7'),
      ];

      const trick = new Trick();
      const chosen = bot.chooseCard(hand, trick, true, false);

      const isInHand = hand.some((c) => c.suit === chosen.suit && c.rank === chosen.rank);
      expect(isInHand).toBe(true);
    });

    it('should return a card that is valid to play', () => {
      const hand: Card[] = [
        card(Suits.HEARTS, '2'),
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '4'),
      ];

      const trick = new Trick();
      trick.leaderPID = PIDs.SOUTH;
      trick.cards[PIDs.SOUTH] = card(Suits.HEARTS, '7');

      const chosen = bot.chooseCard(hand, trick, true, false);

      // Chosen card should be valid according to getValidCards
      const validCards = botUtils.getValidCards(hand, trick, true, false);
      const isValid = validCards.some((c) => c.suit === chosen.suit && c.rank === chosen.rank);
      expect(isValid).toBe(true);
    });
  });

  describe('Integration with botUtils', () => {
    it('should work with multiple rounds of play', () => {
      const hand1: Card[] = [
        card(Suits.CLUBS, '3'),
        card(Suits.DIAMONDS, '5'),
        card(Suits.SPADES, '7'),
      ];

      const trick1 = new Trick();
      const card1 = bot.chooseCard(hand1, trick1, true, false);
      expect(card1).toBeDefined();

      // Simulate second trick - blood has been drawn by now
      const hand2: Card[] = [
        card(Suits.HEARTS, '2'),
        card(Suits.HEARTS, '4'),
      ];

      const trick2 = new Trick();
      trick2.leaderPID = PIDs.NORTH;
      trick2.cards[PIDs.NORTH] = card(Suits.HEARTS, '8');

      const card2 = bot.chooseCard(hand2, trick2, true, false); // bloodDrawn = true
      expect(card2.suit).toBe(Suits.HEARTS); // Must follow suit
    });
  });
});
