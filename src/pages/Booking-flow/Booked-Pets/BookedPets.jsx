import React, { useMemo, useState } from 'react'
import { ChevronLeft, PlusIcon } from 'lucide-react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import BookedPetsList from './BookedPetsList';
import TotalPriceModal from '@/components/Modals/TotalPriceModal';
import TaxInsuranceModal from '@/components/Modals/TaxInsuranceModal';


const BookedPets = () => {
    const navigate = useNavigate();
    const [openPriceTotalModal, setOpenPriceTotalModal] = useState(false);
    const [openTaxModal, setOpenTaxModal] = useState(false);

    const bookingFlow = useSelector((state) => state.bookingFlow);

    const {
        serviceType,
        petsDraft,
        address: bookingAddress,
        totalPrice,
        selectedPetIds
    } = bookingFlow;

    const pets = petsDraft || [];

    console.log(pets);


    /* ---------------- Default Address ---------------- */
    const displayAddress = useMemo(() => {
        return bookingAddress || null;
    }, [bookingAddress]);

    const handlePetSubmit = () => {
        navigate("/book/slot/view-groomers");
    }

    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className='flex items-center px-6 py-3 justify-between'>
                    <div className="flex items-center w-full">
                        <ChevronLeft
                            size={24}
                            className="cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        <h1 className="flex-1 text-center font-bold text-xl w-full">
                            Pet(s) Being Serviced
                        </h1>
                    </div>
                    {selectedPetIds?.length < 5 && <PlusIcon
                        size={24}
                        className="cursor-pointer"
                        onClick={() => navigate("/book/pet/existing")}
                    />}
                </div>
            </div>

            {/* Address */}
            <div className="bg-white border-b px-4 py-2">
                <p className="text-sm text-primary-dark text-center truncate font-medium">
                    <span className='font-bold capitalize'>{serviceType?.toLowerCase()} |{" "}</span>
                    {displayAddress
                        ? `${displayAddress.address1} ${displayAddress.address2}, ${displayAddress.city}, ${displayAddress.state} ${displayAddress.zip}`
                        : "No address selected"}
                </p>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 max-w-xl mx-auto flex flex-col gap-4">
                <div className="space-y-4">
                    {pets.map((petDraft, idx) => (
                        <BookedPetsList
                            key={idx}
                            petDraft={petDraft}
                            isSingle={pets.length === 1}
                        />
                    ))}
                </div>
            </div>

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
                            ${totalPrice || 0}
                        </span>
                        <span className="text-[10px] text-primary-dark">
                            Fees & Taxes Included
                        </span>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={handlePetSubmit}
                        className="h-[52px] rounded-[10px] font-bold text-white bg-primary-dark active:scale-[0.98] transition w-[236px]"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            {/* <TotalPriceModal
                open={openPriceTotalModal}
                onClose={() => setOpenPriceTotalModal(false)}
                onModal={() => { setOpenTaxModal(true); setOpenPriceTotalModal(false); }}
                packageName="Gold"
                packagePrice={130}
                add_ons={ADD_ONS}
                Insurance="$36.14"
            /> */}
            <TaxInsuranceModal
                open={openTaxModal}
                onClose={() => setOpenTaxModal(false)}
                Insurance="$36.14"
                Tax="$12.50"
            />
        </>
    )
}

export default BookedPets