import { useRef, useState } from "react";
import { boardData } from "../../data/boardData";
import { Board } from "../Board/Board";
import type { TileType } from "../../types/TileType";
import { Hud } from "../Hud/Hud";
import type { HudMetricType } from "../../types/HudMetricType";
import { formatTime } from "../../helpers/formatTime";
import styles from "./Game.module.css";

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
        const isMineClicked = clickedTile.isMine;

        const nextBoard = board.map((rowArr, rowIndex) => {
            if (rowIndex !== row) return rowArr;

            return rowArr.map((tile, tileIndex) => {
                if (tileIndex !== col) return tile;
                return { ...tile, isRevealed: true };
            });
        });
        setBoard(nextBoard);

        if (isMineClicked) {
            setIsGameOver(true);
            handleStopTimer(timerIdRef.current);
            timerIdRef.current = null;
            return;
        }
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

    return (
        <div className={styles.gameShell}>
            <div className={styles.gameHeader}>
                <p className={styles.gameTitle}>MineSweeper</p>
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
