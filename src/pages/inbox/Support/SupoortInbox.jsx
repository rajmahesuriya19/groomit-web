import { fetchSelectedChat } from '@/utils/store/slices/inbox/inboxSlice';
import React from 'react'
import { useDispatch } from 'react-redux';

const SupoortInbox = ({ supportChat, selectedChat }) => {
    const dispatch = useDispatch();
    const handleSelectChat = (ticket_id) => {
        dispatch(fetchSelectedChat(ticket_id));
    };
    return (
        <div className="space-y-3">
            {supportChat.map((ticket) => {
                const isOpen = ticket.new_message;
                const statusColor = isOpen ? "bg-[#28B446]" : "bg-[#EB5757]";
                return (
                    <div
                        key={ticket.ticket_id}
                        onClick={() => handleSelectChat(ticket?.ticket_id)}
                        className={`w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${selectedChat?.ticket_id === ticket.ticket_id && "border border-brand"}`}
                    >
                        <div className="flex justify-between items-center gap-3">
                            {/* Ticket Info */}
                            <div className="flex flex-col gap-1 truncate">
                                <div className="font-inter font-bold text-base truncate">
                                    {ticket.category_name || "No Subject"}
                                </div>
                                <div className="font-inter font-normal text-sm truncate">
                                    #{ticket.ticket_id} | {new Date(ticket.created_time).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div
                                className={`font-inter font-bold text-xs uppercase w-14 h-6 flex items-center justify-center rounded-full px-2 text-white ${statusColor}`}
                            >
                                {isOpen ? "OPEN" : "CLOSED"}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default SupoortInbox