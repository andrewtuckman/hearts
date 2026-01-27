import { PIDs, TURN_ORDER } from '../models/constants';
import { PID } from '../models/types';

/**
 * Creates a dictionary with PIDs as keys and the specified initial value.
 * @param initValue - The initial value to assign to each PID
 * @returns A dictionary with PIDs as keys and the initial value
 */
export function createPlayerDict(initValue: any): Record<PID, any> {
  return Object.values(PIDs).reduce((accum, pid) => {
    accum[pid as PID] = initValue;
    return accum;
  }, {} as Record<PID, any>);
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPlayOrder(leader: PID): PID[] {
  const startIdx = TURN_ORDER.indexOf(leader);
  return [...TURN_ORDER.slice(startIdx), ...TURN_ORDER.slice(0, startIdx)];
}
