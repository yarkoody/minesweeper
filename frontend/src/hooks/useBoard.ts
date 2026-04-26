import { useEffect, useMemo, useReducer, useRef } from "react";
import type { TileType } from "../types/TileType";
import {
    mapMineCordsToBoard,
    type BoardLayout,
} from "../helpers/mapMineCordsToBoard";
// import axios from "axios";

import { checkWinCondition } from "../helpers/checkWinCondition";
import { useGameTimer } from "./useGameTimer";
import { floodReveal } from "../helpers/floodReveal";
import type { GameStatus } from "../types/GameStatus";
import { fetchData } from "../helpers/dataFetcher";
import { API_URL } from "../constants/urls";
import { useQuery } from "@tanstack/react-query";
type State = {
    board: TileType[][];
    status: GameStatus["status"];
};

type Action =
    | { type: "init"; board: TileType[][] }
    | { type: "reveal"; row: number; col: number }
    | { type: "toggleFlag"; row: number; col: number };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "init":
            return { ...state, board: action.board, status: "playing" };
        case "toggleFlag": {
            if (state.status !== "playing") return state;

            const next = state.board.map((r, ri) =>
                r.map((tile, ci) =>
                    ri === action.row && ci === action.col
                        ? { ...tile, isFlagged: !tile.isFlagged }
                        : tile,
                ),
            );
            return { ...state, board: next };
        }

        // reducer case
        case "reveal": {
            if (state.status !== "playing") return state;
            if (!state.board.length) return state;

            const clickedTile = state.board[action.row]?.[action.col];
            if (!clickedTile) return state;
            if (clickedTile.isFlagged || clickedTile.isRevealed) return state;

            const nextBoard = state.board.map((rowArr) =>
                rowArr.map((tile) => ({ ...tile })),
            );

            const clicked = nextBoard[action.row][action.col];

            if (clicked.isMine) {
                clicked.isRevealed = true;
                return {
                    ...state,
                    board: nextBoard,
                    status: "lost",
                };
            }

            floodReveal(nextBoard, action.row, action.col);

            return {
                ...state,
                board: nextBoard,
                status: checkWinCondition(nextBoard) ? "won" : "playing",
            };
        }
        default:
            return state;
    }
}

export function useBoard() {
    const { elapsedTime, startGameTimer, stopGameTimer } = useGameTimer();
    const hasFirstMoveBeenMade = useRef(false);

    const seedQuery = useQuery<BoardLayout>({
        queryKey: ["board-seed"],
        queryFn: () => fetchData<BoardLayout>(API_URL, "game/start", "post"),
    });

    // Seed board is derived from query data only
    const seedBoard = useMemo(() => {
        if (!seedQuery.data) return [] as TileType[][];
        return mapMineCordsToBoard(seedQuery.data);
    }, [seedQuery.data]);

    const [state, dispatch] = useReducer(reducer, {
        board: [],
        status: "playing",
    });

    // Active board:
    // 1) use reducer state after INIT
    // 2) fallback to seedBoard before INIT
    const board = state.board.length ? state.board : seedBoard;
    const mineCount = seedQuery.data?.minePositions.length ?? 0;
    const flagsPlaced = board.flat().filter((tile) => tile.isFlagged).length;
    const flagsRemaining = mineCount - flagsPlaced;

    useEffect(() => {
        if (state.status === "won" || state.status === "lost") {
            stopGameTimer();
        }
    }, [state.status, stopGameTimer]);

    // Explicit init call, no effect-based syncing
    const initFromSeed = () => {
        if (!seedBoard.length) return;
        dispatch({ type: "init", board: seedBoard });
    };

    const reveal = (row: number, col: number) => {
        if (state.status !== "playing") return;

        const clickedTile = board[row]?.[col];
        if (!clickedTile || clickedTile.isFlagged || clickedTile.isRevealed) {
            return;
        }

        if (!hasFirstMoveBeenMade.current) {
            startGameTimer();
            hasFirstMoveBeenMade.current = true;
        }

        if (!state.board.length && seedBoard.length) {
            dispatch({ type: "init", board: seedBoard });
        }

        dispatch({ type: "reveal", row, col });
    };

    const toggleFlag = (row: number, col: number) =>
        dispatch({ type: "toggleFlag", row, col });

    const reset = async () => {
        stopGameTimer();
        hasFirstMoveBeenMade.current = false;
        const result = await seedQuery.refetch();
        if (!result.data) return;
        const mapped = mapMineCordsToBoard(result.data);
        dispatch({ type: "init", board: mapped });
    };

    return {
        board,
        gameStatus: state.status,
        initFromSeed,
        reveal,
        toggleFlag,
        flagsPlaced,
        flagsRemaining,
        elapsedTime,
        reset,
        isLoading: seedQuery.isLoading,
        error: seedQuery.error,
    };
}

