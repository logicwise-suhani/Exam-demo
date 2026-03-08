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
        localStorage.setItem(`exam_${subjectId}`, JSON.stringify(previewData));
        alert("Exam Saved Successfully!");
    }

    const handleEdit = () => {
        navigate(`/createExam/${subjectId}`, {
            state: { examData: previewData }
        });
    };

    return (
        <>
            <div className="preview-container">
                <h2>Preview</h2>
                <div className="preview">
                    <h3>Total Time: {formatTime(totalTime)}</h3>

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

                <button className="preview-back" onClick={() => navigate(-1)}>Back</button> {" "}
                <button className="preview-back" onClick={handleSave}>Submit Test</button> {" "}
                <button className="preview-back" onClick={handleEdit}>Edit Test</button>
            </div>
        </>
    )
}

export default Preview;