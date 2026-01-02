import { Card, Trick } from '../types/classes';
import { PIDs, RanksOrder, Suits } from '../types/constants';
import { PID, Hands } from '../types/types';
import { removeCardFromHand } from './hand';

/**
 * Plays a card for a player in the given trick and removes it from the player's hand.
 * @param trick - The current trick
 * @param hands - The game hands (will be mutated)
 * @param pid - The player ID
 * @param card - The card to play
 * @returns The updated trick
 */
export function playCard(trick: Trick, hands: Hands, pid: PID, card: Card) {
  if (trick.cards[pid] !== null) {
    throw new Error(`Player ${pid} has already played a card this trick.`);
  }
  // remove from hand (will throw if not present)
  removeCardFromHand(hands, pid, card);
  trick.cards[pid] = card;
  return trick;
}

/**
 * Resolves the winner of a trick and calculates the points associated.
 * @param trick - The trick to resolve
 * @returns An object containing the winning player's ID and the points in the trick
 */
export function resolveTrick(trick: Trick): {
  winningPID: PID;
  points: number;
} {
  const { leaderPID, cards } = trick;

  let points = 0;
  for (const card of Object.values(cards)) {
    if (card === null) {
      throw new Error('Not all players have played their cards yet.');
    }

    if (card.suit === Suits.HEARTS) {
      points += 1;
    } else if (card.suit === Suits.SPADES && card.rank === 'Q') {
      points += 13;
    }
  }
  if (leaderPID === null) {
    throw new Error('Leader is not set for this trick.');
  }
  const leadCard = cards[leaderPID];
  let winningPID = leaderPID;
  for (const pid of Object.values(PIDs)) {
    const card = cards[pid];
    if (card && card.suit === leadCard!.suit) {
      if (RanksOrder[card.rank] > RanksOrder[leadCard!.rank]) {
        winningPID = pid as PID;
      }
    }
  }
  return { winningPID, points };
}
