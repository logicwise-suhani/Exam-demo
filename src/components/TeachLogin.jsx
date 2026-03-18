import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeachLogin() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginError, setLoginError] = useState("");

  const teacherEmail = "teacher@teach.com";
  const teacherPassword = "Te111111";

  const teachValidate = (values) => {
    const errors = {};

    if (!values.email.includes("@")) {
      errors.email = "Invalid email format";
    }

    if (values.password.length < 6) {
      errors.password = "Invalid password";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...data, [name]: value };

    setData(updated);
    setErrors(teachValidate(updated));
    setLoginError("");
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLogin = () => {
    if (
      data.email === teacherEmail &&
      data.password === teacherPassword
    ) {
      const teacherUser = {
        email: teacherEmail,
        role: "teacher",
      };

      localStorage.setItem("user", JSON.stringify(teacherUser));

      navigate("/createSubject");
    } else {
      setLoginError("Invalid teacher credentials");
    }

  };

  const alreadyLogged = () => {
    const logged = localStorage.getItem("user");

    if (logged) {
      navigate("/createSubject");
    } else {
      alert("Please Login!")
    }
  }

  const isTeachValid =
    Object.keys(errors).length === 0 &&
    data.email &&
    data.password;

  return (
    <>
      <h2>Login</h2>

      <div className="teach-login">
        <input
          placeholder="Enter email"
          name="email"
          value={data.email}
          onChange={handleChange}
          onBlur={handleBlur}
        /> {" "}
        <span>{touched.email && errors.email}</span>

        <br /> <br />

        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={data.password}
          onChange={handleChange}
          onBlur={handleBlur}
        /> {" "}
        <span>{touched.password && errors.password}</span>

        <br />

        {loginError && (
          <p style={{ color: "red" }}>{loginError}</p>
        )}

        <br />
        <button onClick={() => navigate("/")}>Back</button> {" "}

        <button onClick={handleLogin} disabled={!isTeachValid}>
          Login
        </button> {" "}

        <p>Already logged in? <span onClick={alreadyLogged} style={{ color: "red", cursor: "pointer" }}>Click here</span> </p>
      </div>
    </>

  );
}

export default TeachLogin;
