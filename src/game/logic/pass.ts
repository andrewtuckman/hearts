import { Hands, PID } from '../models/types';
import { PIDs, PassingDirections } from '../models/constants';
import { Card } from '../models/classes';

/**
 * Pass selected cards between players according to the chosen direction.
 *
 * @param passSelections - Mapping of `PID` to the array of `Card`s that player wants to pass.
 * @param hands - Current hands mapping of `PID` to their `Card[]`.
 * @param direction - One of the `PassingDirections` values (left, right, across, hold).
 * @returns Hands - A new `Hands` object reflecting cards after passing.
 */
export function passCards(
	passSelections: Record<PID, Card[]>,
	hands: Hands,
	direction: (typeof PassingDirections)[keyof typeof PassingDirections]
): Hands {
	const orderedPIDs = Object.values(PIDs) as PID[];

	// Create a shallow copy of hands (copy arrays) so we don't mutate the original
	const newHands: Hands = orderedPIDs.reduce((acc, pid) => {
		acc[pid] = hands[pid].slice();
		return acc;
	}, {} as Hands);

	if (direction === PassingDirections.HOLD) {
		return newHands;
	}

	const idxFor = (idx: number, offset: number) => (idx + offset + orderedPIDs.length) % orderedPIDs.length;

	for (let i = 0; i < orderedPIDs.length; i++) {
		const fromPID = orderedPIDs[i];
		const selected = passSelections[fromPID] || [];

		let targetIdx: number;
		switch (direction) {
			case PassingDirections.LEFT:
				targetIdx = idxFor(i, 1);
				break;
			case PassingDirections.RIGHT:
				targetIdx = idxFor(i, -1);
				break;
			case PassingDirections.ACROSS:
				targetIdx = idxFor(i, 2);
				break;
			default:
				throw new Error(`Unsupported passing direction: ${direction}`);
		}

		const toPID = orderedPIDs[targetIdx];

		// Remove each selected card from the source hand and add to the target hand
		for (const card of selected) {
			const idxInHand = newHands[fromPID].findIndex(
				(c) => c.suit === card.suit && c.rank === card.rank
			);
			if (idxInHand === -1) {
				throw new Error(
					`Card not found in hand for ${fromPID}: ${card.rank} of ${card.suit}`
				);
			}

			const [removed] = newHands[fromPID].splice(idxInHand, 1);
			newHands[toPID].push(removed);
		}
	}

	return newHands;
}

export default passCards;

