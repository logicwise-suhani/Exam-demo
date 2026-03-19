import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './App.css'
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateSubject from "./components/CreateSubject";
// import SolveQuestion from "./components/SelectSubject";
import TeachLogin from "./components/TeachLogin";
import CreateExam from "./components/CreateExam";
import PrivateRoute from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import Preview from "./components/Preview";
import SelectSubject from "./components/SelectSubject";
import SavedQuestions from "./components/ShowQuestions";
import ThankYou from "./components/ThankYou";

function App() {

  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("user") || [];
    navigate("/teacher-login")
  }

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={
          <>
            <h2>Not allowed</h2> <br />
            <button onClick={() => navigate("/")}>Back</button>
          </>
        } />
        <Route path="/teacher-login" element={
          <>
            <TeachLogin />
          </>
        } />

        <Route path="/create-exam/:subjectId" element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <CreateExam />
            {/* <button onClick={handleLogOut} className="logout">LogOut</button> */}
          </PrivateRoute>} />

        <Route path="/preview/:subjectId" element={<Preview />} />
        <Route path="/showQues/:subjectId" element={<SavedQuestions />} />

        <Route path="/thank-you/:subjectId" element={<ThankYou />} />

        <Route
          path="/createSubject"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <CreateSubject />
              <button onClick={handleLogOut} style={{ color: "red" }}>LogOut</button>
            </PrivateRoute>
          }
        />

        <Route
          path="/selectSubject"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <SelectSubject />
            </PrivateRoute>

          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
