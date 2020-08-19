import React, { Component } from 'react';
import InputContainer from "../InputContainer/inputContainer";
import "./FinalSalary.css";

export default class FinalSalary extends Component {
    constructor() {
        super();
        this.state = {
            finalSalaryPerc: 0
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.salary !== this.props.salary) {
            this.setFinalSalaryPerc(this.props.salary)
        }
        if (prevState.finalSalaryPerc !== this.state.finalSalaryPerc) {
            const { setFinalSalaryPerc } = this.props;
            setFinalSalaryPerc(this.state.finalSalaryPerc);
        }
    }

    setFinalSalaryPerc = (salary) => {
        const { grossSalary } = this.props;
        const finalSalaryPercCalc = salary && grossSalary ? ((salary / grossSalary) * 100).toFixed(2) : 0;

        this.setState({ finalSalaryPerc: finalSalaryPercCalc });
    }

    render() {
        const { salary } = this.props
        const { finalSalaryPerc } = this.state;
        return (
            <div className="final-salary-container">
                <InputContainer
                    inputId="final-salary"
                    classNameValue="final-salary"
                    labelName="Salário Líquido: "
                    disabled
                    value={salary}
                    percValue={finalSalaryPerc}

                />
                <InputContainer
                    classNameValue="final-salary-hidden"
                    disabled
                />
                <InputContainer
                    classNameValue="final-salary-hidden"
                    disabled
                />
                <InputContainer
                    classNameValue="final-salary-hidden"
                    disabled
                />

            </div>
        )
    }
}
