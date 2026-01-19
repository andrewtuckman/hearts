import { PIDs, Ranks, Suits } from '../game/models/constants';
import './App.css';
import Hand, { HandCard } from './Hand/Hand';
import Trick from './Trick/Trick';

function App(): JSX.Element {
  const heartsHand: HandCard[] = Ranks.map((rank) => ({
    id: `hearts-${rank}`,
    suit: Suits.HEARTS,
    rank,
    playable: true,
  }));

  const handlePlayCard = (card: HandCard) => {
    console.log('Played card:', card);
  };

  return (
    <div className="App">
      <Trick
        leaderPID={PIDs.NORTH}
        trick={{
          north: { suit: 'spades', rank: 'A' },
          east: { suit: 'spades', rank: '10' },
          south: { suit: 'hearts', rank: '2' },
          west: { suit: 'spades', rank: 'K' },
        }}
      />
      <div style={{ minHeight: '100vh', paddingBottom: '200px' }}>
        <Hand cards={heartsHand} onPlayCard={handlePlayCard} />
      </div>
    </div>
  );
}

export default App;
