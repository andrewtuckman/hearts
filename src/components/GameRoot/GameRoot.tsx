import React, { useState } from 'react';
import Hand, { HandCard } from '../Hand/Hand';
import Trick, { TrickState } from '../Trick/Trick';
import { Suits, Ranks } from '../../game/models/constants';
import { PID } from '../../game/models/types';
import './GameRoot.css';

const PLAYER_PID: PID = 'south';

export const GameRoot: React.FC = () => {
  // Temporary mock hand (player)
  const [hand, setHand] = useState<HandCard[]>(() =>
    Ranks.map((rank) => ({
      id: `hearts-${rank}`,
      suit: Suits.HEARTS,
      rank,
      playable: true,
    }))
  );

  // Current trick (center of table)
  const [trick, setTrick] = useState<TrickState>({});

  const handlePlayCard = (card: HandCard) => {
    // Remove card from hand
    setHand((prev) => prev.filter((c) => c.id !== card.id));

    // Add card to trick
    setTrick((prev) => ({
      ...prev,
      [PLAYER_PID]: { suit: card.suit, rank: String(card.rank) },
    }));
  };

  return (
    <div className="game-root">
      <Trick trick={trick} leaderPID={null} />
      <Hand cards={hand} onPlayCard={handlePlayCard} />
    </div>
  );
};

export default GameRoot;
