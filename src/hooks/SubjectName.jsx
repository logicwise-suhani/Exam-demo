import { useParams } from "react-router-dom";

export function useSubjectName() {
    const { subjectId } = useParams();

    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    const foundSubject = subjects.find(
        (sub) => String(sub.id) === String(subjectId)
    );

    if (foundSubject) {
        return foundSubject.subject;
    }
}
