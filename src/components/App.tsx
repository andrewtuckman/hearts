import { Ranks, Suits } from '../game/models/constants';
import './App.css';
import Hand, { HandCard } from './Hand/Hand';

function App(): JSX.Element {
  const spadesHand: HandCard[] = Ranks.map((rank) => ({
    id: `spades-${rank}`,
    suit: Suits.SPADES,
    rank,
    playable: true,
  }));

  const handlePlayCard = (card: HandCard) => {
    console.log('Played card:', card);
  };

  return (
    <div className="App">
      <div style={{ minHeight: '100vh', paddingBottom: '200px' }}>
        <Hand cards={spadesHand} onPlayCard={handlePlayCard} />
      </div>
    </div>
  );
}

export default App;
