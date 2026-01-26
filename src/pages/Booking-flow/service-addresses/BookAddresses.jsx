import React, { useEffect, useState } from "react";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Radio, styled, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { geocodeByPlaceId } from "react-google-places-autocomplete";

import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import {
    addAddress,
    fetchAddresses,
    joinWaitlist,
} from "@/utils/store/slices/serviceAddressList/serviceAddressListSlice";

import AddressInputText from "@/common/AddressInput/AddressInputText";
import AddServiceAddressModal from "@/components/Modals/AddServiceAddressModal";
import VerifyServiceArea from "@/components/Modals/VerifyServiceArea";
import SuccessModal from "@/components/Modals/SuccessModal";
import SuccessIcon from "../../../assets/icon/tick-green.svg";
import { CustomInput } from "@/components/CustomInput";
import BookingFooter from "../BookingFooter";
import { setBookingAddress } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { createBookingData } from "@/utils/store/slices/auth/authSlice";

/* ---------------------------- VALIDATION ---------------------------- */

const schema = yup.object({
    street: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip Code is required"),
});

/* ---------------------- ADDRESS FORM ---------------------- */

const AddressForm = ({ control, register, errors, autoFilled, onSelect, type }) => (
    <div className={`${type ? '' : 'px-3 py-4'} flex items-center justify-center`}>
        <div className="space-y-4">
            <div className={`${type ? '' : 'bg-white shadow-md p-[15px] rounded-[15px]'} flex flex-col gap-4`}>
                {!type && <div className="text-base font-bold capitalize">My Address</div>}
                <Controller
                    name="street"
                    control={control}
                    rules={{ required: "Address is required" }}
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
                    <CustomInput label="Apt./Suite (Optional)" {...register("apartment_number")} />
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
            </div>
        </div>
    </div>
);

/* ---------------------------- MAIN PAGE ---------------------------- */

