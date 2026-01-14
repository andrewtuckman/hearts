import { Ranks, Suits } from '../game/models/constants';
import './App.css';
import Hand, { HandCard } from './Hand/Hand';

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
      <div style={{ minHeight: '100vh', paddingBottom: '200px' }}>
        <Hand cards={heartsHand} onPlayCard={handlePlayCard} />
      </div>
    </div>
  );
}

export default App;
