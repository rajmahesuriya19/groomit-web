import React from "react";

const CommonActionButton = ({
    children,
    onClick,
    borderColor = "border-primary-dark",
    textColor = "text-primary-dark",
    className = "",
    type = "button",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full flex h-[38px] py-2 px-4 justify-center items-center rounded-[10px] border ${borderColor} text-base capitalize font-semibold ${textColor} ${className}`}
        >
            {children}
        </button>
    );
};

export default CommonActionButton;
