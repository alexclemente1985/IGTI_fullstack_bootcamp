import React, { Component } from 'react';
import INSS from "./components/INSS";
import IRPF from "./components/IRPF";
import "./Discounts.css";

export default class Discounts extends Component {
    constructor() {
        super();
        this.state = {
            inss: 0,
            irpf: 0,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.irpf !== 0 && prevProps.irpf !== this.state.irpf) {
            const { setIRPFDiscount } = this.props;
            const { irpf } = this.state;
            setIRPFDiscount(irpf);
        }
    }

    handleINSS = (value) => {
        this.setState({ inss: value });
    }

    render() {
        const { grossSalary, setBaseSalary, setIRPFDiscount, setIRPFDiscountPerc, setINSSDiscountPerc } = this.props;
        const { inss } = this.state;
        return (
            <div className="flexRow">
                <INSS
                    grossSalary={grossSalary}
                    setINSS={this.handleINSS}
                    setINSSDiscountPerc={setINSSDiscountPerc} />
                <IRPF
                    grossSalary={grossSalary}
                    inss={inss}
                    setBaseSalary={setBaseSalary}
                    setIRPFDiscount={setIRPFDiscount}
                    setIRPFDiscountPerc={setIRPFDiscountPerc} />
            </div>
        )
    }
}
