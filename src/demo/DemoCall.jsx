import React, { useContext } from "react";
import { TwilioContext } from "@/contexts/TwilioProvider/TwilioProvider";

const DemoCall = () => {
    const { makeCall, hangup, callInProgress } = useContext(TwilioContext);

    const MY_NUMBER = "+918000143004";

    const handleCall = () => {
        console.log("Calling myself...");
        makeCall(MY_NUMBER, "Boss");
    };

    return (
        <div style={{ padding: 30 }}>
            <h2>Twilio Demo Call</h2>

            {!callInProgress ? (
                <button
                    onClick={handleCall}
                    style={{
                        padding: "10px 20px",
                        background: "green",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Call My Phone
                </button>
            ) : (
                <button
                    onClick={hangup}
                    style={{
                        padding: "10px 20px",
                        background: "red",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Hang Up
                </button>
            )}
        </div>
    );
};

export default DemoCall;