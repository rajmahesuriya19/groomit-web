import React from 'react'

const AppointmentInfo = ({ icon, title, subtitle }) => (
    <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
            <img src={icon} alt={subtitle} className="w-5 h-5" />
        </div>
        <div>
            <p className="font-inter font-bold text-primary-dark text-sm">{title}</p>
            <p className="font-inter text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
    </div>
);

export default AppointmentInfo