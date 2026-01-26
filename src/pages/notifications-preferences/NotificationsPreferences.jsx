import React, { useEffect } from 'react';
import SupportItems from '@/common/SupportItems/SupportItems';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from '@mui/material';
import {
    getNotificationPreferences,
    updateNotificationPreferences,
} from '@/utils/store/slices/notifications-preferences/notificationsPreferencesSlice';

const NotificationsPreferences = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const { data } = useSelector(
        (state) => state.notifications_preferences || {}
    );

    const {
        handleSubmit,
        reset,
        control,
        getValues,
        setValue,
    } = useForm({
        defaultValues: {
            unsubscribed_email: false,
            unsubscribed_push: false,
            unsubscribed_sms: false,
            unsubscribed_appts_updates: false,
            unsubscribed_marketing: false,
        },
    });

    /* ---------------- Fetch Preferences ---------------- */
    useEffect(() => {
        showLoader();
        dispatch(getNotificationPreferences()).finally(hideLoader);
    }, [dispatch]);

    /* ---------------- Populate Form ---------------- */
    useEffect(() => {
        if (!data) return;

        reset({
            unsubscribed_email: !!data.unsubscribed_email,
            unsubscribed_push: !!data.unsubscribed_push,
            unsubscribed_sms: !!data.unsubscribed_sms,
            unsubscribed_appts_updates: !!data.unsubscribed_appts_updates,
            unsubscribed_marketing: !!data.unsubscribed_marketing,
        });
    }, [data, reset]);

    /* ---------------- Helpers ---------------- */
    const syncMarketingFromChildren = () => {
        const { unsubscribed_email, unsubscribed_sms, unsubscribed_push } =
            getValues();

        const allChecked =
            unsubscribed_email &&
            unsubscribed_sms &&
            unsubscribed_push;

        setValue('unsubscribed_marketing', allChecked);
    };

    const onSubmit = async (formData) => {
        try {
            showLoader();

            await dispatch(updateNotificationPreferences(formData)).unwrap();
            await dispatch(getNotificationPreferences()).unwrap();
        } catch (error) {
            console.error('Notification update failed:', error);
        } finally {
            hideLoader();
        }
    };

    /* ================================================== */

    return (
        <>
            {/* Header */}
            <div
                className="hidden md:flex bg-white items-center justify-between w-full"
                style={{ padding: '15px 45px 15px 20px' }}
            >
                <div className="flex items-center gap-4">
                    <ChevronLeft
                        size={24}
                        className="text-primary-light cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <div className="font-filson font-bold text-xl text-primary-dark">
                        Notification Preferences
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-28">
                <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[1.25fr_auto_1fr] gap-8">
                    {/* Left */}
                    <div className="space-y-4">
                        <div className="rounded-[15px] bg-white shadow-md p-4 flex flex-col gap-4">
                            {/* Marketing */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-bold">Promotion Messages</p>
                                    <p className="text-sm">Receive promotional offers and updates.</p>
                                </div>

                                <Controller
                                    name="unsubscribed_marketing"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                            onChange={(e) => {
                                                const checked = e.target.checked;

                                                field.onChange(checked);

                                                setValue('unsubscribed_email', checked);
                                                setValue('unsubscribed_sms', checked);
                                                setValue('unsubscribed_push', checked);
                                            }}
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: '#7C868A',
                                                '&.Mui-checked': { color: '#2E2E2E' },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="border-b border-[#E4E4E4]" />

                            {/* Email */}
                            {['email', 'sms', 'push'].map((type) => (
                                <React.Fragment key={type}>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-bold">
                                            {type.toUpperCase()}
                                        </p>

                                        <Controller
                                            name={`unsubscribed_${type}`}
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.checked);
                                                        syncMarketingFromChildren();
                                                    }}
                                                    disableRipple
                                                    sx={{
                                                        p: 0,
                                                        color: '#7C868A',
                                                        '&.Mui-checked': { color: '#2E2E2E' },
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>

                                    {type !== 'push' && (
                                        <div className="border-b border-[#E4E4E4]" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="text-xs px-2">
                            Appointment updates are automatically sent with every booking.
                        </div>

                        {/* Appointment Updates */}
                        <div className="rounded-[15px] bg-white shadow-md p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-bold">Appointment Updates</p>
                                    <p className="text-sm">
                                        Booking and grooming coordination only.
                                    </p>
                                </div>

                                <Controller
                                    name="unsubscribed_appts_updates"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            {...field}
                                            checked={field.value}
                                            disabled={field.value}
                                            disableRipple
                                            sx={{
                                                p: 0,
                                                color: '#BEC3C5',
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:flex justify-center">
                        <div className="h-full w-[1px] bg-[#E4E4E4]" />
                    </div>

                    {/* Right */}
                    <div className="hidden md:block">
                        <SupportItems />
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="fixed bottom-0 w-full left-0 bg-white z-10"
                    style={{ boxShadow: '0 0 30px rgba(0,0,0,0.10)', padding: '15px 20px 25px' }}
                >
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="h-[50px] w-[390px] rounded-[10px] bg-primary-dark text-white font-bold"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default NotificationsPreferences;
