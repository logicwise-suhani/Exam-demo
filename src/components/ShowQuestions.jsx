import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";

function ShowQuestions() {
    const { subjectId } = useParams();

    const [savedData, setSavedData] = useState([]);
    const [displayQuestions, setDisplayQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);

        if (storedData) {
            setSavedData(JSON.parse(storedData));
        }

    }, [subjectId]);


    const generateQuestions = () => {
        if (savedData.length === 0) {
            alert("Questionnaire is empty!");
            return;
        }

        const shuffled = [...savedData].sort(() => 0.3 - Math.random());

        const randomEight = shuffled.slice(0, 8);
        console.log(randomEight);
        setDisplayQuestions(randomEight);
        setCurrentIndex(0);

        setTimeLeft(randomEight[0].timeTaken);
    };

    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            setIsRunning(false);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [isRunning, timeLeft]);

    const handleSubmit = () => {
        const confirmSubmit = confirm("Are you sure want to Submit?");
        if (confirmSubmit) {
            console.log("Submitted!");
        }
    }

    return (
        <>
            <nav className="navbar">
                <h2>{`Subject ID is : ${subjectId}`}</h2>
                {<button onClick={() => setIsRunning(true)} style={{ color: "yellow" }}>Start Timer</button>}
            </nav>
            {displayQuestions.length === 0 && (
                <h3 style={{ color: "yellow" }}>
                    Click Generate to start exam
                </h3>
            )}



            {displayQuestions.length > 0 && (
                <div>
                    <p>Time left is : {formatTime(timeLeft)}</p>
                    <h4>
                        {currentIndex + 1}. {displayQuestions[currentIndex].question}
                    </h4>

                    {displayQuestions[currentIndex].options.map((opt, i) => (
                        <div key={i}>
                            <input
                                type="radio"
                                name="group"
                            />
                            <label style={{ color: displayQuestions[currentIndex].correctAnswer === i ? "green" : "white" }}>{opt}</label>
                        </div>
                    ))}
                </div>
            )}
            <br />
            <button onClick={generateQuestions}>Generate</button> {" "}
            <button onClick={() => {
                if (currentIndex < displayQuestions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setTimeLeft(displayQuestions[currentIndex + 1].timeTaken)
                }

            }}>Next</button> {" "}

            <button onClick={handleSubmit}>Submit Answer</button>
        </>
    )

}

export default ShowQuestions;

