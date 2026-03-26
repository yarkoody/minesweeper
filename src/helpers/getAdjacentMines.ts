import type { TileType } from "../types/TileType";

export function getAdjacentMines(
    board: TileType[][],
    row: number,
    col: number,
): number {
    if (!board || board.length === 0 || board[0].length === 0) return -1;

    const boardRowLimit = board.length;
    const boardColLimit = board[0].length;

    if (row >= boardRowLimit || col >= boardColLimit) return -1;
    if (row < 0 || col < 0) return -1;

    let mineCount = 0;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            const isCenter = r === row && c === col;
            const isOutOfBounds =
                c < 0 || c >= boardColLimit || r < 0 || r >= boardRowLimit;

            if (isCenter || isOutOfBounds) continue;
            if (board[r][c].isMine) mineCount++;
        }
    }
    return mineCount;
}
