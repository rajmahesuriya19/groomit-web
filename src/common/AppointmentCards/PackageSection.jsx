import React from 'react'

/* ✂️ Package Section (Addons + Size changes) */
const PackageSection = ({ addons }) => {
    if (!addons || !addons.pets?.length) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            {addons.pets.map((pet) => {
                const petAddons = addons.update_addons_arr?.[pet.pet_id] || {};
                const addonList = Object.values(petAddons);

                if (!addonList.length) return null;

                // Sort: Updated first, then Added, then Removed
                const sortedAddons = addonList.sort((a, b) => {
                    const order = { '/': 0, '+': 1, '-': 2 };
                    return order[a.changed] - order[b.changed];
                });

                // Get pet update info
                const petUpdate = addons.update_pet_arr?.[pet.pet_id];

                return (
                    <div key={pet.pet_id} className="mb-2">
                        <p className="font-inter font-bold text-sm text-primary-dark mb-1">
                            {pet.name}
                        </p>

                        {/* Size change - show only once per pet */}
                        {petUpdate && petUpdate.size_id !== petUpdate.size_id_orig && (
                            <p className="font-inter text-sm font-normal mt-1">
                                Size changed - {petUpdate.size_name}
                            </p>
                        )}

                        <div className="flex flex-col gap-[2px]">
                            {sortedAddons.map((addon) => (
                                <div key={addon.prod_id} className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <p className="font-inter text-sm font-normal">
                                            {addon.changed === "+"
                                                ? `${addon.prod_name} Added`
                                                : addon.changed === "/"
                                                    ? `${addon.prod_name} Updated`
                                                    : `${addon.prod_name} Removed`}
                                        </p>
                                    </div>

                                    <div
                                        className={`font-inter font-bold text-sm ${addon.changed === "-" ? "text-[#28B446]" : "text-primary-dark"
                                            }`}
                                    >
                                        {addon.amt_show
                                            ? `${addon.changed === "+" || addon.changed === "/" ? "+$" : "-$"}${addon.amt_show}`
                                            : "0.00"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* 🧩 Contact Groomer - show only once at the end */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="font-inter font-bold text-xs text-[#1F2937]">
                    Any issues with this?{" "}
                    <span className="font-normal text-[#4B5563]">
                        Please reach out to your groomer.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PackageSection;
