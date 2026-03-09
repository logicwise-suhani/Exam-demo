import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditTest() {

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

    return (
        <>
            <p>{`Edit Test: ${subjectName}`}</p>
        </>
    )

}

export default EditTest;