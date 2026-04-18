import { useCallback, useEffect, useRef, useState } from "react";
import type { TileType } from "../types/TileType";
import { mapMineCordsToBoard } from "../helpers/mapMineCordsToBoard";
import axios from "axios";

import { checkWinCondition } from "../helpers/checkWinCondition";
import { useGameTimer } from "./useGameTimer";
import { floodReveal } from "../helpers/floodReveal";
import type { GameStatus } from "../types/GameStatus";

export function useBoard(onResetGame?: () => void) {
    const [board, setBoard] = useState<TileType[][]>([] as TileType[][]);
    const [gameState, setGameState] = useState<GameStatus>({
        status: "playing",
    });
    const { elapsedTime, startGameTimer, stopGameTimer } = useGameTimer();
    const hasFirstMoveBeenMade = useRef<boolean>(false);
    const flagsPlaced = board.reduce(
        (acc, row) =>
            acc +
            row.filter((tile) => tile.isMine).length -
            row.filter((tile) => tile.isFlagged).length,
        0,
    );

    const fetchBoardData = useCallback(async () => {
        try {
            const response = await axios.post(
                "http://localhost:5034/game/start",
            );

            if (!response?.data) {
                throw new Error("Failed to fetch board data");
            }
            console.log("Fetched board data:", response.data);
            // debugger;

            return setBoard(
                mapMineCordsToBoard({
                    rows: response.data.rows,
                    cols: response.data.cols,
                    minePositions: response.data.minePositions,
                }),
            );
        } catch (error) {
            console.error("Error fetching board data:", error);
            throw error;
        }
    }, []);
    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    const handleReveal = (row: number, col: number) => {
        if (gameState.status !== "playing") return;

        const clickedTile = board[row][col];
        if (clickedTile.isFlagged || clickedTile.isRevealed) return;

        startGameTimer();

        const nextBoard = board.map((rowArr) =>
            rowArr.map((tile) => ({ ...tile })),
        );
        const clicked = nextBoard[row][col];
        if (clicked.isMine) {
            clicked.isRevealed = true;
            setBoard(nextBoard);
            setGameState({ status: "lost" });
            stopGameTimer();
            return;
        }

        floodReveal(nextBoard, row, col);
        setBoard(nextBoard);

        if (checkWinCondition(nextBoard)) {
            setGameState({ status: "won" });
            stopGameTimer();
            return;
        }
    };

    const handleToggleFlag = (row: number, col: number) => {
        if (gameState.status !== "playing") return;

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
    const handleResetGame = async () => {
        stopGameTimer();
        setGameState({ status: "playing" });
        onResetGame?.();
        hasFirstMoveBeenMade.current = false;
        await fetchBoardData();
    };

    return {
        board,
        handleToggleFlag,
        flagsPlaced,
        handleReveal,
        elapsedTime,
        gameState,
        handleResetGame,
        refetch: fetchBoardData,
    };
}
