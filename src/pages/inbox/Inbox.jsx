import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../assets/icon/message-text.svg';
import Chat from '../../assets/icon/chat-grey.svg';
import Logo from '../../assets/logo/groomit_fav.svg';
import CopyIcon from '../../assets/icon/copyy.svg';
import Gallery from '../../assets/icon/gallery.svg';
import Send from '../../assets/icon/send.svg';
import Document from '../../assets/icon/document-text.svg';
import Camera from '../../assets/icon/camera.svg';

import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { clearSelectedChat, fetchInboxMessages, fetchSelectedChat, fetchSupportInboxMessages } from '@/utils/store/slices/inbox/inboxSlice';
import CopyTooltip from '@/common/CopyTooltip/CopyTooltip';

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
    const [galleryOpen, setGalleryOpen] = React.useState(false);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();

    const docInputRef = useRef(null);
    const imgInputRef = useRef(null);
    const cameraInputRef = useRef(null);

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

    // 📄 Handle document upload
    const handleDocClick = () => {
        docInputRef.current?.click();
    };

    // 🖼️ Handle image upload
    const handleImgClick = () => {
        imgInputRef.current?.click();
    };

    // Example handlers to preview / upload
    const handleDocChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Document selected:", file.name);
            // 👉 You can upload or preview here
        }
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Image selected:", file.name);
            // 👉 You can upload or preview here
        }
    };

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("📸 Captured image:", file.name);
            // 👉 You can preview or upload the photo here
        }
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
                                                <div className="flex flex-col gap-1 truncate">
                                                    <div className="font-inter font-bold text-base truncate">
                                                        {ticket.category_name || "No Subject"}
                                                    </div>
                                                    <div className="font-inter font-normal text-sm truncate">
                                                        #{ticket.ticket_id} | {new Date(ticket.created_time).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                                    </div>
                                                </div>

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
                <div className={`bg-white w-full md:h-full rounded-2xl flex flex-col justify-center items-center ${(activeTab === 1 && selectedChat) && 'border-t-[3px] border-[#2F87D8]'}`}>
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
                        ) : !selectedChat ? (
                            <EmptyState
                                icon={Chat}
                                title="Select a Ticket"
                                description="Your conversations will show up here once you choose one from the left."
                            />
                        ) : (
                            <>
                                <div className="w-full h-full relative flex flex-col">
                                    {/* Ticket Header */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <CopyTooltip textToCopy={`#${selectedChat?.ticket_id}`}>
                                                <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide cursor-pointer">
                                                    #{selectedChat?.ticket_id}
                                                    <img src={CopyIcon} alt="Copy" className="w-3 h-3 opacity-80 hover:opacity-100" />
                                                </div>
                                            </CopyTooltip>
                                        </div>

                                        <p className="font-inter font-bold text-base text-gray-800 mt-1">
                                            Groomer Arrived
                                        </p>
                                        <p className="font-inter text-xs mt-1 text-gray-500">
                                            Requested At{" "}
                                            {new Date(selectedChat?.created_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 max-h-[500px] overflow-y-auto flex flex-col-reverse p-4 border-t border-gray-200">
                                        {selectedChat?.messages?.slice().reverse().map((msg, index, arr) => {
                                            const isCustomer = msg.from === "customer";
                                            const isLast = index === 0;

                                            // Next message in visual order (previous in array)
                                            const nextMsg = arr[index - 1];
                                            const showTime =
                                                !nextMsg ||
                                                new Date(nextMsg.created_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) !==
                                                new Date(msg.created_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                                            return (
                                                <div
                                                    key={msg.message_id}
                                                    className={`flex flex-col ${isCustomer ? "self-end" : "self-start"} ${isLast ? "pb-4" : ""} ${!showTime ? "my-2" : ""}`}
                                                >
                                                    {/* TEXT MESSAGE */}
                                                    {msg.message && (
                                                        <div
                                                            className={`p-4 max-w-[280px] font-normal font-inter text-sm ${isCustomer ? "bg-[#F2F2F2] text-end" : "bg-[#E7E6F5] text-start"
                                                                }`}
                                                            style={{
                                                                borderTopLeftRadius: "15px",
                                                                borderTopRightRadius: "15px",
                                                                borderBottomLeftRadius: isCustomer ? "15px" : "0",
                                                                borderBottomRightRadius: isCustomer ? "0" : "15px",
                                                            }}
                                                        >
                                                            {msg.message}
                                                        </div>
                                                    )}

                                                    {/* IMAGE BOX */}
                                                    {msg.images?.length > 0 && (
                                                        <div
                                                            className={`mt-2 p-[5px] rounded-xl ${isCustomer ? "bg-[#F2F2F2] self-end" : "bg-[#E7E6F5] self-start"
                                                                } flex flex-wrap gap-2`}
                                                        >
                                                            {msg.images.slice(0, 3).map((img, idx) => {
                                                                let width, height;

                                                                if (msg.images.length === 1) {
                                                                    width = 270;
                                                                    height = 181;
                                                                } else if (msg.images.length === 2) {
                                                                    width = 132.5;
                                                                    height = 89.0476;
                                                                } else {
                                                                    width = 86.67;
                                                                    height = 57.78;
                                                                }

                                                                const isLastVisible = idx === 2 && msg.images.length > 3;
                                                                const remainingCount = msg.images.length - 3;

                                                                return (
                                                                    <div key={img.ticket_photo_id} className="relative">
                                                                        <img
                                                                            src={img.ticket_photo_url}
                                                                            alt="attachment"
                                                                            style={{
                                                                                width: `${width}px`,
                                                                                height: `${height}px`,
                                                                                objectFit: msg.images.length === 1 ? "cover" : "contain",
                                                                                borderRadius: "10px",
                                                                            }}
                                                                        />
                                                                        {isLastVisible && (
                                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg text-white font-bold text-sm cursor-pointer">
                                                                                +{remainingCount} More
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    {/* TIME */}
                                                    {showTime && (
                                                        <div
                                                            className={`mt-1 text-[10px] font-inter font-bold text-primary-light ${isCustomer ? "text-end" : "text-start"
                                                                }`}
                                                        >
                                                            {new Date(msg.created_time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 🧠 Only show input if current tab is Support */}
                                    {activeTab === 1 && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white relative">
                                            {/* 📸 Gallery modal */}
                                            {galleryOpen && (
                                                <div className="absolute bottom-[70px] right-[70px] w-[210px] rounded-xl py-4 px-5 bg-white shadow-lg animate-fadeIn">
                                                    <div className="flex items-center justify-between gap-4">
                                                        {/* 📄 Document Upload */}
                                                        <div className="flex flex-col items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={handleDocClick}
                                                                className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#FFEDE9] hover:brightness-95 transition"
                                                            >
                                                                <img src={Document} alt="Document" className="w-[21px] h-[21px]" />
                                                            </button>
                                                            <span className="font-inter font-bold text-[10px] text-[#333]">Document</span>
                                                            <input
                                                                ref={docInputRef}
                                                                type="file"
                                                                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                                                                className="hidden"
                                                                onChange={handleDocChange}
                                                            />
                                                        </div>

                                                        {/* 🖼️ Image Upload */}
                                                        <div className="flex flex-col items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={handleImgClick}
                                                                className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#FFEAF8] hover:brightness-95 transition"
                                                            >
                                                                <img src={Gallery} alt="Gallery" className="w-[21px] h-[21px]" />
                                                            </button>
                                                            <span className="font-inter font-bold text-[10px] text-[#333]">Gallery</span>
                                                            <input
                                                                ref={imgInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleImgChange}
                                                            />
                                                        </div>

                                                        {/* 🚀 Camera Button */}
                                                        <div className="flex flex-col items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={handleCameraClick}
                                                                className="w-[40px] h-[40px] flex items-center justify-center rounded-[10px] bg-[#E7E6F4] hover:brightness-95 transition"
                                                            >
                                                                <img src={Camera} alt="Camera" className="w-[21px] h-[21px]" />
                                                            </button>
                                                            <span className="font-inter font-bold text-[10px]">Camera</span>

                                                            {/* Hidden input for capturing photos */}
                                                            <input
                                                                ref={cameraInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                capture="environment"
                                                                className="hidden"
                                                                onChange={handleCameraCapture}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="font-inter font-bold text-xs mb-3 text-center">
                                                *Response times may vary based on complexity. We aim to reply within 1-3 business days.
                                            </div>

                                            {/* Input Section */}
                                            <div className="flex items-center justify-between w-full h-[57px] border border-primary-line rounded-xl px-[15px] py-[10px]">
                                                <input
                                                    type="text"
                                                    placeholder="Type a message..."
                                                    className="flex-1 bg-transparent outline-none text-sm font-inter placeholder:text-primary-light"
                                                />

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-[10px] border border-[#BEC3C5] p-[7px]"
                                                        onClick={() => setGalleryOpen((prev) => !prev)}
                                                    >
                                                        <img src={Gallery} alt="Attach" className="w-[21px] h-[21px]" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="w-[35px] h-[35px] flex items-center justify-center rounded-[10px] border border-brand bg-brand p-[7px]"
                                                    >
                                                        <img src={Send} alt="Send" className="w-[21px] h-[21px]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
