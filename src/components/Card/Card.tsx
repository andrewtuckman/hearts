import React from 'react';
import './Card.css';
import { Rank, Suit } from '../../game/models/types';
import { Suits } from '../../game/models/constants';

interface CardProps {
  suit: Suit;
  rank: Rank;
  onClick?: () => void;
  disabled?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  [Suits.HEARTS]: '♥',
  [Suits.DIAMONDS]: '♦',
  [Suits.CLUBS]: '♣',
  [Suits.SPADES]: '♠',
};

export const Card: React.FC<CardProps> = ({
  suit,
  rank,
  onClick,
  disabled = false,
}) => {
  const imageSrc = `/cards/${suit}-${rank}.png`;

  return (
    <button
      className={`card ${suit} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${rank} of ${suit}`}
      type="button"
    >
      <div className="card-corner top-left">
        <span className="rank">{rank as string}</span>
        <span className="suit">{suitSymbols[suit]}</span>
      </div>

      <div className="card-center">
        <img src={imageSrc} alt="" draggable={false} />
      </div>

      <div className="card-corner bottom-right">
        <span className="rank">{rank as string}</span>
        <span className="suit">{suitSymbols[suit]}</span>
      </div>
    </button>
  );
};

export default Card;
