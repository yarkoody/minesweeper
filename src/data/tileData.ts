import type { TileType } from "../types/TileType";

export const tileData: TileType = {
    row: 0,
    col: 0,
    isMine: false,
    isFlagged: true,
    isRevealed: false,
    adjacentMines: 0,
};
