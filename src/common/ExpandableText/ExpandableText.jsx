import { useState } from "react";

const ExpandableText = ({ text, limit = 180 }) => {
    const [expanded, setExpanded] = useState(false);

    const isLong = text.length > limit;
    const displayedText = expanded || !isLong
        ? text
        : text.slice(0, limit) + "...";

    return (
        <div className="text-sm font-normal font-inter">
            {displayedText}

            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-2 font-semibold underline text-[#3064a3]"
                >
                    {expanded ? "Read less" : "Read more"}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
