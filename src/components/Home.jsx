import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role === "student") {
      navigate("/selectSubject");
    } else {
      navigate("/login");
    }
  }


  return (
    <>
      <div className="heading">
        <h1>Welcome to Exam!</h1>
        <div className="select-role">
          <h2>Select your Role</h2>
          <button onClick={() => navigate("/teacher-login")} >Create Quiz </button>

          <br /> <br />
          <button onClick={handleStudentClick}>Student: Give a Quiz</button>
        </div>
      </div>
    </>
  )
}

export default Home;
