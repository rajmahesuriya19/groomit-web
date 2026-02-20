import React, { useState } from 'react'
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import CommonActionButton from '@/common/ActionButton/CommonActionButton';
import PackagesModal from '../PackagesModal';
import { getPackageByPet } from '@/utils/store/slices/packages/packagesSlice';

import FallbackDog from '../../../../assets/icon/dog-avatar.jpg';
import FallbackCat from '../../../../assets/icon/cat-avatar.jpg';
import { useNavigate } from 'react-router';

const PetsDashboard = ({ allPets = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const [selectedPet, setSelectedPet] = useState(null);
    const [packagesModal, setPackagesModal] = useState(false);

    const { packages = [] } = useSelector((state) => state.packages);

    const handlePackagePet = async (petId) => {
        try {
            showLoader();

            const response = await dispatch(
                getPackageByPet({ petId })
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

    return (
        <>
            {allPets.length > 0 && (
                <div>
                    <div className="mb-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-inter font-bold text-base text-primary-dark">My Pets</h3>
                        </div>
                    </div>

                    {allPets?.map((pet, index) => (
                        <div key={index} className="mb-3 flex flex-col items-start gap-4 w-full">
                            <div className="p-[15px] bg-white rounded-[15px] w-full">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src={pet?.profilePicture?.path || pet?.photo_url || (pet?.type == 'dog' ? FallbackDog : FallbackCat)}
                                            className="w-9 h-9 object-cover rounded-[10px] cursor-pointer"
                                            alt="Pet Profile"
                                        />
                                        <div>
                                            <h4 className="font-inter font-bold text-base cursor-pointer capitalize text-primary-dark">{pet.name}</h4>
                                            {pet?.type === 'dog' ? (
                                                <div className="font-inter font-normal text-sm text-primary-dark">{(pet?.breed_name && pet?.size?.size_name) ? [pet?.breed_name, pet?.size?.size_name].filter(Boolean).join(', ') : 'Dog'}</div>
                                            ) : (
                                                <div className="font-inter font-normal text-sm text-primary-dark">{pet?.ageFull ? pet?.ageFull : 'Cat'}</div>
                                            )}
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.2 }}
                                        className="px-4 py-2 border border-primary-dark rounded-[10px] text-primary-dark font-inter font-bold text-base"
                                        onClick={() => navigate("/book/service-address")}
                                    >
                                        Book
                                    </motion.button>
                                </div>
                            </div>

                            <CommonActionButton
                                borderColor="border-primary-dark"
                                textColor="text-white"
                                className="bg-primary-dark capitalize"
                                onClick={() => {
                                    setSelectedPet(pet);
                                    handlePackagePet(pet?.pet_id);
                                }}
                            >
                                {`View Pricing For ${pet?.name}`}
                            </CommonActionButton>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {packagesModal && (<PackagesModal
                    open={packagesModal}
                    packages={packages}
                    petType={selectedPet?.type}
                    onClose={() => setPackagesModal(false)} />
                )}
            </AnimatePresence>
        </>
    )
}

export default PetsDashboard