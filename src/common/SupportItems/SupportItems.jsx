import React from 'react'

// icons
import info from '../../assets/icon/help-circle-black.svg';
import Message from '../../assets/icon/chat-black.svg';
import FeedbackIcon from '../../assets/icon/star-gray.svg';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const supportItems = [
    { label: 'FAQs', href: "https://groomit.me/how-it-works", icon: info },
    { label: 'Cancelation Policy', href: "https://groomit.me/customer-cancellation-policy", icon: info },
    { label: 'Live Chat', href: 'https://tawk.to/chat/624b2da42abe5b455fc485b7/1fvqqkiki', icon: Message },
    { label: 'Give us feedback', href: 'https://g.page/r/CcYk6tuuu6NhEB0/review', icon: FeedbackIcon },
];

const SupportItems = () => {
    return (
        <div className="bg-white p-4 pb-0 rounded-2xl w-full overflow-hidden">
            <div className="flex justify-between items-center pb-4">
                <h3 className="text-base font-bold text-primary-dark">Support</h3>
                {/* <span className="text-sm text-primary-light">Have Questions?</span> */}
            </div>

            <div className="flex flex-col w-full">
                {supportItems.map((item) => (
                    <Link key={item.label} to={item.href || "#"} target="_blank">
                        <div
                            key={item.label}
                            className="flex justify-between items-center cursor-pointer py-4 border-t min-w-0"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <img src={item.icon} alt={item.label} className="w-6 h-6 flex-shrink-0" />
                                <span className="text-sm font-bold text-primary-dark font-inter truncate">
                                    {item.label}
                                </span>
                            </div>
                            <ChevronRight size={24} className="text-gray-400 flex-shrink-0" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};


export default SupportItems