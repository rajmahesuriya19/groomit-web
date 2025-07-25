import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import backIcon from '../../../assets/icon/arrow-left.svg';
import Delete from '../../../assets/icon/delete-red.svg';
import { Checkbox } from '@mui/material';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { ChevronLeft } from 'lucide-react';

const schema = yup.object().shape({
    address: yup.string().required('Address is required'),
    apartment: yup.string().required('Apartment or suite number is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip Code is required'),
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreateEditServices = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            address: '',
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    useEffect(() => {
        if (isEdit) {
            reset({
                address: '123 Main Street',
                apartment: 'Apt 204',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
            });
        }
    }, [isEdit, reset]);

    const onSubmit = (data) => {
        console.log(isEdit ? 'Updating address:' : 'Creating address:', data);
    };

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(false);
        alert('Service deleted');
    };

    return (
        <>
            <div className="w-full px-4 md:px-8 py-6">
                <div className="hidden md:flex justify-between items-center pb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shadow"
                        >
                            <img src={backIcon} alt="Back" className="w-[24px] h-[24px]" />
                        </button>
                        <h2 className="text-[20px] font-bold text-[#2E2E2E]">
                            {isEdit ? 'Edit' : 'Add'} New Address
                        </h2>
                    </div>

                    {isEdit && <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-[#EB5757] underline text-[16px]"
                    >
                        Delete Service Address
                    </button>}
                </div>

                <div className="md:mx-0 -mx-4 -my-6 mb-6">
                    <div className="flex md:hidden items-center justify-between bg-white px-5 py-4 h-[64px] w-full">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center"
                        >
                            <ChevronLeft size={24} className="text-[#7C868A]" />
                        </button>

                        <h2 className="text-[20px] font-bold text-[#2E2E2E]">
                            {isEdit ? 'Edit' : 'Add'} New Address
                        </h2>

                        <div className="w-[24px] h-[24px]" />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-[15px] p-4 md:p-6 flex flex-col md:flex-row gap-8 bg-white shadow-md md:shadow-md md:bg-white">
                        <div className="flex flex-col gap-4 md:w-1/2">
                            {/* Address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">Address</label>
                                <input
                                    type="text"
                                    placeholder="123 Main Street"
                                    {...register('address')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter text-[#2E2E2E] placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.address?.message}</div>
                            </div>

                            {/* Apartment or suite number */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">
                                        Apartment or suite number
                                    </label>
                                    <span className="font-inter font-normal italic text-[14px] leading-[100%] text-[#7C868A] text-right">
                                        Optional
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Apt 204"
                                    {...register('apartment')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter text-[#2E2E2E] placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.apartment?.message}</div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px bg-[#C9CFD4]" />

                        {/* Right column */}
                        <div className="flex flex-col md:w-1/2 gap-4">
                            {/* City */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">City</label>
                                <input
                                    type="text"
                                    placeholder="New York"
                                    {...register('city')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter text-[#2E2E2E] placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.city?.message}</div>
                            </div>

                            {/* State & Zip Code */}
                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">State</label>
                                    <input
                                        type="text"
                                        placeholder="NY"
                                        {...register('state')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter text-[#2E2E2E] placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.state?.message}</div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">Zip Code</label>
                                    <input
                                        type="text"
                                        placeholder="10001"
                                        {...register('zipCode')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter text-[#2E2E2E] placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.zipCode?.message}</div>
                                </div>
                            </div>

                            {/* Default Address Checkbox */}
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    {...label}
                                    defaultChecked
                                    disableRipple
                                    disableFocusRipple
                                    disableTouchRipple
                                    sx={{
                                        padding: 0,
                                        color: '#7C868A',
                                        '&.Mui-checked': {
                                            color: '#FF314A',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                        '&.Mui-focusVisible': {
                                            outline: 'none',
                                        },
                                    }}
                                />
                                <span className="font-inter font-normal text-[16px] leading-[21px] tracking-[-0.02em] text-[#2E2E2E]">
                                    Make this to default address
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Submit Button */}
                    <div className="hidden md:flex justify-center items-center py-8">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-[16px] font-semibold font-inter leading-[18px] text-center transition-colors duration-200
      ${!id || isDirty ? 'bg-[#FF314A] text-white cursor-pointer' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            Add Address
                        </button>
                    </div>

                    {/* Mobile Delete Button */}
                    <div className="md:hidden px-5 pt-4 text-center mb-28">
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="text-[#EB5757] underline text-[16px]"
                        >
                            Delete Service Address
                        </button>
                    </div>

                    {/* Sticky Mobile Save Button */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-full h-[48px] rounded-[30px] flex items-center justify-center text-[16px] font-semibold font-inter leading-[18px] transition-colors duration-200
      ${!id || isDirty ? 'bg-[#FF314A] text-white' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            {isEdit ? 'Edit' : 'Add'} Address
                        </button>
                    </div>
                </form>

            </div>

            <DeleteAccountModal
                type={'service'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                icon={Delete}
                title={"Delete Service Address"}
                decription={"Are you sure you want to delete this service address?"}
            />
        </>
    );
};

export default CreateEditServices;
