import React, { useEffect, useState } from 'react';
import { ChevronLeft, PlusIcon } from 'lucide-react';
import AddDog from '../../assets/icon/add-dog.svg';
import AddCat from '../../assets/icon/add-cat.svg';
import FallbackDog from '../../assets/icon/dog-avatar.jpg';
import FallbackCat from '../../assets/icon/cat-avatar.jpg';
import { useNavigate } from 'react-router';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPetList } from '@/utils/store/slices/petList/petListSlice';
import AddPetsModal from '@/components/Modals/AddPetsModal';
import SupportItems from '@/common/SupportItems/SupportItems';

const PetCard = ({ type, pet, onDetails, showBook = true }) => {
    // pick the right image with fallback
    const petImage =
        pet?.profilePicture?.path || pet?.photo_url || (type === "dog" ? FallbackDog : FallbackCat);

    return (
        <div
            className="flex justify-between items-center bg-white rounded-[20px] p-[15px] cursor-pointer"
            onClick={() => onDetails(pet.pet_id)}
        >
            <div className="flex items-center gap-[10px]">
                <img
                    src={petImage}
                    alt={pet?.name || "Pet"}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="flex flex-col justify-center">
                    <h2 className="font-filson font-bold text-xl text-primary-dark">
                        {pet?.name || "Unnamed Pet"}
                    </h2>
                    <span className="font-inter font-normal text-sm text-primary-dark">
                        {pet?.breed_name || pet?.age || "Unknown"}
                    </span>
                </div>
            </div>

            {showBook && (
                <button className="flex items-center justify-center gap-1 rounded-[30px] border border-brand px-[16px] py-2">
                    <span className="font-inter font-bold text-base leading-none tracking-[-0.02em] text-brand">
                        Book
                    </span>
                </button>
            )}
        </div>
    );
};
const MemorializedPetCard = ({ pet, onDetails }) => (
    <div className="flex justify-between items-center bg-white rounded-[20px] p-[15px] cursor-pointer" onClick={() => onDetails(pet.pet_id)}>
        <div className="flex items-center gap-[10px]">
            <img
                src={pet.profilePicture?.path || pet.photo_url}
                alt={pet.name}
                className="w-[50px] h-[50px] rounded-full"
            />
            <div className="flex flex-col justify-center">
                <h2 className="font-filson font-bold text-xl text-primary-dark">{pet.name}</h2>
                <span className="font-inter font-normal text-sm text-primary-dark">{pet.ageFull}</span>
            </div>
        </div>

        <div className="flex gap-2 items-center px-4 border-l border-[#DEE2E6]">
            <div className="flex flex-col justify-center">
                <h2 className="font-inter font-bold text-xs text-primary-light uppercase">
                    Memorialized AT
                </h2>
                <span className="font-inter font-bold text-sm text-primary-dark">
                    {pet.memorialized_at}
                </span>
            </div>
        </div>
    </div>
);

