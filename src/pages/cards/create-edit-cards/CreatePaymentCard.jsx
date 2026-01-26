import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Succes from "../../../assets/icon/tick-green.svg";
import Card from '../../../assets/icon/card.svg';
import userIcon from '../../../assets/icon/user-black.svg';
import lockIcon from '../../../assets/icon/lock-black2.svg';
import calendarIcon from '../../../assets/icon/calendar-black.svg';
import { ChevronLeft } from 'lucide-react';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import SupportItems from '@/common/SupportItems/SupportItems';
import { Checkbox, styled, TextField } from '@mui/material';
import VerifyServiceArea from '@/components/Modals/VerifyServiceArea';
import AddressInputText from '@/common/AddressInput/AddressInputText';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import SuccessModal from '@/components/Modals/SuccessModal';
import { addPaymentCard } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import { CustomInput } from '@/components/CustomInput';

// ✅ Validation schema
const schema = yup.object().shape({
    cardNumber: yup
        .string()
        .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Enter a valid 16-digit card number')
        .required('Card Number is required'),
    cardName: yup.string().required('Name on Card is required'),
    expirationDate: yup
        .string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Enter a valid Expiration Date (MM/YY)')
        .required('Expiration Date is required'),
    cvv: yup
        .string()
        .matches(/^\d{3,4}$/, 'Enter a valid 3 or 4 digit CVV')
        .required('CVV is required'),

    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup
        .string()
        .matches(/^\d{5}$/, 'Enter a valid ZIP code')
        .required('Zip Code is required'),
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreatePaymentCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { addresses } = useSelector((state) => state.addresses);
    const token = useSelector((state) => state.auth.unique_token);

    const [successModal, setSuccessModal] = useState(false);
    const [autoFilled, setAutoFilled] = useState({
        city: false,
        state: false,
        zip: false,
    });

    const defaultAddress = addresses.find(addr => addr.default_address === "Y")

    const defaultServiceAddress = {
        address: defaultAddress?.address1,
        apartment: defaultAddress?.address2,
        city: defaultAddress?.city,
        state: defaultAddress?.state,
        zip: defaultAddress?.zip,
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
        control,
        getValues
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cardNumber: '',
            cardName: '',
            expirationDate: '',
            cvv: '',
            makeDefault: false,

            isDefaultAddress: false,
            address: '',
            apartment: '',
            city: '',
            state: '',
            zip: '',
        },
    });

    // ✅ Format Card Number (#### #### #### ####)
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setValue('cardNumber', value);
    };

    // ✅ Format Expiration Date (MM/YY)
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        setValue('expirationDate', value);
    };

    // ✅ CVV (only numbers, max 4 digits, hidden as ***)
    const handleCVVChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setValue('cvv', value);
    };

    // ✅ Autofill Billing Address if same as Service Address
    const handleBillingCheckbox = (e) => {
        const checked = e.target.checked;

        if (checked) {
            reset({
                ...getValues(),
                ...defaultServiceAddress,
                isDefaultAddress: true,
            });

            setAutoFilled({
                city: !!defaultServiceAddress?.city,
                state: !!defaultServiceAddress?.state,
                zip: !!defaultServiceAddress?.zip,
            });

            console.log(defaultServiceAddress);

        } else {
            reset({
                ...getValues(),
                address: "",
                apartment: "",
                city: "",
                state: "",
                zip: "",
                isDefaultAddress: false,
            });
        }
    };

    const onSubmit = async (formData) => {
        const [month, year] = formData.expirationDate.split("/");

        const payload = {
            booking_session_token: token,
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            cardName: formData.cardName,
            expiryMonth: month,
            expiryYear: year,
            cvv: formData.cvv,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            makeDefault: Boolean(formData.makeDefault),
        };

        try {
            showLoader();
            const result = await dispatch(addPaymentCard(payload)).unwrap();
            setSuccessModal(true);
        } catch (error) {
            console.error("Failed to add card:", error);
        } finally {
            hideLoader();
        }
    };

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '15px 45px 15px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>{isEdit ? 'Verify' : 'Add'} Card</div>
                </div>
            </div>

            <div className='mb-8 h-full'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                        {/* Left Section */}
                        <div className="space-y-4">
                            <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-start self-stretch p-[15px] rounded-[15px] mb-6'>
                                <div className="flex items-center justify-center gap-2 w-full">
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Card Number"
                                                variant="outlined"
                                                fullWidth
                                                {...register("cardNumber")}
                                                onChange={handleCardNumberChange}
                                                maxLength={19}
                                                error={!!errors.cardNumber}
                                                InputProps={{
                                                    endAdornment: (
                                                        <img
                                                            src={Card}
                                                            alt="Card"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )
                                                }}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.cardNumber && <p className="text-brand text-xs mt-1">
                                                {errors.cardNumber?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full">
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Name on Card"
                                                variant="outlined"
                                                fullWidth
                                                {...register("cardName")}
                                                error={!!errors.cardName}
                                                InputProps={{
                                                    endAdornment: (
                                                        <img
                                                            src={userIcon}
                                                            alt="user"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )
                                                }}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.cardName && <p className="text-brand text-xs mt-1">
                                                {errors.cardName?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full">
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Expiration Date"
                                                variant="outlined"
                                                fullWidth
                                                {...register("expirationDate")}
                                                onChange={handleExpiryChange}
                                                maxLength={5}
                                                error={!!errors.expirationDate}
                                                InputProps={{
                                                    endAdornment: (
                                                        <img
                                                            src={calendarIcon}
                                                            alt="calendar"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )
                                                }}
                                            />
                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.expirationDate && <p className="text-brand text-xs mt-1">
                                                {errors.expirationDate?.message || ""}
                                            </p>}
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                type="password"
                                                label="CVV"
                                                variant="outlined"
                                                fullWidth
                                                {...register("cvv")}
                                                onChange={handleCVVChange}
                                                maxLength={4}
                                                error={!!errors.cvv}
                                                InputProps={{
                                                    endAdornment: (
                                                        <img
                                                            src={lockIcon}
                                                            alt="CVV"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )
                                                }}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.cvv && <p className="text-brand text-xs mt-1">
                                                {errors.cvv?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <Controller
                                        name="makeDefault"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
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
                                        )}
                                    />
                                    <span className="font-inter font-normal text-sm text-primary-dark">
                                        Make this my default payment method
                                    </span>
                                </div>
                            </div>

                            <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-start self-stretch p-[15px] rounded-[15px] mb-6'>
                                <div className='flex justify-between items-center w-full border-b border-[#E4E4E4] pb-2'>
                                    <div className='font-base font-bold'>Billing Address</div>
                                </div>

                                {/* Default Address Checkbox */}
                                <div className="flex gap-2 items-center">
                                    <Controller
                                        name="isDefaultAddress"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={handleBillingCheckbox}
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
                                        )}
                                    />
                                    <span className="font-inter font-normal text-sm text-primary-dark">
                                        Billing address same as service address
                                    </span>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full">
                                    {/* Service Address */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <Controller
                                                name="address"
                                                control={control}
                                                rules={{ required: "Address is required" }}
                                                render={({ field }) => (
                                                    <AddressInputText
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        label="Enter Service Address"
                                                        error={errors.address?.message}
                                                        onSelect={async (selected) => {
                                                            if (!selected) return;

                                                            try {
                                                                const placeId =
                                                                    selected.value?.place_id || selected.value?.placeId;
                                                                if (!placeId) return;

                                                                const results = await geocodeByPlaceId(placeId);
                                                                if (!results.length) return;

                                                                const addr = results[0].address_components;

                                                                const streetNumber =
                                                                    addr.find(c => c.types.includes("street_number"))?.long_name || "";
                                                                const route =
                                                                    addr.find(c => c.types.includes("route"))?.long_name || "";
                                                                const city =
                                                                    addr.find(c => c.types.includes("locality"))?.long_name ||
                                                                    addr.find(c => c.types.includes("sublocality"))?.long_name || "";
                                                                const state =
                                                                    addr.find(c =>
                                                                        c.types.includes("administrative_area_level_1")
                                                                    )?.short_name || "";
                                                                const zip =
                                                                    addr.find(c => c.types.includes("postal_code"))?.long_name || "";

                                                                const streetValue = `${streetNumber} ${route}`.trim();

                                                                setValue("address", streetValue, { shouldValidate: true });
                                                                setValue("city", city, { shouldValidate: true });
                                                                setValue("state", state, { shouldValidate: true });
                                                                setValue("zip", zip, { shouldValidate: true });

                                                                setAutoFilled({
                                                                    city: !!city,
                                                                    state: !!state,
                                                                    zip: !!zip,
                                                                });
                                                            } catch (err) {
                                                                console.error("Geocode error:", err);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.address && <p className="text-brand text-xs mt-1">
                                                {errors.address?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full">
                                    {/* Apt./Suite (Optional) */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Apt./Suite (Optional)"
                                                variant="outlined"
                                                fullWidth
                                                {...register("apartment")}
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="City"
                                                variant="outlined"
                                                fullWidth
                                                {...register("city")}
                                                error={!!errors.city}
                                                disabled={autoFilled.city}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.city && <p className="text-brand text-xs mt-1">
                                                {errors.city?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full">
                                    {/* State */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="State"
                                                variant="outlined"
                                                fullWidth
                                                {...register("state")}
                                                error={!!errors.state}
                                                disabled={autoFilled.state}
                                            />
                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.state && <p className="text-brand text-xs mt-1">
                                                {errors.state?.message || ""}
                                            </p>}
                                        </div>
                                    </div>

                                    {/* Zip Code */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Zip Code"
                                                variant="outlined"
                                                fullWidth
                                                {...register("zip")}
                                                error={!!errors.zip}
                                                disabled={autoFilled.zip}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.zip && <p className="text-brand text-xs mt-1">
                                                {errors.zip?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>
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
                                {isEdit ? 'Verify' : 'Add'} Card
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false)
                    navigate("/user/payment/card/list");
                }}
                icon={Succes}
                title={'Your Payment card has been successfully added'}
            />
        </>
    );
};

export default CreatePaymentCard;
