import type { TileType } from "../types/TileType";

export const checkWinCondition = (board: TileType[][]): boolean => {
    return board.every((rowArray) =>
        rowArray.every((tile) => tile.isMine || tile.isRevealed),
    );
};
