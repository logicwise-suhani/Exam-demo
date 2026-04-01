import { useEffect } from "react";

export function useTimer(isActive, callback) {

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(callback, 1000);

        return () => clearInterval(interval);
    }, [isActive, callback]);
}
  