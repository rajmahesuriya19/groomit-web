import React, { createContext, useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";

export const TwilioContext = createContext(null);

const TwilioProvider = ({ children }) => {
    const [device, setDevice] = useState(null);
    const [call, setCall] = useState(null);
    const [callInProgress, setCallInProgress] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        let twilioDevice;

        const initDevice = async () => {
            try {
                // 🔥 Replace with your token API
                const response = await fetch("https://groomit-rn-4528.twil.io/access-token");
                const token = await response.text();

                twilioDevice = new Device(token, {
                    debug: true,
                });

                twilioDevice.on("registered", () => {
                    console.log("Twilio Device Registered ✅");
                });

                twilioDevice.on("error", (error) => {
                    console.error("Twilio Device Error:", error);
                });

                twilioDevice.on("incoming", (incoming) => {
                    console.log("Incoming Call 📞");

                    setIncomingCall(incoming);

                    incoming.on("disconnect", () => {
                        setIncomingCall(null);
                        setCallInProgress(false);
                    });
                });

                await twilioDevice.register();
                setDevice(twilioDevice);

            } catch (err) {
                console.error("Device Init Error:", err);
            }
        };

        initDevice();

        return () => {
            if (twilioDevice) {
                twilioDevice.destroy();
            }
        };
    }, []);

    // ---------------- OUTGOING CALL ----------------
    const makeCall = async (to) => {
        if (!device) {
            console.log("Device not ready");
            return;
        }

        try {
            console.log("Dialing:", to);

            const newCall = await device.connect({
                params: { To: to },
            });

            newCall.on("ringing", () => {
                console.log("Ringing...");
            });

            newCall.on("accept", () => {
                console.log("Call Accepted 🔥");
            });

            newCall.on("disconnect", () => {
                console.log("Call Ended");
                setCall(null);
                setCallInProgress(false);
            });

            newCall.on("error", (err) => {
                console.error("Call Error:", err);
            });

            setCall(newCall);
            setCallInProgress(true);

        } catch (err) {
            console.error("Make Call Error:", err);
        }
    };

    // ---------------- ACCEPT INCOMING ----------------
    const acceptCall = () => {
        if (incomingCall) {
            incomingCall.accept();
            setCall(incomingCall);
            setIncomingCall(null);
            setCallInProgress(true);
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            incomingCall.reject();
            setIncomingCall(null);
        }
    };

    // ---------------- HANGUP ----------------
    const hangup = () => {
        if (call) {
            call.disconnect();
        }
        setCall(null);
        setCallInProgress(false);
    };

    return (
        <TwilioContext.Provider
            value={{
                makeCall,
                hangup,
                acceptCall,
                rejectCall,
                callInProgress,
                incomingCall,
            }}
        >
            {children}
        </TwilioContext.Provider>
    );
};

export default TwilioProvider;