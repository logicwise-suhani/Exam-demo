import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "./Button/Buttons";
import useFormValidation from "../hooks/useError";

function TeachLogin() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const { data,
    errors,
    touched,
    handleChange,
    handleBlur
  } = useFormValidation({
    email: "",
    password: ""
  }, teachValidate);

  const teacherEmail = "teacher@teach.com";
  const teacherPassword = "Te111111";

  function teachValidate(values) {
    const errors = {};

    if (!values.email.includes("@")) {
      errors.email = "Invalid email format";
    }

    if (values.password.length < 6) {
      errors.password = "Invalid password";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    handleChange(e, () => setLoginError(""));
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

  useEffect(() => {
    const logged = localStorage.getItem("user");
    if (logged) {
      navigate("/createSubject");
    }
    return;
  }, [navigate]);

  // const alreadyLogged = () => {
  //   const logged = localStorage.getItem("user");

  //   if (logged) {
  //     navigate("/createSubject");
  //   } else {
  //     alert("Please Login!")
  //   }
  // }

  const isTeachValid =
    Object.keys(errors).length === 0 &&
    data.email &&
    data.password;

  return (
    <>
      <h2>Login</h2>

      <div className="login">
        <input
          placeholder="Enter email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
        /> {" "}
        <span>{touched.email && errors.email}</span>

        <br /> <br />
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={data.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
        /> {" "}
        <span>{touched.password && errors.password}</span>

        <br />
        {loginError && (
          <p style={{ color: "red" }}>{loginError}</p>
        )}

        <br />
        <Buttons onClick={() => navigate("/")} /> {" "}

        <button onClick={handleLogin} disabled={!isTeachValid}>
          Login
        </button> {" "}

        {/* <p>Already logged in? <span onClick={alreadyLogged} style={{ color: "red", cursor: "pointer" }}>Click here</span> </p> */}
      </div>
    </>

  );
}

export default TeachLogin;
