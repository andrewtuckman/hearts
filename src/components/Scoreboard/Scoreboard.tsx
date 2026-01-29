import { PID } from '../../models/types';
import './Scoreboard.css';

export const Scoreboard: React.FC<{
  scores: Record<PID, number>;
}> = ({ scores }) => {
  return (
    <div className="scoreboard">
      <div>North: {scores.north}</div>
      <div>South: {scores.south}</div>
      <div>East: {scores.east}</div>
      <div>West: {scores.west}</div>
    </div>
  );
};
