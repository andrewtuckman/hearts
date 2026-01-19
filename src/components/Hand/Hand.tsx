import React, { useState } from 'react';
import HandBase from './HandBase';
import Card from '../Card/Card';
import { Suit, Rank } from '../../game/models/types';

export interface HandCard {
  id: string;
  suit: Suit;
  rank: Rank;
  playable?: boolean;
}

interface HandProps {
  cards: HandCard[];
  onPlayCard?: (card: HandCard) => void;
}

export const Hand: React.FC<HandProps> = ({ cards, onPlayCard }) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  return (
    <HandBase
      cards={cards}
      renderCard={(card) => {
        const typed = card as HandCard;
        return (
          <Card
            suit={typed.suit}
            rank={typed.rank}
            disabled={!typed.playable}
            onClick={() => onPlayCard?.(typed)}
          />
        );
      }}
    />
  );
};

export default Hand;