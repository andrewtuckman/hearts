import { Trick } from '../types/classes';
import { PIDs, RanksOrder, Suits } from '../types/constants';
import { PID } from '../types/types';

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
