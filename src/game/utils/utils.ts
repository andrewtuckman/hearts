import { PIDs } from '../types/constants';
import { PID } from '../types/types';

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
