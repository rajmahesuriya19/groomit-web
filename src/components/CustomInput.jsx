import { styled, TextField } from "@mui/material";

export const CustomInput = styled(TextField)(() => ({
    "& .MuiOutlinedInput-root": {
        display: "flex",
        padding: "15px",
        borderRadius: "10px",
        background: "#FBFBFB",
        border: "1px solid #BEC3C5",
        alignItems: "center",

        "& fieldset": {
            border: "none",
        },

        "& input": {
            padding: "0",
            marginTop: "12px",
            color: "#2E2E2E",
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 400,

            /* 🔥 AUTOFILL FIX */
            "&:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0px 1000px #FBFBFB inset",
                WebkitTextFillColor: "#2E2E2E",
                caretColor: "#2E2E2E",
                borderRadius: "10px",
                transition: "background-color 9999s ease-out 0s",
            },

            "&:-webkit-autofill:focus": {
                WebkitBoxShadow: "0 0 0px 1000px #FBFBFB inset",
                WebkitTextFillColor: "#2E2E2E",
            },

            "&:-webkit-autofill:hover": {
                WebkitBoxShadow: "0 0 0px 1000px #FBFBFB inset",
            },
        },
    },

    "& .MuiInputLabel-root": {
        position: "absolute",
        top: "10px",
        left: "15px",
        transform: "none !important",
        fontSize: "12px",
        fontFamily: "Inter",
        color: "#7C868A",
        pointerEvents: "none",

        "&.Mui-focused": {
            color: "#7C868A",
        },
    },

    "& .MuiInputLabel-shrink": {
        transform: "none !important",
    },

    /* Error label color */
    "& .Mui-error": {
        color: "#EB5757 !important",
    },
}));