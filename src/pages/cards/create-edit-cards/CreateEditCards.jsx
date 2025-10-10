import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import backIcon from '../../../assets/icon/arrow-left.svg';
import Card from '../../../assets/icon/card-red.svg';
import userIcon from '../../../assets/icon/user.svg';
import Calender from '../../../assets/icon/red-calendar.svg';
import Lock from '../../../assets/icon/red-lock2.svg';
import Location from '../../../assets/icon/location-red.svg';
import { Checkbox } from '@mui/material';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentCard } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

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
    zip: yup.string().required('Zip Code is required'),
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreateEditCards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { addresses } = useSelector((state) => state.addresses);

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
        formState: { errors },
        reset,
        setValue,
        control
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
        if (e.target.checked) {
            reset((prev) => ({
                ...prev,
                ...defaultServiceAddress,
                isDefaultAddress: true,
            }));
        } else {
            reset((prev) => ({
                ...prev,
                address: "",
                apartment: "",
                city: "",
                state: "",
                zip: "",
                isDefaultAddress: false,
            }));
        }
    };

    const onSubmit = async (formData) => {
        const [month, year] = formData.expirationDate.split("/");

        const payload = {
            booking_session_token: "booking_session_6888c7d65d91b1.59307650",
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            cardName: formData.cardName,
            expiryMonth: month,
            expiryYear: year,
            cvv: formData.cvv,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            ...(formData.makeDefault && { makeDefault: true }),
        };

        try {
            showLoader();

            const result = await dispatch(addPaymentCard(payload)).unwrap();

            navigate("/user/account");
        } catch (error) {
            console.error("Failed to add card:", error);
        } finally {
            hideLoader();
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
                                <div className="relative">
                                    <input
                                        type="text"
                                        {...register('cardNumber')}
                                        onChange={handleCardNumberChange}
                                        maxLength={19}
                                        placeholder="Enter Card Number"
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        <img src={Card} alt="Card" className="w-[24px] h-[24px]" />
                                    </div>
                                </div>
                                <p className="text-red-500 text-sm">{errors.cardNumber?.message}</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-primary-dark font-inter">
                                        Name on Card
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter Name on Card"
                                        {...register('cardName')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        <img src={userIcon} alt="user" className="w-[24px] h-[24px]" />
                                    </div>
                                </div>
                                <p className="text-red-500 text-sm">{errors.cardName?.message}</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">Expiration Date</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            {...register('expirationDate')}
                                            onChange={handleExpiryChange}
                                            maxLength={5}
                                            className="w-full border rounded-md px-4 py-2"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            <img src={Calender} alt="Calender" className="w-[24px] h-[24px]" />
                                        </div>
                                    </div>
                                    <p className="text-red-500 text-sm">{errors.expirationDate?.message}</p>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-sm font-bold text-primary-dark font-inter">CVV</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="***"
                                            {...register('cvv')}
                                            onChange={handleCVVChange}
                                            maxLength={4}
                                            className="w-full border rounded-md px-4 py-2"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            <img src={Lock} alt="Lock" className="w-[24px] h-[24px]" />
                                        </div>
                                    </div>
                                    <p className="text-red-500 text-sm">{errors.cvv?.message}</p>
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
                                <span className="font-inter font-normal text-base leading-[21px] tracking-[-0.02em] text-primary-dark">
                                    Billing address same as service address
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 min-w-0">
                                <label className="text-sm font-bold text-primary-dark font-inter">Address</label>

                                <div className="relative min-w-0">
                                    <input
                                        type="text"
                                        placeholder="Enter Address"
                                        {...register('address')}
                                        title={defaultAddress?.address1}
                                        className="block w-full min-w-0 truncate pr-10 rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300" />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <img src={Location} alt="Location" className="w-[24px] h-[24px]" />
                                    </div>
                                </div>

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
                                        {...register('zip')}
                                        className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                                    />
                                    <div className="text-red-500 text-sm">{errors.zip?.message}</div>
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
