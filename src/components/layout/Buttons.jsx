const Buttons = ({ onClick, label = "Back" }) => {

    return <button onClick={onClick}>{label}</button>
}

export default Buttons;  