import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../utils/timeFormatter";

function Preview() {
    const { subjectId } = useParams();
    const [previewData, setPreviewData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const storedData = localStorage.getItem(`exam_${subjectId}`);

        if (storedData) {
            setPreviewData(JSON.parse(storedData));
        }

    }, [subjectId]);

    useEffect(() => {
        if (location.state?.examData) {
            setPreviewData(location.state.examData);
        }

    }, [location.state]);

    const totalTime = previewData.reduce(
        (acc, item) => acc + Number(item.timeTaken || 0),
        0
    );

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
        const data = localStorage.getItem(`exam_${subjectId}`, JSON.stringify(previewData));
        if (data) {
            localStorage.removeItem(`exam_${subjectId}`);
        }
        navigate(`/create-exam/${subjectId}`)
    }


    return (
        <>
            <div className="preview-container">
                <h2>Preview</h2>
                <h3>Total Time: {formatTime(totalTime)}</h3>
                <div className={previewData.length === 0 ? "" : "preview"}>
                    {previewData.map((item, index) => (
                        <div key={index}>
                            <h4>{index + 1}. {item.question} </h4>

                            {item.options.map((opt, i) => (
                                <div key={i}>
                                    {opt && <li className={item.correctAnswer === i ? "correct" : ""} style={{ listStyleType: "none" }}>{opt}</li>}
                                </div>
                            ))}

                        </div>
                    ))}
                </div >
            </div>
            <div className="preview-buttons">
                <div className="preview-back">
                    <button onClick={() => navigate("/createSubject")}>Home</button> {" "}
                    {previewData.length === 0 ? "" :
                        <>
                            <button onClick={handleSave}>Submit Test</button> {" "}
                            <button onClick={handleEdit}>Edit Test</button> {" "}
                            <button onClick={handleDelete}>Delete Test</button>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Preview;