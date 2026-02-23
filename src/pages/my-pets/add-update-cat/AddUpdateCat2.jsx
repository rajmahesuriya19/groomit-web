import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import CatAnimation from '../../../assets/animation/Cat Animation.gif';
import Upload from '../../../assets/icon/upload-white.svg';
import Camera from '../../../assets/icon/camera-white.svg';
import Close from '../../../assets/icon/close.svg';
import HeartIcon from '../../../assets/icon/heart-red.svg';
import CloseIcon from "../../../assets/icon/close-circle-red.svg";
import Succes from "../../../assets/icon/tick-green.svg";
import FallbackCat from '../../../assets/icon/cat-avatar.jpg';
import CatBlack from '../../../assets/icon/cat-black.svg';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { addUpdatePet, getPetProfileID, updatePetStatus } from '@/utils/store/slices/petList/petListSlice';
import DeleteDogModal from '@/components/Modals/DeleteDogModal';
import MemorialiseModal from '@/components/Modals/MemorialiseModal';
import { toast } from 'react-toastify';
import { styled, TextField } from '@mui/material';
import SupportItems from '@/common/SupportItems/SupportItems';
import CreatePetModal from '@/components/Modals/CreatePetModal';
import BehaviourModal from '@/components/Modals/BehaviourModal';
import SuccessModal from '@/components/Modals/SuccessModal';
import RHFDatePicker from '@/components/AgePicker';
import { CustomInput } from '@/components/CustomInput';

// ✅ Schema
const schema = yup.object().shape({
    name: yup.string().required('Pet Name is required'),
    date_of_birth: yup.string().required('Date of Birth is required'),
    gender: yup.string().required('Gender is required'),
    vaccinated_exp_date: yup.string().nullable(),
    profile_photo: yup.mixed().nullable(),
    vaccinated_image_url: yup.mixed().nullable(),
})

export const normalizeDOB = (value) => {
    if (!value) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    if (/^\d{2}\/\d{4}$/.test(value)) {
        const [month, year] = value.split("/");
        return `${year}-${month}-01`;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [, month, year] = value.split("/");
        return `${year}-${month}-01`;
    }

    return value;
};

export const normalizeExpiry = (value) => {
    if (!value) return null;

    // Already correct
    if (/^\d{4}-\d{2}$/.test(value)) return value;

    // YYYY-MM-DD → strip day
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value.slice(0, 7);
    }

    // MM/YYYY
    if (/^\d{2}\/\d{4}$/.test(value)) {
        const [month, year] = value.split("/");
        return `${year}-${month}`;
    }

    // DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [, month, year] = value.split("/");
        return `${year}-${month}`;
    }

    return value;
};

