import React, { createContext, useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";

export const TwilioContext = createContext(null);

const TwilioProvider = ({ children }) => {
    const [device, setDevice] = useState(null);
    const [call, setCall] = useState(null);
    const [callInProgress, setCallInProgress] = useState(false);
    const [ownerName, setOwnerName] = useState("");

    useEffect(() => {
        const initDevice = async () => {
            try {
                const response = await fetch("https://groomit-rn-4528.twil.io/access-token");
                const token = await response.text();

                console.log("TOKEN:", token);

                const twilioDevice = new Device(token, {
                    debug: true,
                });

                twilioDevice.on("registered", () => {
                    console.log("Twilio Device Registered ✅");
                });

                twilioDevice.on("error", (error) => {
                    console.error("Twilio Device Error:", error);
                });

                twilioDevice.on("incoming", (incomingCall) => {
                    console.log("Incoming Call");
                    setCall(incomingCall);
                    setCallInProgress(true);
                });

                twilioDevice.on("disconnect", () => {
                    setCall(null);
                    setCallInProgress(false);
                    setOwnerName("");
                });

                await twilioDevice.register();

                setDevice(twilioDevice);

            } catch (err) {
                console.error("Init Error:", err);
            }
        };

        initDevice();
    }, []);

    const makeCall = async (to, name) => {
        if (!device) {
            console.log("Device not ready yet");
            return;
        }

        try {
            console.log("Dialing:", to);

            const newCall = await device.connect({
                params: { To: to },
            });

            console.log("Call object created:", newCall);

            newCall.on("ringing", () => {
                console.log("Ringing...");
            });

            newCall.on("accept", () => {
                console.log("Call accepted 🔥");
            });

            newCall.on("disconnect", () => {
                console.log("Call disconnected");
            });

            newCall.on("reject", () => {
                console.log("Call rejected");
            });

            newCall.on("error", (err) => {
                console.error("Call error:", err);
            });

            setCall(newCall);
            setCallInProgress(true);
            setOwnerName(name);

        } catch (err) {
            console.error("Call Error:", err);
        }
    };

    const hangup = () => {
        if (call) {
            call.disconnect();
        }
        setCall(null);
        setCallInProgress(false);
        setOwnerName("");
    };

    return (
        <TwilioContext.Provider
            value={{
                makeCall,
                hangup,
                callInProgress,
                ownerName,
            }}
        >
            {children}
        </TwilioContext.Provider>
    );
};

export default TwilioProvider;