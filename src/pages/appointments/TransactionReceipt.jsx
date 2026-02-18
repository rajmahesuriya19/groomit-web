import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// components
import { Card } from '@mui/material';
import SupportItems from '@/common/SupportItems/SupportItems';

const TransactionReceipt = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { appointmentData, autoScroll } = location.state || {};

    console.log("Appointment Data:", appointmentData)
    console.log("Auto Scroll:", autoScroll)

    return (
        <>
            {/* Page Header */}
            <div className="w-full overflow-hidden py-[10px] bg-white shadow-sm">
                <div className="py-2 px-5 w-full hidden md:flex gap-3 items-center">
                    <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate(-1)} />
                    <div className="font-filson font-bold text-xl text-primary-dark">
                        Receipt
                    </div>
                </div>

                <div className="px-2 w-full block md:hidden">
                    <div className="flex items-center gap-2 w-full">
                        <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate(-1)} />
                        <div className="w-full text-center font-filson font-bold text-xl text-primary-dark">
                            Receipt
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                {/* Tabs Section */}
                <div className="space-y-4">

                    {/* Tab Panels */}
                    <Card className='shadow-sm rounded-2xl'>
                        <div className="p-[15px]">

                            <span>Transaction Receipt</span>
                        </div>
                    </Card>
                </div>

                {/* Divider */}
                <div className="hidden md:flex justify-center">
                    <div className="h-full w-[1px] bg-[#E4E4E4]" />
                </div>

                {/* Right Section */}
                <div className="space-y-4 w-full min-w-0 hidden md:block">
                    <SupportItems />
                </div>
            </div>
        </>
    );
};

export default TransactionReceipt;
