import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    exams: {},
    attempts: {}
}

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        setExam: (state, action) => {
            const { subjectId, questions } = action.payload;
            state.exams[subjectId] = questions;
        },

        addQuestion: (state, action) => {
            const { subjectId, question } = action.payload;

            if (!state.exams[subjectId]) {
                state.exams[subjectId] = [];
            }

            state.exams[subjectId].push(question);
        },

        updateQuestion: (state, action) => {
            const { subjectId, index, question } = action.payload;
            if (!state.exams[subjectId]) return;

            state.exams[subjectId][index] = question;
        },

        startAttempt: (state, action) => {
            const { subjectId, questions } = action.payload;
            const isSubmitted = localStorage.getItem(`submitted_${subjectId}`) === "true";

            state.attempts[subjectId] = {
                questions,
                currentIndex: 0,
                answers: [],
                timeLeft: questions[0]?.timeTaken || 0,
                dialogTimeLeft: 300,
                isRunning: true,
                isDialogRunning: false,
                submitted: isSubmitted,
                error: null
            }
        },

        selectAnswer: (state, action) => {
            const { subjectId, index, answer } = action.payload;

            const attempt = state.attempts[subjectId]

            if (!attempt) return;
            attempt.answers[index] = answer;

            attempt.error = null;
        },

        nextQuestion: (state, action) => {
            const { subjectId, force } = action.payload;
            const attempt = state.attempts[subjectId];

            if (!attempt) return;

            attempt.error = "TEST ERROR"

            if (!force && attempt.answers[attempt.currentIndex] === undefined) {
                attempt.error = "Please choose an option";
                return;
            }

            attempt.error = null;

            attempt.currentIndex += 1;

            const nextQ = attempt.questions[attempt.currentIndex];
            if (nextQ) {
                attempt.timeLeft = nextQ.timeTaken
            }
        },

        tickTimer: (state, action) => {
            const { subjectId } = action.payload;
            const attempt = state.attempts[subjectId];

            if (!attempt) return;

            attempt.timeLeft -= 1;
        },

        startDialogTimer: (state, action) => {
            const { subjectId } = action.payload;
            const attempt = state.attempts[subjectId];

            if (!attempt) return;

            attempt.isDialogRunning = true;
            attempt.dialogTimeLeft = 300;
            attempt.isRunning = false;
        },

        tickDialogTimer: (state, action) => {
            const { subjectId } = action.payload;
            const attempt = state.attempts[subjectId];

            if (!attempt) return;

            attempt.dialogTimeLeft -= 1;
        },

        submitExam: (state, action) => {
            const { subjectId } = action.payload;
            const attempt = state.attempts[subjectId];

            if (!attempt) return;

            attempt.submitted = true;
            attempt.isDialogRunning = false;

            localStorage.setItem(`submitted_${subjectId}`, "true");
        }
    }
})

export const { setExam, addQuestion, updateQuestion, startAttempt, selectAnswer, nextQuestion, tickDialogTimer, tickTimer, startDialogTimer, submitExam } = examSlice.actions;
export default examSlice.reducer;