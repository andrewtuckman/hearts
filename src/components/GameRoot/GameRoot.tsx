import React, { useState, useEffect } from 'react';
import Hand from '../Hand/Hand';
import OpponentHand from '../Hand/OpponentHand';
import { Scoreboard } from '../Scoreboard/Scoreboard';
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
  const [botPlayers] = useState({
    north: new SimpleBot('north', 'North Bot'),
    east: new SimpleBot('east', 'East Bot'),
    west: new SimpleBot('west', 'West Bot'),
  });

  const [playerHand, setPlayerHand] = useState<HandCard[]>([]);
  const [opponentHandCount, setOpponentHandCount] = useState({
    north: 0,
    east: 0,
    west: 0,
  });

  /**
   * Actual hands (Card objects, not UI HandCard)
   */
  const [hands, setHands] = useState<Record<PID, Card[]>>({
    north: [],
    east: [],
    south: [],
    west: [],
  });

  const [bloodDrawn, setBloodDrawn] = useState(false);
  const [trick, setTrick] = useState<TrickState>({});
  const [isFirstTrick, setIsFirstTrick] = useState(true);
  const [currentTurnPID, setCurrentTurnPID] = useState<PID | null>(null);
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

    setPlayerHand(
      dealtHands.south.map((card) => ({
        id: `${card.suit}-${card.rank}`,
        suit: card.suit,
        rank: card.rank,
        playable: true,
      }))
    );

    setOpponentHandCount({
      north: 13,
      east: 13,
      west: 13,
    });

    setTrick({});
    setBloodDrawn(false);
    setIsFirstTrick(true);

    const twoOfClubsHolder = (Object.keys(dealtHands) as PID[]).find((pid) =>
      dealtHands[pid].some((c) => c.suit === 'clubs' && c.rank === '2')
    ) as PID;

    setLeaderPID(twoOfClubsHolder);
  };

  const handlePlayCard = (card: HandCard) => {
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));

    setHands((prev) => ({
      ...prev,
      south: prev.south.filter(
        (c) => !(c.suit === card.suit && c.rank === card.rank)
      ),
    }));

    setTrick((prev) => ({
      ...prev,
      south: { suit: card.suit, rank: card.rank },
    }));
  };

  useEffect(() => {
    dealNewHand();
  }, []);

  // Human must-play-2♣ enforcement
  useEffect(() => {
    if (isFirstTrick && leaderPID === PLAYER_PID) {
      setPlayerHand((prev) =>
        prev.map((c) => ({
          ...c,
          playable: c.suit === 'clubs' && c.rank === '2',
        }))
      );
    } else {
      setPlayerHand((prev) => prev.map((c) => ({ ...c, playable: true })));
    }
  }, [leaderPID, isFirstTrick]);

  useEffect(() => {
    if (leaderPID && Object.keys(trick).length === 0) {
      setCurrentTurnPID(leaderPID);
    }
  }, [leaderPID]);

  useEffect(() => {
    if (!currentTurnPID || currentTurnPID === PLAYER_PID) return;

    const playBotCard = async () => {
      await new Promise((r) => setTimeout(r, 500));

      const bot = botPlayers[currentTurnPID as keyof typeof botPlayers];
      const botHand = hands[currentTurnPID];

      let chosenCard: Card;

      // First trick 2♣ enforcement
      if (isFirstTrick && Object.keys(trick).length === 0) {
        chosenCard = botHand.find((c) => c.suit === 'clubs' && c.rank === '2')!;
      } else {
        const trickObj: TrickClass = {
          leaderPID: leaderPID!,
          cards: {
            north: trick.north || null,
            east: trick.east || null,
            south: trick.south || null,
            west: trick.west || null,
          },
        };

        chosenCard = bot.chooseCard(
          botHand,
          trickObj,
          bloodDrawn,
          Object.keys(trick).length === 0
        );
      }

      setHands((prev) => ({
        ...prev,
        [currentTurnPID]: prev[currentTurnPID].filter(
          (c) => !(c.suit === chosenCard.suit && c.rank === chosenCard.rank)
        ),
      }));

      setOpponentHandCount((prev) => ({
        ...prev,
        [currentTurnPID]: prev[currentTurnPID] - 1,
      }));

      setTrick((prev) => ({
        ...prev,
        [currentTurnPID]: chosenCard,
      }));
    };

    playBotCard();
  }, [currentTurnPID]);

  useEffect(() => {
    if (!leaderPID) return;

    const order = getPlayOrder(leaderPID);
    const played = Object.keys(trick);

    // Trick not finished → advance to next player
    if (played.length > 0 && played.length < 4) {
      const nextPID = order[played.length];
      setCurrentTurnPID(nextPID);
    }

    // Trick finished
    if (played.length === 4) {
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

      setScores((prev) => ({
        ...prev,
        [winningPID]: prev[winningPID] + points,
      }));

      if (points > 0) setBloodDrawn(true);

      setTimeout(() => {
        setTrick({});
        setLeaderPID(winningPID);
        setCurrentTurnPID(winningPID);
        setIsFirstTrick(false);
      }, 1200);
    }
  }, [trick]);

  return (
    <div className="game-root">
      <OpponentHand pid="north" cardCount={opponentHandCount.north} />
      <OpponentHand pid="west" cardCount={opponentHandCount.west} />
      <OpponentHand pid="east" cardCount={opponentHandCount.east} />

      <Trick leaderPID={leaderPID} trick={trick} />
      <Hand cards={playerHand} onPlayCard={handlePlayCard} />

      <div
        className="scoreboard-container"
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <Scoreboard scores={scores} />
      </div>
    </div>
  );
};

export default GameRoot;
