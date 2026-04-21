import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime } from "../utils/timeFormatter";
import { useNavigate, useParams } from "react-router-dom";
import { useSubjectName } from "../hooks/useSubjectName";
import Buttons from "./layout/Buttons";
import { useTimer } from "../hooks/useTimer";
 
function Result() {
    const { subjectId } = useParams();
    const dialogRef = useRef(null);
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [selected, setSelected] = useState(() => {
        return subjectId || localStorage.getItem("selectedSubjectId") || "";
    });
    const subName = useSubjectName(selected);
    const [testData, setTestData] = useState(null);

    useEffect(() => {
        if (!selected) return;

        const data = localStorage.getItem(`test_${selected}`);
        try {
            setTestData(data ? JSON.parse(data) : null);
        } catch {
            setTestData(null);
        }
    }, [selected]);

    useEffect(() => {
        if (selected) {
            localStorage.setItem("selectedSubjectId", selected);
        }
    }, [selected]);

    useEffect(() => {
        if (!selected) return;

        const end = localStorage.getItem(`endTime_${selected}`);
        if (!end) {
            setTimeLeft(0);
            return;
        }

        const remaining = Math.max(0, Math.floor((Number(end) - Date.now()) / 1000));
        setTimeLeft(remaining);
    }, [selected]);

    useTimer(selected, () => {
        const end = localStorage.getItem(`endTime_${selected}`);
        if (!end) {
            setTimeLeft(0);
            return;
        }

        const remaining = Math.max(0, Math.floor((Number(end) - Date.now()) / 1000));
        setTimeLeft((prev) => (prev !== remaining ? remaining : prev));
    });

    const handleResult = () => {
        if (!selected) {
            alert("Please select subject");
            return;
        }

        if (!testData) {
            alert("No result found for this subject");
            return;
        }

        let totalScore = 0;
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].correctAnswer === testData[i].selectedAnswer) {
                totalScore++;
            }
        }
        setScore(totalScore);
    };

    const handleDialog = () => {
        handleResult();
        dialogRef.current?.showModal();
    };

    const handleClose = () => {
        if (selected) {
            localStorage.setItem(`result_${selected}`, score);
        }
        dialogRef.current?.close();
    };
    const hasResult = !!testData;

    const subjects = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("subjects")) || [];
        } catch {
            return [];
        }
    }, []);


    return (
        <>
            <nav className="navbar-ques">
                <div className="nav-center">
                    <p>Select Subject</p>
                </div>
            </nav>

            <div className="drop-down">
                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}>
                    {subjects.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.subject}
                        </option>
                    ))}
                </select>{" "}

                {timeLeft > 0 ? (
                    <p>Result in: {formatTime(timeLeft)}</p>
                ) : hasResult ? (
                    <button onClick={handleDialog}>View Result</button>
                ) : (
                    <p>No result available</p>
                )}
            </div>

            <br />
            <Buttons onClick={() => navigate(-1)} />{" "}

            <dialog ref={dialogRef} className="score-dialog">
                <p>Subject: {subName}</p>
                <p>Marks: {score} / 8</p>
                <p>Result:{" "}
                    {score >= 6 ? (
                        <span style={{ color: "green" }}>PASS</span>
                    ) : (
                        <span style={{ color: "red" }}>FAIL</span>
                    )}
                </p>
                <Buttons onClick={handleClose} label="Close" />
            </dialog>
        </>
    );
}

export default Result;