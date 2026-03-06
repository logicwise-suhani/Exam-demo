import { useCallback, useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom';

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
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem(`exam_${subjectId}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setQuestions(parsed);
        }
    }, [subjectId]);

    const handleQuestionChange = (e) => {
        const value = e.target.value;
        setQues(value);
        validate("question", value);
    };

    const handleOptionsChange = (index, values) => {
        const updatedOptions = [...options]
        updatedOptions[index] = values;
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

            if (quesNumber >= 15) {
                alert("End of question creation")
                return;
            }

            const newQuestion = {
                question: ques,
                options: options,
                correctAnswer: correctOption,
                timeTaken: Number(timeSpent) || 0
            };

            // const data = [...questions, newQuestion];

            setQuestions([...questions, newQuestion]);
            setQuesNumber(prev => prev + 1);

            setQues("");
            setOptions(["", "", "", ""]);
            setCorrectOption(null);
            setTimeSpent("");
            setErrors({});

        }
        , [correctOption, options, ques, timeSpent, isValid, quesNumber, questions])

    const handleBack = () => {

        if (quesNumber === 1) {
            navigate("/createSubject");
            return;
        }

        // const data ={
        //     question: 
        // }

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

        const finalQuestions = [...questions, lastQuestion];
        navigate(`/preview/${subjectId}`, {
            state: { examData: finalQuestions }
        });

    }

    return (
        <>
            <div className='create-exam'>
                <h2>CreateExam: {`${subjectId}`}</h2>

                Time Required (in secs): {" "}
                <input
                    style={{ width: "40px", border: "2px solid white", borderRadius: "5px" }}
                    type='number'
                    min="0"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    onBlur={(e) => validate("timeSpent", e.target.value)}
                />
                {errors.timeSpent && <p style={{ color: "red" }}>{errors.timeSpent}</p>}


                <br /> <br />
                <label style={{ fontSize: "20px", marginRight: "80px" }}>Ques no: {quesNumber} </label> <br />
                <textarea
                    value={ques}
                    onChange={handleQuestionChange}
                    placeholder='Type Question'
                    onBlur={(e) => validate("question", e.target.value)}
                />
                {errors.question && <p style={{ color: "red" }}>{errors.question}</p>}

                <h3>Options</h3>

                {options.map((opt, index) => (
                    <div key={index}>
                        <input
                            type='radio'
                            name='group'
                            value={index}
                            checked={correctOption === index}
                            onChange={() => {
                                setCorrectOption(index);
                                validate("correctOption", index);
                            }}
                        />

                        {opt}

                        {show && < input
                            type="text"
                            value={opt}
                            placeholder={`Type Option ${index + 1}`}
                            onChange={(e) =>
                                handleOptionsChange(index, e.target.value)
                            }
                            onBlur={(e) => {
                                validateOption(index, e.target.value)
                                if (!opt.trim()) {
                                    setShow(!show)
                                }
                            }}
                        />}

                        {errors[`option${index}`] && (
                            < p style={{ color: "red" }}>
                                {errors[`option${index}`]}
                            </p>
                        )}

                    </div>
                ))}
                {errors.correctOption && <p style={{ color: "red" }}>{errors.correctOption}</p>}
                <br />
                <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Edit Options'}</button> {" "}
                <button onClick={handleBack}>Back</button> {" "}
                <button onClick={nextQuestion} disabled={!isValid}>Next</button> {" "}
                {quesNumber >= 15 && <button onClick={previewQuestions}>Preview</button>}

            </div >
        </>
    )
}

export default CreateExam;
