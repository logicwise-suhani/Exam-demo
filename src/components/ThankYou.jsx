import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatTime } from "../utils/timeFormatter";

function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();
    const { subjectId } = useParams();
    const [score, setScore] = useState(0);

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

    useEffect(() => {
        const savedExam = localStorage.getItem(`exam_state_${subjectId}`);
        const remainingTime = localStorage.getItem("remainingTime");

        if (savedExam) {
            setTimeLeft(remainingTime > 0 ? remainingTime : 0);
        }

    }, [subjectId]);

    const handleLogOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("remainingTime");
        navigate("/login");
    };

    const handleResult = () => {
        const testId = localStorage.getItem(`test_${subjectId}`);
        const resArray = JSON.parse(testId);
        console.log(resArray);

        resArray.forEach((t, index) => {
            console.log(index)
            const correctAnswer = t.correctAnswer;
            const selectedAnswer = t.selectedAnswer;

            if (correctAnswer === selectedAnswer) {
                console.log("Correct");
                // setScore(prev => prev + 1);

            }
            else {
                console.log("Incorrect");
                // setScore(0);
            }
        })

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
                    <br />
                    <p>{`Score: ${score}`}</p>

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