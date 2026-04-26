import { Board } from "../Board/Board";

import { Hud } from "../Hud/Hud";
import type { HudMetricType } from "../../types/HudMetricType";
import { formatTime } from "../../helpers/formatTime";
import styles from "./Game.module.css";

import { Clock, Flag } from "lucide-react";
import { Modal } from "../Modal/Modal";

import { Leaderboard } from "../Leaderboard/Leaderboard";
import { useBoard } from "../../hooks/useBoard";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useSubmitScore } from "../../hooks/useSubmitScore";

export function Game() {
    const { leaderboard } = useLeaderboard();

    const {
        board,
        reveal,
        reset,
        toggleFlag,
        gameStatus,
        flagsPlaced,
        elapsedTime,
    } = useBoard();

    const {
        playerName,
        handlePlayerNameChange,
        handleSubmitScore,
        resetSubmissionStatus,
    } = useSubmitScore(elapsedTime);

    const hudMetrics: HudMetricType[] = [
        { id: "flags", icon: <Flag />, value: flagsPlaced },
        { id: "time", icon: <Clock />, value: formatTime(elapsedTime) },
    ];

    const isWin = gameStatus === "won";
    const isGameOver = gameStatus !== "playing";
    return (
        <div className={styles.gameShell}>
            <div className={styles.gameHeader}>
                <h1 className={styles.gameTitle}>MineSweeper</h1>
                <p className={styles.gameStatus}>
                    {gameStatus === "won"
                        ? "You win!"
                        : gameStatus === "lost"
                          ? "Game Over"
                          : ""}
                </p>
            </div>
            <Hud metrics={hudMetrics} />
            <Board
                tiles={board}
                handleReveal={reveal}
                handleToggleFlag={toggleFlag}
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
                    resetSubmissionStatus();
                    void reset();
                }}
            />
            <Leaderboard leaderboard={leaderboard} />
        </div>
    );
}
