import Card from "@/common/Booking-Flow/Card";
import { CustomInput } from "../CustomInput";
import { ChevronDown } from 'lucide-react'
import RHFDatePicker from '@/components/AgePicker';

import CatBlack from '../../assets/icon/cat-black.svg';
import SuccessIcon from "../../assets/icon/tick-green.svg";

export const StepOneContentCat = ({
    showSuccess,
    register,
    errors,
    control,
    isDirty,
    setValue,
    selectedGender,
    setGenderDropdownOpen,
    genderDropdownOpen,
}) => (
    <Card title="Cat Details"
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

        <div className="flex items-center justify-center gap-2 w-full">
            {/* Age */}
            <div className="w-full">
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
                        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
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
    </Card>
);