import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Succes from "../../../assets/icon/tick-green.svg";
import Eye from "../../../assets/icon/open-eye.svg";
import ClosedEye from "../../../assets/icon/closed-eye.svg";
import { ChevronLeft } from 'lucide-react';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import SupportItems from '@/common/SupportItems/SupportItems';
import { styled, TextField } from '@mui/material';
import { changePassword, resetChangePasswordState } from '@/utils/store/slices/auth/authSlice';
import NewVerifyPhoneModal from '@/components/Modals/NewVerifyPhoneModal';
import SuccessModal from '@/components/Modals/SuccessModal';
import { resetForgotPassword } from '@/utils/store/slices/userInfo/userInfoSlice';
import { CustomInput } from '@/components/CustomInput';

// ✅ Schema
const getSchema = (showField) =>
    yup.object({
        old_password: !showField
            ? yup.string().required("Current password is required")
            : yup.string().notRequired(),

        new_password: yup
            .string()
            .required("New password is required")
            .min(8, "Password must be at least 8 characters")
            .test(
                "not-same-as-old",
                "New password can’t be the same as your current password",
                function (value) {
                    const { old_password } = this.parent;
                    return !showField || value !== old_password;
                }
            ),

        password: yup
            .string()
            .required("Confirm new password is required")
            .oneOf([yup.ref("new_password")], "Oops! These passwords aren’t the same"),
    });

const ChangePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [forgotModal, setForgotModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [showField, setShowField] = useState(false);
    const [otp, setOtp] = useState(null);

    const { user } = useSelector((state) => state.user);

    const {
        changePasswordLoading,
    } = useSelector((state) => state.auth);

    const formKey = showField ? "forgot-password" : "change-password";

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm({
        key: formKey,
        resolver: yupResolver(getSchema(showField)),
        mode: "onChange",
    });

    const onSubmit = async (formData) => {
        try {
            showLoader();

            if (!showField) {
                // normal change password
                await dispatch(
                    changePassword({
                        old_password: formData.old_password,
                        password: formData.new_password,
                    })
                ).unwrap();
            } else {
                // forgot password flow (example endpoint)
                await dispatch(
                    resetForgotPassword({
                        email: user?.email,
                        otp: otp,
                    })
                ).unwrap();
            }
            setOtp('');
            setSuccessModal(true);
        } catch (error) {
            if (error?.message?.toLowerCase().includes("current")) {
                setError("old_password", {
                    type: "manual",
                    message: error.message,
                });
            }
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        return () => {
            setShowField(false);
            dispatch(resetChangePasswordState());
        };
    }, [dispatch]);

    const handleVerify = (otp) => {
        setOtp(otp);
        setShowField(true);
        setForgotModal(false);
    };

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '15px 45px 15px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>Change Password</div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-start self-stretch p-[15px] rounded-[15px] mb-6'>
                            {!showField && <div className='w-full'>
                                <div className="flex items-center justify-center gap-2 w-full">
                                    {/* Current Password */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Current Password"
                                                type="text"
                                                variant="outlined"
                                                fullWidth
                                                {...register("old_password")}
                                                error={!!errors.old_password}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.old_password && <p className="text-brand text-xs mt-1">
                                                {errors.old_password?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className='text-[#3064A3] text-end text-sm w-full underline cursor-pointer mt-3' onClick={() => setForgotModal(true)}>Forgot Password?</div>
                            </div>}

                            <div className="flex items-center justify-center gap-2 w-full">
                                {/* Create New Password */}
                                <div className="w-full">
                                    <div className="flex flex-col">
                                        <CustomInput
                                            label="Create New Password"
                                            type={showNew ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            {...register("new_password")}
                                            error={!!errors.new_password}
                                            InputProps={{
                                                endAdornment: (
                                                    <img
                                                        src={showNew ? ClosedEye : Eye}
                                                        alt="Show Password"
                                                        className="w-[24px] h-[24px] cursor-pointer"
                                                        onClick={() => setShowNew(!showNew)}
                                                    />
                                                )
                                            }}
                                        />

                                        {/* Reserve space for error text so layout stays stable */}
                                        {errors.new_password && <p className="text-brand text-xs mt-1">
                                            {errors.new_password?.message || ""}
                                        </p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 w-full">
                                {/* Confirm New Password */}
                                <div className="w-full">
                                    <div className="flex flex-col">
                                        <CustomInput
                                            label="Confirm New Password"
                                            type={showConfirm ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            {...register("password")}
                                            error={!!errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <img
                                                        src={showConfirm ? ClosedEye : Eye}
                                                        alt="Hide Password"
                                                        className="w-[24px] h-[24px] cursor-pointer"
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                    />
                                                )
                                            }}
                                        />

                                        {/* Reserve space for error text so layout stays stable */}
                                        {errors.password && <p className="text-brand text-xs mt-1">
                                            {errors.password?.message || ""}
                                        </p>}
                                    </div>
                                </div>
                            </div>

                            <div className='text-xs'>Password must be at least 8 characters with a mix of letters, numbers, and symbols</div>
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
                            disabled={!isValid}
                            className={`h-[50px] w-[390px] rounded-[10px] text-white text-base font-bold tracking-wide transition-all duration-200
    ${(!isValid)
                                    ? 'bg-primary-line cursor-not-allowed'
                                    : 'bg-primary-dark hover:opacity-90 active:scale-95'}
  `}
                        >
                            {changePasswordLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>

            <NewVerifyPhoneModal
                open={forgotModal}
                onClose={() => setForgotModal(false)}
                onConfirm={handleVerify}
                phone={user?.phone}
                email={user?.email}
            />
            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false)
                    navigate("/user/account");
                }}
                icon={Succes}
                title={'Your new password was created successfully!'}
            />
        </>
    );
};

export default ChangePassword;
