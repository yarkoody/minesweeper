import axios from "axios";

import { useCallback, useState } from "react";

type LeaderBoardEntry = Record<string, unknown>;

export function useSubmitScore(
    elapsedTime: number = 0,
    onScoreSubmitted?: () => void,
) {
    const [hasSubmittedScore, setHasSubmittedScore] = useState<boolean>(false);
    const [playerName, setPlayerName] = useState<string>("");
    const registerScore = useCallback(async (entry: LeaderBoardEntry) => {
        try {
            const response = await axios.post(
                "http://localhost:5034/game/leaderboard",
                entry,
            );
            if (!response?.data) {
                throw new Error("Failed to register score");
            }
            console.log("Score registered successfully:", response.data);
            setHasSubmittedScore(true);
        } catch (error) {
            console.error("Error registering score:", error);
        }
    }, []);

    const resetSubmissionStatus = useCallback(() => {
        setHasSubmittedScore(false);
    }, []);

    const handleSubmitScore = async () => {
        if (playerName.trim() === "") return;
        const entry: LeaderBoardEntry = {
            playerName,
            timeInSeconds: elapsedTime,
        };
        await registerScore(entry);
        // refetch();
        setHasSubmittedScore(true);
        onScoreSubmitted?.();
    };

    const handlePlayerNameChange = (name: string) => {
        setPlayerName(name);
    };

    return {
        registerScore,
        hasSubmittedScore,
        resetSubmissionStatus,
        handlePlayerNameChange,
        handleSubmitScore,
        playerName,
    };
}
