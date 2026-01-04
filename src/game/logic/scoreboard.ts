import { Scoreboard } from '../models/classes';
import { LOSING_SCORE, PIDs, SHOOT_THE_MOON_SCORE } from '../models/constants';
import { PID } from '../models/types';
import { createPlayerDict } from '../utils/utils';

/**
 * Updates the round score for a given player.
 * @param scoreboard - The current scoreboard
 * @param pid - The player ID whose score is to be updated
 * @param points - The points to add to the player's round score
 * @returns The updated round score for the player
 */
export function updateRoundScore(
  scoreboard: Scoreboard,
  pid: PID,
  points: number
) {
  return (scoreboard.roundScores[pid] += points);
}

/**
 * Updates the game scores based on the round scores.
 * Handles the "shooting the moon" scenario.
 * @param scoreboard - The current scoreboard
 * @returns The updated scoreboard with game scores adjusted
 */
export function updateGameScore(scoreboard: Scoreboard) {
  let { roundScores, gameScores } = scoreboard;
  // Check for "shooting the moon"
  const shooter = Object.entries(roundScores).find(
    ([_, score]) => score === SHOOT_THE_MOON_SCORE
  );
  if (shooter) {
    const [shooterPID] = shooter;
    for (const pid of Object.values(PIDs)) {
      if (pid !== shooterPID) {
        gameScores[pid as PID] += SHOOT_THE_MOON_SCORE;
      }
    }
  } else {
    for (const pid of Object.values(PIDs)) {
      gameScores[pid as PID] += roundScores[pid as PID];
    }
  }
  // Reset round scores
  scoreboard.roundScores = createPlayerDict(0);
  scoreboard.gameScores = gameScores;

  return scoreboard;
}

/**
 * Checks if any player has reached or exceeded the losing score.
 * @param scoreboard - The current scoreboard
 * @returns True if any player has lost, otherwise false
 */
export function hasLoser(scoreboard: Scoreboard): boolean {
  return Object.values(scoreboard.gameScores).some(
    (score) => score >= LOSING_SCORE
  );
}
