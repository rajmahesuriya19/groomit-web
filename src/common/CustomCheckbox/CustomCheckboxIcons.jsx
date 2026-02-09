import React from "react";
import { Check } from "lucide-react";

const baseStyle = {
    width: 22,
    height: 22,
    borderRadius: 6,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

export const CheckboxIcon = ({
    checked = false,
    disabled = false,
}) => {
    if (checked) {
        return (
            <span
                style={{
                    ...baseStyle,
                    backgroundColor: "#FF314A",
                }}
            >
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </span>
        );
    }

    return (
        <span
            style={{
                ...baseStyle,
                border: "2px solid #BFC5C8",
                backgroundColor: disabled ? '#BEC3C5' : "#FFFFFF",
                opacity: disabled ? 0.6 : 1,
            }}
        />
    );
};
