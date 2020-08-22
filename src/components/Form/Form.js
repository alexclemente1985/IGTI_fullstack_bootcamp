import React, { Fragment } from 'react';
import "./Form.css";

export default function Form(props) {
    const { formFields } = props;
    return (

        <div className="form">
            {formFields.map((field, index) => {
                return <Fragment key={index}>{field}</Fragment>
            })}
        </div>


    )
}
