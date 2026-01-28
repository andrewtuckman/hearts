import React from 'react';
import HandBase from './HandBase';
import { PID } from '../../models/types';
import './OpponentHand.css';
import CardBack from '../Card/CardBack';

interface OpponentCard {
  id: string;
}

interface OpponentHandProps {
  pid: PID;
  cardCount: number;
}

function generateCardIds(count: number, pid: PID): OpponentCard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${pid}-card-${i}`,
  }));
}

export const OpponentHand: React.FC<OpponentHandProps> = ({ pid, cardCount }) => {
  return (
    <div className={`opponent-hand opponent-hand--${pid}`}>
      <HandBase cards={generateCardIds(cardCount, pid)} renderCard={() => <CardBack size="small" />} />
    </div>
  );
};

export default OpponentHand;
