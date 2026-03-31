import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/timeFormatter";
import { useNavigate, useParams } from "react-router-dom";
import { useSubjectName } from "../hooks/useSubjectName";
import { useTimer } from "../hooks/useTimer";

function Result() {
    const { subjectId } = useParams();
    const dialogRef = useRef();
    const navigate = useNavigate(); 
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [displaySubjects, setDisplaySubjects] = useState([]);
    const [selected, setSelected] = useState(() => {
        return localStorage.getItem("selectedSubjectId") || "";
    });
    const subName = useSubjectName(selected);

    useEffect(() => {
        if (selected) {
            localStorage.setItem("selectedSubjectId", selected);
        }
    }, [selected]);

    useEffect(() => {
        if (selected) {
            const saved = localStorage.getItem(`remainingTime_${selected}`);
            if (saved !== null) {
                setTimeLeft(Number(saved));
            }
        }
    }, [selected]);

    useTimer(selected, () => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                localStorage.setItem(`remainingTime_${selected}`, 0);
                return 0;
            }
            const updated = prev - 1;
            localStorage.setItem(`remainingTime_${selected}`, updated);
            return updated > 0 ? updated : 0;
        });
    })

    useEffect(() => {
        const subject = localStorage.getItem("subjects");
        setDisplaySubjects(subject ? JSON.parse(subject) : "");
    }, []);

    const handleResult = () => {
        if (!selected) {
            alert("Please select subject");
            return;
        }

        const result = localStorage.getItem(`test_${selected}`);

        if (!result) {
            alert("No result found for this subject");
            return;
        }
        const testId = localStorage.getItem(`test_${selected}`);
        const resArray = JSON.parse(testId);
        let totalScore = 0;

        resArray.forEach((t) => {
            const correctAnswer = t.correctAnswer;
            const selectedAnswer = t.selectedAnswer;

            if (correctAnswer === selectedAnswer) {
                totalScore += 1;
            }
        });

        setScore(totalScore);
    };

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

    const hasResult = selected && localStorage.getItem(`test_${selected}`);

    return (
        <>
            <nav className="navbar-ques">
                <nav className="nav-center">
                    <p>Select Subject</p>
                </nav>
            </nav>

            <select value={selected} onChange={(e) => setSelected(e.target.value)} style={{ padding: "5px", fontSize: "14px" }}>
                {displaySubjects.map((item, index) => (
                    <option key={index} value={item.id}>{item.subject}</option>
                ))}
            </select>  {" "}

            {timeLeft > 0 ? (
                <p>Result in: {formatTime(timeLeft)}</p>
            ) : hasResult ? (
                <button onClick={handleDialog}>View Result</button>
            ) : (
                <p>No result available</p>
            )}

            <br /> <br />
            <button onClick={() => navigate(-1)}>Back</button>

            <dialog ref={dialogRef} className="score-dialog">
                <p>Subject: {subName} </p>
                <p>Marks: {score} / 8 </p>
                <p>Result: {score > 6 ? <span style={{ color: "green" }}>PASS</span> : <span style={{ color: "red" }}>FAIL</span>} </p>
                <button onClick={handleClose}>Close</button>
            </dialog>
        </>
    )
}

export default Result;