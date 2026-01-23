import { HandCard } from '../../models/types';
import { getRandomInt } from '../../utils/utils';

export const simpleBot = (hand: HandCard[]): HandCard => {
  // Pick a random card from the hand
  const randomIndex = getRandomInt(0, hand.length - 1);
  return hand[randomIndex];
};
