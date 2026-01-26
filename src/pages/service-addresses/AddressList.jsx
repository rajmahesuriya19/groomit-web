import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddressList = ({ address, isLast }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/user/address/edit/${address?.address_id}`)}
            className={`group w-full flex items-center justify-between gap-3 cursor-pointer
        ${!isLast ? "pb-4 border-b border-[#E4E4E4]" : ""}
      `}
        >
            {/* Left: Address Info */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                {address?.default_address === "Y" && (
                    <span className="inline-flex items-center px-[6px] pt-[2px] pb-[1px] rounded-full text-xs font-bold uppercase border border-primary-line w-fit mb-1">
                        DEFAULT
                    </span>
                )}
                <p className="text-sm font-bold text-primary-dark leading-tight truncate">
                    {address?.address1} {address?.address2}
                </p>

                <p className="text-sm font-normal text-primary-dark leading-tight truncate">
                    {address?.city}, {address?.state} {address?.zip}
                </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <ChevronRight
                    size={24}
                    className="text-primary-light transition-transform group-hover:translate-x-0.5"
                />
            </div>
        </div>
    );
};

export default AddressList;
