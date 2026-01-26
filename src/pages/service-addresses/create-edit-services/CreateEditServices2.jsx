import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Succes from "../../../assets/icon/tick-green.svg";
import { ChevronLeft } from 'lucide-react';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import SupportItems from '@/common/SupportItems/SupportItems';
import { Checkbox, styled, TextField } from '@mui/material';
import VerifyServiceArea from '@/components/Modals/VerifyServiceArea';
import AddressInputText from '@/common/AddressInput/AddressInputText';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { addAddress, deleteAddress, joinWaitlist, updateAddress } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';
import SuccessModal from '@/components/Modals/SuccessModal';
import { CustomInput } from '@/components/CustomInput';

// ✅ Schema
const schema = yup.object().shape({
    street: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup.string().required('Zip Code is required'),
});

const CreateEditServices2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { showLoader, hideLoader } = useLoader();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [verifyService, setVerifyService] = useState(false);
    const [autoFilled, setAutoFilled] = useState({
        city: false,
        state: false,
        zip: false,
    });

    const { addresses } = useSelector((state) => state.addresses);
    const { user } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        control,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            street: '',
            apartment_number: '',
            city: '',
            state: '',
            zip: '',
            isDefault: false,
        },
    });

    useEffect(() => {
        if (isEdit && addresses?.length > 0) {
            const currentAddress = addresses.find(
                (addr) => String(addr.address_id) === String(id)
            );

            if (currentAddress) {
                reset({
                    street: currentAddress.address1 || '',
                    apartment_number: currentAddress.address2 || '',
                    city: currentAddress.city || '',
                    state: currentAddress.state || '',
                    zip: currentAddress.zip || '',
                    isDefault: currentAddress.default_address === "Y",
                });

                // ✅ Lock city, state, zip if they exist (Edit mode)
                setAutoFilled({
                    city: !!currentAddress.city,
                    state: !!currentAddress.state,
                    zip: !!currentAddress.zip,
                });
            }
        }
    }, [isEdit, addresses, id, reset]);

    const onSubmit = async (formData) => {
        const payload = {
            street: formData.street,
            apartment_number: formData.apartment_number || "",
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            isDefault: formData.isDefault,
        };

        try {
            showLoader();

            if (isEdit) {
                const currentAddress = addresses.find(
                    (addr) => String(addr.address_id) === String(id)
                );
                if (currentAddress) {
                    await dispatch(
                        updateAddress({ ...payload, address_id: currentAddress.address_id })
                    ).unwrap();
                }
            } else {
                await dispatch(addAddress(payload)).unwrap();
            }

            // ✅ navigate only if success
            navigate("/user/address");
        } catch (err) {
            if (err?.isZipNotExists) {
                setVerifyService(true);
            }
        } finally {
            hideLoader();
        }
    };

    const handleDeleteAccount = async () => {
        const currentAddress = addresses.find(addr => String(addr.address_id) === String(id));
        if (!currentAddress) return;

        try {
            showLoader();
            await dispatch(deleteAddress(currentAddress.address_id)).unwrap();
            setIsDeleteModalOpen(false);
            setSuccessModal(true);
        } catch (error) {
            console.error("Failed to delete address:", error);
            // toast.error("Failed to delete account");
        } finally {
            hideLoader();
        }
    };

    const handleJoinWaitlist = async () => {
        try {
            const payload = {
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                zip: getValues("zip"),
            };

            await dispatch(joinWaitlist(payload)).unwrap();

            setVerifyService(false);
            reset({
                street: '',
                apartment_number: '',
                city: '',
                state: '',
                zip: '',
                isDefault: false,
            });
        } catch (err) {
            console.error("Join waitlist failed:", err);
        }
    };

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '15px 45px 15px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>{isEdit ? 'Edit' : 'Add'} Service Address</div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-start self-stretch p-[15px] rounded-[15px] mb-6'>
                            <div className="flex items-center justify-center gap-2 w-full">
                                {/* Service Address */}
                                <div className="w-full">
                                    <div className="flex flex-col">
                                        <Controller
                                            name="street"
                                            control={control}
                                            rules={{ required: "Address is required" }}
                                            render={({ field }) => (
                                                <AddressInputText
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    label="Enter Service Address"
                                                    error={errors.street?.message}
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
                                                    }}
                                                />
                                            )}
                                        />

                                        {/* Reserve space for error text so layout stays stable */}
                                        {errors.street && <p className="text-brand text-xs mt-1">
                                            {errors.street?.message || ""}
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
                                            {...register("apartment_number")}
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
                                            disabled={autoFilled.state}
                                        />

                                        {/* Reserve space for error text so layout stays stable */}
                                        {errors.zip && <p className="text-brand text-xs mt-1">
                                            {errors.zip?.message || ""}
                                        </p>}
                                    </div>
                                </div>
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

                        {isEdit && <button type="button" onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-white shadow-md rounded-[10px] font-bold text-[#EB5757] text-sm flex justify-center items-center align-middle w-full px-4 py-3 border border-primary-line"
                        >
                            Delete Service Address
                        </button>}
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
                            {isEdit ? 'Save Changes' : 'Add Address'}
                        </button>
                    </div>
                </div>
            </form>

            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false)
                    navigate("/user/address");
                }}
                icon={Succes}
                title={"Your Service Address Has been deleted successfully!"}
            />
            <DeleteAccountModal
                type={'service'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title={"Delete Address"}
                decription={"Are you sure you want to delete this service address?"}
            />
            <VerifyServiceArea
                type={'service'}
                open={verifyService}
                onClose={() => setVerifyService(false)}
                onReset={() => reset({
                    street: '',
                    apartment_number: '',
                    city: '',
                    state: '',
                    zip: '',
                    isDefault: false,
                })}
                onConfirm={handleJoinWaitlist}
                title={"We're not in your area yet"}
                description={`We're not currently serving ${getValues('zip') || "your area"}, but we'll let you know as soon as we arrive!`}
            />
        </>
    );
};

export default CreateEditServices2;
