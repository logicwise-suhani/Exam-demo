import { useEffect } from "react";
import { formatTime } from "../../utils/timeFormatter";

function Timer({ timeLeft, isRunning, onTick, danger = 10 }) {

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            onTick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, onTick]);

    return (
        <p>
            Time left is :{" "}
            <span style={{ color: timeLeft < danger ? "red" : "" }}>
                {formatTime(timeLeft)}
            </span>
        </p>
    );
}

export default Timer;