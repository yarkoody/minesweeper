import type { TileType } from "../../types/TileType";
import styles from "./Tile.module.css";

interface TileProps {
    tile: TileType;
    onReveal: (row: number, col: number) => void;
    onToggleFlag: (row: number, col: number) => void;
}

export function Tile({ tile, onReveal, onToggleFlag }: TileProps) {
    const getTileContent = (tile: TileType): React.ReactNode => {
        if (!tile.isRevealed) return tile.isFlagged ? "🚩" : "";
        if (tile.isMine) return "💣";
        return tile.adjacentMines > 0 ? tile.adjacentMines : "";
    };

    const content = getTileContent(tile);

    return (
        <div
            className={[
                styles.tile,
                tile.isRevealed && !tile.isFlagged && !tile.isMine
                    ? styles.tileRevealed
                    : "",
                tile.isFlagged ? styles.tileFlagged : "",
                tile.isRevealed && tile.isMine ? styles.tileMine : "",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={() => onReveal(tile.row, tile.col)}
            onContextMenu={(e) => {
                onToggleFlag(tile.row, tile.col);
                e.preventDefault();
            }}
        >
            {content}
        </div>
    );
}
