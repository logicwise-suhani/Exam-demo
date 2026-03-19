import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatTime } from "../utils/timeFormatter";

function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();

    const [timeLeft, setTimeLeft] = useState(
        location.state?.remainingTime || 0
    );

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const updated = prev - 1;
                localStorage.setItem("remainingTime", updated)
                return updated;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleLogOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("remainingTime");
        navigate("/login");
    };

    const handleResult = (id) => {
        const testId = localStorage.getItem(`test_${id}`)
        console.log(testId);
    }

    return (
        <>
            <h3>Thank you for Giving exam!</h3>
            <br />

            {timeLeft > 0 ? (
                <p>Result in: {formatTime(timeLeft)}</p>
            ) : (
                <>
                    <p onClick={handleResult} style={{ color: "red", cursor: "pointer" }}>Showing result...</p>
                </>
            )}

            <br />

            <button onClick={() => navigate("/selectSubject")}>
                Give another Test
            </button>{" "}
            <button onClick={handleLogOut}>LogOut</button>
        </>
    );
}

export default ThankYou;