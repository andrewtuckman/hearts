import React from 'react';
import Card from '../Card/Card';
import { Suit, Rank } from '../../game/models/types';
import './Hand.css';

export interface BaseHandCard {
  id: string;
  suit?: Suit;
  rank?: Rank;
}

interface HandBaseProps {
  cards: BaseHandCard[];
  renderCard: (card: BaseHandCard) => React.ReactNode;
}

export const HandBase: React.FC<HandBaseProps> = ({
  cards,
  renderCard,
}) => {
  return (
    <div className="hand-container">
      <div className="hand">
        {cards.map((card) => (
          <div key={card.id} className="hand-card-wrapper">
            {renderCard(card)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandBase;