const BookAddresses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const { addresses = [] } = useSelector((state) => state.addresses);
    const { user } = useSelector((state) => state.user);
    const bookingAddress = useSelector(
        (state) => state.bookingFlow.address
    );

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addService, setAddService] = useState(false);
    const [verifyService, setVerifyService] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    const [autoFilled, setAutoFilled] = useState({
        city: false,
        state: false,
        zip: false,
    });

    const defaultAddress = addresses.find(
        (add) => add?.default_address === "Y"
    );

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    /* ---------------------- ADDRESS AUTOFILL ---------------------- */

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
                addr.find(c =>
                    c.types.includes("administrative_area_level_1")
                )?.short_name || "";
            const zip =
                addr.find(c => c.types.includes("postal_code"))?.long_name || "";

            const streetValue = `${streetNumber} ${route}`.trim();

            setValue("street", streetValue, { shouldValidate: true });
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
    };

    /* ---------------------------- SUBMIT ---------------------------- */

    const canContinue = addresses.length
        ? !!selectedAddressId
        : Object.keys(errors).length === 0;

    const handleNext = async (formData) => {
        if (!canContinue) return;

        try {
            showLoader();

            // CASE 1️⃣ Address already exists
            if (addresses.length) {
                const selectedAddress = addresses.find(
                    (addr) => addr?.address_id === selectedAddressId
                );

                dispatch(setBookingAddress(selectedAddress));
                dispatch(createBookingData());
                navigate("/book/service-type");
                return;
            }

            // CASE 2️⃣ No address → create one
            const payload = {
                street: formData.street,
                apartment_number: formData.apartment_number || "",
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                isDefault: true,
            };

            await dispatch(addAddress(payload)).unwrap();

            // refetch updated list
            const updatedAddresses = await dispatch(fetchAddresses()).unwrap();

            // get newly added default address
            const newAddress =
                updatedAddresses.find((a) => a.default_address === "Y") ||
                updatedAddresses[0];

            dispatch(setBookingAddress(newAddress));

            navigate("/book/service-type");

        } catch (err) {
            if (err?.isZipNotExists) {
                setVerifyService(true);
                return;
            }

            console.error("Booking address flow failed", err);
        } finally {
            hideLoader();
        }
    };

    const handleAddAddress = async (formData) => {
        const payload = {
            street: formData.street,
            apartment_number: formData.apartment_number || "",
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            isDefault: true,
        };

        try {
            showLoader();
            await dispatch(addAddress(payload)).unwrap();
            await dispatch(fetchAddresses()).unwrap();
            // ✅ success
            setSuccessModal(true);
            setAddService(false);
            reset();
        } catch (err) {
            // ❌ service not available in zip
            if (err?.isZipNotExists) {
                setVerifyService(true);
                // setAddService(false);
                return;
            }

            // optional: unexpected error
            console.error("Add address failed", err);
        } finally {
            hideLoader();
        }
    };

    const handleJoinWaitlist = async () => {
        await dispatch(
            joinWaitlist({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                zip: getValues("zip"),
            })
        );
        setAddService(false);
        setVerifyService(false);
        reset();
    };

    /* ---------------------------- EFFECT ---------------------------- */

    useEffect(() => {
        showLoader();
        dispatch(fetchAddresses()).finally(hideLoader);
    }, []);

    useEffect(() => {
        // If user already selected an address earlier
        if (bookingAddress?.address_id) {
            setSelectedAddressId(bookingAddress.address_id);
            return;
        }

        // Otherwise fallback to default address
        if (defaultAddress?.address_id) {
            setSelectedAddressId(defaultAddress.address_id);
        }
    }, [bookingAddress, defaultAddress]);

    /* ---------------------------- UI ---------------------------- */

    return (
        <>
            {/* HEADER */}
            <div className="w-full overflow-hidden py-[10px] bg-white shadow-sm">
                <div className="py-1 px-8 w-full hidden md:flex gap-3 items-center">
                    <ChevronLeft
                        size={25}
                        className="text-primary-light cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <div className="font-filson font-bold text-xl text-primary-dark w-full text-center">
                        Book Appointment
                    </div>
                </div>

                <div className="px-2 py-2 w-full block md:hidden">
                    <div className="flex items-center w-full">
                        <ChevronLeft
                            size={25}
                            className="text-primary-light cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        <div className="w-full text-center font-filson font-bold text-xl text-primary-dark">
                            Book Appointment
                        </div>
                    </div>
                </div>
            </div>

            {addresses.length ? (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex justify-center min-h-screen px-3 py-4">
                        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                            <div className="rounded-[15px] bg-white shadow-md p-4 space-y-2">

                                <div className="flex items-center justify-between border-b border-[#E4E4E4] pb-2">
                                    <h3 className="font-inter font-bold text-base text-primary-dark">
                                        Service Address
                                    </h3>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer"
                                        onClick={() => setAddService(true)}
                                    >
                                        <PlusIcon size={22} className="text-[#3064A3] cursor-pointer" />
                                        <div className="text-sm text-[#3064A3]">Add</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-0.5">
                                    {addresses.map((address) => (
                                        <label
                                            key={address?.address_id}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Radio
                                                checked={selectedAddressId === address?.address_id}
                                                onChange={() => {
                                                    setSelectedAddressId(address.address_id);
                                                    dispatch(setBookingAddress(address));
                                                }}
                                                sx={{
                                                    p: 0,
                                                    color: "#7C868A",
                                                    "&.Mui-checked": { color: "#FF314A" },
                                                }}
                                            />
                                            <span className="text-sm">{address?.address1} {address?.address2}, {address?.city}, {address?.state} {address?.zip}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* footer */}
                        <BookingFooter onClick={handleNext} disabled={!canContinue} />
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit(handleNext)}>
                    <AddressForm
                        control={control}
                        register={register}
                        errors={errors}
                        autoFilled={autoFilled}
                        onSelect={handleAddressSelect}
                    />

                    {/* footer */}
                    <BookingFooter onClick={handleSubmit(handleNext)} disabled={!canContinue} />
                </form>
            )}

            {/* Modals */}

            {/* ADD ADDRESS MODAL */}
            <AddServiceAddressModal
                open={addService}
                onClose={() => {
                    setAddService(false);
                    reset({
                        street: '',
                        apartment_number: '',
                        city: '',
                        state: '',
                        zip: '',
                        isDefault: false,
                    })
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
                    <button className="mt-4 h-[50px] w-full rounded-[10px] text-white text-base font-bold bg-primary-dark cursor-pointer">
                        Add Address
                    </button>
                </form>
            </AddServiceAddressModal>

            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false);
                    navigate("/book/service-type")
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
                description={`We'll notify you once we arrive in ${getValues("zip")}`}
            />
        </>
    );
};

export default BookAddresses;
