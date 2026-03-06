import { useNavigate } from "react-router-dom";

function StudentCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("role", "student");
    navigate("/selectSubject");
  };

  return (
    <div>
      <button onClick={handleClick}>Student</button>
    </div>
  );
}

export default StudentCard;
