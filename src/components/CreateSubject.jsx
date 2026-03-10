import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateSubject() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [addSubject, setAddSubject] = useState("");
    const [listSubject, setListSubject] = useState([]);


    useEffect(() => {
        const subjectList = localStorage.getItem("subjects");
        if (subjectList !== "null" && subjectList?.length > 0) {
            setListSubject(JSON.parse(subjectList))
        }
    }, []);

    const updateIDs = (list) => {
        return list.map((item, index) => ({
            ...item,
            id: index + 1
        }))
    }

    const showAndAddSubject = () => {
        setShow((prev) => !prev)
        if (show && addSubject.trim() !== "") {
            let getSubList = [...listSubject]

            const sub = {
                id: getSubList.length + 1,
                subject: addSubject.trim()
            }
            getSubList.push(sub)
            const updatedList = updateIDs(getSubList);
            setListSubject(updatedList)
            localStorage.setItem("subjects", JSON.stringify(updatedList))
            setAddSubject("")
        }
    }

    const handleBack = () => {
        const user = JSON.parse(localStorage.getItem("user")) || [];

        if (user.role === "teacher") {
            navigate("/");
        } else if (user.role === "student") {
            navigate("/selectSubject");
        }
    }

    const handleDelete = (id) => {
        const confirmDelete = confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const updatedList = listSubject.filter(subject => subject.id !== id);
            const reassign = updateIDs(updatedList);
            setListSubject(reassign);
            localStorage.setItem("subjects", JSON.stringify(reassign));
            localStorage.removeItem(`exam_${id}`);

        }
    };

    const handleData = (id) => {

        const storedData = localStorage.getItem(`exam_${id}`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);

            navigate(`/preview/${id}`, {
                state: { examData: parsedData }
            });
        } else {
            alert("No exam data found for this subject");
        }
    };

    return (
        <>
            <div className="create-subject">
                <button onClick={showAndAddSubject}>{show ? 'Add' : 'Create Subject'}</button> <br /> <br />

                {show && <input placeholder="Enter Subject" value={addSubject} onChange={(e) => setAddSubject(e.target.value)} />}
                <br /> <br />
                <table border="1">
                    <thead>
                        <tr>
                            <td>
                                ID
                            </td>
                            <td>Subject</td>
                            <td colSpan="3" style={{ textAlign: "center" }}>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listSubject.length ?
                                listSubject?.map(({ id, subject }, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{id}</td>
                                            <td>{subject}</td>
                                            <td onClick={() => navigate(`/create-exam/${id}`)} style={{ cursor: "pointer", color: "yellow" }}>
                                                Create Exam
                                            </td>
                                            <td onClick={() => handleDelete(id)} style={{ cursor: "pointer", color: "red" }}>
                                                Delete Exam
                                            </td>
                                            <td onClick={() => handleData(id)} style={{ cursor: "pointer", color: localStorage.getItem(`exam_${id}`) ? "yellowgreen" : "red" }}>Preview Data</td>
                                        </tr>
                                    )
                                })
                                : null
                        }
                    </tbody>
                </table>

                <br />

            </div>
            <button onClick={handleBack}>Back</button> {" "}

        </>

    )
}

export default CreateSubject;