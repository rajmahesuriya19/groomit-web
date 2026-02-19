import Card from "@/common/Booking-Flow/Card";
import { CustomInput } from "../CustomInput";
import { ChevronDown, Search } from 'lucide-react'
import RHFDatePicker from '@/components/AgePicker';

import DogBlack from '../../assets/icon/dog-black.svg';
import SuccessIcon from "../../assets/icon/tick-green.svg";
import Searchh from '../../assets/icon/search-black.svg';
import { useDispatch, useSelector } from "react-redux";
import { getBookingPetSizes } from "@/utils/store/slices/booking-flow/bookingFlowSlice";

export const StepOneContentDog = ({
    showSuccess,
    register,
    errors,
    control,
    watch,
    setValue,
    selectedGender,
    selectedSize,
    selectedBreedName,
    setBreedListModalOpen,
    breedListModalOpen,
    searchTerm,
    setSearchTerm,
    filteredBreeds,
    setSelectedBreedName,
    setGenderDropdownOpen,
    genderDropdownOpen,
    isDirty,
}) => {
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.unique_token);
    const { petSizes } = useSelector((state) => state.bookingFlow);

    const selectedBreedId = watch("breed_id");

    // 🔒 Normalize gender safely
    const normalizedGender =
        selectedGender === "m" || selectedGender === "M" || selectedGender === "F" || selectedGender === "f"
            ? selectedGender
            : null;

    const genderLabel =
        normalizedGender === "m" || normalizedGender === "M"
            ? "Male"
            : normalizedGender === "f" || normalizedGender === "F"
                ? "Female"
                : "";

    return (
        <Card title="Dog Details"
            action={showSuccess &&
                <div
                    className="flex items-center gap-1 text-[#3064A3] cursor-pointer"
                >
                    <img src={SuccessIcon} alt="Success" className="w-6 h-6 cursor-pointer" />
                </div>
            }
        >
            <div className="flex items-center justify-center gap-2 w-full pt-2">
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
                                        src={DogBlack}
                                        alt="Email"
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

                {/* Age */}
                <div className="w-2/5">
                    <div className="flex flex-col">
                        <RHFDatePicker
                            name="date_of_birth"
                            control={control}
                            label="Date of Birth"
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
            </div>

            <div className="flex items-center justify-center gap-2 w-full">
                <div className="w-full cursor-pointer">
                    <CustomInput
                        label="Breed"
                        variant="outlined"
                        fullWidth
                        value={selectedBreedName}
                        placeholder=""
                        error={!!errors.breed_id}
                        onClick={() => setBreedListModalOpen(true)}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <img
                                    src={Searchh}
                                    alt="Searchh"
                                    className="w-[24px] h-[24px] cursor-pointer"
                                />
                            ),
                        }}
                        className="cursor-pointer"
                    />

                    {/* Error text */}
                    {errors.breed_id && (
                        <p className="text-brand text-xs mt-1">
                            {errors.breed_id.message}
                        </p>
                    )}
                </div>

                {/* MODAL */}
                {breedListModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-xl p-4 w-full max-w-[390px]">

                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-bold text-lg">Select Breed</h2>
                                <button
                                    onClick={() => setBreedListModalOpen(false)}
                                    className="text-gray-500 text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Search Box */}
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Search breed..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 pr-10"
                                />
                                <Search
                                    size={18}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                />
                            </div>

                            {/* Breed List */}
                            <div className="max-h-64 overflow-y-auto">
                                {filteredBreeds.length > 0 ? (
                                    filteredBreeds.map((breed) => (
                                        <div
                                            key={breed?.breed_id}
                                            onClick={() => {
                                                setValue("breed_id", breed.breed_id, { shouldDirty: true });

                                                // Always reset size when breed changes
                                                setValue("size_id", null, { shouldDirty: true });

                                                if (breed?.breed_id) {
                                                    dispatch(
                                                        getBookingPetSizes({
                                                            breed_id: breed.breed_id,
                                                            booking_session_token: token,
                                                        })
                                                    );
                                                }
                                                setSelectedBreedName(breed.breed_name);
                                                setBreedListModalOpen(false);
                                                setSearchTerm("");
                                            }}
                                            className={`px-3 py-2 cursor-pointer rounded mb-1
                                ${watch("breed_id") == breed?.breed_id
                                                    ? "bg-[#EB5757] text-white hover:bg-[#EB5757]/90"
                                                    : "hover:bg-gray-100"
                                                }
                            `}
                                        >
                                            {breed?.breed_name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No breeds found</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-2/5">
                    <div className="relative">
                        <CustomInput
                            label="Gender"
                            variant="outlined"
                            fullWidth
                            value={genderLabel}
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
                            <div className="fixed max-w-[180px] z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
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
                                        className={`px-3 py-2 cursor-pointer rounded mb-1 ${normalizedGender === g.key ? "bg-[#EB5757] text-white hover:bg-[#EB5757]/90" : "hover:bg-gray-100"
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

            {selectedBreedId && petSizes?.length > 0 && <div className="w-full pt-3">
                <label className="block text-sm font-bold mb-1">Select Size</label>

                <div className="flex w-full gap-2">
                    {petSizes?.map((item) => (
                        <button
                            type="button"
                            key={item.size_id}
                            onClick={() => setValue("size_id", item.size_id, { shouldDirty: true })}
                            className={`w-full flex flex-col items-center px-4 py-3 border rounded-[10px] transition-all
          ${selectedSize == item.size_id
                                    ? 'text-primary-dark border-brand'
                                    : 'bg-white border-[#BEC3C5] hover:border-brand/60'
                                }
        `}
                        >
                            <div className="text-sm font-medium">{item.size}</div>
                            <div className="text-xs opacity-80">{item.size_desc_new} lbs</div>
                        </button>
                    ))}
                </div>

                {errors.size_id && (
                    <p className="text-brand text-xs mt-2">{errors.size_id.message}</p>
                )}
            </div>}

            {/* Footer */}
            {/* <div className="fixed bottom-0 w-full left-0 bg-white z-10"
            style={{
                boxShadow: "0 0 30px rgba(0,0,0,0.10)",
                padding: "15px 20px 25px",
            }}>
            <div className="flex justify-center items-center">
                <button
                    type='submit'
                    disabled={!isDirty}
                    className={`w-[390px] h-[50px] rounded-[10px] font-bold transition text-white
        ${!isDirty
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-primary-dark"
                        }`}
                >
                    Next
                </button>
            </div>
        </div> */}
        </Card>
    )
};