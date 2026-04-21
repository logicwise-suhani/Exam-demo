import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";
import { useSubjectName } from "../hooks/useSubjectName";
import { useTimer } from "../hooks/useTimer";
import Buttons from "./layout/Buttons";
import Options from "./layout/Options";
import { useDispatch, useSelector } from "react-redux";
import { startAttempt, selectAnswer, nextQuestion, tickDialogTimer, tickTimer, startDialogTimer, submitExam } from "../features/exams/examSlice";

function ShowQuestions() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const dialogRef = useRef();
    const subName = useSubjectName();
    const [savedData, setSavedData] = useState([]);
    const userName = JSON.parse(localStorage.getItem("user"))?.email || [];
    const dispatch = useDispatch();
    const attempt = useSelector((state) => state.exam.attempts[subjectId]);
    const {
        questions = [],
        currentIndex = 0,
        answers = [],
        timeLeft = 0,
        dialogTimeLeft = 0,
        isRunning = false,
        isDialogRunning = false,
        submitted,
        error = null
    } = attempt || {};

    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);
        setSavedData(storedData ? JSON.parse(storedData) : []);
    }, [subjectId]);

    useEffect(() => {
        if (!attempt) return;

        const examState = {
            questions,
            currentIndex,
            timeLeft: timeLeft,
            answers,
            isRunning: isRunning
        };
        localStorage.setItem(`exam_state_${subjectId}`, JSON.stringify(examState));

    }, [questions, currentIndex, answers, attempt, subjectId, timeLeft, isRunning]);

    const generateQuestions = () => {
        if (savedData.length === 0) {
            alert("Questionnaire is empty!");
            return;
        }
        const shuffled = [...savedData].sort(() => 0.5 - Math.random());
        const randomEight = shuffled.slice(0, 8);

        dispatch(startAttempt({
            subjectId,
            questions: randomEight
        }));

        localStorage.setItem("randomEight", JSON.stringify(randomEight));
    };

    const getResult = useCallback(
        () => {
            return questions.map((q, index) => ({
                correctAnswer: q.correctAnswer,
                selectedAnswer: answers[index],
            }));
        }, [answers, questions])

    useTimer(isRunning, () => {
        dispatch(tickTimer({ subjectId }));
    })

    useTimer(isDialogRunning, () => {
        if (dialogTimeLeft <= 0) {
            dispatch(submitExam({ subjectId }));
            navigate(`/thank-you/${subjectId}`);
            return;
        }
        dispatch(tickDialogTimer({ subjectId }));
    })

    const submit = useCallback(() => {
        const result = getResult();

        localStorage.setItem(`test_${subjectId}`, JSON.stringify(result));
        localStorage.setItem(`submitted_${subjectId}`, "true");
        dialogRef.current?.showModal();

        const duration = 300;
        const endTime = Date.now() + duration * 1000;
        localStorage.setItem(`endTime_${subjectId}`, endTime);

        dispatch(startDialogTimer({ subjectId }));
    }, [getResult, subjectId, dispatch])

    useEffect(() => {
        if (!isRunning || timeLeft > 0) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
            submit();
            return;
        }

        dispatch(nextQuestion({ subjectId, force: true }));
    }, [timeLeft, isRunning, currentIndex, questions.length, subjectId, submit, dispatch]);

    useEffect(() => {
        if (submitted) {
            navigate("/selectSubject");
        }
    }, [navigate, submitted]);

    const handleSubmit = () => {
        if (submitted) return;
        if (!confirm("Are you sure want to Submit?")) return;
        submit();
    };

    const handleNext = () => {
        dispatch(nextQuestion({ subjectId }));
    };

    const handleDialogClose = () => {
        dispatch(submitExam({ subjectId }));

        localStorage.setItem("selectedSubjectId", subjectId);
        dialogRef.current.close();

        navigate("/result", {
            state: { remainingTime: dialogTimeLeft }
        });
    };

    return (
        <>
            <nav className="navbar-ques">

                <div className="nav-left"> {!attempt ? <button onClick={generateQuestions}>Start Exam</button>
                    : questions.length > 0 && <p >Time left is : <span style={{ color: timeLeft < 10 ? "red" : "" }}>{formatTime(timeLeft)}</span> </p>} {" "}
                </div>

                <div className="nav-center">
                    <h2>{subName} <br /> <span>{`Subject ID is : ${subjectId}`}</span> </h2>
                </div>

                <div className="nav-right">
                    {questions.length > 0 ? <button onClick={handleSubmit} disabled={submitted}>{localStorage.getItem(`submitted_${subjectId}`)
                        ? "Submitted" : "Submit"}</button>
                        : <p>Logged as: {userName} </p>}
                </div>
            </nav>

            {questions.length === 0 && (
                <h3 style={{ color: "yellow" }}>
                    {savedData.length === 0 ? "Questionnaire is empty!" : "Click Start to give Exam"}
                </h3>
            )}

            {questions.length > 0 && (
                <div className="display-ques">
                    <h4>{currentIndex + 1}. {questions[currentIndex].question}</h4>

                    <Options
                        options={questions[currentIndex].options}
                        selected={answers[currentIndex]}
                        onSelect={(i) => dispatch(selectAnswer({
                            subjectId,
                            index: currentIndex,
                            answer: i
                        }))}
                    />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </div>
            )} <br />

            <div className="show-next">
                {questions.length > 0 && <button onClick={handleNext} disabled={currentIndex === questions.length - 1}>Next</button>}
            </div>

            {questions.length > 0 ? "" : <Buttons onClick={() => navigate("/selectSubject")} />}

            <dialog ref={dialogRef} className="dialog-box">
                <h3>Thank you for giving exam!</h3>
                <p>Result in: {formatTime(dialogTimeLeft)}</p>
                <Buttons onClick={handleDialogClose} label="Close" />
            </dialog>
        </>
    )
}

export default ShowQuestions;
