import React, { Component } from 'react';
import "./App.css";
import Discounts from "./components/Discounts/Discounts";
import FinalSalary from "./components/FinalSalary/FinalSalary";
import InputContainer from "./components/InputContainer/inputContainer";
import ValueBar from "./components/ValueBar/ValueBar";


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      grossSalary: 0,
      IRPFDiscount: 0,
      baseSalary: 0,
      finalSalary: 0,
      IRPFDiscountPerc: 0,
      INSSDiscountPerc: 0,
      FinalSalaryPerc: 0,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.grossSalary !== 0 && (prevState.baseSalary !== this.state.baseSalary || prevState.IRPFDiscount !== this.state.IRPFDiscount)) {
      this.setFinalSalary();
    }
  }

  setGrossSalary = (salary) => {
    this.setState({ grossSalary: salary });
  }
  setIRPFDiscount = (discount) => {
    this.setState({ IRPFDiscount: discount });
  }
  setBaseSalary = (baseSalary) => {
    this.setState({ baseSalary })
  }

  setFinalSalary = () => {
    const { IRPFDiscount, baseSalary } = this.state;
    this.setState({ finalSalary: (baseSalary - IRPFDiscount).toFixed(2) });
  }
  setIRPFDiscountPerc = (IRPFDiscountPerc) => {
    this.setState({ IRPFDiscountPerc })
  }
  setINSSDiscountPerc = (INSSDiscountPerc) => {
    this.setState({ INSSDiscountPerc });
  }
  setFinalSalaryPerc = (FinalSalaryPerc) => {
    this.setState({ FinalSalaryPerc });
  }
  render() {
    const { grossSalary, finalSalary, FinalSalaryPerc, IRPFDiscountPerc, INSSDiscountPerc } = this.state;
    return (
      <div className="container formattedContainer">
        <InputContainer inputId="gross-salary" setGrossSalary={this.setGrossSalary} />
        <Discounts
          grossSalary={parseFloat(grossSalary) ? parseFloat(grossSalary) : 0}
          setIRPFDiscount={this.setIRPFDiscount}
          setBaseSalary={this.setBaseSalary}
          setIRPFDiscountPerc={this.setIRPFDiscountPerc}
          setINSSDiscountPerc={this.setINSSDiscountPerc}

        />
        <FinalSalary
          grossSalary={parseFloat(grossSalary) ? parseFloat(grossSalary) : 0}
          salary={finalSalary}
          setFinalSalaryPerc={this.setFinalSalaryPerc}
        />
        <ValueBar
          FinalSalaryPerc={FinalSalaryPerc}
          INSSDiscountPerc={INSSDiscountPerc}
          IRPFDiscountPerc={IRPFDiscountPerc}
        />



      </div>
    )
  }

}


