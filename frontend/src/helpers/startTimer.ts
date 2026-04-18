export function startTimer(
    timerIdRef: React.RefObject<number | null>,
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>,
) {
    if (timerIdRef.current !== null) {
        return; // Timer is already running
    }
    timerIdRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
    }, 1000);
    return timerIdRef.current;
}
