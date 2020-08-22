import React from 'react';
import "./Installments.css";

export default function Installments(props) {
    const { children } = props;

    return (
        <div className="installments">
            {children}
        </div>
    )
}
