import { useEffect, useState } from "react";
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
    const navigate = useNavigate();

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


    const generateQuestions = () => {
        if (savedData.length === 0) {
            alert("Questionnaire is empty!");
            return;
        }

        const shuffled = [...savedData].sort(() => 0.3 - Math.random());

        const randomEight = shuffled.slice(0, 8);
        setDisplayQuestions(randomEight);
        setCurrentIndex(0);

        setTimeLeft(randomEight[0].timeTaken);
        setIsRunning(true);
        setShow(true);

        localStorage.setItem("randomEight", JSON.stringify(randomEight));
    };

    useEffect(() => {
        if (!isRunning) return;

        const nextIndex = currentIndex + 1;

        if (timeLeft <= 0) {
            setIsRunning(false);
            setCurrentIndex(nextIndex);
            setTimeLeft(displayQuestions[nextIndex].timeTaken);
            setIsRunning(true)
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [isRunning, timeLeft, currentIndex, displayQuestions]);

    const notValid = Object.keys(answers).length !== displayQuestions.length;

    const handleSubmit = () => {
        if (notValid) {
            alert("Please answer all questions before submitting!");
            return;
        }

        const confirmSubmit = confirm("Are you sure want to Submit?");
        if (!confirmSubmit) return;


        const result = displayQuestions.map((q, index) => ({
            correctAnswer: q.correctAnswer,
            selectedAnswer: answers[index],
        }));

        localStorage.setItem("test", JSON.stringify(result));

        console.log("Submitted!", result);
    };

    const handlePrev = () => {
        if (currentIndex === 0) return;

        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);

        const prevQues = displayQuestions[prevIndex];
        if (prevQues) {
            setTimeLeft(prevQues.timeTaken);
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


    return (
        <>
            <nav className="navbar-ques">
                <div className="nav-left"> {!show ? <button onClick={generateQuestions}>Start Exam</button>
                    : displayQuestions.length > 0 && <p>Time left is : {formatTime(timeLeft)}</p>} {" "}
                </div>

                <div className="nav-center">
                    <h2>{subjectName} <br /> <span style={{ fontSize: "20px" }}>{`Subject ID is : ${subjectId}`}</span> </h2>
                </div>

                <div className="nav-right">
                    {displayQuestions.length > 0 ? <button onClick={handleSubmit} disabled={notValid}>Submit Answer</button> : <p>Logged as: {userName} </p>}
                </div>
            </nav>

            {displayQuestions.length === 0 && (
                <h3 style={{ color: "yellow" }}>
                    Click Start to give Exam
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

            <button onClick={() => navigate(-1)}>Back</button> {" "}

            {displayQuestions.length > 0 && <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>} {" "}

            {displayQuestions.length > 0 && <button onClick={handleNext} disabled={currentIndex === 7}>Next</button>}

        </>
    )

}

export default ShowQuestions;






{/* <label style={{ color: displayQuestions[currentIndex].correctAnswer === i ? "green" : "white" }}>{opt}</label> */ }