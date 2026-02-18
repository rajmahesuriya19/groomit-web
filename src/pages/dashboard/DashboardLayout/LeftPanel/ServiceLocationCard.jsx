import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { CustomInput } from '@/components/CustomInput'

import SuccessIcon from "../../../../assets/icon/tick-green.svg";
import Location from '../../../../assets/icon/location.svg';
import AddServiceAddressModal from '@/components/Modals/AddServiceAddressModal';
import { Controller, useForm } from 'react-hook-form';
import AddressInputText from '@/common/AddressInput/AddressInputText';
import SuccessModal from '@/components/Modals/SuccessModal';
import VerifyServiceArea from '@/components/Modals/VerifyServiceArea';
import { addAddress, fetchAddresses, joinWaitlist } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';
import { Checkbox } from '@mui/material';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

/* ---------------------- ADDRESS FORM ---------------------- */

const AddressForm = ({ control, register, errors, autoFilled, onSelect, type }) => (
    <div className={`${type ? '' : 'px-3 py-4'} flex items-center justify-center`}>
        <div className="space-y-4">
            <div className={`${type ? '' : 'bg-white shadow-md p-[15px] rounded-[15px]'} flex flex-col gap-4`}>
                {!type && <div className="text-base font-bold capitalize">My Address</div>}

                <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                        <AddressInputText
                            {...field}
                            label="Enter Service Address"
                            error={errors.street?.message}
                            onSelect={onSelect}
                        />
                    )}
                />

                <div className="flex gap-2">
                    <CustomInput
                        label="Apt./Suite (Optional)"
                        {...register("apartment_number")}
                    />
                    <CustomInput
                        label="City"
                        {...register("city")}
                        disabled={autoFilled.city}
                        error={!!errors.city}
                    />
                </div>

                <div className="flex gap-2">
                    <CustomInput
                        label="State"
                        {...register("state")}
                        disabled={autoFilled.state}
                        error={!!errors.state}
                    />
                    <CustomInput
                        label="Zip Code"
                        {...register("zip")}
                        disabled={autoFilled.zip}
                        error={!!errors.zip}
                    />
                </div>

                {/* Default Address Checkbox */}
                <div className="flex gap-2 items-center">
                    <Controller
                        name="isDefault"
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
                        Make this my default service address
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const schema = yup.object({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip Code is required"),
});

const ServiceLocationCard = () => {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();
    const { user } = useSelector((state) => state.user);

    const [addService, setAddService] = useState(false);
    const [verifyService, setVerifyService] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [autoFilled, setAutoFilled] = useState({
        city: false,
        state: false,
        zip: false,
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            street: '',
            apartment_number: '',
            city: '',
            state: '',
            zip: '',
            isDefault: false,
        },
    });

    const zipValue = watch("zip");

    const handleAddressSelect = async (selected) => {
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
                addr.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
            const zip =
                addr.find(c => c.types.includes("postal_code"))?.long_name || "";

            const streetValue = `${streetNumber} ${route}`.trim();

            setValue("street", streetValue, { shouldValidate: true, shouldDirty: true });
            setValue("city", city, { shouldValidate: true, shouldDirty: true });
            setValue("state", state, { shouldValidate: true, shouldDirty: true });
            setValue("zip", zip, { shouldValidate: true, shouldDirty: true });

            setAutoFilled({
                city: !!city,
                state: !!state,
                zip: !!zip,
            });

        } catch (err) {
            console.error("Geocode error:", err);
        }
    };

    const handleAddAddress = async (formData) => {
        const payload = {
            street: formData.street,
            apartment_number: formData.apartment_number || "",
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            isDefault: formData.isDefault,
        };

        console.log(formData);

        try {
            showLoader();

            await dispatch(addAddress(payload)).unwrap();
            await dispatch(fetchAddresses()).unwrap();

            setSuccessModal(true);
            setAddService(false);

            reset();
        } catch (err) {
            if (err?.isZipNotExists) {
                setVerifyService(true);
                return;
            }

            if (!err?.success) {
                reset()
            }

            console.error("Add address failed", err);
        } finally {
            hideLoader();
        }
    };

    const handleJoinWaitlist = async () => {
        try {
            await dispatch(
                joinWaitlist({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    zip: watch("zip"),
                })
            ).unwrap();

            setAddService(false);
            setVerifyService(false);
            reset();
        } catch (err) {
            console.error("Waitlist failed", err);
        }
    };

    return (
        <>
            <div className='text-base font-semibold font-inter'>
                Where do you want the service?
            </div>

            <div className="w-full">
                <div className="flex flex-col">
                    <CustomInput
                        label="Enter Your Address"
                        variant="outlined"
                        fullWidth
                        onClick={() => setAddService(true)}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <img
                                    src={Location}
                                    alt="Location"
                                    className="w-[24px] h-[24px] cursor-pointer"
                                    onClick={() => setAddService(true)}
                                />
                            )
                        }}
                    />
                </div>
            </div>

            <AddServiceAddressModal
                open={addService}
                onClose={() => {
                    setAddService(false);
                    setAutoFilled({ city: false, state: false, zip: false });
                    reset();
                }}
                title="My Address"
            >
                <form onSubmit={handleSubmit(handleAddAddress)}>
                    <AddressForm
                        control={control}
                        register={register}
                        errors={errors}
                        autoFilled={autoFilled}
                        onSelect={handleAddressSelect}
                        type={true}
                    />

                    <button
                        type="submit"
                        disabled={!isValid}
                        className="mt-4 h-[50px] w-full rounded-[10px] text-white text-base font-bold bg-primary-dark cursor-pointer disabled:opacity-50"
                    >
                        Add Address
                    </button>
                </form>
            </AddServiceAddressModal>

            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false);
                }}
                icon={SuccessIcon}
                title="Address added successfully"
            />

            <VerifyServiceArea
                open={verifyService}
                onClose={() => setVerifyService(false)}
                onConfirm={handleJoinWaitlist}
                onReset={() => reset({
                    street: '',
                    apartment_number: '',
                    city: '',
                    state: '',
                    zip: '',
                    isDefault: false,
                })}
                title="We're not in your area yet"
                description={`We'll notify you once we arrive in ${zipValue}`}
            />
        </>
    )
}

export default ServiceLocationCard