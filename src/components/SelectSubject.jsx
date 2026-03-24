import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";

function SelectSubject() {
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [userName, setUserName] = useState("");
    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem("remainingTime");
        return saved ? Number(saved) : 0;
    });
    const location = useLocation();

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', () => {
            window.history.pushState(null, document.title, window.location.href);
        });
    }, [location]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    localStorage.setItem("remainingTime", 0);
                    return 0;
                }
                const updated = prev - 1;
                localStorage.setItem("remainingTime", updated);
                return updated > 0 ? updated : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

        localStorage.setItem("currentSubjectId", id);
        navigate(`/showQues/${id}`);
    }

    const handleLogOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    const handleResult = () => {

        const keys = Object.keys(localStorage);

        const resultKey = keys.find(key => key.startsWith("result_"));
        if (!resultKey) {
            alert("No result found");
            return;
        }

        const id = resultKey.split("_")[1];
        navigate(`/thank-you/${id}`);
    };

    return (
        <>
            <nav className="navbar">

                {timeLeft > 0 ? <p>Result in: {formatTime(timeLeft)}</p>
                    : <button onClick={handleResult} style={{ color: "black" }}>View Result</button>}

                <p>Logged in as: {userName}</p>
                <button onClick={handleLogOut} style={{ color: "red" }}>LogOut</button>
            </nav>
            <h3>Choose your Exam</h3>
            <div className="select-subject">
                {subjects.map((item, index) => (
                    <div key={index}>
                        <label style={{ cursor: "pointer", color: "pink" }} onClick={() => handleClick(item.id)}> {item.subject}</label>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SelectSubject;







{/* <button onClick={() => {
    const id = localStorage.getItem("currentSubjectId");
    navigate(`/thank-you/${id}`);
}} style={{ color: "black" }}>View Result</button> */}