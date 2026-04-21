import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setSubjects } from "../features/subject/subjectSlice";

function CreateSubject() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [addSubject, setAddSubject] = useState("");
    const [error, setError] = useState("");
    const listSubject = useSelector((s) => s.subjects.subjects);
    const dispatch = useDispatch();

    useEffect(() => {
        const handlePopState = () => {
            window.history.go(1);
        };
        window.addEventListener("popstate", handlePopState);
        window.history.pushState(null, "", window.location.href);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        const subjectList = localStorage.getItem("subjects");
        if (subjectList !== "null" && subjectList?.length > 0) {
            dispatch(setSubjects(JSON.parse(subjectList)));
        }
    }, [dispatch]);

    const updateIDs = (list) => {
        return list.map((item, index) => ({
            ...item,
            id: index + 1
        }))
    }

    const showAndAddSubject = () => {
        if (!show) {
            setShow(true);
            return;
        }

        const subject = addSubject.trim();
        if (!subject) {
            setError("Subject name is required");
            return;
        }

        if (subject.length < 3) {
            setError("Subject must be at least 3 characters");
            return;
        }

        const isDuplicate = listSubject.some(
            (item) => item.subject.toLowerCase() === subject.toLowerCase()
        );
        if (isDuplicate) {
            setError("Subject already exists");
            return;
        }

        const valid = /^[A-Za-z0-9 .\s]+$/;
        if (!valid.test(subject)) {
            setError("Invalid characters");
            return;
        }

        setError("");

        const newList = [...listSubject, {
            id: listSubject.length + 1,
            subject
        }];

        const updatedList = updateIDs(newList);
        dispatch(setSubjects(updatedList));
        localStorage.setItem("subjects", JSON.stringify(updatedList))
        setAddSubject("")
        setShow(false);
    }

    const handleDelete = (id) => {
        const confirmDelete = confirm("Are you sure you want to delete?");
        if (confirmDelete) {
            const updatedList = listSubject.filter(subject => subject.id !== id);
            const reassign = updateIDs(updatedList);
            dispatch(setSubjects(reassign));
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

    const handleLogOut = () => {
        const confirmLogOut = confirm("Are you sure want to Log Out?");
        if (confirmLogOut) {
            localStorage.removeItem("user") || [];
            navigate("/teacher-login")
        }
    }

    return (
        <>
            <nav className="navbar">
                <button onClick={handleLogOut}>LogOut</button>
            </nav>

            <div className="heading">
                <h1>Welcome, Teacher!</h1>
            </div>
            <br />
            <div className="create-subject">
                {show && (
                    <input
                        placeholder="Enter Subject"
                        value={addSubject}
                        onChange={(e) => setAddSubject(e.target.value)}
                    />
                )}{" "}

                <button onClick={showAndAddSubject}>{show ? 'Add' : 'Create Subject'}</button>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <br /> <br />
                {listSubject.length > 0 ? < table border="1">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Subject</td>
                            <td colSpan="3" style={{ textAlign: "center" }}>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listSubject.length ?
                                listSubject?.map(({ id, subject }, index) => {
                                    const examExists = localStorage.getItem(`exam_${id}`);
                                    return (
                                        <tr key={index}>
                                            <td>{id}</td>
                                            <td>{subject}</td>
                                            <td onClick={() => {
                                                if (examExists) {
                                                    alert("Exam already created");
                                                    return;
                                                }
                                                navigate(`/create-exam/${id}`);
                                            }} className={examExists ? "disabled" : "enabled"} style={{ fontSize: "20px" }}>
                                                +
                                            </td>
                                            <td onClick={() => handleData(id)} style={{ cursor: "pointer", color: localStorage.getItem(`exam_${id}`) ? "var(--steel-blue)" : "red" }}> 👁</td>
                                            <td onClick={() => handleDelete(id)} style={{ cursor: "pointer", color: "red" }}>
                                                ❌
                                            </td>
                                        </tr>
                                    )
                                }) : null
                        }
                    </tbody>
                </table> : ""}
            </div >
        </>
    )
}

export default CreateSubject;