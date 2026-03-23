import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/timeFormatter";

function ThankYou() {
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const dialogRef = useRef();
    const [score, setScore] = useState(0);

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem("remainingTime");
        return saved ? Number(saved) : 0;
    });

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const updated = prev - 1;
                localStorage.setItem("remainingTime", updated)
                return updated > 0 ? updated : 0;
            });
        }, 1000);

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
        let totalScore = 0;

        resArray.forEach((t) => {
            const correctAnswer = t.correctAnswer;
            const selectedAnswer = t.selectedAnswer;

            if (correctAnswer === selectedAnswer) {
                totalScore += 1;
            }
        });

        setScore(totalScore)
    }

    const handleDialog = () => {
        handleResult();
        dialogRef.current.showModal();
    }

    const handleClose = () => {
        const data = localStorage.getItem(`test_${subjectId}`);

        if (data) {
            localStorage.setItem(`result_${subjectId}`, score)
        }
        dialogRef.current.close();
    };

    return (
        <>
            <h3>Thank you for Giving exam!</h3>
            <br />

            {timeLeft > 0 ? (
                <p>Result in: {formatTime(timeLeft)}</p>
            ) : (
                <>
                    <p onClick={handleDialog} style={{ color: "red", cursor: "pointer" }}>Click to show result</p>
                </>
            )}

            <br />

            <button onClick={() => navigate("/selectSubject")}>
                Give another Test
            </button>{" "}
            <button onClick={handleLogOut}>LogOut</button>

            <dialog ref={dialogRef} className="score-dialog">
                <p>Marks: {score} / 8 </p>
                <p>Result: {score > 6 ? <span style={{ color: "green" }}>PASS</span> : <span style={{ color: "red" }}>FAIL</span>} </p>

                <button onClick={handleClose}>
                    Close
                </button>
            </dialog>
        </>
    );
}

export default ThankYou;


















// const handleResult = () => {
//     const testId = localStorage.getItem(`test_${subjectId}`);
//     const resArray = JSON.parse(testId);

//     const totalScore = resArray.reduce((acc, t) => {
//         return acc + (t.correctAnswer === t.selectedAnswer ? 1 : 0);
//     }, 0);

//     setScore(totalScore);
// };