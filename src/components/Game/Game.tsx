import { useRef, useState } from "react";
import { boardData } from "../../data/boardData";
import { Board } from "../Board/Board";
import type { TileType } from "../../types/TileType";
import { Hud } from "../Hud/Hud";
import type { HudMetricType } from "../../types/HudMetricType";
import { formatTime } from "../../helpers/formatTime";
import styles from "./Game.module.css";
import { getAdjacentMines } from "../../helpers/getAdjacentMines";

export function Game() {
    const [board, setBoard] = useState(boardData);
    const [isWin, setIsWin] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const hasFirstMoveBeenMade = useRef(false);
    const timerIdRef = useRef<number | null>(null);

    const flagsPlaced = board.reduce(
        (acc, row) => acc + row.filter((tile) => tile.isFlagged).length,
        0,
    );

    const handleFirstClickTimer = () => {
        timerIdRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return timerIdRef.current;
    };

    const handleStopTimer = (id: number | null) => {
        if (id !== null) {
            clearInterval(id);
        }
    };

    const hudMetrics: HudMetricType[] = [
        { id: "flags", icon: "🚩", value: flagsPlaced },
        { id: "time", icon: "⏱", value: formatTime(elapsedTime) },
    ];
    const checkWinCondition = (board: TileType[][]) => {
        return board.every((rowArray) =>
            rowArray.every((tile) => tile.isMine || tile.isRevealed),
        );
    };

    const handleReveal = (row: number, col: number) => {
        if (isGameOver || isWin) return;

        const clickedTile = board[row][col];
        if (clickedTile.isFlagged || clickedTile.isRevealed) return;

        if (!hasFirstMoveBeenMade.current) {
            hasFirstMoveBeenMade.current = true;
            handleFirstClickTimer();
        }

        const nextBoard = board.map((rowArr) =>
            rowArr.map((tile) => ({ ...tile })),
        );
        const clicked = nextBoard[row][col];
        if (clicked.isMine) {
            clicked.isRevealed = true;
            setBoard(nextBoard);
            setIsGameOver(true);
            handleStopTimer(timerIdRef.current);
            timerIdRef.current = null;
            return;
        }

        floodReveal(nextBoard, row, col);
        setBoard(nextBoard);

        if (checkWinCondition(nextBoard)) {
            setIsWin(true);
            handleStopTimer(timerIdRef.current);
            timerIdRef.current = null;

            return;
        }
    };

    const handleToggleFlag = (row: number, col: number) => {
        if (isGameOver || isWin || board[row][col].isRevealed) return;

        setBoard((prevBoard) => {
            const nextBoard = prevBoard.map((rowArr, rowIndex) => {
                if (rowIndex !== row) return rowArr;
                return rowArr.map((tile, tileIndex) => {
                    if (tileIndex !== col) return tile;
                    return { ...tile, isFlagged: !tile.isFlagged };
                });
            });
            return nextBoard;
        });
    };

    const floodReveal = (
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
                row < 0 ||
                row >= board.length ||
                col < 0 ||
                col >= board[0].length;
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

    return (
        <div className={styles.gameShell}>
            <div className={styles.gameHeader}>
                <h1 className={styles.gameTitle}>MineSweeper</h1>
                <p className={styles.gameStatus}>
                    {isWin ? "You win!" : isGameOver ? "Game Over" : ""}
                </p>
            </div>
            <Hud metrics={hudMetrics} />
            <Board
                tiles={board}
                handleReveal={handleReveal}
                handleToggleFlag={handleToggleFlag}
                isWin={isWin}
                isGameOver={isGameOver}
            />
        </div>
    );
}
