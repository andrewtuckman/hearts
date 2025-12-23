import { Card } from '../types/classes';
import { Hands, PID } from '../types/types';

/**
 * Passes cards from one player's hand to another's.
 * @param hands - Dictionary with PIDs as keys and an array of Card objects as values
 * @param fromPID - PID of the player passing the cards
 * @param toPID - PID of the player receiving the cards
 * @param cardsToPass - Array of Card objects to pass
 */
export function passCards(
  hands: Hands,
  fromPID: PID,
  toPID: PID,
  cardsToPass: Card[]
): void {
  // Remove cards from the 'from' player's hand
  for (const card of cardsToPass) {
    const index = hands[fromPID].findIndex(
      (c) => c.suit === card.suit && c.rank === card.rank
    );
    if (index !== -1) {
      hands[fromPID].splice(index, 1);
    } else {
      throw new Error(
        `Card ${card.rank} of ${card.suit} not found in player ${fromPID}'s hand.`
      );
    }
  }

  // Add cards to the 'to' player's hand
  hands[toPID].push(...cardsToPass);
}
