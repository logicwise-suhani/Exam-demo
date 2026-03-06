import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectSubject() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const subjectList = localStorage.getItem("subjects");
        if (subjectList !== "null" && subjectList?.length > 0) {
            setSubjects(JSON.parse(subjectList))
        }
        console.log(subjectList);
    }, []);

    const handleClick = (id) => {
        navigate(`/showQues/${id}`);
    }

    return (
        <>
            <h3>Select Subject</h3>

            {subjects.map((item, index) => (
                <div key={index}>
                    <label style={{ cursor: "pointer", color: "pink" }} onClick={() => handleClick(item.id)}> {item.subject} </label>
                </div>
            ))}

            <br />
            <button onClick={() => navigate(-1)}>Back</button> {" "}
            <button onClick={() => navigate("/")}>Home</button>
        </>
    )
}

export default SelectSubject; 