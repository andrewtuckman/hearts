import React from 'react';
import HandBase from './HandBase';
import Card from '../Card/Card';
import { PID } from '../../game/models/types';
import './OpponentHand.css';

interface OpponentCard {
  id: string;
}

interface OpponentHandProps {
  pid: PID;
  cards: OpponentCard[];
}

export const OpponentHand: React.FC<OpponentHandProps> = ({ pid, cards }) => {
  return (
    <div className={`opponent-hand opponent-hand--${pid}`}>
      <HandBase
        cards={cards}
        renderCard={() => (
          <div className="opponent-card">
            <Card suit="hearts" rank="A" disabled />
          </div>
        )}
      />
    </div>
  );
};

export default OpponentHand;
