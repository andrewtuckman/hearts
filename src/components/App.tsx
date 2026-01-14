import logo from '../logo.svg';
import './App.css';
import Card from './Card/Card';

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <Card suit="hearts" rank="K"></Card>
        <Card suit="hearts" rank="Q"></Card>
        <Card suit="hearts" rank="J"></Card>
      </header>
    </div>
  );
}

export default App;
