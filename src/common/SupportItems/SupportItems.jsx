import React from 'react'

// icons
import info from '../../assets/icon/help-circle-black.svg';
import Message from '../../assets/icon/chat-black.svg';
import FeedbackIcon from '../../assets/icon/star-gray.svg';
import { ChevronRight } from 'lucide-react';

const supportItems = [
    { label: 'How Groomit Works', icon: info },
    { label: 'Cancelation Policy', icon: info },
    { label: 'Live Chat', icon: Message },
    { label: 'Give us feedback', icon: FeedbackIcon },
];

const SupportItems = () => {
    return (
        <>
            <div className="bg-white p-4 pb-0 rounded-2xl">
                <div className="flex justify-between items-center pb-4">
                    <h3 className="text-base font-bold text-primary-dark">Support</h3>
                    <span className="text-sm text-primary-light">Have Questions?</span>
                </div>

                <div className="flex flex-col">
                    {supportItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex justify-between items-center cursor-pointer py-4 border-t"
                        >
                            <div className="flex items-center gap-2">
                                <img src={item.icon} alt={item.label} className="w-6 h-6" />
                                <span className="text-sm font-bold text-primary-dark font-inter">
                                    {item.label}
                                </span>
                            </div>
                            <ChevronRight size={24} className="text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SupportItems