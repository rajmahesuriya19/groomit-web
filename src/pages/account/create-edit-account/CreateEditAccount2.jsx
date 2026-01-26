import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import avatar from '../../../assets/icon/user-big.svg';
import editIcon from '../../../assets/icon/fill-edit.svg';
import userIcon from '../../../assets/icon/user.svg';
import emailIcon from '../../../assets/icon/sms-black.svg';
import phoneIcon from '../../../assets/icon/call-black.svg';
import Info from '../../../assets/icon/info-circle-yellow.svg';
import Tick from '../../../assets/icon/tick-green.svg';
import backIcon from '../../../assets/icon/arrow-left.svg';
import passwordIcon from '../../../assets/icon/red-lock.svg';
// import CloseIcon from '../../../assets/icon/close-circle-red.svg';
import DeleteAccount from '../../../assets/modal/delete-modal.svg';
import CallIcon from '../../../assets/icon/call-green.svg';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { getUserInfo, updateUserInfo } from '@/utils/store/slices/userInfo/userInfoSlice';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import VerifyPhoneModal from '@/components/Modals/VerifyPhoneModal';
import SupportItems from '@/common/SupportItems/SupportItems';
import { Box, styled, TextField } from '@mui/material';
import { CustomInput } from '@/components/CustomInput';

// ✅ Schema
const schema = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
});

const CreateEditAccount2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { showLoader, hideLoader } = useLoader();

    const { user } = useSelector((state) => state.user);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [improveDeleteModalOpen, setImproveDeleteModalOpen] = useState(false);
    const [verifyPhoneModalOpen, setVerifyPhoneModalOpen] = useState(false);
    const [avatarImage, setAvatarImage] = useState();
    const [avatarFile, setAvatarFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            profile_photo: null,
        },
    });

    useEffect(() => {
        if (isEdit && user) {
            reset({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
            if (user.photo) setAvatarImage(user.photo);
        }
    }, [isEdit, user, reset]);

    const onSubmit = async (data) => {
        const payload = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            profile_photo: avatarFile,
        };

        console.log(payload);

        try {
            showLoader("Updating profile...");
            const result = await dispatch(updateUserInfo(payload)).unwrap();
            navigate("/user/account");
        } catch (error) {
            console.error("❌ Failed to update profile:", error);
        } finally {
            hideLoader();
        }
    };


    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(false);
        setImproveDeleteModalOpen(true);
    };

    const handleVerifyPhone = (otp) => {
        dispatch(getUserInfo())
        setVerifyPhoneModalOpen(false);
    };

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '15px 45px 15px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate("/user/account")} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>{isEdit ? 'Edit' : 'Create'} Profile</div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-center self-stretch p-[15px] rounded-[15px]'>
                            <div className="relative">
                                <img src={avatarImage ? avatarImage : 'https://dev.groomit.me/v6/images/profile-avatar.svg'} alt="Profile" className="rounded-[10px] w-[100px] h-[100px] object-cover" />
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
                                            setAvatarFile(file);
                                            setValue('profile_photo', file);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('avatarUpload')?.click()}
                                    className="absolute left-1/2 -translate-x-1/2 bottom-[-0.8rem]"
                                >
                                    <img src={editIcon} alt="Edit" className="w-[32px] h-[32px]" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-full mt-5">
                                {/* First Name */}
                                <div className="w-full">
                                    <div className="flex flex-col">
                                        <CustomInput
                                            label="First Name"
                                            variant="outlined"
                                            fullWidth
                                            {...register("first_name")}
                                            error={!!errors.first_name}
                                        />

                                        {/* Reserve space for error text so layout stays stable */}
                                        {errors.first_name && <p className="text-brand text-xs mt-1">
                                            {errors.first_name?.message || ""}
                                        </p>}
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="w-full">
                                    <div className="flex flex-col">
                                        <CustomInput
                                            label="Last Name"
                                            variant="outlined"
                                            fullWidth
                                            {...register("last_name")}
                                            error={!!errors.last_name}
                                        />
                                        {/* Reserve space for error text */}
                                        {errors.last_name && <p className="text-brand text-xs mt-1">
                                            {errors.last_name?.message || ""}
                                        </p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-full">
                                {/* Email */}
                                <div className="relative w-full">
                                    <CustomInput
                                        label="Email Address"
                                        variant="outlined"
                                        fullWidth
                                        {...register("email")}
                                        error={!!errors.email}
                                        InputProps={{
                                            endAdornment: (
                                                <img
                                                    src={!user?.is_email_verified ? emailIcon : Tick}
                                                    alt="Email"
                                                    className="w-[24px] h-[24px]"
                                                />
                                            )
                                        }}
                                    />
                                    {/* Reserve space for error text */}
                                    <p className="text-brand text-xs mt-1">
                                        {errors.email?.message || ""}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-full">
                                {/* Phone */}
                                <div className="relative w-full">
                                    <CustomInput
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        {...register("phone")}
                                        error={!!errors.phone}
                                        InputProps={{
                                            endAdornment: (
                                                <div className="flex items-center gap-2">
                                                    {!user?.is_phone_verified ? (
                                                        <>
                                                            <img src={Info} alt="Info" className="w-[24px] h-[24px]" />

                                                            <button
                                                                type="button"
                                                                onClick={() => setVerifyPhoneModalOpen(true)}
                                                                className="inline-flex h-[30px] px-3 justify-center 
                                           items-center gap-1 rounded-[30px] bg-[#2E2E2E]
                                           text-white text-sm font-inter"
                                                            >
                                                                Verify
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <img
                                                            src={phoneIcon}
                                                            alt="Phone"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )}
                                                </div>
                                            ),
                                        }}
                                    />
                                    {/* Reserve space for error text */}
                                    <p className="text-brand text-xs mt-1">
                                        {errors.phone?.message || ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-center mt-1'>
                            <button
                                type='button'
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="text-[#EB5757] underline text-base"
                            >
                                Delete My account
                            </button>
                        </div>
                    </div>

                    {/* Divider Section */}
                    <div className="hidden md:flex justify-center">
                        <div className="h-full w-[1px] bg-[#E4E4E4]" />
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4 w-full min-w-0 hidden md:block">
                        {/* Support List */}
                        <SupportItems />
                    </div>
                </div>

                {/* footer */}
                <div
                    className="fixed bottom-0 w-full left-0 bg-white z-10"
                    style={{
                        boxShadow: '0 0 30px rgba(0,0,0,0.10)',
                        padding: '15px 20px 25px'
                    }}
                >
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`h-[50px] w-[390px] rounded-[10px] text-white text-base font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 ${!id || isDirty ? 'bg-primary-dark cursor-pointer' : 'bg-primary-line cursor-not-allowed'}`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

            <DeleteAccountModal
                type={'account'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                improveDeleteModalOpen={improveDeleteModalOpen}
                setImproveDeleteModalOpen={setImproveDeleteModalOpen}
                onConfirm={handleDeleteAccount}
                icon={DeleteAccount}
                title={"We’re sad to see you go"}
                decription={"If you delete your account, all your data and history will be permanently removed. Are you sure you want to continue?"}
            />
            <VerifyPhoneModal
                open={verifyPhoneModalOpen}
                onClose={() => setVerifyPhoneModalOpen(false)}
                onConfirm={handleVerifyPhone}
                icon={CallIcon}
                title="Verify Phone Number"
                description={`Verification Code sent to ${user?.phone}`}
                phone={user?.phone}
            />
        </>
    );
};

export default CreateEditAccount2;
