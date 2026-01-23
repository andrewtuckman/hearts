import { Hands, PID } from '../../models/types';
import { Card } from '../../models/classes';

/**
 * Remove a single card from a player's hand (mutates hands) and return it.
 * Throws if not found or hand empty.
 * @param hands - Dictionary with PIDs as keys and an array of Card objects as values
 * @param pid - PID of the player whose hand to modify
 * @param card - Card object to remove
 * @returns The removed Card object
 */
export function removeCardFromHand(hands: Hands, pid: PID, card: Card): Card {
  const hand = hands[pid];
  if (!hand || hand.length <= 0) {
    throw new Error(`Player ${pid} has no cards in hand to remove.`);
  }
  const cardIndex = hand.findIndex(
    (c) => c.suit === card.suit && c.rank === card.rank
  );
  if (cardIndex === -1) {
    throw new Error(
      `Card ${card.rank} of ${card.suit} not found in player ${pid}'s hand.`
    );
  }
  const [removed] = hand.splice(cardIndex, 1);
  if (!removed || removed.suit !== card.suit || removed.rank !== card.rank) {
    throw new Error(
      `Removed card does not match the requested card for player ${pid}.`
    );
  }
  return removed;
}

/**
 * Add cards to a player's hand (mutates hands).
 * @param hands - Dictionary with PIDs as keys and an array of Card objects as values
 * @param pid - PID of the player whose hand to modify
 * @param cards - Array of Card objects to add
 */
export function addCardsToHand(hands: Hands, pid: PID, cards: Card[]): void {
  hands[pid].push(...cards);
}

/**
 * Transfer cards from one player's hand to another (uses removeCardFromHand).
 * Preserves the order of cardsToTransfer when adding to destination.
 * @param hands - Dictionary with PIDs as keys and an array of Card objects as values
 * @param fromPID - PID of the player passing the cards
 * @param toPID - PID of the player receiving the cards
 * @param cardsToTransfer - Array of Card objects to pass
 */
export function transferCards(
  hands: Hands,
  fromPID: PID,
  toPID: PID,
  cardsToTransfer: Card[]
): void {
  const removed: Card[] = [];
  for (const card of cardsToTransfer) {
    removed.push(removeCardFromHand(hands, fromPID, card));
  }
  addCardsToHand(hands, toPID, removed);
}
