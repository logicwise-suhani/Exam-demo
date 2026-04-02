function Options({ options, selected, onSelect }) {
    return options.map((opt, i) => (
        <div key={i}>
            <input
                type="radio"
                checked={selected === i}
                onChange={() => onSelect(i)}
            />
            <label>{opt}</label>
        </div>
    ));
}
 
export default Options;