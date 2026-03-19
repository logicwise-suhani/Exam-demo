import { useNavigate } from "react-router-dom";

function ThankYou() {

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <>
            <h3>Thank you for Giving exam!</h3>
            <br />
            <p>Result in 5 minutes</p>
            <br />
            <button onClick={() => navigate("/selectSubject")}>Give another Test</button> {" "}
            <button onClick={handleLogOut}>LogOut</button>
        </>
    )

}

export default ThankYou;