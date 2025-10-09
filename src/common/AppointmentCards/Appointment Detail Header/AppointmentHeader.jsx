import CopyTooltip from "@/common/CopyTooltip/CopyTooltip";

import CopyIcon from '../../../assets/icon/copyy.svg';

const AppointmentHeader = ({ appointment }) => (
    <div>
        <div className="flex justify-between items-center">
            <CopyTooltip textToCopy={`#${appointment?.appt_detail?.appointment_id}`}>
                <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide cursor-pointer">
                    #{appointment?.appt_detail?.appointment_id}
                    <img src={CopyIcon} alt="Copy" className="w-3 h-3 opacity-80 hover:opacity-100" />
                </div>
            </CopyTooltip>
        </div>

        <p className="font-inter font-bold text-base text-gray-800 mt-1">
            {appointment?.appointment_status_label}
        </p>
        <p className="font-inter text-xs mt-1 text-gray-500">
            Requested {appointment?.appt_detail?.groomer_last_updated_at}
        </p>
    </div>
);

export default AppointmentHeader