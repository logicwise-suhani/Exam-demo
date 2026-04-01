import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "./Button/Buttons";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedUser) {
      if (loggedUser.role === "teacher") {
        navigate("/createSubject");
      } else if (loggedUser.role === "student") {
        navigate("/selectSubject");
      }
    }
  }, [navigate]);

  const validate = (values) => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email address";
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(values.password)) {
      errors.password =
        "Invalid Password";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...data, [name]: value };

    setData(updated);
    setErrors(validate(updated));
    setLoginError("");
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email === data.email &&
        u.password === data.password
    );

    if (!user) {
      setLoginError("Invalid email or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "teacher") {
      navigate("/createSubject");
    } else if (user.role === "student") {
      navigate("/selectSubject");
    }
  };

  const isValid =
    Object.keys(errors).length === 0 &&
    data.email && data.password;

  return (
    <div>
      <h2>Login</h2>

      <div className="login">
        <input
          placeholder="Enter email"
          name="email"
          value={data.email}
          onChange={handleChange}
          onBlur={handleBlur}
        /> <br />
        <span style={{ color: "red" }}>{touched.email && errors.email}</span>

        <br />
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={data.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <br />
        <span style={{ color: "red" }}>{touched.password && errors.password}</span>

        <br />
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <br />
        <Buttons onClick={() => navigate("/")} /> {" "}
        <button onClick={handleLogin} disabled={!isValid}> Login</button> {" "}
        <p>New student? {" "} <span onClick={() => navigate("/register")} style={{ color: "red", cursor: "pointer" }}>Register here</span></p>
      </div>
    </div>
  );
}

export default Login;
