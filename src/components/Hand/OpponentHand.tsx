import React from 'react';
import HandBase from './HandBase';
import { PID } from '../../game/models/types';
import './OpponentHand.css';
import CardBack from '../Card/CardBack';

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
      <HandBase cards={cards} renderCard={() => <CardBack size="small" />} />
    </div>
  );
};

export default OpponentHand;
