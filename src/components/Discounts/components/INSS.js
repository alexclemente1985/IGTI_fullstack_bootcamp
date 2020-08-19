import React, { Component } from 'react';
import InputContainer from "../../InputContainer/inputContainer";

export default class INSS extends Component {
    constructor() {
        super();
        this.state = {
            inssBase: 0,
            firstCeil: 0,
            secondCeil: 0,
            thirdCeil: 0,
            firstRange: 0.075 * 1045,
            secondRange: (2089.6 - 1045) * 0.09,
            thirdRange: (3134.4 - 2089.6) * 0.12,
            inssPerc: 0
        }
    }

    componentDidMount() {
        const { firstRange, secondRange, thirdRange } = this.state;
        const firstCeil = firstRange;
        const secondCeil = firstCeil + secondRange;
        const thirdCeil = secondCeil + thirdRange;

        this.setState({ firstCeil, secondCeil, thirdCeil });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.grossSalary !== this.props.grossSalary) {
            this.handleDiscount();
        }
        if (prevProps.grossSalary !== this.props.grossSalary || prevState.inssBase !== this.state.inssBase) {
            if (!!this.state.inssBase) {
                const { setINSS } = this.props;
                setINSS(this.state.inssBase);
                this.setIRPFPerc(this.state.inssBase);
            }
        }
    }

    setIRPFPerc = (inssBase) => {
        const { grossSalary, setINSSDiscountPerc } = this.props;
        const inssPercCalc = !!inssBase && (grossSalary !== 0 && !!grossSalary) ? ((inssBase / grossSalary) * 100).toFixed(2) : 0;

        this.setState({ inssPerc: inssPercCalc });
        setINSSDiscountPerc(inssPercCalc);
    }

    handleDiscount = () => {
        const { grossSalary } = this.props;
        const { firstCeil, secondCeil, thirdCeil } = this.state;

        if (!grossSalary) {
            this.setState({ inssBase: 0 })
        }
        else if (grossSalary <= 1045) {
            this.setState({ inssBase: (0.075 * (grossSalary)) });
        } else if (grossSalary > 1045 && grossSalary <= 2089.6) {
            this.setState({ inssBase: (firstCeil + (grossSalary - 1045) * 0.09) });
        } else if (grossSalary > 2089.6 && grossSalary <= 3134.4) {
            this.setState({ inssBase: (secondCeil + (grossSalary - 2089.6) * 0.12) });
        } else if (grossSalary > 3134.4 && grossSalary <= 6101.06) {
            this.setState({ inssBase: (thirdCeil + (grossSalary - 3134.4) * 0.14) });
        } else {
            this.setState({ inssBase: 713.1 });
        }
    }
    render() {
        const { inssBase, inssPerc } = this.state;
        const { grossSalary } = this.props;
        return (
            <div className="flexRow">
                <InputContainer inputId="inss" classNameValue="inss" labelName="Base INSS: " disabled value={grossSalary} />
                <InputContainer inputId="desc-inss" classNameValue="desc-inss" labelName="Desconto INSS: " disabled value={inssBase} percValue={inssPerc} />
            </div>
        )
    }
}
