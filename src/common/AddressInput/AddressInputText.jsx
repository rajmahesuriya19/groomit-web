import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const AddressInputText = ({ value, onChange, placeholder, error, onSelect }) => {
    const [internalValue, setInternalValue] = useState(null);

    // 🔄 Sync internalValue whenever RHF value changes
    useEffect(() => {
        if (typeof value === "string" && value.trim() !== "") {
            setInternalValue({ label: value, value });
        } else {
            setInternalValue(null);
        }
    }, [value]);

    return (
        <div className="relative w-full">
            <GooglePlacesAutocomplete
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API}
                selectProps={{
                    value: internalValue,
                    onChange: (selected) => {
                        if (!selected) {
                            setInternalValue(null);
                            onChange("");
                            return;
                        }

                        setInternalValue(selected);
                        onChange(selected.label || "");
                        onSelect?.(selected);
                    },
                    placeholder: placeholder || "123 Main Street",
                    options: { componentRestrictions: { country: "us" } },
                    components: { DropdownIndicator: null, IndicatorSeparator: null },
                    styles: {
                        input: (provided) => ({
                            ...provided,
                            width: "100%",
                            minWidth: "0",
                            padding: "8px 16px",
                            fontSize: "1rem",
                            lineHeight: "21px",
                            fontFamily: "Inter, sans-serif",
                            borderRadius: "0.375rem",
                            border: error ? "1px solid #ef4444" : "1px solid #E2E2E2",
                            color: "#2E2E2E",
                            outline: "none",
                            margin: 0,
                        }),
                        valueContainer: (provided) => ({ ...provided, padding: 0 }),
                        placeholder: (provided) => ({ ...provided, padding: "0 15px" }),
                        singleValue: (provided) => ({ ...provided, padding: "0 15px" }),
                        control: (provided) => ({ ...provided, boxShadow: "none", border: "none", minHeight: "unset" }),
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            borderRadius: "0.375rem",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            padding: "0.6rem 1rem",
                            borderRadius: "0.5rem",
                            fontSize: "0.9rem",
                            color: "#2E2E2E",
                            backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
                            "&:active": { backgroundColor: "#ef4444", color: "#fff" },
                        }),
                    },
                }}
            />
        </div>
    );
};

export default AddressInputText;
