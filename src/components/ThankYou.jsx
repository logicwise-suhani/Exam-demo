import { useNavigate } from "react-router-dom";

function ThankYou() {
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("remainingTime");
        navigate("/login");
    };

    return (
        <>
            <h3>Thank you for Giving exam!</h3>

            <br />
            <p onClick={() => navigate("/result")} style={{ color: "red", cursor: "pointer" }}>Click to show result</p>

            <br />
            <button onClick={() => navigate(-1)}>Back</button> {" "}
            <button onClick={() => navigate("/selectSubject")}>
                Give another Test
            </button>{" "}
            <button onClick={handleLogOut}>LogOut</button>
        </>
    );
}

export default ThankYou;