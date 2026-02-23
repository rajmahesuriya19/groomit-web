import React, { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Divider } from "@mui/material";
import { ChevronDown, Search } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import DogIcon from "../../../../assets/icon/dog-black.svg";
import CatIcon from "../../../../assets/icon/cat-black.svg";
import Searchh from "../../../../assets/icon/search-black.svg";
import CommonActionButton from "@/common/ActionButton/CommonActionButton";
import { CustomInput } from "@/components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { getBookingPetBreeds, getBookingPetSizes } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { getPackages } from "@/utils/store/slices/packages/packagesSlice";
import PackagesModal from "../PackagesModal";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";

// ---------------- SCHEMA ----------------
const schema = yup.object().shape({
    type: yup.string().required("Pet type is required"),
    zip: yup
        .string()
        .required("Zip code is required")
        .matches(/^[0-9]{5,6}$/, "Enter valid zip code"),

    breed_id: yup.string().when("type", {
        is: "dog",
        then: (schema) => schema.required("Breed is required"),
        otherwise: (schema) => schema.nullable(),
    }),

    size_id: yup.string().when("type", {
        is: "dog",
        then: (schema) => schema.required("Size is required"),
        otherwise: (schema) => schema.nullable(),
    }),
});

const GroomingOptionsAccordion = () => {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();

    const [expanded, setExpanded] = useState(true);
    const [packagesModal, setPackagesModal] = useState(false);
    const [breedListModalOpen, setBreedListModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBreedName, setSelectedBreedName] = useState("");

    const { packages = [] } = useSelector((state) => state.packages);
    const bookingFlow = useSelector((state) => state.bookingFlow);
    const token = useSelector((state) => state.auth.unique_token);

    const { petBreeds: breeds = [], petSizes = [] } = bookingFlow;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            type: "",
            zip: "",
            breed_id: "",
            size_id: "",
        },
    });

    // ---------------- FILTER BREEDS ----------------
    const filteredBreeds = useMemo(() => {
        if (!searchTerm.trim()) return breeds;
        return breeds.filter((breed) =>
            breed?.breed_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [breeds, searchTerm]);

    // ---------------- WATCHED VALUES ----------------
    const selectedType = watch("type");
    const zipValue = watch("zip");
    const selectedBreedId = watch("breed_id");
    const selectedSize = watch("size_id");

    // ---------------- HANDLERS ----------------
    const handlePetTypeSelect = (type) => {
        setValue("type", type, { shouldValidate: true });

        if (type === "cat") {
            setValue("breed_id", null);
            setValue("size_id", null);
            setSelectedBreedName("");
        } else {
            setValue("breed_id", "");
            setValue("size_id", "");
        }
        setValue("zip", null);
    };

    const handleBreedSelect = (breed) => {
        setValue("breed_id", (breed?.id ?? breed?.breed_id), { shouldValidate: true });
        setValue("size_id", "", { shouldValidate: true, shouldDirty: true });
        setSelectedBreedName(breed?.breed_name);
        setBreedListModalOpen(false);
        setSearchTerm("");
    };

    const onSubmit = async (data) => {
        try {
            showLoader();

            const response = await dispatch(
                getPackages({
                    pet_type: data?.type,
                    zip: data?.zip,
                    breed_id: data?.type === "cat" ? null : data?.breed_id,
                    size_id: data?.type === "cat" ? null : data?.size_id,
                })
            ).unwrap();

            // 🔥 Prevent opening empty modal
            if (response?.packages?.length > 0) {
                setPackagesModal(true);
            }

        } catch (error) {
            console.error("Failed to fetch packages:", error);
        } finally {
            hideLoader();
        }
    };

    const handleAccordionToggle = () => {
        setExpanded((prev) => {
            const newState = !prev;

            if (!newState) {
                resetAll();
            }

            return newState;
        });
    };

    const resetAll = () => {
        reset({
            type: "",
            zip: "",
            breed_id: "",
            size_id: "",
        });

        setSelectedBreedName("");
        setSearchTerm("");
        setBreedListModalOpen(false);
    };

    useEffect(() => {
        const fetchSizes = async () => {
            if (!selectedBreedId) return;

            try {
                showLoader();

                await dispatch(
                    getBookingPetSizes({
                        breed_id: selectedBreedId,
                        booking_session_token: token,
                    })
                ).unwrap();
            } catch (error) {
                console.error("Failed to fetch sizes:", error);
            } finally {
                hideLoader();
            }
        };

        fetchSizes();
    }, [selectedBreedId]);

    useEffect(() => {
        if (selectedType) {
            dispatch(
                getBookingPetBreeds({
                    pet_type: selectedType,
                    booking_session_token: token
                })
            );
        }
    }, [selectedType, dispatch]);

    return (
        <>
            <div>
                <Accordion
                    expanded={expanded}
                    onChange={handleAccordionToggle}
                    disableGutters
                    elevation={0}
                    sx={{
                        background: "transparent",
                        "&:before": { display: "none" },
                        "& .MuiAccordionSummary-root": { padding: 0 },
                        "& .MuiAccordionSummary-content": { margin: 0 },
                        "& .MuiAccordionDetails-root": { padding: 0 },
                    }}
                >
                    <AccordionSummary>
                        <div className="flex justify-between items-center p-[15px] bg-white rounded-t-[15px] w-full">
                            <h2 className="font-bold text-base capitalize text-primary-dark">
                                Explore Grooming Options
                            </h2>

                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <ChevronDown size={22} />
                            </motion.div>
                        </div>
                    </AccordionSummary>

                    <AccordionDetails className="bg-white rounded-b-[15px]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: expanded ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="px-[15px] pb-[15px]">

                                    {/* ---------------- PET TYPE ---------------- */}
                                    <div className="flex items-start flex-col gap-2">
                                        <div className="text-sm font-bold text-primary-dark">
                                            Select Pet Type
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <motion.button
                                                type="button"
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => handlePetTypeSelect("dog")}
                                                className={`flex w-20 h-[45px] py-3 px-[10px] justify-center items-center rounded-[10px] text-sm font-bold bg-white
                    ${selectedType === "dog"
                                                        ? "border-2 border-brand text-primary-dark shadow-md"
                                                        : "border border-primary-light text-primary-dark"
                                                    }`}
                                            >
                                                <img src={DogIcon} alt="" className="w-6 h-6 mr-1" />
                                                Dog
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => handlePetTypeSelect("cat")}
                                                className={`flex w-20 h-[45px] py-3 px-[10px] justify-center items-center rounded-[10px] text-sm font-bold bg-white
                    ${selectedType === "cat"
                                                        ? "border-2 border-brand text-primary-dark shadow-md"
                                                        : "border border-primary-light text-primary-dark"
                                                    }`}
                                            >
                                                <img src={CatIcon} alt="" className="w-6 h-6 mr-1" />
                                                Cat
                                            </motion.button>
                                        </div>

                                        {errors.type && (
                                            <p className="text-brand text-xs mt-1">
                                                {errors.type.message}
                                            </p>
                                        )}
                                    </div>

                                    {selectedType && (
                                        <>
                                            <Divider sx={{ my: 2, borderColor: "#E4E4E4" }} />

                                            {/* ---------------- ZIP ---------------- */}
                                            <div className="w-full">
                                                <CustomInput
                                                    label="Zip Code"
                                                    {...register("zip")}
                                                    fullWidth
                                                    error={!!errors.zip}
                                                />
                                                {errors.zip && (
                                                    <p className="text-brand text-xs mt-2">
                                                        {errors.zip.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {selectedType === "dog" && zipValue && zipValue.length >= 5 && (
                                        <>
                                            <Divider sx={{ my: 2, borderColor: "#E4E4E4" }} />

                                            {/* ---------------- BREED ---------------- */}
                                            <div className="w-full cursor-pointer">
                                                <CustomInput
                                                    label="Breed"
                                                    fullWidth
                                                    value={selectedBreedName}
                                                    error={!!errors.breed_id}
                                                    onClick={() => setBreedListModalOpen(true)}
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: (
                                                            <img
                                                                src={Searchh}
                                                                alt=""
                                                                className="w-[24px] h-[24px] cursor-pointer"
                                                            />
                                                        ),
                                                    }}
                                                />

                                                {errors.breed_id && (
                                                    <p className="text-brand text-xs mt-2">
                                                        {errors.breed_id.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ---------------- BREED MODAL ---------------- */}
                                            <AnimatePresence>
                                                {breedListModalOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0.95, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.95, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="bg-white rounded-xl p-4 w-full max-w-[390px]"
                                                        >
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h2 className="font-bold text-lg">Select Breed</h2>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setBreedListModalOpen(false)}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>

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

                                                            <div className="max-h-64 overflow-y-auto">
                                                                {filteredBreeds.length > 0 ? (
                                                                    filteredBreeds.map((breed, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            onClick={() => handleBreedSelect(breed)}
                                                                            className={`px-3 py-2 cursor-pointer rounded mb-1
                                ${(selectedBreedId === breed.id) || (selectedBreedId === breed.breed_id)
                                                                                    ? "bg-[#EB5757] text-white"
                                                                                    : "hover:bg-gray-100"
                                                                                }`}
                                                                        >
                                                                            {breed?.breed_name}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-gray-500 text-sm">
                                                                        No breeds found
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    )}

                                    {/* ---------------- SIZE ---------------- */}
                                    {selectedType === "dog" && selectedBreedId && petSizes?.length > 0 && (
                                        <>
                                            <Divider sx={{ my: 2, borderColor: "#E4E4E4" }} />

                                            <div className="w-full">
                                                <label className="block text-sm font-bold mb-2">
                                                    Select Size
                                                </label>

                                                <div className="flex w-full gap-2">
                                                    {petSizes.map((item) => (
                                                        <motion.button
                                                            type="button"
                                                            key={item.size_id}
                                                            whileHover={{ y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={() =>
                                                                setValue("size_id", item.size_id, {
                                                                    shouldValidate: true,
                                                                })
                                                            }
                                                            className={`w-full flex flex-col items-center 
    px-1 py-2 sm:px-4 sm:py-3
    rounded-[10px] transition-all duration-200
    ${selectedSize === item.size_id
                                                                    ? "border-2 border-brand text-primary-dark shadow-md"
                                                                    : "border border-[#BEC3C5]"
                                                                }`}
                                                        >
                                                            <div
                                                                className={`text-xs sm:text-sm ${selectedSize === item.size_id ? "font-bold" : ""
                                                                    }`}
                                                            >
                                                                {item.size}
                                                            </div>

                                                            <div
                                                                className={`text-[10px] sm:text-xs opacity-80 ${selectedSize === item.size_id ? "font-bold" : ""
                                                                    }`}
                                                            >
                                                                {item.size_desc_new} lbs
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>

                                                {errors.size_id && (
                                                    <p className="text-brand text-xs mt-2">
                                                        {errors.size_id.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {((selectedType === "dog" && selectedSize) ||
                                        (selectedType === "cat" && zipValue?.length >= 5)) && (
                                            <motion.div
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.96 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="w-full mt-4"
                                            >
                                                <CommonActionButton
                                                    type="submit"
                                                    borderColor="border-primary-dark"
                                                    textColor="text-primary-dark"
                                                >
                                                    Explore Packages
                                                </CommonActionButton>
                                            </motion.div>
                                        )}
                                </div>
                            </form>
                        </motion.div>
                    </AccordionDetails>
                </Accordion>
            </div>

            <AnimatePresence>
                {packagesModal && (<PackagesModal
                    open={packagesModal}
                    packages={packages}
                    petType={selectedType}
                    onClose={() => setPackagesModal(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default GroomingOptionsAccordion;
