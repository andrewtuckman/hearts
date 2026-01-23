import React, { useState } from 'react';
import Hand from '../Hand/Hand';
import { HandCard } from '../../models/types';
import OpponentHand from '../Hand/OpponentHand';
import Trick, { TrickState } from '../Trick/Trick';
import { Suits, Ranks } from '../../models/constants';
import { PID } from '../../models/types';
import './GameRoot.css';

const PLAYER_PID: PID = 'south';

export const GameRoot: React.FC = () => {
  /**
   * Player hand (bottom)
   */
  const [playerHand, setPlayerHand] = useState<HandCard[]>(
    Ranks.map((rank) => ({
      id: `diamonds-${rank}`,
      suit: Suits.DIAMONDS,
      rank,
      playable: true,
    }))
  );

  /**
   * Opponent hands (face-down)
   */
  const [opponentHands] = useState({
    north: Array.from({ length: 13 }, (_, i) => ({ id: `n-${i}` })),
    east: Array.from({ length: 13 }, (_, i) => ({ id: `e-${i}` })),
    west: Array.from({ length: 13 }, (_, i) => ({ id: `w-${i}` })),
  });

  /**
   * Current trick (center)
   */
  const [trick, setTrick] = useState<TrickState>({
    north: { suit: Suits.SPADES, rank: 'K' },
    east: { suit: Suits.DIAMONDS, rank: 'Q' },
    west: { suit: Suits.HEARTS, rank: 'J' },
  });

  /**
   * Player plays a card
   */
  const handlePlayCard = (card: HandCard) => {
    // Remove from hand
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));

    // Add to trick
    setTrick((prev) => ({
      ...prev,
      [PLAYER_PID]: {
        suit: card.suit,
        rank: card.rank,
      },
    }));
  };

  return (
    <div className="game-root">
      {/* Opponents */}
      <OpponentHand pid="north" cards={opponentHands.north} />
      <OpponentHand pid="west" cards={opponentHands.west} />
      <OpponentHand pid="east" cards={opponentHands.east} />

      {/* Center trick */}
      <Trick leaderPID={'west'} trick={trick} />

      {/* Player hand */}
      <Hand cards={playerHand} onPlayCard={handlePlayCard} />
    </div>
  );
};

export default GameRoot;
