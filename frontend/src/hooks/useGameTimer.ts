import { useRef, useState } from "react";
import { startTimer } from "../helpers/startTimer";

export function useGameTimer() {
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerIdRef = useRef<number | null>(null);

    const startGameTimer = () => {
        startTimer(timerIdRef, setElapsedTime);
    };

    const stopGameTimer = () => {
        if (timerIdRef.current !== null) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
            setElapsedTime(0);
        }
    };

    return { elapsedTime, startGameTimer, stopGameTimer };
}
