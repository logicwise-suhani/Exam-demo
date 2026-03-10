import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CreateExam = () => {
    const { subjectId } = useParams();
    const [quesNumber, setQuesNumber] = useState(1);
    const [ques, setQues] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [show, setShow] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [correctOption, setCorrectOption] = useState(null);
    const [timeSpent, setTimeSpent] = useState("");
    const [errors, setErrors] = useState({});
    const [subjectName, setSubjectName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.examData) {
            const data = location.state.examData;
            setQuestions(data);

            if (data.length > 0) {
                const last = data[data.length - 1];

                setQuesNumber(data.length);
                setQues(last.question);
                setOptions(last.options);
                setCorrectOption(last.correctAnswer);
                setTimeSpent(last.timeTaken);
            }
        }
    }, [location.state]);

    useEffect(() => {
        const savedData = localStorage.getItem(`exam_${subjectId}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setQuestions(parsed);
        }

        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

        const foundSubject = subjects.find(
            (sub) => String(sub.id) === String(subjectId)
        );

        if (foundSubject) {
            setSubjectName(foundSubject.subject);
        }
    }, [subjectId]);

    const handleQuestionChange = (e) => {
        const value = e.target.value;
        setQues(value);
        validate("question", value);
    };

    const handleOptionsChange = (index, value) => {
        const updatedOptions = [...options]
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    }

    const validate = useCallback((name, value) => {
        let error = "";

        if (name === "question" && !value.trim()) {
            error = "Fill the question!";
        }

        if (name === "timeSpent" && !value.trim()) {
            error = "Enter Time Required";
        }

        if (name === "correctOption" && value === null) {
            error = "Please select correct answer.";
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, [])

    const validateOption = (index, value) => {
        let message = "";

        if (!value.trim()) {
            message = "Option required";
        }

        setErrors(prev => ({
            ...prev,
            [`option${index}`]: message
        }));
    };

    const isValid =
        ques.trim() !== "" &&
        correctOption !== null &&
        options.every(opt => opt.trim() !== "") &&
        timeSpent !== "";

    const nextQuestion = useCallback(
        () => {

            if (!isValid) return;

            const newQuestion = {
                question: ques,
                options: options,
                correctAnswer: correctOption,
                timeTaken: Number(timeSpent) || 0
            };

            const updatedQuestions = [...questions];

            if (updatedQuestions[quesNumber - 1]) {
                updatedQuestions[quesNumber - 1] = newQuestion;
            } else {
                updatedQuestions.push(newQuestion);
            }

            setQuestions(updatedQuestions);

            if (quesNumber === 15) {
                alert("End of Question creation")
                return;
            }

            const nextIndex = quesNumber;

            setQuesNumber(prev => prev + 1);

            if (updatedQuestions[nextIndex]) {
                const nextQues = updatedQuestions[nextIndex];

                setQues(nextQues.question);
                setOptions(nextQues.options);
                setCorrectOption(nextQues.correctAnswer);
                setTimeSpent(nextQues.timeTaken);
            }

            else {
                setQues("");
                setOptions(["", "", "", ""]);
                setCorrectOption(null);
                setTimeSpent("");
            }
            setErrors({});

        }
        , [correctOption, options, ques, timeSpent, isValid, quesNumber, questions])

    const handleBack = () => {

        if (quesNumber === 1) {
            navigate("/createSubject");
            return;
        }

        const prevIndex = quesNumber - 2;
        const prevQuestion = questions[prevIndex];

        if (!prevQuestion) return;

        setQuesNumber(prev => prev - 1);

        setQues(prevQuestion.question);
        setOptions(prevQuestion.options);
        setCorrectOption(prevQuestion.correctAnswer);
        setTimeSpent(prevQuestion.timeTaken);
    };

    const previewQuestions = () => {

        const lastQuestion = {
            question: ques,
            options: options,
            correctAnswer: correctOption,
            timeTaken: Number(timeSpent) || 0
        };

        const updatedQuestions = [...questions];

        if (updatedQuestions[quesNumber - 1]) {
            updatedQuestions[quesNumber - 1] = lastQuestion;
        } else {
            updatedQuestions.push(lastQuestion);
        }

        setQuestions(updatedQuestions);

        navigate(`/preview/${subjectId}`, {
            state: { examData: updatedQuestions }
        });
    };

    const handleKeyDown = (e) => {
        const invalid = ['e', 'E', '.', '+', '-'];

        if (invalid.includes(e.key)) {
            e.preventDefault();
        }
    }

    return (
        <>
            <h2 style={{ textAlign: "center" }}>SUBJECT: {`${subjectName}`}</h2>
            <br />
            <div className='create-exam'>
                <label>Ques no: {quesNumber} </label> <br />
                <textarea
                    value={ques}
                    onChange={handleQuestionChange}
                    placeholder='Type Question'
                    onBlur={(e) => validate("question", e.target.value)}
                />
                {errors.question && <p style={{ color: "red" }}>{errors.question}</p>}

                <h3>Options</h3>
                {options.map((opt, index) => (
                    <div key={index} className='radio-btn'>
                        <input
                            type='radio'
                            value={index}
                            checked={correctOption === index}
                            onChange={() => {
                                setCorrectOption(index);
                                validate("correctOption", index);
                            }}
                        />
                        {show ? (
                            <input
                                type="text"
                                value={opt}
                                placeholder={`Type Option ${index + 1}`}
                                onChange={(e) => handleOptionsChange(index, e.target.value)}
                                onBlur={(e) => {
                                    validateOption(index, e.target.value);

                                    const updatedOptions = [...options];
                                    updatedOptions[index] = e.target.value;

                                }}
                            />
                        ) : (
                            <span>{opt}</span>
                        )}

                        {errors[`option${index}`] && (
                            < p style={{ color: "red" }}>
                                {errors[`option${index}`]}
                            </p>
                        )}
                    </div>
                ))}
                {errors.correctOption && <p style={{ color: "red" }}>{errors.correctOption}</p>}
                < br />
                Time Required: {" "}
                <input
                    style={{ width: "40px" }}
                    type='number'
                    min="0"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    onBlur={(e) => validate("timeSpent", e.target.value)}
                    onKeyDown={handleKeyDown}
                /> secs
                {errors.timeSpent && <p style={{ color: "red" }}>{errors.timeSpent}</p>}
                <br /> <br />
            </div >
            <div className='exam-btn'>
                <button onClick={handleBack} > Back</button> {" "}
                <button onClick={nextQuestion} disabled={!isValid}>Next</button> {" "}
                {quesNumber === 15 && <button onClick={previewQuestions}>Preview</button>}
            </div>
        </>
    )
}

export default CreateExam;

// if (updatedOptions.every(o => o.trim() !== "")) {
//     setShow(false);
// }

{/* <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Edit Options'}</button> {" "} */ }