import { useNavigate } from "react-router-dom";
import useFormValidation from "../hooks/useError";;

function Register() {
    const navigate = useNavigate();
    const { data, errors, touched, handleChange, handleBlur } = useFormValidation({
        email: "",
        password: ""
    }, validate);

    function validate(values) {
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
        }
    }

    return (
        <div>
            <h2>Register</h2>

            <div className="login">
                <input
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <span>{touched.email && errors.email}</span>

                <br /> <br />
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
        </div>
    );
}

export default Register;
