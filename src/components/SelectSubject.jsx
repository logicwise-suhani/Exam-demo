import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectSubject() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const subjectList = localStorage.getItem("subjects");
        if (subjectList !== "null" && subjectList?.length > 0) {
            setSubjects(JSON.parse(subjectList))
        }
    }, []);

    useEffect(() => {
        const name = JSON.parse(localStorage.getItem("user")) || [];

        if (name) {
            setUserName(name.email)
        }
    }, []);

    const handleClick = (id) => {
        const test = localStorage.getItem(`test_${id}`);
        if (test) {
            alert("Already attempted!")
            return;
        }
        navigate(`/showQues/${id}`);
    }

    const handleLogOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <>

            <nav className="navbar">
                <p>Logged in as: {userName}</p>
                <button onClick={handleLogOut} style={{ color: "red" }}>LogOut</button>
            </nav>
            <h3>Choose your Exam</h3>
            <div className="select-subject">
                {subjects.map((item, index) => (
                    <div key={index}>
                        <label style={{ cursor: "pointer", color: "pink" }} onClick={() => handleClick(item.id)}> {item.subject} </label>
                    </div>
                ))}
            </div>
            <br /> <br />

            <div className="select-btn">
                <button onClick={() => navigate("/register")}>Back</button> {" "}
                <button onClick={() => navigate("/")}>Home</button>
            </div>
        </>
    )
}

export default SelectSubject;  