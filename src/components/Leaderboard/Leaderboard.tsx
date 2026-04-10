import { Trophy } from "lucide-react";
import type { LeaderBoardEntry } from "../../types/LeaderBoardEntry";
import styles from "./Leaderboard.module.css";

interface LeaderboardProps {
    leaderboard: LeaderBoardEntry[];
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
    return (
        <section className={styles.leaderboard} aria-label="Leaderboard">
            <header className={styles.header}>
                <Trophy size={18} className={styles.icon} />
                <h3 className={styles.title}>Top 10 Players</h3>
            </header>

            {leaderboard.length === 0 ? (
                <p className={styles.emptyState}>
                    No scores yet. Be the first to set one.
                </p>
            ) : (
                <ol className={styles.list}>
                    {leaderboard.map((entry, index) => (
                        <li
                            key={entry.playerName + entry.timeInSeconds + index}
                            className={styles.row}
                        >
                            <span className={styles.rank}>{index + 1}</span>
                            <span className={styles.name}>
                                {entry.playerName}
                            </span>
                            <span className={styles.time}>
                                {entry.timeInSeconds}s
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
