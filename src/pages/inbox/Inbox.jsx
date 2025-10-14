import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../assets/icon/message-text.svg';
import Chat from '../../assets/icon/chat-grey.svg';
import Logo from '../../assets/logo/groomit_fav.svg';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { clearSelectedChat, fetchInboxMessages, fetchSelectedChat, fetchSupportInboxMessages } from '@/utils/store/slices/inbox/inboxSlice';

const CustomTabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`custom-tab-${index}`}>
        {value === index && <Box className="pt-2">{children}</Box>}
    </div>
);

const EmptyState = ({ icon, title, description }) => (
    <div className="flex flex-col items-center justify-center h-[500px] w-full gap-2 p-0">
        {icon && <img src={icon} alt="icon" className="w-[60px] h-[60px]" />}
        {title && <div className="font-inter font-bold text-xl text-center">{title}</div>}
        {description && <div className="font-inter font-normal text-base text-center">{description}</div>}
    </div>
);

const Inbox = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();

    const { groomersChat, supportChat, selectedChat } = useSelector((state) => state.inbox || []);

    console.log(selectedChat);

    const tabs = [
        { label: 'Groomers', type: 'groomers', count: groomersChat.filter(chat => chat.new_message).length },
        { label: 'Support', type: 'support', count: supportChat.filter(ticket => ticket.new_message).length },
    ];

    // ✅ Fetch messages on mount
    useEffect(() => {
        showLoader();
        Promise.all([
            dispatch(fetchInboxMessages()),
            dispatch(fetchSupportInboxMessages()),
        ]).finally(() => hideLoader());
    }, [dispatch]);

    const handleSelectChat = (ticket_id) => {
        dispatch(fetchSelectedChat(ticket_id));
    };

    return (
        <div className="px-5 py-6 flex flex-col md:flex-row gap-4">
            {/* Tabs + Content */}
            <div className="md:w-2/5 space-y-4">
                {/* Tab Buttons */}
                <div className="flex w-full">
                    {tabs.map((tab, index) => {
                        const isActive = index === activeTab;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setActiveTab(index);
                                    dispatch(clearSelectedChat());
                                }}
                                className={`flex justify-center items-center gap-2 w-1/2 h-[41px] px-4 text-center font-inter text-sm transition-all duration-200 ${isActive
                                    ? 'font-bold text-white bg-primary-dark'
                                    : 'bg-white font-normal text-primary-dark border-[1.5px] border-primary-line'
                                    }`}
                                style={{
                                    borderRadius: index === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
                                }}
                            >
                                <span>{tab.label}</span>
                                {tab.count > 0 && <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-brand text-white shadow-sm">
                                    {tab.count}
                                </span>}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Panels */}
                {tabs.map((tab, index) => (
                    <CustomTabPanel key={index} value={activeTab} index={index}>
                        {tab.type === 'groomers' && groomersChat.length > 0 ? (
                            <div className="space-y-3">
                                {groomersChat.map((ticket) => {
                                    const isOpen = ticket.new_message;
                                    const statusColor = isOpen ? "bg-[#28B446]" : "bg-[#EB5757]";
                                    return (
                                        <div
                                            key={ticket.ticket_id}
                                            onClick={() => handleSelectChat(ticket?.ticket_id)}
                                            className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
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

                        ) : tab.type === 'support' && supportChat.length > 0 ? (
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

                        ) : tab.type === 'groomers' ? (
                            <EmptyState
                                icon={Message}
                                title="No Groomer Messages!"
                                description="You’ll see the messages here whenever you’ll start conversations with groomer!"
                            />
                        ) : (
                            <EmptyState
                                icon={Logo}
                                title="No Support Tickets"
                                description="You’ll see the messages here whenever you’ll create support tickets!"
                            />
                        )}
                    </CustomTabPanel>
                ))}
            </div>

            {/* Right Chat Box */}
            <div className="md:w-3/5 w-full min-w-0 hidden md:flex">
                <div className="bg-white w-full h-[550px] md:h-full rounded-2xl flex flex-col justify-center items-center p-6">
                    {activeTab === 0 ? (
                        // Groomers Tab
                        groomersChat.length === 0 ? (
                            <EmptyState description="Your conversations will show up here." />
                        ) : !selectedChat ? (
                            <EmptyState
                                icon={Chat}
                                title="Select a Chat"
                                description="Your conversations will show up here once you choose one from the left."
                            />
                        ) : (
                            <div className="w-full h-full overflow-y-auto p-4">
                                {selectedChat?.messages.map((msg) => (
                                    <div
                                        key={msg.message_id}
                                        className={`p-3 my-2 rounded-lg ${msg.from === "customer"
                                            ? "bg-gray-100 self-start"
                                            : "bg-primary-dark text-white self-end"
                                            } max-w-[70%]`}
                                    >
                                        {msg.message}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(msg.created_time).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        // Support Tab
                        supportChat.length === 0 ? (
                            <EmptyState description="Your conversations will show up here." />
                        ) : selectedChat?.length === 0 ? (
                            <EmptyState
                                icon={Chat}
                                title="Select a Ticket"
                                description="Your conversations will show up here once you choose one from the left."
                            />
                        ) : (
                            <div className="w-full h-full overflow-y-auto p-4">
                                {selectedChat?.messages?.map((msg) => (
                                    <div
                                        key={msg.message_id}
                                        className={`p-3 my-2 rounded-lg ${msg.from === "customer"
                                            ? "bg-gray-100 self-start"
                                            : "bg-primary-dark text-white self-end"
                                            } max-w-[70%]`}
                                    >
                                        {msg.message}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(msg.created_time).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
