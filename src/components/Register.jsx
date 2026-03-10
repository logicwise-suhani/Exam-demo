import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();

    const validate = (values) => {
        const errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values.email)) {
            errors.email = "Invalid email address";
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(values.password)) {
            errors.password =
                "Password must be 8+ chars, include upper, lower & number";
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...data, [name]: value };
        setData(updated);
        setErrors(validate(updated));
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleRegister = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(u => u.email === data.email);
        if (exists) {
            alert("User already registered. Please Login");
            return;
        }

        users.push({
            email: data.email,
            password: data.password,
            role: "student"
        });

        localStorage.setItem("users", JSON.stringify(users));
        navigate("/login");
    };

    const isValid =
        Object.keys(errors).length === 0 &&
        data.email &&
        data.password;

    const alreadyRegistered = () => {
        const loggedUser = JSON.parse(localStorage.getItem("user")) || [];

        if (loggedUser) {
            navigate("/login");
            console.log("Logged in as: ", loggedUser.email);
        }

    }

    return (
        <div>
            <h2>Register</h2>

            <input
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <span>{touched.email && errors.email}</span>

            <br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <span>{touched.password && errors.password}</span>

            <br /> <br />

            <button onClick={handleRegister} disabled={!isValid}>
                Register
            </button>
            <br /> <br />
            <p>Already registered? <span onClick={alreadyRegistered} style={{ cursor: "pointer", color: "red" }}>Please Login</span></p>
        </div>
    );
}

export default Register;
