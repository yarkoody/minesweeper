import type { TileType } from "../types/TileType";

interface MineCoords {
    row: number;
    col: number;
}

export interface BoardLayout {
    rows: number;
    cols: number;
    minePositions: MineCoords[];
}

export function mapMineCordsToBoard(board: BoardLayout) {
    const { rows, cols, minePositions } = board;

    const mineSet = new Set<string>();
    for (const { row, col } of minePositions) {
        mineSet.add(`${row}-${col}`);
    }

    const boardData: TileType[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            row,
            col,
            isMine: mineSet.has(`${row}-${col}`),
            isFlagged: false,
            isRevealed: false,
            adjacentMines: 0,
        })),
    );
    return boardData;
}
