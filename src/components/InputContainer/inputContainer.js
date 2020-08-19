import React, { Component } from 'react';
import "./inputContainer.css";

export default class InputContainer extends Component {

    handleChange = (event) => {
        const { setGrossSalary } = this.props;
        const grossSalary = event.target.value;

        setGrossSalary(parseFloat(grossSalary));
    }

    formatValue = (percValue, value) => {
        return percValue ? `${value} (${percValue}%)` : value;
    }

    render() {
        const { inputId, classNameValue, labelName, value, percValue } = this.props;
        const IntlValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        return (
            <>
                {inputId === "gross-salary" ? (
                    <div className="input-field input-container">
                        <input className={`input `} type="number" id={inputId} onChange={this.handleChange} />
                        <label className="active input-label " htmlFor={inputId} >Salário Base: </label>
                    </div>
                ) : (
                        <div className="input-field input-container">
                            <input disabled className={`input ${classNameValue ? classNameValue : ''}`} type="text" id={inputId} value={this.formatValue(percValue, IntlValue)} />
                            <label className="active input-label " htmlFor={inputId} >{labelName}</label>
                        </div>
                    )}

            </>
        )
    }
}
