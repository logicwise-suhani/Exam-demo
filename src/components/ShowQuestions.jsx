import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";

function ShowQuestions() {
    const { subjectId } = useParams();

    const [savedData, setSavedData] = useState([]);
    const [displayQuestions, setDisplayQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [show, setShow] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [subjectName, setSubjectName] = useState("");
    const [userName, setUserName] = useState("");
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [dialogTimeLeft, setDialogTimeLeft] = useState(0);
    const [isDialogRunning, setIsDialogRunning] = useState(false);
    const navigate = useNavigate();
    const dialogRef = useRef();

    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);

        if (storedData) {
            setSavedData(JSON.parse(storedData));
        }

    }, [subjectId]);

    useEffect(() => {
        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

        const foundSubject = subjects.find(
            (sub) => String(sub.id) === String(subjectId)
        );

        if (foundSubject) {
            setSubjectName(foundSubject.subject);
        }
    }, [subjectId]);

    useEffect(() => {
        const name = JSON.parse(localStorage.getItem("user")) || [];

        if (name) {
            setUserName(name.email)
        }
    }, []);

    useEffect(() => {
        if (!show) return;

        const examState = {
            displayQuestions,
            currentIndex,
            timeLeft,
            answers,
            isRunning
        };

        localStorage.setItem(`exam_state_${subjectId}`, JSON.stringify(examState));

    }, [displayQuestions, currentIndex, timeLeft, answers, isRunning, show, subjectId]);

    const generateQuestions = () => {
        if (savedData.length === 0) {
            alert("Questionnaire is empty!");
            return;
        }
        const shuffled = [...savedData].sort(() => 0.5 - Math.random());

        const randomEight = shuffled.slice(0, 8);

        setDisplayQuestions(randomEight);
        setCurrentIndex(0);

        setTimeLeft(randomEight[0].timeTaken);
        setIsRunning(true);
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

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            const nextIndex = currentIndex + 1;

            if (nextIndex >= displayQuestions.length) {
                setIsRunning(false);

                const result = getResult();
                localStorage.setItem(`test_${subjectId}`, JSON.stringify(result));
                localStorage.setItem(`submitted_${subjectId}`, "true");

                setIsSubmitted(true);

                dialogRef.current?.showModal();
                setDialogTimeLeft(300);
                setIsDialogRunning(true);
                return;
            }

            setCurrentIndex(nextIndex);
            setTimeLeft(displayQuestions[nextIndex].timeTaken);
        }
    }, [timeLeft, isRunning, currentIndex, displayQuestions, getResult, subjectId]);

    useEffect(() => {
        if (!isDialogRunning) return;

        if (dialogTimeLeft <= 0) {
            setIsDialogRunning(false);
            navigate(`/thank-you/${subjectId}`);
            return;
        }

        const interval = setInterval(() => {
            setDialogTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isDialogRunning, dialogTimeLeft, navigate, subjectId]);

    useEffect(() => {
        const submitted = localStorage.getItem(`submitted_${subjectId}`);
        if (submitted === "true") {
            setIsSubmitted(true);
        }
    }, [subjectId]);

    useEffect(() => {
        const submitted = localStorage.getItem(`submitted_${subjectId}`);
        if (submitted === "true") {
            navigate("/selectSubject");
        }
    }, [subjectId, navigate]);

    // const notValid = Object.keys(answers).length !== displayQuestions.length;

    const handleSubmit = () => {
        // if (notValid) {
        //     alert("Please answer all questions before submitting!");
        //     return;
        // }
        if (isSubmitted) return;

        const confirmSubmit = confirm("Are you sure want to Submit?");
        if (!confirmSubmit) return;

        const result = getResult();

        localStorage.setItem(`test_${subjectId}`, JSON.stringify(result));
        console.log("Submitted!", result);

        setIsSubmitted(true);
        localStorage.setItem(`submitted_${subjectId}`, "true");
        setIsRunning(false);
        if (dialogRef.current) {
            dialogRef.current.showModal();
            setDialogTimeLeft(300);
            setIsDialogRunning(true);
        }
    };

    const handleNext = () => {
        if (answers[currentIndex] === undefined) {
            setError("Please choose an option");
            return;
        }

        setError("");

        if (currentIndex < displayQuestions.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setTimeLeft(displayQuestions[nextIndex].timeTaken);
        }
    };

    const handleDialogClose = () => {
        setIsDialogRunning(false);

        const finalTime = dialogTimeLeft > 0 ? dialogTimeLeft : 0;
        localStorage.setItem(`remainingTime_${subjectId}`, finalTime);
        localStorage.setItem("selectedSubjectId", subjectId);
        dialogRef.current.close();

        navigate(`/thank-you/${subjectId}`, {
            state: { remainingTime: dialogTimeLeft }
        });
    };

    return (
        <>
            <nav className="navbar-ques">
                <div className="nav-left"> {!show ? <button onClick={generateQuestions}>Start Exam</button>
                    : displayQuestions.length > 0 && <p >Time left is : <span style={{ color: timeLeft < 10 ? "red" : "" }}>{formatTime(timeLeft)}</span> </p>} {" "}
                </div>

                <div className="nav-center">
                    <h2>{subjectName} <br /> <span style={{ fontSize: "20px" }}>{`Subject ID is : ${subjectId}`}</span> </h2>
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
                    <h4>
                        {currentIndex + 1}. {displayQuestions[currentIndex].question}
                    </h4>

                    {displayQuestions[currentIndex].options.map((opt, i) => (
                        <div key={i}>
                            <input
                                type="radio"
                                name={`Question-${currentIndex}`}
                                checked={answers[currentIndex] === i}
                                onChange={() => {
                                    setAnswers({
                                        ...answers,
                                        [currentIndex]: i
                                    });
                                    setError("");
                                }}
                            />
                            <label>{opt}</label>
                        </div>
                    ))}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </div>
            )}
            <br />

            <div className="show-next">
                {displayQuestions.length > 0 && <button onClick={handleNext} disabled={currentIndex === displayQuestions.length - 1}>Next</button>}
            </div>

            {displayQuestions.length > 0 ? "" : <button onClick={() => navigate("/selectSubject")}>Back</button>}

            <dialog ref={dialogRef} className="dialog-box">
                <p>Result in: {formatTime(dialogTimeLeft)}</p>

                <button onClick={handleDialogClose}>
                    Close
                </button>
            </dialog>
        </>
    )
}

export default ShowQuestions;






{/* <label style={{ color: displayQuestions[currentIndex].correctAnswer === i ? "green" : "white" }}>{opt}</label> */ }