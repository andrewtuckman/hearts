import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import { PID, Suit, Rank } from '../../game/models/types';
import { resolveTrick } from '../../game/logic/trick';
import {
  Trick as TrickClass,
  Card as CardInterface,
} from '../../game/models/classes';
import { PIDs } from '../../game/models/constants';
import './Trick.css';

export type TrickState = Partial<Record<PID, CardInterface>>;

interface TrickProps {
  trick: TrickState;
  leaderPID: PID | null;
}

export const Trick: React.FC<TrickProps> = ({ trick, leaderPID }) => {
  const [winningPID, setWinningPID] = useState<PID | null>(null);

  useEffect(() => {
    // Check if all cards are played
    const allPlayed = Object.values(PIDs).every((pid) => trick[pid]);

    if (allPlayed && leaderPID !== null) {
      try {
        // Create a Trick object to pass to resolveTrick
        const cards = Object.entries(trick).reduce((acc, [pid, card]) => {
          acc[pid as PID] = card ? card : null;
          return acc;
        }, {} as Record<PID, CardInterface | null>);

        const trickObj: TrickClass = {
          leaderPID,
          cards,
        };
        const { winningPID: winner } = resolveTrick(trickObj);
        setWinningPID(winner);
      } catch (e) {
        console.error('Error resolving trick:', e);
      }
    } else {
      setWinningPID(null);
    }
  }, [trick, leaderPID]);

  return (
    <div className="trick-container">
      <div className="trick-table">
        {Object.entries(trick).map(([pid, card]) => {
          if (!card) return null;

          const isWinning = winningPID !== null && pid === winningPID;
          return (
            <div
              key={pid}
              className={`trick-card trick-card--${pid} ${
                isWinning ? 'trick-card--winning' : ''
              }`}
            >
              <Card suit={card.suit} rank={card.rank as Rank} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trick;