const Pets = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const [petsModal, setPetsModal] = useState(false);

    const {
        dogPets = [],
        catPets = [],
        memorializedDogPets = [],
        memorializedCatPets = [],
    } = useSelector((state) => state.pets.pets || {});


    const handlePetDetails = (id) => {
        navigate(`/user/pet/details/${id}`);
    };

    useEffect(() => {
        showLoader();
        dispatch(getPetList()).finally(() => hideLoader());
    }, [dispatch]);

    return (
        <>
            <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[1.25fr_auto_1fr] gap-8">
                {/* Left Section */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <div className="hidden md:flex justify-between items-center mb-6">
                            <h2 className="mb-3 text-xl font-bold text-primary-dark">My Pets</h2>
                            {dogPets.length > 0 && catPets.length > 0 && (
                                <button className="flex items-center justify-center gap-[4px] rounded-[30px] border border-[#BEC3C5] px-[10px] pr-[15px] py-[8px]" onClick={() => setPetsModal(true)}>
                                    <PlusIcon size={21} className="text-brand" />
                                    <span className="font-inter font-bold text-base text-primary-dark">
                                        Add Pet
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Header */}
                        <div className="md:mx-0 -mx-4 -my-4 mb-6">
                            <div className="flex md:hidden items-center justify-between bg-white px-5 py-4 h-[64px] w-full">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center justify-center"
                                >
                                    <ChevronLeft size={24} className="text-primary-light" />
                                </button>

                                <h2 className="text-xl font-['Filson Soft'] font-bold text-primary-dark capitalize">
                                    My Pets
                                </h2>

                                <button className="flex items-center justify-center gap-[4px] rounded-[30px] border border-[#BEC3C5] px-[10px] pr-[15px] py-[8px]">
                                    <PlusIcon size={21} className="text-brand" />
                                    <span className="font-inter font-bold text-base text-primary-dark">
                                        Add Pet
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- Reference Code (Keep) --- */}
                    {/* <div className="bg-white rounded-[20px] p-4 md:p-4 shadow-sm">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={dog}
                                alt="Profile"
                                className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <h2 className="font-filson font-bold text-[20px] leading-[28px] text-[#2E2E2E]">
                                    Bruno
                                </h2>
                                <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[-0.01em] text-[#2E2E2E]">
                                    German Shepherd
                                </span>
                            </div>
                        </div>
                        <button className="flex">
                            <span className="font-inter font-semibold text-[16px] leading-none tracking-[-0.02em] text-[#3064A3]">
                                Details
                            </span>
                            <ChevronRight size={20} className="text-[#3064A3]" />
                        </button>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-6 py-6">
                        <div className="flex flex-col">
                            <h2 className="font-inter font-bold text-[12px] text-primary-light uppercase">
                                PET SIZE
                            </h2>
                            <span className="font-inter font-bold text-[14px] text-primary-dark">
                                Small
                            </span>
                        </div>

                        <div className="hidden md:flex justify-center">
                            <div className="h-full w-px bg-[#BEC3C5]" />
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-inter font-bold text-[12px] text-primary-light uppercase">
                                GENDER
                            </h2>
                            <span className="font-inter font-bold text-[14px] text-primary-dark">
                                Male
                            </span>
                        </div>

                        <div className="hidden md:flex justify-center">
                            <div className="h-full w-px bg-[#BEC3C5]" />
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-inter font-bold text-[12px] text-primary-light uppercase">
                                Temperament
                            </h2>
                            <span className="font-inter font-bold text-[14px] text-primary-dark">
                                Friendly
                            </span>
                        </div>
                    </div>

                    <button
                        className="w-full flex items-center justify-center gap-1 rounded-[30px] border border-brand p-2"
                    >
                        <span className="font-inter font-bold text-base leading-none tracking-[-0.02em] text-brand">
                            Book Appointment
                        </span>
                    </button>
                </div>

                <div>
                    <h2 className="font-inter font-bold text-lg mb-3 text-primary-dark">
                        Memorialized Pet
                    </h2>
                    <div className="flex justify-between items-center bg-white rounded-[20px] p-[15px]">
                        <div className="flex items-center gap-[10px]">
                            <img
                                src={dog}
                                alt="Profile"
                                className="w-[50px] h-[50px] rounded-full"
                            />
                            <div className="flex flex-col justify-center">
                                <h2 className="font-filson font-bold text-xl text-primary-dark">
                                    Kittie
                                </h2>
                                <span className="font-inter font-normal text-sm text-primary-dark">
                                    11 Months Old
                                </span>
                            </div>
                        </div>

                        <div className='flex gap-2 align-middle'>
                            <div className="hidden md:flex justify-center">
                                <div className="h-full w-[1px] bg-[#BEC3C5]" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="font-inter font-bold text-xs text-primary-light uppercase">
                                    Memorialized AT
                                </h2>
                                <span className="font-inter font-bold text-sm text-primary-dark">
                                    15 Jan, 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div> */}

                    {/* Empty State */}
                    {dogPets.length === 0 && catPets.length === 0 && (
                        <div className="flex gap-2">
                            <img src={AddDog} alt="Add Dog" className="w-[190px] h-[156px]" />
                            <img src={AddCat} alt="Add Cat" className="w-[190px] h-[156px]" />
                        </div>
                    )}

                    {/* Dogs */}
                    {dogPets.length > 0 && (
                        <div>
                            <h2 className="font-inter font-bold text-base mb-3 text-primary-dark">Dogs</h2>
                            <div className="space-y-3">
                                {dogPets.map((dog) => (
                                    <PetCard type={"dog"} key={dog.pet_id} pet={dog} onDetails={handlePetDetails} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cats */}
                    {catPets.length > 0 && (
                        <div>
                            <h2 className="font-inter font-bold text-base mb-3 text-primary-dark">Cats</h2>
                            <div className="space-y-3">
                                {catPets.map((cat) => (
                                    <PetCard type={"cat"} key={cat.pet_id} pet={cat} onDetails={handlePetDetails} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Memorialized Pets */}
                    {(memorializedDogPets.length > 0 || memorializedCatPets.length > 0) && (
                        <div>
                            <h2 className="font-inter font-bold text-lg mb-3 text-primary-dark">
                                Memorialized Pets
                            </h2>
                            <div className="space-y-3">
                                {memorializedDogPets.map((pet) => (
                                    <MemorializedPetCard key={pet.pet_id} pet={pet} onDetails={handlePetDetails} />
                                ))}
                                {memorializedCatPets.map((pet) => (
                                    <MemorializedPetCard key={pet.pet_id} pet={pet} onDetails={handlePetDetails} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="hidden md:flex justify-center">
                    <div className="h-full w-[1px] bg-[#C9CFD4]" />
                </div>

                {/* Right Section */}
                <div className="space-y-4">
                    <SupportItems />
                </div>
            </div>

            <AddPetsModal open={petsModal}
                onClose={() => setPetsModal(false)}
                iconDog={AddDog} iconCat={AddCat} />
        </>
    );
};

export default Pets;
