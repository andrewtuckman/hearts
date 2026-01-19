import { Ranks, Suits } from '../game/models/constants';
import './App.css';
import GameRoot from './GameRoot/GameRoot';
import { HandCard } from './Hand/Hand';

function App(): JSX.Element {
  return (
    <div className="App">
      <GameRoot/>
    </div>
  );
}

export default App;
