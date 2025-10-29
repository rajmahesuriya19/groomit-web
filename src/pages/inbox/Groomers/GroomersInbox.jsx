import React from "react";
import { useDispatch } from "react-redux";
import { fetchGroomerSelectedChat } from "@/utils/store/slices/inbox/inboxSlice";
import fallback from "../../../assets/icon/sandra-static.svg";

const GroomersInbox = ({ groomersChat = [], selectedChat }) => {
    console.log(selectedChat);

    const dispatch = useDispatch();

    const handleSelectChat = (appointment_id) => {
        dispatch(fetchGroomerSelectedChat(appointment_id));
    };

    return (
        <div className="space-y-2">
            {groomersChat.map((chat) => {
                const { appointment_id, created_time, groomer, messages } = chat;
                const latestMsg = messages?.[messages.length - 1];
                const unreadCount = parseInt(latestMsg?.total_unread_count || 0);
                const isSelected = selectedChat?.appointment_id == appointment_id;

                return (
                    <div
                        key={appointment_id}
                        onClick={() => handleSelectChat(appointment_id)}
                        className={`w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${isSelected && "border border-brand"}`}
                    >
                        {/* Groomer Profile */}
                        <div className="flex items-center gap-3 flex-1">
                            <img
                                src={groomer?.profile_photo_url || fallback}
                                alt={groomer?.first_name || "Groomer"}
                                className="w-[40px] h-[40px] rounded-lg object-cover"
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                                {/* Name + Time */}
                                <div className="flex items-center justify-between">
                                    <p className="font-inter font-bold text-base text-primary-dark capitalize truncate">
                                        {`${groomer?.first_name || "Unknown"} ${groomer?.last_name || ""
                                            }`}
                                    </p>
                                    <span className="text-[10px] font-bold whitespace-nowrap">
                                        {new Date(
                                            latestMsg?.created_time || created_time
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                {/* Message + Unread */}
                                <div className="flex items-center justify-between">
                                    <p
                                        className={`font-inter text-sm truncate`}
                                    >
                                        {latestMsg?.message || "No messages yet"}
                                    </p>

                                    {unreadCount > 0 && (
                                        <span className="bg-brand text-white text-sm font-semibold rounded-full flex items-center justify-center w-[18px] h-[18px] shrink-0 px-1">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
            }
        </div>
    );
};

export default GroomersInbox;
