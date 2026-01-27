import React, { useState, useEffect } from 'react';
import Hand from '../Hand/Hand';
import OpponentHand from '../Hand/OpponentHand';
import Trick, { TrickState } from '../Trick/Trick';
import { HandCard } from '../../models/types';
import { RanksOrder } from '../../models/constants';
import { Trick as TrickClass, Card } from '../../models/classes';
import { PID } from '../../models/types';
import { SimpleBot } from '../../game/ai/simpleBot';
import { resolveTrick } from '../../game/logic/trick';
import { createDeck, shuffle } from '../../game/logic/deck';
import { getPlayOrder } from '../../utils/utils';
import './GameRoot.css';

const PLAYER_PID: PID = 'south';

export const GameRoot: React.FC = () => {
  /**
   * Initialize bots for opponent players
   */
  const [botPlayers] = useState({
    north: new SimpleBot('north', 'North Bot'),
    east: new SimpleBot('east', 'East Bot'),
    west: new SimpleBot('west', 'West Bot'),
  });

  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [opponentHands, setOpponentHands] = useState({
    north: Array.from({ length: 13 }, (_, i) => ({ id: `n-${i}` })),
    east: Array.from({ length: 13 }, (_, i) => ({ id: `e-${i}` })),
    west: Array.from({ length: 13 }, (_, i) => ({ id: `w-${i}` })),
  });

  /**
   * Actual hands for bots (Card objects, not UI HandCard)
   */
  const [hands, setHands] = useState<Record<PID, Card[]>>({
    north: [],
    east: [],
    south: [],
    west: [],
  });

  /**
   * Game state
   */
  const [bloodDrawn, setBloodDrawn] = useState(false);
  const [trick, setTrick] = useState<TrickState>({});
  const [leaderPID, setLeaderPID] = useState<PID | null>(null);
  const [scores, setScores] = useState<Record<PID, number>>({
    north: 0,
    east: 0,
    south: 0,
    west: 0,
  });

  const dealNewHand = () => {
    const deck = shuffle(createDeck());

    const dealtHands: Record<PID, Card[]> = {
      north: [],
      east: [],
      south: [],
      west: [],
    };
    deck.forEach((card, index) => {
      const pid: PID = ['north', 'east', 'south', 'west'][index % 4] as PID;
      dealtHands[pid].push(card);
    });
    dealtHands.south.sort((a, b) =>
      a.suit === b.suit
        ? RanksOrder[a.rank] - RanksOrder[b.rank]
        : a.suit.localeCompare(b.suit)
    );
    setHands(dealtHands);

    // 4. Update player UI hand
    setPlayerHand(
      dealtHands.south.map((card) => ({
        id: `${card.suit}-${card.rank}`,
        suit: card.suit,
        rank: card.rank,
        playable: true,
      }))
    );

    // 5. Update opponent UI hands (counts only)
    setOpponentHands({
      north: dealtHands.north.map((_, i) => ({ id: `n-${i}` })),
      east: dealtHands.east.map((_, i) => ({ id: `e-${i}` })),
      west: dealtHands.west.map((_, i) => ({ id: `w-${i}` })),
    });

    // 6. Reset trick + state
    setTrick({});
    setLeaderPID(null);
    setBloodDrawn(false);
  };

  /**
   * Player plays a card
   */
  const handlePlayCard = (card: HandCard) => {
    // Remove from hand
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));

    // Remove from internal hand state
    setHands((prev) => ({
      ...prev,
      [PLAYER_PID]: prev[PLAYER_PID].filter(
        (c) => !(c.suit === card.suit && c.rank === card.rank)
      ),
    }));

    // Add to trick
    setTrick((prev) => ({
      ...prev,
      [PLAYER_PID]: {
        suit: card.suit,
        rank: card.rank,
      },
    }));

    // Set as leader if this is the first card
    if (Object.keys(trick).length === 0) {
      setLeaderPID(PLAYER_PID);
    }
  };

  /**
   * Play remaining cards in turn order
   */
  const playRemainingCards = async () => {
    // Build the current trick state (accumulate as we play)
    const currentTrick: TrickState = { ...trick };

    // Maintain local copy of hands to track cards as they're played
    const currentHands = { ...hands };

    if (!leaderPID) return;

    const order = getPlayOrder(leaderPID).filter((pid) => pid !== PLAYER_PID);

    for (const pid of order) {
      if (!currentTrick[pid]) {
        // Small delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 500));

        const bot = botPlayers[pid as keyof typeof botPlayers];
        const botHand = currentHands[pid]; // Use accumulated hands, not state

        // Build Trick object for bot to evaluate (use accumulated trick state)
        const trickObj: TrickClass = {
          leaderPID,
          cards: {
            north: (currentTrick.north as Card) || null,
            east: (currentTrick.east as Card) || null,
            south: (currentTrick.south as Card) || null,
            west: (currentTrick.west as Card) || null,
          },
        };

        const chosenCard = bot.chooseCard(
          botHand,
          trickObj,
          bloodDrawn,
          Object.keys(currentTrick).length === 1
        );

        // Update accumulated trick (for next bot's evaluation)
        currentTrick[pid] = chosenCard;

        // Update accumulated hands (for next bot's hand)
        currentHands[pid] = botHand.filter(
          (c) => !(c.suit === chosenCard.suit && c.rank === chosenCard.rank)
        );

        // Update trick UI
        setTrick((prev) => ({ ...prev, [pid]: chosenCard }));

        // Remove card from bot's hand (state update)
        setHands((prev) => ({
          ...prev,
          [pid]: prev[pid].filter(
            (c) => !(c.suit === chosenCard.suit && c.rank === chosenCard.rank)
          ),
        }));

        // Update opponent hand display (just show fewer cards)
        setOpponentHands((prev) => ({
          ...prev,
          [pid]: prev[pid as keyof typeof prev].slice(0, -1),
        }));
      }
    }
  };

  /**
   * Start new hand on component mount
   */
  useEffect(() => {
    dealNewHand();
  }, []);

  /**
   * Trigger bot plays when player plays a card
   */
  useEffect(() => {
    // Only trigger if player has played and not all 4 cards are played
    if (leaderPID && trick[leaderPID] && Object.keys(trick).length < 4) {
      playRemainingCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trick.south]);

  /**
   * Handle trick completion
   */
  useEffect(() => {
    if (Object.keys(trick).length === 4) {
      // Resolve trick
      const trickObj: TrickClass = {
        leaderPID,
        cards: {
          north: trick.north || null,
          east: trick.east || null,
          south: trick.south || null,
          west: trick.west || null,
        },
      };

      const { winningPID, points } = resolveTrick(trickObj);

      // Update scores
      setScores((prev) => ({
        ...prev,
        [winningPID]: prev[winningPID] + points,
      }));

      // Update blood drawn if points were taken
      if (points > 0) {
        setBloodDrawn(true);
      }

      // Set next leader
      setLeaderPID(winningPID);

      // Reset trick after brief delay
      setTimeout(() => {
        setTrick({});
      }, 1500);
    }
  }, [trick, leaderPID]);

  return (
    <div className="game-root">
      {/* Opponents */}
      <OpponentHand pid="north" cards={opponentHands.north} />
      <OpponentHand pid="west" cards={opponentHands.west} />
      <OpponentHand pid="east" cards={opponentHands.east} />

      {/* Center trick */}
      <Trick leaderPID={leaderPID} trick={trick} />

      {/* Player hand */}
      <Hand cards={playerHand} onPlayCard={handlePlayCard} />

      {/* Display scores (optional) */}
      <div
        style={{ position: 'absolute', top: 10, right: 10, fontSize: '12px' }}
      >
        <div>North: {scores.north}</div>
        <div>South: {scores.south}</div>
        <div>East: {scores.east}</div>
        <div>West: {scores.west}</div>
      </div>
    </div>
  );
};

export default GameRoot;
