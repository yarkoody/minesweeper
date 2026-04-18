import { Board } from "../Board/Board";

import { Hud } from "../Hud/Hud";
import type { HudMetricType } from "../../types/HudMetricType";
import { formatTime } from "../../helpers/formatTime";
import styles from "./Game.module.css";

import { Clock, Flag } from "lucide-react";
import { Modal } from "../Modal/Modal";

import { Leaderboard } from "../Leaderboard/Leaderboard";
import { useBoard } from "../../hooks/useBoard";
import { useFetchLeaderboard } from "../../hooks/useFetchLeaderboard";
import { useGameTimer } from "../../hooks/useGameTimer";
import { useSubmitScore } from "../../hooks/useSubmitScore";

export function Game() {
    const { elapsedTime } = useGameTimer();
    const { leaderboard } = useFetchLeaderboard();

    const { playerName, handlePlayerNameChange, handleSubmitScore, resetSubmissionStatus } =
        useSubmitScore(elapsedTime);

    const {
        board,
        handleReveal,
        handleResetGame,
        handleToggleFlag,
        gameState,
        flagsPlaced,
    } = useBoard(resetSubmissionStatus);

    const hudMetrics: HudMetricType[] = [
        { id: "flags", icon: <Flag />, value: flagsPlaced },
        { id: "time", icon: <Clock />, value: formatTime(elapsedTime) },
    ];

    const isWin = gameState.status === "won";
    const isGameOver = gameState.status !== "playing";
    return (
        <div className={styles.gameShell}>
            <div className={styles.gameHeader}>
                <h1 className={styles.gameTitle}>MineSweeper</h1>
                <p className={styles.gameStatus}>
                    {gameState.status === "won"
                        ? "You win!"
                        : gameState.status === "lost"
                          ? "Game Over"
                          : ""}
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
            <Modal
                playerName={playerName}
                winOrLose={isWin}
                isOpen={isWin || isGameOver}
                onNameChange={handlePlayerNameChange}
                onSubmitScore={handleSubmitScore}
                onRestart={() => {
                    void handleResetGame();
                }}
            />
            <Leaderboard leaderboard={leaderboard} />
        </div>
    );
}
