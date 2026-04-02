import { useState } from "react";

function useFormValidation(initialValues, validateFn) {
    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e, extraCallback) => {
        const { name, value } = e.target;
        const updated = { ...data, [name]: value };

        setData(updated);
        setErrors(validateFn(updated));

        if (extraCallback) extraCallback();
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    return {
        data,
        setData,
        errors,
        touched,
        handleChange,
        handleBlur,
    };
}

export default useFormValidation;
