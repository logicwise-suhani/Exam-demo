import { useNavigate } from "react-router-dom";
import Buttons from "../../components/layout/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

function Auth() {
    const navigate = useNavigate();

    return (
        <>
            <div className="auth">
                <FontAwesomeIcon icon={faUserSlash} className="icon" />
                <h2>Permission Denied</h2>
                <p>You can't access this page</p>
                <Buttons onClick={() => navigate("/")} label="Home" />
            </div>

        </>
    )
}

export default Auth;