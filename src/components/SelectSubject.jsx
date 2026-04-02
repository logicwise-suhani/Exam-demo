import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "./layout/Buttons";

function SelectSubject() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const handlePopState = () => {
            window.history.pushState(null, document.title, window.location.href);
        };

        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        const subjectList = localStorage.getItem("subjects");
        if (subjectList !== "null" && subjectList?.length > 0) {
            setSubjects(JSON.parse(subjectList))
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
        localStorage.removeItem("user");
        navigate("/login");
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

            <h3>Choose your Exam</h3>
            <div className="select-subject">
                {subjects.map((item) => (
                    <div key={item.id}>
                        <label style={{ cursor: "pointer", color: "pink" }} onClick={() => handleClick(item.id)}> {item.subject}</label>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SelectSubject;