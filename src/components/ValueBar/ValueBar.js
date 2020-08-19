import React, { Component } from 'react';
import "./valuebar.css";

export default class ValueBar extends Component {
    constructor() {
        super();
        this.state = {
            inssBar: null,
            irpfBar: null,
            salaryBar: null,
            fullBar: null,
            animation: true
        }
    }

    componentDidMount() {
        const inssBar = document.querySelector("#INSS");
        const irpfBar = document.querySelector("#IRPF");
        const salaryBar = document.querySelector("#salary");
        const fullBar = document.querySelector("#fullBar");
        inssBar.style.width = "0%";
        irpfBar.style.width = "0%";
        salaryBar.style.width = "0%";

        this.setState({
            inssBar,
            irpfBar,
            salaryBar,
            fullBar
        })

    }

    componentDidUpdate(prevProps, prevState) {
        const { inssBar, irpfBar, salaryBar } = this.state;
        const { INSSDiscountPerc, IRPFDiscountPerc, FinalSalaryPerc } = this.props;

        if (prevProps.INSSDiscountPerc !== INSSDiscountPerc) {
            inssBar.style.width = `${INSSDiscountPerc}%`
        }
        if (prevProps.IRPFDiscountPerc !== IRPFDiscountPerc) {
            irpfBar.style.width = `${IRPFDiscountPerc}%`
        }
        if (prevProps.FinalSalaryPerc !== FinalSalaryPerc) {
            salaryBar.style.width = `${FinalSalaryPerc}%`
        }
    }

    render() {
        return (
            <div id="fullBar" className="valueBarContainer">
                <span id="INSS" className="INSSDiscountsBar" />
                <span id="IRPF" className="IRPFDiscountsBar" />
                <span id="salary" className="finalSalaryBar" />
            </div>
        )
    }
}
