import { Navigate, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateSubject from "./components/CreateSubject";
import TeachLogin from "./components/TeachLogin";
import CreateExam from "./components/CreateExam";
import PrivateRoute from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import Preview from "./components/Preview";
import SelectSubject from "./components/SelectSubject";
import SavedQuestions from "./components/ShowQuestions";
import Result from "./components/Result";
import Auth from "./routes/authRoutes/Auth";

function App() {

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
        <Route path="/unauthorized" element={<Auth />} />
        <Route path="/teacher-login" element={<TeachLogin />} />

        <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
          <Route path="/create-exam/:subjectId" element={<CreateExam />} />
          <Route path="/preview/:subjectId" element={<Preview />} />
          <Route path="/createSubject" element={<CreateSubject />} />
        </Route>

        <Route path="/showQues/:subjectId" element={<SavedQuestions />} />
        <Route path="/result" element={<Result />} />

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
