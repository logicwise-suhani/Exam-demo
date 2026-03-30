import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useSubjectName() {
    const { subjectId } = useParams();
    const [subjectName, setSubjectName] = useState("");

    useEffect(() => {

        const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

        const foundSubject = subjects.find(
            (sub) => String(sub.id) === String(subjectId)
        );

        if (foundSubject) {
            setSubjectName(foundSubject.subject);
        }

    }, [subjectId]);

    return subjectName;

}
 