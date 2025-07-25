import React, { useState } from 'react'
import backIcon from '../../../assets/icon/arrow-left.svg';
import Location from '../../../assets/icon/location-red.svg';
import Card from '../../../assets/cards/card-bg.svg';
import Visa from '../../../assets/cards/Visa-light.svg';
import Delete from '../../../assets/icon/delete-red.svg';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';

const ViewCard = () => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(false);
        alert('Card deleted');
    };

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/user/account')}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
                    >
                        <img src={backIcon} alt="Back" className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-primary-dark">Card Details</h2>
                </div>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-[#EB5757] underline text-base"
                >
                    Delete Card
                </button>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden -mx-4 mb-6">
                <div className="flex items-center justify-between bg-white px-5 py-4 shadow-md">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center"
                    >
                        <ChevronLeft size={24} className="text-primary-light" />
                    </button>

                    <h2 className="text-lg font-bold text-primary-dark">Card Details</h2>

                    <div className="w-6 h-6" />
                </div>
            </div>

            {/* Card Details */}
            <div className="rounded-[15px] p-4 md:p-6 flex flex-col md:flex-row gap-6 bg-white shadow-md">
                {/* Card Image */}
                <div className="relative md:w-full h-[128px] rounded-[15px] overflow-hidden">
                    <img src={Card} alt="Card" className="w-[390px] h-[128px] object-cover hidden md:block" />
                    <img src={Card} alt="Card" className="w-full h-full object-cover md:hidden" />

                    <div className="absolute top-4 left-5 text-white">
                        <div className="flex items-start gap-3">
                            <img src={Visa} alt="Visa" className="w-12 h-7 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase font-medium tracking-wider">Number</span>
                                <span className="text-lg font-bold tracking-widest leading-tight">**** **** 0222 0034</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-5 text-white">
                        <div className="text-[8px] font-medium uppercase tracking-wide">Name</div>
                        <div className="text-sm font-semibold tracking-wider mt-1 leading-tight">CRAIG JOHNSON SHIIK</div>
                    </div>

                    <div className="absolute bottom-4 right-4 md:right-[70px] text-white text-right">
                        <div className="text-[8px] font-medium uppercase tracking-wide">End Date</div>
                        <div className="text-base font-bold mt-1 leading-tight">12/29</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-[#C9CFD4]" />

                {/* Address */}
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2">
                        <img src={Location} alt="Location" className="w-6 h-6" />
                        <h2 className="text-base font-bold text-primary-dark">Billing Address</h2>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-bold text-primary-dark">
                            34 Long address with a lot of characters Kevorkian 50 Washington Square S,
                        </h2>
                        <h2 className="text-base font-normal text-primary-dark">
                            New York, NY 10012
                        </h2>
                    </div>
                </div>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden md:flex justify-center items-center py-8">
                <button
                    type="submit"
                    className='w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] text-center transition-colors duration-200
      bg-primary-dark text-white cursor-pointer'
                >
                    Verify Card
                </button>
            </div>

            {/* Mobile Delete Button */}
            <div className="md:hidden px-5 pt-4 text-center mb-28">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-[#EB5757] underline text-base"
                >
                    Delete Card
                </button>
            </div>

            {/* Sticky Mobile Save Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <button
                    type="submit"
                    className='w-full h-[48px] rounded-[30px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] transition-colors duration-200
      bg-primary-dark text-white'
                >
                    Verify Card
                </button>
            </div>

            <DeleteAccountModal
                type={'card'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                icon={Delete}
                title={"Delete Credit Card"}
                decription={"Are you sure you want to delete this credit card?"}
            />
        </div>
    )
}

export default ViewCard
