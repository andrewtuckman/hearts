import { Deck } from '../types/classes';
import { Hands, PID } from '../types/types';

export function passCards(
  hands: Hands,
  fromPID: PID,
  toPID: PID,
  cardsToPass: Deck
): void {
  // Remove cards from the 'from' player's hand
  for (const card of cardsToPass.cards) {
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
  hands[toPID].push(...cardsToPass.cards);
}
