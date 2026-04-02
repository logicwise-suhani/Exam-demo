import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";
import { useSubjectName } from "../hooks/useSubjectName";
import { useTimer } from "../hooks/useTimer";
import Buttons from "./Reusable components/Buttons";
import useQuestion from "../hooks/useQuestion";
import Options from "./Reusable components/Options";

function ShowQuestions() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const dialogRef = useRef();
    const subName = useSubjectName();
    const { currentIndex, answers, error, selectAnswer, next } = useQuestion();
    const [savedData, setSavedData] = useState([]);
    const [displayQuestions, setDisplayQuestions] = useState([]);
    const [show, setShow] = useState(false);
    const [timer, setTimer] = useState({
        timeLeft: 0,
        isRunning: false,
        dialogTimeLeft: 0,
        isDialogRunning: false
    })
    const userName = JSON.parse(localStorage.getItem("user"))?.email || [];
    const isSubmitted = localStorage.getItem(`submitted_${subjectId}`) === "true";

    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);
        setSavedData(storedData ? JSON.parse(storedData) : []);
    }, [subjectId]);

    useEffect(() => {
        if (!show) return;

        const examState = {
            displayQuestions,
            currentIndex,
            timeLeft: timer.timeLeft,
            answers,
            isRunning: timer.isRunning
        };
        localStorage.setItem(`exam_state_${subjectId}`, JSON.stringify(examState));

    }, [displayQuestions, currentIndex, answers, show, subjectId, timer.timeLeft, timer.isRunning]);

    const generateQuestions = () => {
        if (savedData.length === 0) {
            alert("Questionnaire is empty!");
            return;
        }
        const shuffled = [...savedData].sort(() => 0.5 - Math.random());

        const randomEight = shuffled.slice(0, 8);
        setDisplayQuestions(randomEight);

        setTimer(prev => ({
            ...prev,
            isRunning: true,
            timeLeft: randomEight[0].timeTaken
        }));
        setShow(true);

        localStorage.setItem("randomEight", JSON.stringify(randomEight));
    };

    const getResult = useCallback(
        () => {
            return displayQuestions.map((q, index) => ({
                correctAnswer: q.correctAnswer,
                selectedAnswer: answers[index],
            }));
        }, [answers, displayQuestions])

    useTimer(timer.isRunning, () => {
        setTimer(prev => ({
            ...prev,
            timeLeft: prev.timeLeft - 1
        }));
    })
    useTimer(timer.isDialogRunning, () => {
        if (timer.dialogTimeLeft <= 0) {
            setTimer(prev => ({
                ...prev,
                isDialogRunning: false
            }));
            navigate(`/thank-you/${subjectId}`);
            return;
        }
        setTimer(prev => ({
            ...prev,
            dialogTimeLeft: prev.dialogTimeLeft - 1
        }));
    })

    const submit = useCallback(() => {
        const result = getResult();

        localStorage.setItem(`test_${subjectId}`, JSON.stringify(result));
        localStorage.setItem(`submitted_${subjectId}`, "true");
        dialogRef.current?.showModal();

        setTimer(prev => ({
            ...prev,
            dialogTimeLeft: 300,
            isDialogRunning: true,
            isRunning: false
        }));
    }, [getResult, subjectId])

    useEffect(() => {
        if (!timer.isRunning || timer.timeLeft > 0) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex >= displayQuestions.length) {
            submit();
            return;
        }

        next(displayQuestions, true);
        setTimer(prev => ({
            ...prev,
            timeLeft: displayQuestions[nextIndex].timeTaken
        }));
    }, [timer.timeLeft, timer.isRunning, currentIndex, displayQuestions, submit, next]);

    useEffect(() => {
        if (isSubmitted) {
            navigate("/selectSubject");
        }
    }, [navigate, isSubmitted]);

    const handleSubmit = () => {
        if (isSubmitted) return;
        if (!confirm("Are you sure want to Submit?")) return;
        submit();
    };

    const handleNext = () => {
        const moved = next(displayQuestions);
        if (moved) {
            const nextIndex = currentIndex + 1;
            setTimer(prev => ({
                ...prev,
                timeLeft: displayQuestions[nextIndex].timeTaken
            }));
        }
    };

    const handleDialogClose = () => {
        setTimer(prev => ({
            ...prev,
            isDialogRunning: false
        }));
        const duration = 300;
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem(`endTime_${subjectId}`, endTime);

        localStorage.setItem("selectedSubjectId", subjectId);
        dialogRef.current.close();

        navigate(`/thank-you/${subjectId}`, {
            state: { remainingTime: timer.dialogTimeLeft }
        });
    };

    return (
        <>
            <nav className="navbar-ques">

                <div className="nav-left"> {!show ? <button onClick={generateQuestions}>Start Exam</button>
                    : displayQuestions.length > 0 && <p >Time left is : <span style={{ color: timer.timeLeft < 10 ? "red" : "" }}>{formatTime(timer.timeLeft)}</span> </p>} {" "}
                </div>

                <div className="nav-center">
                    <h2>{subName} <br /> <span style={{ fontSize: "20px" }}>{`Subject ID is : ${subjectId}`}</span> </h2>
                </div>

                <div className="nav-right">
                    {displayQuestions.length > 0 ? <button onClick={handleSubmit} disabled={isSubmitted}>{localStorage.getItem(`submitted_${subjectId}`)
                        ? "Submitted" : "Submit"}</button>
                        : <p>Logged as: {userName} </p>}
                </div>
            </nav>

            {displayQuestions.length === 0 && (
                <h3 style={{ color: "yellow" }}>
                    {savedData.length === 0 ? "Questionnaire is empty!" : "Click Start to give Exam"}
                </h3>
            )}

            {displayQuestions.length > 0 && (
                <div className="display-ques">
                    <h4>{currentIndex + 1}. {displayQuestions[currentIndex].question}</h4>

                    <Options
                        options={displayQuestions[currentIndex].options}
                        selected={answers[currentIndex]}
                        onSelect={(i) => selectAnswer(currentIndex, i)}
                    />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </div>
            )} <br />

            <div className="show-next">
                {displayQuestions.length > 0 && <button onClick={handleNext} disabled={currentIndex === displayQuestions.length - 1}>Next</button>}
            </div>

            {displayQuestions.length > 0 ? "" : <Buttons onClick={() => navigate("/selectSubject")} />}

            <dialog ref={dialogRef} className="dialog-box">
                <p>Result in: {formatTime(timer.dialogTimeLeft)}</p>
                <Buttons onClick={handleDialogClose} label="Close" />
            </dialog>
        </>
    )
}

export default ShowQuestions;