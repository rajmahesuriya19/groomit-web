import React, { useContext } from "react";
import { TwilioContext } from "@/contexts/TwilioProvider/TwilioProvider";

const DemoCall = () => {
    const {
        makeCall,
        hangup,
        callInProgress,
        incomingCall,
        acceptCall,
        rejectCall,
    } = useContext(TwilioContext);

    const MY_NUMBER = "+918000143004";

    return (
        <div style={{ padding: 30 }}>
            <h2>Twilio Demo Call</h2>

            {/* OUTGOING */}
            {!callInProgress && !incomingCall && (
                <button
                    onClick={() => makeCall(MY_NUMBER)}
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
            )}

            {/* HANGUP */}
            {callInProgress && (
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

            {/* INCOMING */}
            {incomingCall && (
                <div style={{ marginTop: 20 }}>
                    <p>Incoming Call...</p>

                    <button
                        onClick={acceptCall}
                        style={{
                            padding: "8px 16px",
                            background: "green",
                            color: "white",
                            border: "none",
                            marginRight: 10,
                        }}
                    >
                        Accept
                    </button>

                    <button
                        onClick={rejectCall}
                        style={{
                            padding: "8px 16px",
                            background: "red",
                            color: "white",
                            border: "none",
                        }}
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default DemoCall;