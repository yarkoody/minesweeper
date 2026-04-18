export function stopTimer(timerIdRef: React.RefObject<number | null>) {
    if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
    }
}
