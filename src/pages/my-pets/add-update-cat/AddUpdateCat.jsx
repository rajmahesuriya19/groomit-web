import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Search } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Upload from '../../../assets/icon/upload-white.svg';
import Camera from '../../../assets/icon/camera-white.svg';
import Close from '../../../assets/icon/close.svg';
import Delete from '../../../assets/icon/delete-red.svg';
import Paw from '../../../assets/icon/pet-paw.svg';
import FallbackCat from '../../../assets/icon/cat-avatar.jpg';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { addUpdatePet, getPetProfileID, updatePetStatus } from '@/utils/store/slices/petList/petListSlice';
import DeleteDogModal from '@/components/Modals/DeleteDogModal';
import MemorialiseModal from '@/components/Modals/MemorialiseModal';
import { toast } from 'react-toastify';

// ✅ Schema
const schema = yup.object().shape({
    name: yup.string().required('Pet Name is required'),
    date_of_birth: yup.string().required('Date of Birth is required'),
    gender: yup.string().required('Gender is required'),
    vaccinated_exp_date: yup.string().nullable(),
    profile_photo: yup.mixed().nullable(),
    vaccinated_image_url: yup.mixed().nullable(),
})

const formatToMMYYYY = (dateStr) => {
    if (!dateStr) return '';

    let d;

    // Check if format is dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        d = new Date(`${year}-${month}-${day}`);
    } else {
        // Try normal parsing
        d = new Date(dateStr);
    }

    if (isNaN(d)) return '';

    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const parseMMYYYY = (val) => {
    if (!val) return ''
    const [mm, yyyy] = val.split('/')
    if (!mm || !yyyy) return ''
    return `${yyyy}-${mm}-01`
}