// export function useBoard(onResetGame?: () => void) {
//     const [board, setBoard] = useState<TileType[][]>([] as TileType[][]);
//     const [gameState, setGameState] = useState<GameStatus>({
//         status: "playing",
//     });
//     const { elapsedTime, startGameTimer, stopGameTimer } = useGameTimer();
//     const hasFirstMoveBeenMade = useRef<boolean>(false);
//     const flagsPlaced = board.reduce(
//         (acc, row) =>
//             acc +
//             row.filter((tile) => tile.isMine).length -
//             row.filter((tile) => tile.isFlagged).length,
//         0,
//     );

//     const boardSeedQuery = useQuery<BoardLayout>({
//         queryKey: ["board"],
//         queryFn: () => fetchData(API_URL, "game/start"),
//     });

//     const seedBoard = useMemo(() => {
//         const seed = boardSeedQuery.data;
//         if (!seed) return [] as TileType[][];

//         return mapMineCordsToBoard({
//             rows: seed.rows,
//             cols: seed.cols,
//             minePositions: seed.minePositions,
//         });
//     }, [boardSeedQuery.data]);

// const fetchBoardData = useCallback(async () => {
//     try {
//         const response = await axios.post(
//             "http://localhost:5034/game/start",
//         );

//         if (!response?.data) {
//             throw new Error("Failed to fetch board data");
//         }
//         console.log("Fetched board data:", response.data);
//         // debugger;

//         return setBoard(
//             mapMineCordsToBoard({
//                 rows: response.data.rows,
//                 cols: response.data.cols,
//                 minePositions: response.data.minePositions,
//             }),
//         );
//     } catch (error) {
//         console.error("Error fetching board data:", error);
//         throw error;
//     }
// }, []);

// useEffect(() => {
//     fetchBoardData();
// }, [fetchBoardData]);

//     const handleReveal = (row: number, col: number) => {
//         if (gameState.status !== "playing") return;

//         const clickedTile = board[row][col];
//         if (clickedTile.isFlagged || clickedTile.isRevealed) return;

//         startGameTimer();

//         const nextBoard = board.map((rowArr) =>
//             rowArr.map((tile) => ({ ...tile })),
//         );
//         const clicked = nextBoard[row][col];
//         if (clicked.isMine) {
//             clicked.isRevealed = true;
//             setBoard(nextBoard);
//             setGameState({ status: "lost" });
//             stopGameTimer();
//             return;
//         }

//         floodReveal(nextBoard, row, col);
//         setBoard(nextBoard);

//         if (checkWinCondition(nextBoard)) {
//             setGameState({ status: "won" });
//             stopGameTimer();
//             return;
//         }
//     };

//     const handleToggleFlag = (row: number, col: number) => {
//         if (gameState.status !== "playing") return;

//         setBoard((prevBoard) => {
//             const nextBoard = prevBoard.map((rowArr, rowIndex) => {
//                 if (rowIndex !== row) return rowArr;
//                 return rowArr.map((tile, tileIndex) => {
//                     if (tileIndex !== col) return tile;
//                     return { ...tile, isFlagged: !tile.isFlagged };
//                 });
//             });
//             return nextBoard;
//         });
//     };

//     const handleResetGame = async () => {
//         stopGameTimer();
//         setGameState({ status: "playing" });
//         onResetGame?.();
//         hasFirstMoveBeenMade.current = false;
//         await query.refetch();
//     };

//     return {
//         board,
//         handleToggleFlag,
//         flagsPlaced,
//         handleReveal,
//         elapsedTime,
//         gameState,
//         handleResetGame,
//         refetch: query.refetch,
//     };
// }