const AddUpdateCat2 = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const isEdit = Boolean(id)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memorialiseOpen, setMemorialiseOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [createPetModal, setCreatePetModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [behaviourModal, setBehaviourModal] = useState(false);
    const [successTitle, setSuccessTitle] = useState('');

    const { pet: selectedPet, loading } = useSelector((state) => state.pets.selectedPet || {})

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            date_of_birth: '',
            gender: '',
            temperament: '',
            special_note: '',
            vaccinated_exp_date: '',
            profile_photo: null,
            vaccinated_image_url: null,
        },
    })

    // 🐶 Load Pet Profile for Edit Mode
    useEffect(() => {
        if (isEdit) {
            showLoader()
            dispatch(getPetProfileID(id)).finally(() => hideLoader())
        }
    }, [id, dispatch, isEdit])

    // Prefill form when selectedPet is loaded
    useEffect(() => {
        if (selectedPet && isEdit) {
            reset({
                name: selectedPet.name || '',
                date_of_birth: selectedPet.date_of_birth || "",
                gender: selectedPet.gender || '',
                temperament: selectedPet.temperament || '',
                special_note: selectedPet.special_note || '',
                vaccinated_exp_date: selectedPet.vaccinated_exp_date,
                profile_photo: selectedPet?.photo_url || selectedPet?.profilePicture?.path || "",
                vaccinated_image_url: selectedPet.vaccinated_image_url || '',
            })
        }
    }, [selectedPet, reset, isEdit])

    const dateOfBirth = watch("date_of_birth");
    const petName = watch("name");

    useEffect(() => {
        if (!dateOfBirth) return;

        const dobDate = new Date(dateOfBirth);
        const now = new Date();

        const diffMonths =
            (now.getFullYear() - dobDate.getFullYear()) * 12 +
            (now.getMonth() - dobDate.getMonth());

        if (diffMonths < 3) {
            toast.error("Pets must be a minimum of 3 months old for grooming.");
        }
    }, [dateOfBirth]);

    // 📝 Handle Submit
    const onSubmit = async (formData) => {
        const certificate = formData.vaccinated_image_url;
        const expiration = formData.vaccinated_exp_date;

        /* -------------------------
            Age validation (3 months)
        -------------------------- */
        if (formData.date_of_birth) {
            const dob = normalizeDOB(formData.date_of_birth);
            const dobDate = new Date(dob);
            const now = new Date();

            const diffMonths =
                (now.getFullYear() - dobDate.getFullYear()) * 12 +
                (now.getMonth() - dobDate.getMonth());

            if (diffMonths < 3) {
                toast.error("Pets must be a minimum of 3 months old for grooming.");
                return;
            }
        }

        /* ------------------------------------------------
            Certificate → expiration date validation
        ------------------------------------------------- */
        if (certificate && !expiration) {
            toast.error("Expiration date is required when certificate is uploaded");
            return;
        }

        showLoader();

        const payload = {
            ...formData,
            petType: "cat",
            pet_id: isEdit ? id : undefined,
            gender: formData.gender?.toUpperCase() === "M" ? "M" : "F",

            // ✅ ALWAYS normalized (changed or not)
            date_of_birth: normalizeDOB(formData.date_of_birth),
            vaccinated_exp_date: normalizeExpiry(formData.vaccinated_exp_date),
        };

        // ✅ Profile photo handling
        if (formData.profile_photo instanceof File) {
            payload.profile_photo = formData.profile_photo;
        } else {
            payload.profile_photo =
                selectedPet?.profilePicture?.path ||
                selectedPet?.photo_url ||
                null;
        }

        try {
            const res = await dispatch(addUpdatePet(payload));
            if (!res.error) {
                setCreatePetModal(true);
            }
        } finally {
            hideLoader();
        }
    };

    const handleBook = async () => {
        navigate('/book/service-address');
        setCreatePetModal(false);
    };

    const handleNavigate = async () => {
        navigate('/user/dashboard');
        setCreatePetModal(false);
    };

    const handleDeletePet = async () => {
        if (!id) return;
        try {
            showLoader();
            await dispatch(updatePetStatus({ pet_id: id, remove_type: "D" })).unwrap();
            setSuccessTitle("Your Pet has been deleted successfully.");
            setIsDeleteModalOpen(false);
            setSuccessModal(true);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            hideLoader();
        }
    };

    const handleMemorialisePet = async () => {
        if (!id) return;
        try {
            showLoader();
            await dispatch(updatePetStatus({ pet_id: id, remove_type: "M" })).unwrap();
            setSuccessTitle(`${selectedPet?.name} successfully added in Memorialized List`);
            setSuccessModal(true);
            setMemorialiseOpen(false);
        } catch (error) {
            console.error("Memorialise failed:", error);
        } finally {
            hideLoader();
        }
    };

    const selectedGender = watch('gender')
    const selectedTemperament = watch('temperament')

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '15px 45px 15px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>{isEdit ? 'Edit' : 'Add'} Cat</div>
                </div>
            </div>

            <div className='mb-8 h-full'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-4 sm:px-5 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 md:gap-6 lg:gap-8 relative">
                        {/* Left Section */}
                        <div className="space-y-4 pb-32">
                            <div className='bg-white shadow-md flex gap-3 flex-col justify-center items-center self-stretch p-[15px] rounded-[15px]'>
                                <div className="relative">
                                    {/* Circle Image */}
                                    {watch("profile_photo") ? (
                                        <img
                                            src={
                                                watch("profile_photo") instanceof File
                                                    ? URL.createObjectURL(watch("profile_photo"))
                                                    : watch("profile_photo")
                                            }
                                            alt="Profile"
                                            className="rounded-[10px] w-[100px] h-[100px] object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={FallbackCat}
                                            alt="Fallback"
                                            className="rounded-[10px] w-[100px] h-[100px] object-cover"
                                        />
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setValue('profile_photo', file, { shouldDirty: true })
                                            }
                                        }}
                                    />

                                    {/* Center Button */}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('avatarUpload')?.click()}
                                        className="absolute w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#2E2E2E] border-2 border-white"
                                        style={{
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <img
                                            src={Camera}
                                            alt="Upload"
                                            className="w-[18px] h-[18px]"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 w-full mt-5">
                                    {/* Pet Name */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Pet Name"
                                                variant="outlined"
                                                fullWidth
                                                {...register('name')}
                                                error={!!errors.name}
                                                InputProps={{
                                                    endAdornment: (
                                                        <img
                                                            src={CatBlack}
                                                            alt="Cat"
                                                            className="w-[24px] h-[24px]"
                                                        />
                                                    )
                                                }}
                                            />

                                            {/* Reserve space for error text so layout stays stable */}
                                            {errors.name && <p className="text-brand text-xs mt-1">
                                                {errors.name?.message || ""}
                                            </p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 w-full">
                                    {/* Age */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <RHFDatePicker
                                                name="date_of_birth"
                                                control={control}
                                                label="Age"
                                                views={["year", "month"]}
                                                format="MM/YYYY"
                                                dateType="past"
                                                errors={errors}
                                            />

                                            {errors.date_of_birth && (
                                                <p className="mt-1 text-xs text-brand">
                                                    {errors.date_of_birth.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="w-full">
                                        <div className="relative">
                                            <CustomInput
                                                label="Gender"
                                                variant="outlined"
                                                fullWidth
                                                value={
                                                    selectedGender?.toLowerCase() === "m"
                                                        ? "Male"
                                                        : selectedGender?.toLowerCase() === "f"
                                                            ? "Female"
                                                            : ""
                                                }
                                                // placeholder="Select Gender"
                                                error={!!errors.gender}
                                                onClick={() => setGenderDropdownOpen((prev) => !prev)}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <ChevronDown size={24} className="text-primary-light cursor-pointer" />
                                                    ),
                                                }}
                                                className="cursor-pointer"
                                            />

                                            {/* Dropdown */}
                                            {genderDropdownOpen && (
                                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                                    {[
                                                        { key: "m", label: "Male" },
                                                        { key: "f", label: "Female" },
                                                    ].map((g) => (
                                                        <div
                                                            key={g.key}
                                                            onClick={() => {
                                                                setValue("gender", g.key, { shouldDirty: true });
                                                                setGenderDropdownOpen(false);
                                                            }}
                                                            className={`px-3 py-2 cursor-pointer rounded mb-1 ${selectedGender === g.key ? "bg-[#EB5757] text-white hover:bg-[#EB5757]/90" : "hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {g.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Error text */}
                                        {errors.gender && (
                                            <p className="text-brand text-xs mt-1">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full mt-2">
                                    <label className="block text-sm font-bold mb-1">Behavior</label>

                                    <div className="flex w-full gap-2">
                                        {[
                                            { label: 'Friendly', title: 'Friendly' },
                                            { label: 'Anxious', title: 'Anxious' },
                                            { label: 'Hard to Handle', title: 'Aggressive' },
                                        ].map((item, idx) => (
                                            <button
                                                type="button"
                                                key={idx}
                                                onClick={() => {
                                                    setValue('temperament', item.title, { shouldDirty: true });
                                                    if (item.title === 'Aggressive') {
                                                        setBehaviourModal(true);
                                                    }
                                                }}
                                                className={`w-full flex flex-col items-center px-4 py-3 border rounded-[10px] transition-all
          ${selectedTemperament == item.title
                                                        ? 'text-primary-dark border-brand'
                                                        : 'bg-white border-[#BEC3C5] hover:border-brand/60'
                                                    }
        `}
                                            >
                                                <div className="text-sm font-medium">{item.label}</div>
                                            </button>
                                        ))}
                                    </div>

                                    {errors.temperament && (
                                        <p className="text-brand text-xs mt-2">{errors.temperament.message}</p>
                                    )}
                                </div>

                                <div className="w-full mt-2">
                                    <div className='flex justify-between items-center mb-1'>
                                        <div className='flex flex-col gap-1'>
                                            <label className="block text-sm font-bold">Additional information</label>
                                            <div className="font-normal text-xs">More about pet (Health conditions, allergies, etc..)</div>
                                        </div>
                                        <span className="font-normal text-xs">Optional</span>
                                    </div>
                                    {/* Enter Note */}
                                    <div className="w-full">
                                        <div className="flex flex-col">
                                            <CustomInput
                                                label="Enter Note"
                                                variant="outlined"
                                                fullWidth
                                                {...register('special_note')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-2">
                                    <div className='flex justify-between items-center mb-1'>
                                        <div className='flex flex-col gap-1'>
                                            <label className="block text-sm font-bold">Rabies Vaccination </label>
                                        </div>
                                    </div>
                                    {/* Expiration Date */}
                                    <div className="w-full mb-3">
                                        <div className="flex flex-col">
                                            <RHFDatePicker
                                                name="vaccinated_exp_date"
                                                control={control}
                                                label="Expiration Date"
                                                dateType="future"
                                                views={["year", "month"]}
                                                format="MM/YYYY"
                                                errors={errors}
                                            />

                                            {watch("vaccinated_image_url") && !watch("vaccinated_exp_date") && (
                                                <p className="text-brand text-xs mt-2">
                                                    *Please select date too along with certificate to continue
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between rounded-[10px] p-4 bg-[#F1F1F1]">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm font-bold">Rabies Vaccine Certificate</div>
                                                <div className="font-normal text-sm">
                                                    Upload Proof of rabies vaccination
                                                </div>
                                            </div>
                                            <label className="p-2.5 rounded-[10px] bg-primary-dark cursor-pointer">
                                                <img src={Upload} alt="Upload" className="w-[24px] h-[24px]" />
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setValue("vaccinated_image_url", file, { shouldDirty: true });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Show uploaded or existing certificate */}
                                    {watch("vaccinated_image_url") && (
                                        <div className="mt-2 py-1 px-3 rounded-3xl bg-black flex gap-2 items-center w-fit">
                                            <div className="font-semibold text-xs text-white">
                                                {watch("vaccinated_image_url")?.displayName ||
                                                    selectedPet?.vaccinated_image_name ||
                                                    watch("vaccinated_image_url")?.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setValue("vaccinated_image_url", null)}
                                                className="flex justify-center items-center w-5 h-5 rounded-full bg-white transition"
                                            >
                                                <img
                                                    src={Close}
                                                    alt="Close"
                                                    className="w-[10px] h-[10px] pointer-events-none"
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEdit && <div className="flex justify-center items-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setMemorialiseOpen(true)}
                                    className="w-full rounded-[10px] px-4 py-3 flex items-center justify-center text-base font-bold cursor-pointer disabled:opacity-50 border border-[#BEC3C5]"
                                >
                                    {`Memorialize ${selectedPet?.name}`}
                                </button>
                            </div>}

                            {isEdit && <button type="button" onClick={() => setIsDeleteModalOpen(true)}
                                className="rounded-[10px] font-bold text-[#EB5757] text-base flex justify-center items-center align-middle w-full px-4 py-3 border border-[#BEC3C5]"
                            >
                                Delete Pet
                            </button>}
                        </div>

                        {/* Divider Section */}
                        <div className="hidden md:flex justify-center">
                            <div className="h-full w-[1px] bg-[#E4E4E4]" />
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:block w-full min-w-0">
                            <div className="sticky top-24 space-y-4">
                                <SupportItems />
                            </div>
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
                                disabled={isEdit && !isDirty}
                                className={`h-[50px] w-[390px] rounded-[10px] text-white text-base font-bold tracking-wide transition-all duration-200
    ${!isEdit || isDirty
                                        ? 'bg-primary-dark cursor-pointer'
                                        : 'bg-primary-line cursor-not-allowed'}
  `}
                            >
                                {isEdit ? 'Save Changes' : 'Add Cat'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <DeleteDogModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeletePet(selectedPet?.pet_id)}
                icon={CloseIcon}
                title={`Delete ${selectedPet?.name}`}
                decription={"By deleting this pet’s profile, it will no longer appear in your app. Are you sure you want to continue?"}
            />
            <BehaviourModal
                open={behaviourModal}
                onClose={() => setBehaviourModal(false)}
            />
            <MemorialiseModal
                type={'add'}
                open={memorialiseOpen}
                onClose={() => setMemorialiseOpen(false)}
                onConfirm={() => handleMemorialisePet(selectedPet?.pet_id)}
                icon={HeartIcon}
                title={`Memorialise ${selectedPet?.name}`}
                decription={`We will keep your pets records and history, Are you sure you want to add ${selectedPet?.name} to memorialized list?`}
            />
            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    setSuccessModal(false)
                    navigate("/user/pet/list");
                }}
                icon={Succes}
                title={successTitle}
            />
            <CreatePetModal
                type={"cat"}
                open={createPetModal}
                onClose={() => setCreatePetModal(false)}
                onBook={handleBook}
                onNavigate={handleNavigate}
                icon={CatAnimation}
                title={`Pet Profile Successfully Created!`}
                decription={`${selectedPet ? selectedPet?.name : petName}'s profile has successfully created, Celebrate with their first booking!`}
            />
        </>
    );
};

export default AddUpdateCat2;
