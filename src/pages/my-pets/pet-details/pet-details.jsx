import React, { useEffect, useState } from 'react';
import { ChevronRight, PlusIcon, ArrowLeft } from 'lucide-react';
import infoRed from '../../../assets/icon/info-circle.svg';
import Message from '../../../assets/icon/messages-red.svg';
import FeedbackIcon from '../../../assets/icon/red-star.svg';
import Edit2 from '../../../assets/icon/edit-2.svg';
import Delete from '../../../assets/icon/trash.svg';
import Close from '../../../assets/icon/close.svg';
import { useNavigate, useParams } from 'react-router';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPetProfileID, updatePetStatus } from '@/utils/store/slices/petList/petListSlice';
import DeleteDogModal from '@/components/Modals/DeleteDogModal';
import { formatDate } from '@/common/helpers';
import MemorialiseModal from '@/components/Modals/MemorialiseModal';
import Paw from '../../../assets/icon/pet-paw.svg';

const supportItems = [
    { label: 'How Groomit Works', icon: infoRed },
    { label: 'Cancelation Policy', icon: infoRed },
    { label: 'Live Chat', icon: Message },
    { label: 'Give us feedback', icon: FeedbackIcon },
];

const PetDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memorialiseOpen, setMemorialiseOpen] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    const { pet, loading, error } = useSelector((state) => state.pets.selectedPet || {});

    console.log(pet);


    useEffect(() => {
        if (id) {
            showLoader();
            dispatch(getPetProfileID(id)).finally(() => hideLoader());
        }
    }, [id, dispatch]);

    const handleNavigate = (type, petId) => {
        navigate(`/user/pet/edit/${type}/${petId}`);
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-primary-dark font-semibold">Loading pet details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">No pet found</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between md:mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-[35px] h-[35px] flex items-center justify-center rounded-full bg-white"
                            >
                                <ArrowLeft size={20} className="text-primary-light" />
                            </button>
                            <h2 className="text-xl font-bold text-primary-dark tracking-tight">
                                {pet?.name}’s Details
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            {!pet?.memorialized_at && <button
                                className="w-[35px] h-[35px] border flex items-center justify-center rounded-full"
                                onClick={() => handleNavigate(pet?.type, pet?.pet_id)}
                            >
                                <img src={Edit2} alt="Edit" className="w-[21px] h-[21px]" />
                            </button>}
                            <button className="w-[35px] h-[35px] border flex items-center justify-center rounded-full" onClick={() => setIsDeleteModalOpen(true)}>
                                <img src={Delete} alt="Delete" className="w-[21px] h-[21px]" />
                            </button>
                        </div>
                    </div>

                    {/* Pet Info */}
                    <div className="bg-white rounded-[20px] p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <img
                                src={pet?.photo_url || 'https://placehold.co/74x74'}
                                alt={pet?.name}
                                className="w-[74px] h-[74px] rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <h2 className="font-bold text-xl text-primary-dark">{pet?.name}</h2>
                                <span className="text-sm text-primary-dark">
                                    {pet?.breed_name || 'Unknown Breed'}
                                </span>
                                <span className="text-sm text-primary-light">
                                    {pet?.ageFull || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-6 pt-6 pb-3">
                            <PetDetailItem label="Pet Size" value={pet?.size_name} />
                            <Divider />
                            <PetDetailItem label="Gender" value={pet?.gender_show} />
                            <Divider />
                            <PetDetailItem label="Temperament" value={pet?.temperament} />
                        </div>

                        {pet?.memorialized_at ? "" : !pet?.special_note ? <InfoCard
                            title="Additional Information"
                            subtitle="Tell us more about your pet"
                            onClick={() => handleNavigate(pet?.type, pet?.pet_id)}
                        /> : (
                            <>
                                <div className='mt-3'>
                                    <div className='font-bold text-base'>Additional Information</div>
                                    <div className='font-normal text-sm'>{pet?.special_note}</div>
                                </div>
                            </>
                        )}

                        {pet?.vaccinated_image_url && pet?.special_note && (
                            <hr className="my-4 border-t border-gray-300" />
                        )}

                        {pet?.memorialized_at ? "" : !pet?.vaccinated_image_url ? <InfoCard
                            title="Add Rabies Vaccination"
                            subtitle="Add expiration date & certificate"
                            onClick={() => handleNavigate(pet?.type, pet?.pet_id)}
                        /> : (
                            <>
                                <div className='mt-3'>
                                    <div className='font-bold text-base mb-3'>Rabies Vaccination Details</div>
                                    <div className='p-4 bg-[#F1F1F1] rounded-[10px] flex justify-between align-middle'>
                                        <div>
                                            <div className='font-bold text-base'>Expiration Date</div>
                                            <div className='font-normal text-primary-light text-sm'>{formatDate(pet?.dob)}</div>
                                        </div>

                                        <div className='flex justify-center items-center font-bold text-base h-[38px] px-4 py-2 border border-primary-dark rounded-[30px] cursor-pointer' onClick={() => {
                                            setSelectedImage(pet?.vaccinated_image_url);
                                            setShowModal(true);
                                        }}>
                                            View Certificate
                                        </div>
                                    </div>
                                </div>

                                {showModal && (
                                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn">
                                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-2xl relative animate-scaleIn">

                                            {/* Header */}
                                            <div className="flex items-center justify-center mb-4 pb-3">
                                                <h2 className="font-semibold md:text-xl text-center text-gray-800 text-lg w-full">
                                                    View Certificate
                                                </h2>
                                                <button
                                                    onClick={() => setShowModal(false)}
                                                    className="text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    <img src={Close} alt="Close" />
                                                </button>
                                            </div>

                                            {/* Image / Content */}
                                            <div className="flex justify-center items-center">
                                                {selectedImage ? (
                                                    <div className="w-full h-[300px] md:h-[450px] flex justify-center items-center rounded-lg">
                                                        <img
                                                            src={selectedImage}
                                                            alt="Rabies Certificate"
                                                            className="max-h-full max-w-full object-contain rounded-md"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">No certificate uploaded</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <button
                        className="w-full mt-4 flex items-center justify-center bg-brand gap-1 rounded-[30px] border border-brand p-3"
                        onClick={() =>
                            pet?.memorialized_at
                                ? setMemorialiseOpen(true)
                                : navigate('/user/pet/list')
                        }
                    >
                        <span className="font-bold text-base text-white">
                            {pet?.memorialized_at ? 'Remove From Memorialized' : 'Book Appointment'}
                        </span>
                    </button>

                </div>

                {/* Divider */}
                <div className="hidden md:flex justify-center">
                    <div className="h-full w-[1px] bg-[#C9CFD4]" />
                </div>

                {/* Right Section */}
                <div className="space-y-4">
                    <div className="p-4">
                        <div className="flex justify-between items-center pb-4">
                            <h3 className="text-base font-bold text-primary-dark">Support</h3>
                            <span className="text-sm text-primary-light">Have Questions?</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {supportItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-white rounded-[20px] flex justify-between items-center cursor-pointer px-4 py-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <img src={item.icon} alt={item.label} className="w-6 h-6" />
                                        <span className="text-sm font-bold text-primary-dark">
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={24} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <MemorialiseModal
                open={memorialiseOpen}
                onClose={() => setMemorialiseOpen(false)}
                onConfirm={handleMemorialisePet}
                icon={Paw}
                title={`Remove ${pet?.name} From Memorialized`}
                decription={`Are you sure you want to remove ${pet?.name} from memorialized?`}
            />
            <DeleteDogModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeletePet}
                icon={Delete}
                title={`Remove ${pet?.name}`}
                decription={"Are you sure you want to delete this dog?"}
            />
        </>
    );
};

const PetDetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <h2 className="text-xs text-primary-light uppercase font-bold">{label}</h2>
        <span className="text-sm text-primary-dark font-bold">{value || 'N/A'}</span>
    </div>
);

const Divider = () => (
    <div className="hidden md:flex justify-center">
        <div className="h-full w-px bg-[#BEC3C5]" />
    </div>
);

const InfoCard = ({ title, subtitle, onClick }) => (
    <div
        onClick={onClick}
        className="flex justify-between items-center bg-[#F1F1F1] rounded-[10px] p-[15px] cursor-pointer mt-3"
    >
        <div className="flex flex-col">
            <h2 className="font-bold text-base text-primary-dark">{title}</h2>
            <span className="text-sm text-primary-light">{subtitle}</span>
        </div>
        <button className="w-[40px] h-[40px] rounded-[10px] bg-brand flex items-center justify-center">
            <PlusIcon size={24} className="text-white" />
        </button>
    </div>
);

export default PetDetails;
