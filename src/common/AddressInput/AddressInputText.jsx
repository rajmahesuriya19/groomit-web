import React, { useEffect, useState } from "react";
import Location from '../../assets/icon/location.svg';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const AddressInputText = ({ value, onChange, label, error, onSelect }) => {
    const [internalValue, setInternalValue] = useState(null);

    // Sync RHF value
    useEffect(() => {
        if (typeof value === "string" && value.trim() !== "") {
            setInternalValue({ label: value, value });
        } else {
            setInternalValue(null);
        }
    }, [value]);

    return (
        <div className="relative w-full">
            {/* Icon */}
            <img
                src={Location}
                alt="Location"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[24px] h-[24px] z-20"
            />

            {/* Floating label (same as CustomInput) */}
            <label
                className={`absolute top-[10px] left-[15px] text-[12px] font-inter pointer-events-none z-10
          ${error ? "text-[#EB5757]" : "text-[#7C868A]"}`}
            >
                {label}
            </label>

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
                    placeholder: "",
                    options: { componentRestrictions: { country: "us" } },
                    components: {
                        DropdownIndicator: null,
                        IndicatorSeparator: null,
                    },
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            minHeight: "56px",
                            padding: "15px",
                            borderRadius: "10px",
                            backgroundColor: "#FBFBFB",
                            border: error ? "1px solid #EB5757 !important" : "1px solid #BEC3C5 !important",
                            boxShadow: "none",
                            alignItems: "center",
                            cursor: "text",
                        }),
                        valueContainer: (provided) => ({
                            ...provided,
                            padding: 0,
                            marginTop: "12px",
                        }),
                        input: (provided) => ({
                            ...provided,
                            margin: 0,
                            padding: 0,
                            color: "#2E2E2E",
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: 400,
                        }),
                        placeholder: () => ({
                            display: "none",
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            margin: 0,
                            padding: 0,
                            color: "#2E2E2E",
                            fontFamily: "Inter",
                            fontSize: "14px",
                        }),
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                            borderRadius: "10px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            padding: "10px 15px",
                            fontSize: "14px",
                            backgroundColor: state.isFocused ? "#F3F4F6" : "#fff",
                            color: "#2E2E2E",
                            cursor: "pointer",
                        }),
                    },
                }}
            />
        </div>
    );
};

export default AddressInputText;
