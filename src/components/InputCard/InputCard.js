import React, { useCallback, useEffect, useState } from 'react';
import "./InputCard.css";

export default function InputCard(props) {
    const { inputId, labelName, setValue } = props;
    const [className, setClassName] = useState('');
    const [inputValue, setInputValue] = useState(0)

    const handleChange = (event) => {
        const value = event.target.value;
        if (value) {
            setValue(parseFloat(value));
            setInputValue(parseFloat(value));
        } else {
            setValue(0);
            setInputValue(0);
        }
    }
    const handleClassNames = useCallback(() => {
        switch (inputId) {
            case 'capital':
                return inputValue < 0 ? 'negative-capital' : '';
            case 'tax':
                return inputValue < 0 ? 'negative-tax' : '';
            default:
                break;
        }
    }, [inputId, inputValue])

    useEffect(() => {
        setClassName(handleClassNames());
    }, [handleClassNames])

    return (
        <div key={inputId} className={`input-field input-card-container ${className}`}>
            <input type="number" id={inputId} className={className} onChange={handleChange} />
            <label htmlFor={inputId}>{labelName}</label>
        </div>
    )
}
