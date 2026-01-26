import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import SuccessIcon from "../assets/icon/tick-green.svg";

const StepAccordion = ({
    stepId,
    openStep,
    onToggle,
    title,
    description,
    showSuccess,
    children,
}) => {
    const isOpen = openStep === stepId;

    /* ✅ OPEN → NORMAL CARD */
    if (isOpen) {
        return (
            <div className="bg-white rounded-[15px] overflow-hidden">
                {children}
            </div>
        );
    }

    /* ❌ CLOSED → ACCORDION */
    return (
        <Accordion
            expanded={false}
            disableGutters
            elevation={0}
            sx={{
                background: "transparent",
                "&:before": { display: "none" },
                "& .MuiAccordionSummary-root": { padding: 0 },
                "& .MuiAccordionSummary-content": { margin: 0 },
            }}
        >
            <AccordionSummary onClick={() => onToggle(stepId)}>
                <AccordionHeader
                    title={title}
                    description={description}
                    showSuccess={showSuccess}
                />
            </AccordionSummary>

            <AccordionDetails sx={{ padding: 0 }} />
        </Accordion>
    );
};

/* 🔹 HEADER */
const AccordionHeader = ({ title, description, showSuccess }) => {
    return (
        <div className="flex p-[15px] bg-white rounded-[15px] w-full items-center justify-between cursor-pointer">
            <div>
                <h2 className="font-bold text-base text-primary-dark">
                    {title}
                </h2>
                {description && (
                    <span className="text-sm text-primary-dark">
                        {description}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {showSuccess && (
                    <img
                        src={SuccessIcon}
                        alt="Success"
                        className="w-6 h-6"
                    />
                )}

                <div className="flex bg-[#F2F2F2] items-center justify-center rounded-[10px] p-[7px]">
                    <ChevronDown size={22} />
                </div>
            </div>
        </div>
    );
};

export default StepAccordion;
