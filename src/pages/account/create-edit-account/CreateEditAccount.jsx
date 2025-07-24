import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import avatar from '../../../assets/icon/user-big.svg';
import editIcon from '../../../assets/icon/fill-edit.svg';
import userIcon from '../../../assets/icon/user.svg';
import emailIcon from '../../../assets/icon/sms-red.svg';
import phoneIcon from '../../../assets/icon/phone-red.svg';
import backIcon from '../../../assets/icon/arrow-left.svg';
import passwordIcon from '../../../assets/icon/red-lock.svg';
import { ChevronRight } from 'lucide-react';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
});

const CreateEditAccount = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [avatarImage, setAvatarImage] = useState(avatar);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (isEdit) {
            reset({
                firstName: 'Andrew',
                lastName: 'Smith',
                email: 'andrewsmith124@mail.com',
                phone: '+12345 67890',
            });
        }
    }, [isEdit, reset]);

    const onSubmit = (data) => {
        console.log(isEdit ? 'Updating profile:' : 'Creating profile:', data);
    };

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(false);
        alert('Account deleted');
    };


    return (
        <>
            <div className="w-full px-4 md:px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center shadow">
                            <img src={backIcon} alt="Back" className="w-[24px] h-[24px]" />
                        </button>
                        <h2 className="text-[20px] font-bold text-[#2E2E2E]">{isEdit ? 'Edit' : 'Create'} Profile</h2>
                    </div>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-[#EB5757] underline text-[16px]"
                    >
                        Delete My account
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white rounded-[15px] shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col gap-6 md:w-1/2">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative w-[110px] h-[110px] mx-auto md:mx-0 shrink-0">
                                    <img src={avatarImage} alt="Profile" className="rounded-full w-full h-full object-cover" />

                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => setAvatarImage(reader.result);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />

                                    <button type="button" onClick={() => document.getElementById('avatarUpload')?.click()} className="absolute bottom-0 right-0">
                                        <img src={editIcon} alt="Edit" className="w-[32px] h-[32px]" />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            {...register('firstName')}
                                            className="w-full rounded-md border border-[#E2E2E2] px-4 pr-10 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter font-normal text-[#2E2E2E] placeholder:text-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            <img src={userIcon} alt="User" className="w-[20px] h-[20px]" />
                                        </div>
                                    </div>
                                    <div className="text-red-500 text-sm">{errors.firstName?.message}</div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            {...register('lastName')}
                                            className="w-full rounded-md border border-[#E2E2E2] px-4 pr-10 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter font-normal text-[#2E2E2E] placeholder:text-gray-300"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            <img src={userIcon} alt="User" className="w-[20px] h-[20px]" />
                                        </div>
                                    </div>
                                    <div className="text-red-500 text-sm">{errors.lastName?.message}</div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="flex items-center justify-between h-[54px] bg-white rounded-[15px] px-[15px] shadow-[0_0_40px_0_rgba(0,0,0,0.1)]"
                            >
                                <div className="flex items-center gap-2">
                                    <img src={passwordIcon} alt="Lock" className="w-[24px] h-[24px]" />
                                    <span className="text-[#2E2E2E] font-inter font-bold text-[14px] leading-[100%] tracking-[-0.01em]">
                                        Change Password
                                    </span>
                                </div>
                                <ChevronRight size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="hidden md:block w-px bg-[#C9CFD4]" />

                        <div className="flex flex-col md:w-1/2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        {...register("email", {
                                            required: "required",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Entered value does not match email format"
                                            }
                                        })}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 pr-10 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter font-normal text-[#2E2E2E] placeholder:text-gray-300"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        <img src={emailIcon} alt="Email" className="w-[20px] h-[20px]" />
                                    </div>
                                </div>
                                {errors.email && <div className="text-red-500 text-sm">{errors.email?.message}</div>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#2E2E2E] font-inter">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder='Phone Number'
                                        {...register('phone')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 pr-10 py-2 text-[16px] leading-[21px] tracking-[-0.02em] font-inter font-normal text-[#2E2E2E] placeholder:text-gray-300"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        <img src={phoneIcon} alt="Phone" className="w-[20px] h-[20px]" />
                                    </div>
                                </div>
                                <div className="text-red-500 text-sm">{errors.phone?.message}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center py-8">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-[16px] font-semibold font-inter leading-[18px] text-center transition-colors duration-200
    ${!id || isDirty ? 'bg-[#FF314A] text-white cursor-pointer' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <DeleteAccountModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </>
    );
};

export default CreateEditAccount;
