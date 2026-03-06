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
      <h2>Select your Role</h2>
      <div className="select-role">
        <button
          onClick={() =>
            navigate("/teacher-login")
          }
        >
          Teacher
        </button>
        <br /> <br />
        <button
          onClick={handleStudentClick}
        >
          Student
        </button>
      </div>

    </>
  )


}

export default Home;




























// import StudentCard from "./StudentCard";
// import TeacherCard from "./TeacherCard";

// function Home() {
//   return (
//     <div>
//       <TeacherCard />
//       <StudentCard />
//     </div>
//   );
// }

// export default Home;
