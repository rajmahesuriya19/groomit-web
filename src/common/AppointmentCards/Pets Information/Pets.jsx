import { ChevronRight } from "lucide-react";


const MyPets = ({ pets }) => {
    if (!pets || pets.length === 0) return null;

    const packageColors = {
        Gold: '#ED9F00',
        Silver: '#AEAEAE',
        Eco: '#3064A3',
    };

    return (
        <div>
            {pets.map((pet) => {
                const packageName = pet?.package?.prod_name || '';
                const badgeColor = packageColors[packageName] || '#ED9F00';

                return (
                    <div key={pet.pet_id} className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                            <img
                                src={pet.photo_url || 'https://www.groomit.me/v7/images/icons/dog-avatar.jpg'}
                                alt={pet.name || 'Pet'}
                                className="w-[40px] h-[40px] rounded-md object-cover"
                            />

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-inter font-bold text-base text-primary-dark">
                                        {pet.name}
                                    </p>
                                    <div
                                        className="text-white font-inter font-normal uppercase py-1 px-[6px] flex items-center justify-center rounded-3xl"
                                        style={{ backgroundColor: badgeColor, fontSize: '10px' }}
                                    >
                                        {packageName}
                                    </div>
                                </div>

                                {(pet?.recurring_interval_id || pet?.recurring_appointment_batch_pet_id)
                                    ? <p className="cursor-pointer underline font-inter font-normal text-sm text-[#0A7170]">
                                        Recurring - Every 6 Weeks
                                    </p>
                                    : <p className="font-inter font-normal text-sm text-primary-dark">
                                        One Time Service
                                    </p>}
                            </div>

                            <ChevronRight size={24} className="text-[#7C868A]" />
                        </div>
                    </div>
                );
            })}

            <div className="flex flex-col gap-3 mt-4">
                <button className="w-full h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base hover:bg-gray-50 transition">
                    Add Add-ons
                </button>
            </div>
        </div>
    );
};

export default MyPets