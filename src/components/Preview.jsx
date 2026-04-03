import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";
import { useSubjectName } from "../hooks/useSubjectName";
import Buttons from "./layout/Buttons";
 
function Preview() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const subName = useSubjectName();
    const [previewData, setPreviewData] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);
        setPreviewData(storedData ? JSON.parse(storedData) : "");
    }, [subjectId]);

    useEffect(() => {
        if (location.state?.examData) {
            setPreviewData(location.state.examData);
        }
    }, [location.state]);

    const handleSave = () => {
        if (!previewData || (Array.isArray(previewData) && previewData.length === 0)) {
            alert("Empty Test can't be submitted!");
            return;
        }
        localStorage.setItem(`exam_${subjectId}`, JSON.stringify(previewData));
        alert("Exam Saved Successfully!");
    };

    const handleEdit = () => {
        navigate(`/create-exam/${subjectId}`, {
            state: { examData: previewData }
        });
    };

    const handleDelete = () => {
        localStorage.removeItem(`exam_${subjectId}`);
        navigate(`/create-exam/${subjectId}`, { replace: true })
    }

    const totalTime = (Array.isArray(previewData) ? previewData : []).reduce(
        (acc, item) => acc + Number(item?.timeTaken || 0), 0);

    return (
        <>
            <div className="preview-container">
                <h2>Preview</h2>
                <h3 style={{ color: "white" }}>{subName}</h3>

                {previewData.length === 0 ? <h3>No exam to Preview</h3> : <h3>Total Time  {formatTime(totalTime)}</h3>}

                <div className={previewData.length === 0 ? "" : "preview"}>
                    {previewData ? previewData.map((item, index) => (
                        <div key={index}>
                            <h4>{index + 1}. {item.question} </h4>

                            {item.options.map((opt, i) => (
                                <div key={i}>
                                    {opt && <li className={item.correctAnswer === i ? "correct" : ""} style={{ listStyleType: "none" }}>{opt}</li>}
                                </div>
                            ))}
                        </div>
                    )) : ""}
                </div >
            </div>
            <div className="preview-buttons">
                <div className="preview-back">
                    <button onClick={() => navigate("/createSubject")}>Home</button> {" "}
                    {previewData.length === 0 ? "" :
                        <>
                            <Buttons onClick={handleSave} label="Submit Test" /> {" "}
                            <Buttons onClick={handleEdit} label="Edit Test" /> {" "}
                            <Buttons onClick={handleDelete} label="Delete Test" />
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Preview;