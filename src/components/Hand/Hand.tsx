import React, { useState } from 'react';
import HandBase from './HandBase';
import Card from '../Card/Card';
import { HandCard } from '../../models/types';

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
