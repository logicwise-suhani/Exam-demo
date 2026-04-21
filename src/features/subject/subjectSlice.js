import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    subjects: []
}
 
const subjectSlice = createSlice({
    name: "subjects",
    initialState,
    reducers: {
        setSubjects: (state, action) => {
            state.subjects = action.payload;
        },
        addSubjects: (state, action) => {
            state.subjects.push(action.payload);
        },
        deleteSubjects: (state, action) => {
            state.subjects = state.subjects.filter((sub) => sub.id !== action.payload);
        }
    }
});

export const { setSubjects, addSubjects, deleteSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;   