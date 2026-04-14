import type { TileType } from "../../types/TileType";
import { Tile } from "../Tile/Tile";
import styles from "./Board.module.css";

interface BoardProps {
    tiles: TileType[][];
    isWin: boolean;
    isGameOver: boolean;
    handleReveal: (row: number, col: number) => void;
    handleToggleFlag: (row: number, col: number) => void;
}

export function Board({
    tiles,
    isWin,
    isGameOver,
    handleReveal,
    handleToggleFlag,
}: BoardProps) {
    const className = [
        styles.board,
        isWin && !isGameOver ? styles.boardWin : "",
        isGameOver && !isWin ? styles.boardLose : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <div className={className}>
            {tiles.map((row: TileType[]) =>
                row.map((tile: TileType) => (
                    <Tile
                        tile={tile}
                        onReveal={handleReveal}
                        onToggleFlag={handleToggleFlag}
                        key={`${tile.row}-${tile.col}`}
                    />
                )),
            )}
        </div>
    );
}
