import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import backIcon from '../../../assets/icon/arrow-left.svg';
import Delete from '../../../assets/icon/delete-red.svg';
import Location from '../../../assets/icon/location.svg';
import { Autocomplete, Checkbox, CircularProgress, TextField } from '@mui/material';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, deleteAddress, joinWaitlist, updateAddress } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';
import AddressInputText from '@/common/AddressInput/AddressInputText';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import VerifyServiceArea from '@/components/Modals/VerifyServiceArea';

// ✅ Schema
const schema = yup.object().shape({
    street: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup.string().required('Zip Code is required'),
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreateEditServices = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        console.log(formData);

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
            navigate("/user/account");
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
            navigate("/user/account");
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
                            {isEdit ? 'Edit' : 'Add'} New Address
                        </h2>
                    </div>

                    {isEdit && <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-[#EB5757] underline text-base"
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
                            <ChevronLeft size={24} className="text-primary-light" />
                        </button>

                        <h2 className="text-xl font-bold text-primary-dark">
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
                                <label className="text-sm font-bold text-primary-dark font-inter">Address</label>
                                {/* <input
                                    type="text"
                                    placeholder="123 Main Street"
                                    {...register('street')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                /> */}
                                <Controller
                                    name="street"
                                    control={control}
                                    rules={{ required: "Address is required" }}
                                    render={({ field }) => (
                                        <AddressInputText
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="123 Main Street"
                                            error={errors.street?.message}
                                            onSelect={async (selected) => {
                                                if (!selected) return;
                                                try {
                                                    const placeId = selected.value?.place_id || selected.value?.placeId;
                                                    if (!placeId) return;

                                                    const results = await geocodeByPlaceId(placeId);
                                                    if (!results.length) return;

                                                    const addrComponents = results[0].address_components;

                                                    const streetNumber =
                                                        addrComponents.find((c) => c.types.includes("street_number"))?.long_name || "";
                                                    const route =
                                                        addrComponents.find((c) => c.types.includes("route"))?.long_name || "";
                                                    const city =
                                                        addrComponents.find((c) => c.types.includes("locality"))?.long_name ||
                                                        addrComponents.find((c) => c.types.includes("sublocality"))?.long_name ||
                                                        "";
                                                    const state =
                                                        addrComponents.find((c) =>
                                                            c.types.includes("administrative_area_level_1")
                                                        )?.short_name || "";
                                                    const zip =
                                                        addrComponents.find((c) => c.types.includes("postal_code"))?.long_name || "";

                                                    // ✅ Set values
                                                    const streetValue = `${streetNumber} ${route}`.trim();
                                                    setValue("street", streetValue.length > 0 ? streetValue : "", { shouldValidate: true });
                                                    setValue("city", city, { shouldValidate: true });
                                                    setValue("state", state, { shouldValidate: true });
                                                    setValue("zip", zip, { shouldValidate: true });

                                                    // ✅ Lock only if autofilled
                                                    setAutoFilled({
                                                        city: !!city,
                                                        state: !!state,
                                                        zip: !!zip,
                                                    });
                                                } catch (err) {
                                                    console.error("Geocoding error:", err);
                                                }
                                            }}
                                        />
                                    )}
                                />
                                <div className="text-red-500 text-sm">{errors.street?.message}</div>
                            </div>

                            {/* Apartment or suite number */}
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
                                    placeholder="Apt 204"
                                    {...register('apartment_number')}
                                    className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px bg-[#C9CFD4]" />

                        {/* Right column */}
                        <div className="flex flex-col md:w-1/2 gap-4">
                            {/* City */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-primary-dark font-inter">City</label>
                                <input
                                    type="text"
                                    placeholder="New York"
                                    {...register("city")}
                                    disabled={autoFilled.city}
                                    className={`w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] 
    tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300
    ${autoFilled.city ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                                />
                                <div className="text-red-500 text-sm">{errors.city?.message}</div>
                            </div>

                            {/* State & Zip Code */}
                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">State</label>
                                    <input
                                        type="text"
                                        placeholder="NY"
                                        {...register("state")}
                                        disabled={autoFilled.state}
                                        className={`w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] 
    tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300
    ${autoFilled.state ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                                    />
                                    <div className="text-red-500 text-sm">{errors.state?.message}</div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">Zip Code</label>
                                    <input
                                        type="text"
                                        placeholder="10001"
                                        {...register("zip")}
                                        disabled={autoFilled.zip}
                                        className={`w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] 
    tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300
    ${autoFilled.zip ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                                    />
                                    <div className="text-red-500 text-sm">{errors.zip?.message}</div>
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
                                <span className="font-inter font-normal text-base leading-[21px] tracking-[-0.02em] text-primary-dark">
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
                            className={`w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] text-center transition-colors duration-200
      ${!id || isDirty ? 'bg-brand text-white cursor-pointer' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
                        >
                            Add Address
                        </button>
                    </div>

                    {/* Mobile Delete Button */}
                    {isEdit && <div className="md:hidden px-5 pt-4 text-center mb-28">
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="text-[#EB5757] underline text-base"
                        >
                            Delete Service Address
                        </button>
                    </div>}

                    {/* Sticky Mobile Save Button */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                        <button
                            type="submit"
                            disabled={!!id && !isDirty}
                            className={`w-full h-[48px] rounded-[30px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] transition-colors duration-200
      ${!id || isDirty ? 'bg-brand text-white' : 'bg-[#BEC3C5] text-white cursor-not-allowed'}`}
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
                icon={Location}
                title={"Address"}
                description={"Sorry! We are not currently in your area but we will notify you once we are there"}
            />
        </>
    );
};

export default CreateEditServices;
