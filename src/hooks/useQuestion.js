import { useState } from "react";

function useQuestion() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");

    const selectAnswer = (index, option) => {
        setAnswers(prev => ({
            ...prev,
            [index]: option
        }));
        setError("");
    };

    const next = (questions, force = false) => {
        if (!force && answers[currentIndex] === undefined) {
            setError("Please choose an option");
            return false;
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }

        return true;
    };

    return {
        currentIndex,
        answers,
        error,
        setError,
        selectAnswer,
        next
    };
}

export default useQuestion;