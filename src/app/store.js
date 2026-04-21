import { configureStore } from "@reduxjs/toolkit";
import subjectReducer from "../features/subject/subjectSlice";
import examReducer from "../features/exams/examSlice";

export const store = configureStore({
    reducer: {
        subjects: subjectReducer,
        exam: examReducer
    }
});

