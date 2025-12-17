import React, { useEffect } from 'react';
import Message from '../../assets/icon/message-blue.svg';
import Call from '../../assets/icon/call-green.svg';
import Info from '../../assets/icon/info-circle-grey.svg';

// components
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

const PreferredGroomer = ({item, onInfoClick }) => {
    if (!item?.groomer) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-4">
            <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg w-[40px] h-[40px]">
            <img src={item?.groomer?.profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                alt={item?.groomer?.first_name || 'Groomer'} className="w-5 h-5" /> 
            </div>
                <div className="flex-1">
                    <div className="flex gap-1 items-center">
                        <p className="font-inter font-bold text-sm text-primary-dark">
                        {item?.groomer_id ? item?.groomer?.name : 'Groomer'}
                        </p>
                      {item?.groomer_id && <button onClick={() => onInfoClick?.(item?.groomer)}>
                            <img src={Info} alt="Info" className="w-4 h-4" />
                        </button>}
                    </div>
                    <p className="font-inter text-xs text-gray-500 mt-1">{item?.groomer_id ? item?.groomer?.groomer_type : 'Best Match Groomer'}</p>
                </div>

                <div className="flex gap-2">
                    <ActionIcon
                        icon={item?.groomer?.isAllowedMessage ? Message : 'https://dev.groomit.me/v7/images/webapp/icons/message-gray.svg'}
                    />
                    <ActionIcon
                        icon={item?.groomer?.isAllowedCall ? Call : 'https://dev.groomit.me/v7/images/webapp/icons/call-gray.svg'}
                    />
                </div>
            </div>

           {item?.isAllowedCall || item?.isAllowedMessage && <p className="mt-2 font-inter text-xs text-gray-600">
                Calling is available on the app only
            </p>}
        </div>
    );
};

// 🧩 Icon button with tooltip (for message/call)
const ActionIcon = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px] hover:bg-gray-50 transition">
        <img src={icon} alt="action" className="w-5 h-5" />
    </div>
);


export default PreferredGroomer