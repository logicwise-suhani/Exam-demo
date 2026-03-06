import { useNavigate } from "react-router-dom";

function TeacherCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("role", "teacher");
    navigate("/createSubject");
  };

  return (
    <div>
      <button onClick={handleClick}>Teacher</button>
    </div>
  );
}

export default TeacherCard;
