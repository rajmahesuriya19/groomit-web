import React from 'react'

const AppointmentInfo = ({ type, icon, title, subtitle }) => (
    <div className={`flex items-start ${type ? '' : 'mt-4 pt-3 border-t border-[#E4E4E4]'}`}>
        <div className="flex justify-center items-center bg-[#F2F2F2] rounded-[10px] me-3 w-[40px] h-[40px]">
            <img src={icon} alt={subtitle} className="w-[22px] h-[22px]" />
        </div>
        <div>
            <p className="font-inter font-bold text-primary-dark text-sm">{title}</p>
            <p className="font-inter text-xs text-primary-dark mt-1">{subtitle}</p>
        </div>
    </div>
);

export default AppointmentInfo