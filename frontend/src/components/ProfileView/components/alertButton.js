import React from "react";
import "./alertButton.scss";

const AlertButton = ({ type, component, func }) => {
    return (
        <div className="page">
            <div className={`background ${type}`}>
                {component}
            </div>
            <div className="background-blur" onClick={func}></div>
        </div>
    );
};

export default AlertButton;