const AddUpdateCat = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const isEdit = Boolean(id)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memorialiseOpen, setMemorialiseOpen] = useState(false);

    const { pet: selectedPet, loading } = useSelector((state) => state.pets.selectedPet)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
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
                date_of_birth: formatToMMYYYY(selectedPet.date_of_birth),
                gender: selectedPet.gender || '',
                temperament: selectedPet.temperament || '',
                special_note: selectedPet.special_note || '',
                vaccinated_exp_date: formatToMMYYYY(selectedPet.vaccinated_exp_date),
                profile_photo: selectedPet?.photo_url || selectedPet?.profilePicture?.path || "",
                vaccinated_image_url: selectedPet.vaccinated_image_url || '',
            })
        }
    }, [selectedPet, reset, isEdit])

    // 📝 Handle Submit
    const onSubmit = (formData) => {
        const certificate = formData.vaccinated_image_url;
        const expiration = formData.vaccinated_exp_date;

        // ✅ Validation: If certificate uploaded, expiration date must exist
        if (certificate && !expiration) {
            toast.error("Expiration date is required when certificate is uploaded");
            return;
        }

        const payload = {
            ...formData,
            petType: 'cat',
            pet_id: isEdit ? id : undefined,
        }

        // convert MM/YYYY -> YYYY-MM-DD for backend
        payload.date_of_birth = parseMMYYYY(formData.date_of_birth)
        payload.vaccinated_exp_date = parseMMYYYY(formData.vaccinated_exp_date)

        // ✅ Handle profile photo correctly
        if (formData.profile_photo instanceof File) {
            payload.profile_photo = formData.profile_photo;
        } else {
            payload.profile_photo = selectedPet?.profilePicture?.path || selectedPet?.photo_url || null;
        }


        // ✅ Handle rabies certificate
        // if (formData.vaccinated_image_url instanceof File) {
        //     payload.vaccinated_image_url = formData.vaccinated_image_url?.displayName;
        // } else {
        //     payload.vaccinated_image_url = selectedPet?.vaccinated_image_url || null;
        // }

        console.log("🚀 Final Payload", payload)

        dispatch(addUpdatePet(payload)).then((res) => {
            if (!res.error) navigate('/user/pet/list')
        })
    }

    const handleDeletePet = async () => {
        if (!id) return;
        try {
            showLoader();
            await dispatch(updatePetStatus({ pet_id: id, remove_type: "D" })).unwrap();
            setIsDeleteModalOpen(false);
            navigate("/user/pet/list");
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
            setMemorialiseOpen(false);
            navigate("/user/pet/list");
        } catch (error) {
            console.error("Memorialise failed:", error);
        } finally {
            hideLoader();
        }
    };

    const selectedGender = watch('gender')

    return (
        <>
            <div className="p-4 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <button type="button"
                                onClick={() => navigate(-1)}
                                className="w-[35px] h-[35px] flex items-center justify-center rounded-full bg-white shadow-sm"
                            >
                                <ArrowLeft size={20} className="text-primary-light" />
                            </button>
                            <h2 className="text-xl font-bold text-primary-dark tracking-tight">
                                {isEdit ? 'Edit' : 'Add'} Cat
                            </h2>
                        </div>

                        {/* Main Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
                            {/* Left Card */}
                            <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm space-y-4 h-fit">
                                <div className='flex gap-6 items-center'>
                                    {/* Profile Photo Upload */}
                                    <div className="relative w-[110px] h-[110px] mx-auto shrink-0">
                                        {/* Circle Image */}
                                        {watch("profile_photo") ? (
                                            <img
                                                src={
                                                    watch("profile_photo") instanceof File
                                                        ? URL.createObjectURL(watch("profile_photo"))
                                                        : watch("profile_photo")
                                                }
                                                alt="Profile"
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={FallbackCat}
                                                alt="Fallback"
                                                className="rounded-full w-full h-full object-cover"
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
                                                    setValue('profile_photo', file)
                                                }
                                            }}
                                        />

                                        {/* Center Button */}
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('avatarUpload')?.click()}
                                            className="absolute w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#2E2E2E] border-2 border-white"
                                            style={{
                                                top: '100%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <img
                                                src={Camera}
                                                alt="Upload"
                                                className="w-[15px] h-[15px]"
                                            />
                                        </button>
                                    </div>

                                    <div className="w-full">
                                        <label className="block text-sm font-bold mb-1">
                                            Pet Name
                                        </label>
                                        <input
                                            {...register('name')}
                                            type="text"
                                            placeholder="Enter Pet Name"
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-2">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register('date_of_birth')}
                                            type="text"
                                            placeholder="MM/YYYY"
                                            className="w-full border rounded-lg px-3 py-2 pr-10"
                                        />
                                        <Calendar
                                            size={18}
                                            className="absolute right-3 top-2.5 text-gray-400"
                                        />
                                    </div>
                                    {errors.date_of_birth && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.date_of_birth.message}
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Select Gender
                                    </label>
                                    <div className="flex gap-2">
                                        {['M', 'F'].map((gender) => (
                                            <button
                                                type="button"
                                                key={gender}
                                                onClick={() => setValue('gender', gender)}
                                                className={`px-3.5 py-3 border rounded-[10px] ${selectedGender === gender
                                                    ? 'bg-brand text-white'
                                                    : 'bg-white border-[#BEC3C5]'
                                                    }`}
                                            >
                                                {gender === 'M' ? 'Male' : 'Female'}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.gender && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:flex justify-center">
                                <div className="h-full w-[1px] bg-[#C9CFD4]" />
                            </div>

                            {/* Right Card */}
                            <div>
                                {/* Additional Info */}
                                <div className="bg-white rounded-[20px] h-fit p-4 md:p-6 shadow-sm space-y-4">
                                    <div>
                                        <label className="flex justify-between items-center text-base font-bold">
                                            Additional Information <span className="font-normal text-primary-light text-sm">Optional</span>
                                        </label>

                                        <div className='font-normal text-sm text-primary-light mb-5'>Tell us more about your pet</div>

                                        <div className='font-bold text-sm mb-1'>Note</div>
                                        <textarea
                                            {...register('special_note')}
                                            placeholder="Any additional info..."
                                            className="w-full text-sm font-normal border rounded-[10px] px-3 py-2 h-24 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Rabies */}
                                <div className="bg-white mt-4 rounded-[20px] h-fit p-4 md:p-6 shadow-sm space-y-4">
                                    <div>
                                        <label className="flex justify-between items-center text-base font-bold">
                                            Rabies Vaccination
                                        </label>

                                        <div className="font-normal text-sm text-primary-light mb-5">
                                            Add expiration date & certificate
                                        </div>

                                        {/* Expiration Date */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold mb-1">Expiration Date</label>
                                            <div className="relative">
                                                <input
                                                    {...register("vaccinated_exp_date")}
                                                    type="text"
                                                    placeholder="MM/YYYY"
                                                    className={`w-full border rounded-lg px-3 py-2 ${watch("vaccinated_image_url") && !watch("vaccinated_exp_date")
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                        }`}
                                                />
                                                <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400" />
                                            </div>
                                            {/* Error message if certificate is uploaded but expiration is empty */}
                                            {watch("vaccinated_image_url") && !watch("vaccinated_exp_date") && (
                                                <p className="text-red-500 text-xs mt-2">
                                                    Expiration date is required when certificate is uploaded
                                                </p>
                                            )}
                                        </div>

                                        {/* Upload Certificate */}
                                        <div className="mb-3">
                                            <div className="flex justify-between rounded-[10px] p-4 bg-[#F1F1F1]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-base font-bold">Rabies Vaccine Certificate</div>
                                                    <div className="font-normal text-sm text-primary-light">
                                                        Upload Proof of rabies vaccination
                                                    </div>
                                                </div>
                                                <label className="p-2.5 rounded-[10px] bg-brand cursor-pointer">
                                                    <img src={Upload} alt="Upload" className="w-[24px] h-[24px]" />
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const today = new Date();
                                                                const dateStr = `${today
                                                                    .getDate()
                                                                    .toString()
                                                                    .padStart(2, "0")}-${(today.getMonth() + 1)
                                                                        .toString()
                                                                        .padStart(2, "0")}-${today.getFullYear()}`;

                                                                const renamedFile = {
                                                                    ...file,
                                                                    displayName: `Proof-of-vaccination_Added-${dateStr}${file.name.substring(
                                                                        file.name.lastIndexOf(".")
                                                                    )}`,
                                                                };

                                                                setValue("vaccinated_image_url", renamedFile);
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

                                        {/* Terms Checkbox (only edit mode) */}
                                        {/* {isEdit && (
                                            <div className="flex gap-3 mb-3 mt-3">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    className="w-[22px] h-[22px]"
                                                    required
                                                />
                                                <label htmlFor="terms" className="font-normal text-sm text-gray-600">
                                                    By adding this pet, you agree to our{" "}
                                                    <span className="text-[#3064A3] underline">Terms & Conditions</span>.
                                                </label>
                                            </div>
                                        )} */}
                                    </div>
                                </div>

                                {isEdit && <div className="flex justify-center items-center pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setMemorialiseOpen(true)}
                                        className="w-full rounded-[30px] px-4 py-2 flex items-center justify-center text-base font-bold cursor-pointer disabled:opacity-50 border border-[#BEC3C5]"
                                    >
                                        {`Memorialize ${selectedPet?.name}`}
                                    </button>
                                </div>}

                                {isEdit && <button type="button" onClick={() => setIsDeleteModalOpen(true)}
                                    className="text-[#EB5757] underline text-base flex justify-center items-center w-full py-6"
                                >
                                    {`Delete ${selectedPet?.name}’s Profile`}
                                </button>}

                                {/* Submit */}
                                <div className={`flex justify-center items-center ${isEdit ? "" : "pt-6"}`}>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-[30px] px-[27px] py-[11px] flex items-center justify-center text-base font-semibold
                 bg-brand text-white cursor-pointer disabled:opacity-50"
                                    >
                                        {isEdit ? 'Save Changes' : 'Add Cat'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <DeleteDogModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeletePet}
                icon={Delete}
                title={`Remove ${selectedPet?.name}`}
                decription={"Are you sure you want to delete this Cat?"}
            />
            <MemorialiseModal
                open={memorialiseOpen}
                onClose={() => setMemorialiseOpen(false)}
                onConfirm={handleMemorialisePet}
                icon={Paw}
                title={`Memorialise ${selectedPet?.name}`}
                decription={"We will keep your pets records and history"}
            />
        </>
    )
}

export default AddUpdateCat
