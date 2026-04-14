export interface TileType {
    row: number;
    col: number;
    isMine: boolean;
    isFlagged: boolean;
    isRevealed: boolean;
    adjacentMines: number;
}
