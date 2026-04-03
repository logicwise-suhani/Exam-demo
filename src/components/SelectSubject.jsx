import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "./layout/Buttons";

function SelectSubject() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [userName, setUserName] = useState("");

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
            const parsedSubjects = JSON.parse(subjectList);

            const filterSubjects = parsedSubjects.filter((subject) => {
                const hasExam = localStorage.getItem(`exam_${subject.id}`);
                if (!hasExam) return;
                const parsedExam = JSON.parse(hasExam);
                return Array.isArray(parsedExam) && parsedExam.length > 0;
            })
            setSubjects(filterSubjects);
        }
        const name = JSON.parse(localStorage.getItem("user")) || [];
        if (name?.email) {
            setUserName(name.email)
        }
    }, []);

    const handleClick = (id) => {
        const test = localStorage.getItem(`test_${id}`);
        if (test) {
            alert("Already attempted!")
            return;
        }
        localStorage.setItem("currentSubjectId", id);
        navigate(`/showQues/${id}`);
    }

    const handleLogOut = () => {
        const confirmLogOut = confirm("Are you sure want to logOut?");
        if (confirmLogOut) {
            localStorage.removeItem("user");
            navigate("/login");
        }
    }

    return (
        <>
            <nav className="navbar">
                <button onClick={() => navigate("/result")} style={{ cursor: "pointer" }}>Result</button>
                <p>Logged as: {userName}</p>

                <div className="red-btn">
                    <Buttons onClick={handleLogOut} label="LogOut" />
                </div>
            </nav>

            {subjects.length > 0 ?
                <>
                    <h3>Available Exams</h3>
                    <div className="select-subject">
                        {subjects.map((item) => (
                            <div key={item.id}>
                                <label onClick={() => handleClick(item.id)}> {item.subject}</label>
                            </div>
                        ))}
                    </div>
                </>
                :
                <>
                    <h3>No exams available</h3>
                    <p>Check back later for new examinations</p>
                </>
            }
        </>
    )
}

export default SelectSubject;