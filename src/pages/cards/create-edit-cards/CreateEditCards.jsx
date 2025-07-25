import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import backIcon from '../../../assets/icon/arrow-left.svg';
import { Checkbox } from '@mui/material';
import { ChevronLeft } from 'lucide-react';

const schema = yup.object().shape({
    cardNumber: yup.string().required('Card Number is required'),
    nameOnCard: yup.string().required('Name on Card is required'),
    expirationDate: yup.string().required('Expiration Date is required'),
    cvv: yup.string().required('CVV is required'),

    address: yup.string().required('Address is required'),
    apartment: yup.string().required('Apartment or suite number is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().required('Zip Code is required'),
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreateEditCards = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cardNumber: '',
            nameOnCard: '',
            expirationDate: '',
            cvv: '',
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
                cardNumber: '1234 5678 9222 0034',
                nameOnCard: 'Craig Jhohnson Shiik',
                expirationDate: '02/29',
                cvv: '123',

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
                        <h2 className="text-xl font-bold text-primary-dark">
                            {isEdit ? 'Verify' : 'Add'} Card
                        </h2>
                    </div>
                </div>

                <div className="md:mx-0 -mx-4 -my-6 mb-6">
                    <div className="flex md:hidden items-center justify-between bg-white px-5 py-4 h-[64px] w-full">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center"
                        >
                            <ChevronLeft size={24} className="text-primary-light" />
                        </button>

                        <h2 className="text-xl font-bold text-primary-dark">
                            {isEdit ? 'Verify' : 'Add'} a Card
                        </h2>

                        <div className="w-[24px] h-[24px]" />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-[15px] p-4 md:p-6 flex flex-col md:flex-row gap-8 bg-white shadow-md md:shadow-md md:bg-white">
                        <div className="flex flex-col gap-4 md:w-1/2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-primary-dark font-inter">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter Card Number"
                                    {...register('cardNumber')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.cardNumber?.message}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-primary-dark font-inter">
                                        Name on Card
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Name on Card"
                                    {...register('nameOnCard')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.nameOnCard?.message}</div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">Expiration Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        {...register('expirationDate')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.expirationDate?.message}</div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="Enter CVV"
                                        {...register('cvv')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.cvv?.message}</div>
                                </div>
                            </div>

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
                                <span className="font-inter font-normal text-base leading-[21px] tracking-[-0.02em] text-primary-dark">
                                    Make this my default payment method
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px bg-[#C9CFD4]" />

                        {/* Right column */}
                        <div className="flex flex-col md:w-1/2 gap-4">
                            <h2 className="text-xl font-bold text-primary-dark">
                                Billing Address
                            </h2>
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
                                <span className="font-inter font-normal text-base leading-[21px] tracking-[-0.02em] text-primary-dark">
                                    Billing address same as service address
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-primary-dark font-inter">Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter Address"
                                    {...register('address')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.address?.message}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-primary-dark font-inter">
                                        Apartment or suite number
                                    </label>
                                    <span className="font-inter font-normal italic text-sm leading-[100%] text-primary-light text-right">
                                        Optional
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter No / # If You’ve"
                                    {...register('apartment')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.apartment?.message}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-primary-dark font-inter">City</label>
                                <input
                                    type="text"
                                    placeholder="Enter City"
                                    {...register('city')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                                <div className="text-red-500 text-sm">{errors.city?.message}</div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter State"
                                        {...register('state')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.state?.message}</div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">Zip Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Zip"
                                        {...register('zipCode')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.zipCode?.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Submit Button */}
                    <div className="hidden md:flex justify-center items-center py-8">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] text-center transition-colors duration-200
      ${!id || isDirty ? 'bg-brand text-white cursor-pointer' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            {isEdit ? 'Verify' : 'Add'} Card
                        </button>
                    </div>

                    {/* Sticky Mobile Save Button */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-full h-[48px] rounded-[30px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] transition-colors duration-200
      ${!id || isDirty ? 'bg-brand text-white' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            {isEdit ? 'Verify' : 'Add'} Card
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateEditCards;
