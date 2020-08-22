import React, { Fragment, useEffect, useState } from 'react';
import "./App.css";
import Form from './components/Form/Form';
import InputCard from "./components/InputCard/InputCard";
import Installment from "./components/Installments/components/Installment";
import Installments from "./components/Installments/Installments";

function App() {
  const [capital, setCapital] = useState(0);
  const [mensalTax, setMensalTax] = useState(0);
  const [period, setPeriod] = useState(0);

  const capitalInput = <InputCard inputId="capital" labelName="Capital Inicial" setValue={setCapital} />
  const taxInput = <InputCard inputId="tax" labelName="Taxa de Juros Mensal" setValue={setMensalTax} />
  const periodInput = <InputCard inputId="period" labelName="Período" setValue={setPeriod} />

  const formFieldsArray = [capitalInput, taxInput, periodInput];

  const [installmentCards, setInstallmentCards] = useState([]);

  useEffect(() => {
    const cards = [];
    for (let i = 1; i <= period; i++) {
      (capital && mensalTax) && cards.push(<Installment number={i} capital={capital} mensalTax={mensalTax} />)
    }
    setInstallmentCards(cards);
  }, [capital, mensalTax, period])

  return (
    <div className="container formattedContainer">
      <span className="title">React - Juros Compostos</span>
      <Form formFields={formFieldsArray} />
      {installmentCards.length > 0 && (
        <Installments>
          {installmentCards.map((installment, index) => <Fragment key={index}>{installment}</Fragment>)}
        </Installments>)}
    </div>
  );
}

export default App;
