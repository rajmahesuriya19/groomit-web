import React from "react";

const BookingFooter = ({
    onClick,
    disabled = false,
    buttonText = "Next",
    maxWidth = "390px",
}) => {
    return (
        <div
            className="fixed bottom-0 left-0 w-full bg-white z-10"
            style={{
                boxShadow: "0 0 30px rgba(0,0,0,0.10)",
                padding: "15px 20px 25px",
            }}
        >
            <div className="flex justify-center items-center">
                <button
                    disabled={disabled}
                    onClick={onClick}
                    className={`h-[50px] rounded-[10px] font-bold transition text-white w-full`}
                    style={{ maxWidth }}
                >
                    <span
                        className={`w-full h-full rounded-[10px] flex items-center justify-center
              ${disabled
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-primary-dark"
                            }
            `}
                    >
                        {buttonText}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default BookingFooter;
