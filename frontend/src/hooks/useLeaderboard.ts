// import { useCallback, useEffect, useState } from "react";
import type { LeaderBoardEntry } from "../types/LeaderBoardEntry";

import { fetchData } from "../helpers/dataFetcher";
import { API_URL } from "../constants/urls";
import { useQuery } from "@tanstack/react-query";

export function useLeaderboard() {
    const query = useQuery<LeaderBoardEntry[]>({
        queryKey: ["leaderboard"],
        queryFn: () => fetchData(API_URL, "game/leaderboard"),
    });

    return {
        leaderboard: query.data ?? [],
        refetch: query.refetch,
        // setLeaderboard: query.setData,
    };

    // const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>(
    //     [] as Array<LeaderBoardEntry>,
    // );
    // const fetchLeaderBoard = useCallback(async () => {
    //     try {
    //         const resp = await axios.get(
    //             "http://localhost:5034/game/leaderboard",
    //         );
    //         if (!resp?.data) {
    //             throw new Error("Failed to fetch leaderboard data");
    //         }
    //         console.log("Fetched leaderboard data:", resp.data);

    //         setLeaderboard(resp.data);
    //     } catch (error) {
    //         console.error(`failed to fetch leaderboard: ${error}`);
    //     }
    // }, []);

    // const fetchLeaderBoard = useCallback(async () => {
    //     const resp = await fetchData<LeaderBoardEntry[]>(
    //         API_URL,
    //         "game/leaderboard",
    //     );
    //     const data = resp.data;
    //     setLeaderboard(data);
    // }, []);

    // useEffect(() => {
    //     fetchLeaderBoard();
    // }, [fetchLeaderBoard]);

    // return { leaderboard, setLeaderboard, refetch: fetchLeaderBoard };
}
