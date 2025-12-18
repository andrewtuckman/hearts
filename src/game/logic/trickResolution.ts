import { Trick } from "../types/classes";
import { PIDs, RanksOrder } from "../types/constants";
import { PID } from "../types/types";

export function resolveTrick(trick: Trick): PID {
    const { leader, cards } = trick;

    for (const card in Object.values(cards)) {
        if (card === null) {
            throw new Error("Not all players have played their cards yet.");
        }
    }
    if (leader === null) {
        throw new Error("Leader is not set for this trick.");
    }
    const leadCard = cards[leader];
    let winningPID = leader;
    for (const pid of Object.values(PIDs)) {
        const card = cards[pid];
        if (card && card.suit === leadCard!.suit) {
            if (RanksOrder[card.rank] > RanksOrder[leadCard!.rank]) {
                winningPID = pid as PID;
            }
        }
    }
    return winningPID;
}