import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSubjectName } from "../hooks/useSubjectName";
import Buttons from './layout/Buttons';

function CreateExam() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const subName = useSubjectName();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [form, setForm] = useState({
        ques: "",
        options: ["", "", "", ""],
        correctOption: null,
        timeSpent: "",
        questions: []
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const data = location.state?.examData;
        if (!data || data.length === 0) return;

        if (data.length > 0) {
            const lastIndex = data.length - 1;
            const last = data[lastIndex];

            setCurrentIndex(lastIndex);
            setForm({
                ques: last.question,
                options: last.options,
                correctOption: last.correctAnswer,
                timeSpent: last.timeTaken,
                questions: data
            });
        }
    }, [location.state]);

    useEffect(() => {
        const savedData = localStorage.getItem(`exam_${subjectId}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setForm(prev => ({ ...prev, questions: parsed }))
        }
    }, [subjectId]);

    const handleQuestionChange = (e) => {
        const value = e.target.value;
        updateForm("ques", value);
        validate("question", value);
    };

    const validate = (name, value) => {
        let error = "";

        switch (name) {
            case "question":
                if (!value.trim()) error = "Fill the question!";
                break;
            case "timeSpent":
                if (!value.trim()) error = "Enter Time Required";
                break;
            case "correctOption":
                if (value === null) error = "Please select correct answer.";
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));

    }

    const validateOption = (index, value) => {
        setErrors(prev => ({
            ...prev,
            [`option${index}`]: !value.trim() ? "Option required" : ""
        }));
    };

    const isValid =
        form.ques.trim() !== "" &&
        form.correctOption !== null &&
        form.options.every(opt => opt.trim() !== "") &&
        form.timeSpent !== ""

    const saveQuestion = (list, index, question) => {
        const updated = [...list];

        if (updated[index]) {
            updated[index] = question;
        } else {
            updated.push(question);
        }
        return updated;
    };

    const updateOption = (index, value) => {
        const updated = [...form.options];
        updated[index] = value;
        updateForm("options", updated);
    };

    const updateForm = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const buildQuestion = () => ({
        question: form.ques,
        options: form.options,
        correctAnswer: form.correctOption,
        timeTaken: Number(form.timeSpent) || 0
    });

    const nextQuestion = () => {

        if (!isValid) return;

        const newQuestion = buildQuestion();

        const updatedQuestions = saveQuestion(form.questions, currentIndex, newQuestion);

        if (currentIndex === 14) {
            alert("End of Question creation");
            return;
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (updatedQuestions[nextIndex]) {
            const nextQues = updatedQuestions[nextIndex];

            setForm({
                ques: nextQues.question,
                options: nextQues.options,
                correctOption: nextQues.correctAnswer,
                timeSpent: nextQues.timeTaken,
                questions: updatedQuestions
            });
        } else {
            setForm(prev => ({
                ...prev,
                questions: updatedQuestions,
                ques: "",
                options: ["", "", "", ""],
                correctOption: null,
                timeSpent: ""
            }));
        }

        setErrors({});
    };

    const handleBack = () => {
        if (currentIndex === 0) {
            navigate("/createSubject");
            return;
        }

        const prevIndex = currentIndex - 1;
        const prevQuestion = form.questions[prevIndex];

        if (!prevQuestion) return;
        setCurrentIndex(prevIndex);

        setForm(prev => ({
            ...prev,
            ques: prevQuestion.question,
            options: prevQuestion.options,
            correctOption: prevQuestion.correctAnswer,
            timeSpent: prevQuestion.timeTaken
        }));
    };

    const previewQuestions = () => {
        const lastQuestion = buildQuestion();

        const updatedQuestions = saveQuestion(form.questions, currentIndex, lastQuestion);
        setForm(prev => ({
            ...prev,
            questions: updatedQuestions
        }));

        navigate(`/preview/${subjectId}`, {
            state: { examData: updatedQuestions }
        });
    };

    const handleKeyDown = (e) => {
        const invalid = ['e', 'E', '.', '+', '-'];
        if (invalid.includes(e.key)) e.preventDefault();
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-center">
                    <h2>SUBJECT: {subName}</h2>
                </div>
            </nav>

            <br />
            <div className='create-exam'>
                <label>Ques no: {currentIndex + 1}</label>

                <br />
                <textarea
                    value={form.ques}
                    onChange={handleQuestionChange}
                    placeholder='Type Question'
                    onBlur={(e) => validate("question", e.target.value)}
                />
                {errors.question && <p style={{ color: "red" }}>{errors.question}</p>}

                <h3>Options</h3>
                {form.options.map((opt, index) => (
                    <div key={index} className='radio-btn'>
                        <input
                            type='radio'
                            value={index}
                            checked={form.correctOption === index}
                            onChange={() => {
                                updateForm("correctOption", index);
                                validate("correctOption", index);
                            }}
                        />

                        <input
                            type="text"
                            value={opt}
                            placeholder={`Type Option ${index + 1}`}
                            onChange={(e) => updateOption(index, e.target.value)}
                            onBlur={(e) => validateOption(index, e.target.value)}
                        />

                        {errors[`option${index}`] && (
                            <p style={{ color: "red" }}>
                                {errors[`option${index}`]}
                            </p>
                        )}
                    </div>
                ))}

                {errors.correctOption && <p style={{ color: "red" }}>{errors.correctOption}</p>}
                <br />
                Time Required:{" "}
                <input
                    style={{ width: "40px" }}
                    type='number'
                    min="0"
                    value={form.timeSpent}
                    onChange={(e) => updateForm("timeSpent", e.target.value)}
                    onBlur={(e) => validate("timeSpent", e.target.value)}
                    onKeyDown={handleKeyDown}
                /> secs

                {errors.timeSpent && <p style={{ color: "red" }}>{errors.timeSpent}</p>}
                <br /><br />
            </div>

            <div className='exam-btn'>
                <Buttons onClick={handleBack} /> {" "}
                <button onClick={nextQuestion} disabled={!isValid}>Next</button>{" "}
                {currentIndex === 14 && <button onClick={previewQuestions}>Preview</button>}
            </div>
        </>
    );
}

export default CreateExam;