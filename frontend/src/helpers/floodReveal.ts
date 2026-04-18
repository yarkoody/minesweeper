import type { TileType } from "../types/TileType";
import { getAdjacentMines } from "./getAdjacentMines";

export const floodReveal = (
    board: TileType[][],
    startRow: number,
    startCol: number,
) => {
    const queue: Array<[number, number]> = [[startRow, startCol]];
    const visited = new Set<string>();
    const directions: Array<[number, number]> = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];
    while (queue.length > 0) {
        const current = queue.shift();

        if (!current) continue;
        const [row, col] = current;

        const outOfBounds =
            row < 0 || row >= board.length || col < 0 || col >= board[0].length;
        if (outOfBounds) continue;

        const key = `${row}-${col}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const tile = board[row][col];

        if (tile.isFlagged || tile.isMine || tile.isRevealed) continue;

        tile.isRevealed = true;

        const adjacent = getAdjacentMines(board, row, col);
        tile.adjacentMines = adjacent;

        if (adjacent !== 0) continue;

        for (const [dRow, dCol] of directions) {
            queue.push([row + dRow, col + dCol]);
        }
    }
};
