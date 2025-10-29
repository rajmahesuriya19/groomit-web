import React, { useRef, useState } from 'react';
import CopyTooltip from '@/common/CopyTooltip/CopyTooltip';

import CopyIcon from '../../../assets/icon/copyy.svg';
import Gallery from '../../../assets/icon/gallery.svg';
import Send from '../../../assets/icon/send.svg';
import Document from '../../../assets/icon/document-text.svg';
import Camera from '../../../assets/icon/camera.svg';
import { fetchSelectedChat, sendSupportMessage } from '@/utils/store/slices/inbox/inboxSlice';
import { useDispatch, useSelector } from 'react-redux';

const SupoortChat = () => {
    const dispatch = useDispatch();
    const [galleryOpen, setGalleryOpen] = React.useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [messageText, setMessageText] = useState("");

    const { selectedChat } = useSelector((state) => state.inbox || []);

    const docInputRef = useRef(null);
    const imgInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // 📄 Handle document upload
    const handleDocClick = () => {
        if (docInputRef.current) {
            docInputRef.current.value = "";
            docInputRef.current.click();
        }
    };

    const handleCameraClick = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.value = "";
            cameraInputRef.current.click();
        }
    };

    // 🖼️ Handle image upload
    const handleImgClick = () => {
        if (imgInputRef.current) {
            imgInputRef.current.value = "";
            imgInputRef.current.click();
        }
    };

    // Example handlers to preview / upload
    const handleDocChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("📄 Document selected:", file.name);
        }
    };

    const handleImgChange = (e) => {
        const files = Array.from(e.target.files || []);
        console.log("📸 Selected images:", files);

        if (files.length > 0) {
            setUploadedImages((prev) => [...prev, ...files]);
        }
        setGalleryOpen(false);
    };

    const handleRemoveImage = (index) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("📷 Captured image:", file.name);
            setUploadedImages((prev) => [...prev, file]);
        }
    };

    // Handle sending message
    const handleSendMessage = () => {
        if (!messageText.trim() && uploadedImages.length === 0) return;
        const payload = {
            appointment_id: selectedChat?.appointment_id || null,
            ticket_id: selectedChat?.ticket_id,
            comment: messageText ? messageText : '',
            files: uploadedImages,
        };

        dispatch(sendSupportMessage(payload))
            .unwrap()
            .then(() => {
                dispatch(fetchSelectedChat(selectedChat?.ticket_id));
                setMessageText("");
                setUploadedImages([]);
            })
            .catch((err) => console.error(err));
    };
    return (
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
                            key={index}
                            className={`flex flex-col ${isCustomer ? "self-end" : "self-start"} ${isLast ? "pb-4" : ""} my-2`}
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
                                    {msg.created_time && new Date(msg.created_time).toLocaleTimeString([], {
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white relative">
                {/* 📸 Gallery modal */}
                {galleryOpen && (
                    <div className="absolute bottom-[70px] right-[70px] w-[210px] rounded-xl py-4 px-5 bg-white shadow-lg animate-fadeIn z-10">
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
                                    multiple
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

                {/* 🖼️ Uploaded Image Preview */}
                {uploadedImages?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`preview-${idx}`}
                                    className="w-[75px] h-[50px] object-contain rounded-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-[-5px] right-[-5px] bg-primary-dark text-white text-[10px] rounded-full w-[16px] h-[16px] flex justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {uploadedImages?.length === 0 && <div className="font-inter font-bold text-xs mb-3 text-center">
                    *Response times may vary based on complexity. We aim to reply within 1-3 business days.
                </div>}

                {/* Input Section */}
                <div className="flex items-center justify-between w-full h-[57px] border border-primary-line rounded-xl px-[15px] py-[10px]">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-sm font-inter placeholder:text-primary-light"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
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
                            onClick={handleSendMessage}
                        >
                            <img src={Send} alt="Send" className="w-[21px] h-[21px]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupoortChat