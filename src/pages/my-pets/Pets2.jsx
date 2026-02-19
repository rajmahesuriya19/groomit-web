import React, { useEffect, useState } from 'react'
import SupportItems from '@/common/SupportItems/SupportItems'
import AddPetsModal from '@/components/Modals/AddPetsModal'
import { useLoader } from '@/contexts/loaderContext/LoaderContext'
import { getPetList } from '@/utils/store/slices/petList/petListSlice'
import { ChevronLeft, PlusIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import PetsList from './PetsList'

const Pets2 = () => {
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

    useEffect(() => {
        showLoader();
        dispatch(getPetList()).finally(() => hideLoader());
    }, [dispatch]);

    const allPets = [...dogPets, ...catPets];
    const allMemorializedPets = [...memorializedDogPets, ...memorializedCatPets];
    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '10px 45px 10px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>My Pets</div>
                </div>

                <button className="flex items-center justify-center gap-1 rounded-[10px] border border-primary-line p-[7px]" onClick={() => setPetsModal(true)}>
                    <PlusIcon size={24} />
                </button>
            </div>

            <div className={`mb-28 ${allPets.length === 1 ? 'h-full' : ''}`}>
                <div className="px-4 sm:px-5 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 md:gap-6 lg:gap-8 relative">
                    {/* Left Section */}
                    <div className="space-y-4">
                        {allPets.map((pet) => (
                            <PetsList
                                key={pet.id}
                                pet={pet}
                                isSingle={allPets.length === 1}
                            />
                        ))}

                        <div>
                            <h2 className="font-inter font-bold text-base mb-3 text-primary-dark">
                                Memorialized Pets
                            </h2>
                            <div className="space-y-4">
                                {allMemorializedPets.map((pet) => (
                                    <PetsList
                                        key={pet.id}
                                        pet={pet}
                                        isSingle={allPets.length === 1}
                                        memorizez={true}
                                    />
                                ))}
                            </div>
                        </div>
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
                {allPets.length === 1 && <div
                    className="fixed bottom-0 w-full left-0 bg-white z-10"
                    style={{
                        boxShadow: '0 0 30px rgba(0,0,0,0.10)',
                        padding: '15px 20px 25px'
                    }}
                >
                    <div className="flex justify-center items-center">
                        <button
                            className={`h-[50px] w-[390px] rounded-[10px] text-white text-base font-bold bg-primary-dark cursor-pointer`}
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>}
            </div>

            <AddPetsModal open={petsModal}
                onClose={() => setPetsModal(false)} />
        </>
    )
}

export default Pets2;