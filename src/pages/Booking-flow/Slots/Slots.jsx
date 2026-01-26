import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router';
import TotalPriceModal from '@/components/Modals/TotalPriceModal';
import TaxInsuranceModal from '@/components/Modals/TaxInsuranceModal';

const Slots = () => {
    const navigate = useNavigate();

    const [openPriceTotalModal, setOpenPriceTotalModal] = useState(false);
    const [openTaxModal, setOpenTaxModal] = useState(false);

    const handleFooterAction = () => {
        navigate("/book/checkout")
    };

    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="flex items-center px-6 py-3">
                    <ChevronLeft
                        size={24}
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="flex-1 text-center font-bold text-xl">
                        Mobile Groomers & Schedule
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 max-w-md mx-auto flex flex-col gap-2"></div>

            {/* Footer */}
            <div
                className="fixed bottom-0 left-0 w-full bg-white z-20"
                style={{
                    boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
                    padding: "16px 20px 24px",
                }}
            >
                <div className="max-w-md mx-auto flex items-center justify-between">
                    {/* PRICE */}
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-bold text-primary-dark underline cursor-pointer" onClick={() => setOpenPriceTotalModal(true)}>
                            $105
                        </span>
                        <span className="text-[10px] text-primary-dark">
                            Fees & Taxes Included
                        </span>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handleFooterAction}
                        className="h-[52px] rounded-[10px] font-bold text-white bg-primary-dark active:scale-[0.98] transition w-[236px]"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            <TotalPriceModal
                open={openPriceTotalModal}
                onClose={() => setOpenPriceTotalModal(false)}
                onModal={() => { setOpenTaxModal(true); setOpenPriceTotalModal(false); }}
                packageName="Gold"
                packagePrice={130}
                add_ons={[]}
                Insurance="$36.14"
            />
            <TaxInsuranceModal
                open={openTaxModal}
                onClose={() => setOpenTaxModal(false)}
                Insurance="$36.14"
                Tax="$12.50"
            />
        </>
    )
}

export default Slots