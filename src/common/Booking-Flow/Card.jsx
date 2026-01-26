import React from 'react'

const Card = ({ title, action, children, open }) => (
    <div className={`bg-white rounded-2xl shadow-md p-4 ${(title && title !== 'Who need grooming?' && title !== 'Payment Method') && 'space-y-2'}`}>
        {title && <div className={`flex items-center gap-1 ${(title === "Pet(s) Being Serviced" || title === "Add-ons" || title === "Grooming Details" || title === "Payment Method") ? 'border-b pb-3 border-[#E4E4E4] justify-between' : (title === "Cat Details" || title === "Dog Details" || title === "Select Package") ? 'justify-between' : ''}`}>
            <h3 className="font-bold text-base text-primary-dark">{title}</h3>
            {action}
        </div>}
        {children}
    </div >
);

export default Card