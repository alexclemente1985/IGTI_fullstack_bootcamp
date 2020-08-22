import React, { useCallback, useEffect, useState } from 'react';
import "./Installment.css";

export default function Installment(props) {
    const { number, capital, mensalTax } = props;
    const [amountValue, setAmountValue] = useState(0);
    const [interestValue, setInterestValue] = useState(0);

    const amountCalc = useCallback(() => {
        return capital * (Math.pow((1 + (mensalTax / 100)), number))
    }, [capital, mensalTax, number])

    const interestCalc = useCallback(() => {
        return amountValue - capital;
    }, [amountValue, capital])

    const formatValue = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const finalTax = () => {
        return interestValue && capital ? `${((interestValue / capital) * 100).toFixed(2).toString().replace('.', ',')}%` : '0,00%';
    }

    const setValueClassname = () => {
        return mensalTax >= 0 ? 'value-row' : 'negative-value-row';
    }

    const setTaxClassname = () => {
        return mensalTax >= 0 ? 'mensal-tax' : 'negative-mensal-tax';
    }

    useEffect(() => {
        setAmountValue(amountCalc());
    }, [amountCalc]);

    useEffect(() => {
        setInterestValue(interestCalc())
    }, [interestCalc]);

    return (
        <div className="installment-container">
            <span className="installment-number">{number}</span>
            <div className="installment-content">
                <span className={`${setValueClassname()}`}>{formatValue(amountValue)}</span>
                <span className={`${setValueClassname()}`}>{formatValue(interestValue)}</span>
                <span className={`${setTaxClassname()}`}>{finalTax()}</span>
            </div>
        </div>
    )
}
