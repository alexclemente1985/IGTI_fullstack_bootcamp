import React, { Component } from 'react';
import InputContainer from "../../InputContainer/inputContainer";

export default class IRPF extends Component {
    constructor() {
        super();
        this.state = {
            irpfBase: '',
            baseSalary: 0,
            irpfPerc: 0,
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.grossSalary !== this.props.grossSalary || this.props.inss !== prevProps.inss) {
            this.handleDiscount();
        }
        if (prevProps.grossSalary !== this.props.grossSalary || prevState.baseSalary !== this.state.baseSalary) {
            const { setBaseSalary } = this.props;
            const { baseSalary } = this.state;
            this.setIRPFBase(baseSalary);
            setBaseSalary(baseSalary);


        }
        if (prevState.irpfBase !== this.state.irpfBase || prevState.baseSalary !== this.state.baseSalary) {
            const { setIRPFDiscount } = this.props;
            const { irpfBase } = this.state;
            setIRPFDiscount(irpfBase);
            this.setIRPFPerc(irpfBase);
        }

        if (prevState.irpfPerc !== this.state.irpfPerc) {
            const { setIRPFDiscountPerc } = this.props;
            setIRPFDiscountPerc(this.state.irpfPerc);
        }

    }
    setIRPFPerc = (irpfBase) => {
        const { grossSalary } = this.props;
        const irpfPercCalc = irpfBase && grossSalary ? ((irpfBase / grossSalary) * 100).toFixed(2) : 0;
        this.setState({ irpfPerc: irpfPercCalc });
    }

    handleDiscount = () => {
        const { grossSalary, inss } = this.props;
        const baseSalary = grossSalary ? (grossSalary - inss).toFixed(2) : 0;
        this.setState({ baseSalary: grossSalary ? baseSalary : 0 });


    }

    setIRPFBase = (baseSalary) => {

        if (baseSalary === 0) {
            this.setState({ irpfBase: '' })
        }
        else if (baseSalary < 1903.99) {
            this.setState({ irpfBase: 0 });
        } else if (baseSalary >= 1903.99 && baseSalary < 2826.66) {
            this.setState({ irpfBase: ((0.075 * (baseSalary)) - 142.80).toFixed(2) });

        } else if (baseSalary >= 2826.66 && baseSalary < 3751.06) {
            this.setState({ irpfBase: ((0.15 * (baseSalary)) - 354.8).toFixed(2) });
        } else if (baseSalary >= 3751.06 && baseSalary < 4664.69) {
            this.setState({ irpfBase: ((0.225 * (baseSalary)) - 636.13).toFixed(2) });
        } else {
            this.setState({ irpfBase: ((0.275 * (baseSalary)) - 869.36).toFixed(2) });
        }
    }
    render() {
        const { irpfBase, baseSalary, irpfPerc } = this.state;
        return (
            <div className="flexRow">
                <InputContainer inputId="irpf" classNameValue="irpf" labelName="Base IRPF: " disabled value={baseSalary} />
                <InputContainer inputId="desc-irpf" classNameValue="desc-irpf" labelName="Desconto IRPF: " disabled value={irpfBase} percValue={irpfPerc} />
            </div>
        )
    }
}
