import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/timeFormatter";
import { useNavigate, useParams } from "react-router-dom";

function Result() {
    const { subjectId } = useParams();
    const [score, setScore] = useState(0);
    const dialogRef = useRef();

    const [timeLeft, setTimeLeft] = useState(0);
    const [displaySubjects, setDisplaySubjects] = useState([]);

    const [selected, setSelected] = useState(() => {
        return localStorage.getItem("selectedSubjectId") || "";
    });
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!selected) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    localStorage.setItem(`remainingTime_${selected}`, 0);
                    return 0;
                }
                const updated = prev - 1;
                localStorage.setItem(`remainingTime_${selected}`, updated);
                return updated > 0 ? updated : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [selected]);

    useEffect(() => {
        const subject = localStorage.getItem("subjects");
        const parsed = JSON.parse(subject);
        setDisplaySubjects(parsed);
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
        // navigate(`/thank-you/${selected}`);
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
    };

    const handleSelected = (e) => {
        setSelected(e.target.value);
    }
    const hasResult = selected && localStorage.getItem(`test_${selected}`);

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
            <nav className="navbar-ques">
                <nav className="nav-center">
                    <p>Select Subject</p>
                </nav>
            </nav>

            <select value={selected} onChange={handleSelected} style={{ padding: "5px", fontSize: "14px" }}>
                <option value="">Select</option>
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
                <p>Marks: {score} / 8 </p>
                <p>Result: {score > 6 ? <span style={{ color: "green" }}>PASS</span> : <span style={{ color: "red" }}>FAIL</span>} </p>

                <button onClick={handleClose}>
                    Close
                </button>
            </dialog>
        </>
    )
}

export default Result;