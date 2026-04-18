import { useCallback, useEffect, useState } from "react";
import type { LeaderBoardEntry } from "../types/LeaderBoardEntry";
import axios from "axios";

export function useFetchLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>(
        [] as Array<LeaderBoardEntry>,
    );

    const fetchLeaderBoard = useCallback(async () => {
        try {
            const resp = await axios.get(
                "http://localhost:5034/game/leaderboard",
            );
            if (!resp?.data) {
                throw new Error("Failed to fetch leaderboard data");
            }
            console.log("Fetched leaderboard data:", resp.data);

            setLeaderboard(resp.data);
        } catch (error) {
            console.error(`failed to fetch leaderboard: ${error}`);
        }
    }, []);

    useEffect(() => {
        fetchLeaderBoard();
    }, [fetchLeaderBoard]);

    return { leaderboard, setLeaderboard, refetch: fetchLeaderBoard };
}
