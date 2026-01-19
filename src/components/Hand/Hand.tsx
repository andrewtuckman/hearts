import React, { useState } from 'react';
import Card from '../Card/Card';
import { Suit, Rank } from '../../game/models/types';
import './Hand.css';

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

  const handleCardClick = (card: HandCard) => {
    setSelectedCardId(card.id);
    onPlayCard?.(card);
  };

  return (
    <div className="hand-container">
      <div className="hand">
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;

          return (
            <div
              key={card.id}
              className={`hand-card-wrapper ${isSelected ? 'selected' : ''}`}
            >
              <Card
                suit={card.suit}
                rank={card.rank}
                disabled={!card.playable}
                onClick={() => handleCardClick(card)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hand;
