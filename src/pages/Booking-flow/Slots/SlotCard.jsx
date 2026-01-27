import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const SlotButton = ({ label, isSelected, onClick, id }) => {
    return (
        <motion.button
            id={id}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={onClick}
            className={`flex w-1/2 h-[45px] items-center justify-center
            rounded-[10px] border bg-white text-sm uppercase
            ${isSelected
                    ? "border-brand font-bold"
                    : "border-primary-light"
                }`}
        >
            {label}
        </motion.button>
    );
};

const SlotCard = ({ date, slots, selectedSlot, onSelect }) => {
    const [expanded, setExpanded] = useState(false);

    const makeId = (slot) =>
        `slot-${date}-${slot.replace(/[^a-zA-Z0-9]/g, "")}`;

    const handleSelect = (slot) => {
        onSelect({
            date,
            slot,
            id: makeId(slot),
        });
    };

    const firstRow = slots.slice(0, 2);
    const expandableSlots = slots.slice(2);

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    return (
        <div className="flex flex-col p-[15px] gap-[10px] rounded-[15px] bg-white">
            <div className="text-xs font-bold uppercase">
                {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                })}
            </div>

            <AnimatePresence initial={false}>
                <motion.div layout className="flex flex-col gap-2">
                    {/* ROW 1 */}
                    <div className="flex gap-2">
                        {firstRow.map((slot) => (
                            <SlotButton
                                key={slot}
                                id={makeId(slot)}
                                label={slot}
                                isSelected={
                                    selectedSlot?.date === date &&
                                    selectedSlot?.slot === slot
                                }
                                onClick={() => handleSelect(slot)}
                            />
                        ))}
                    </div>

                    {/* COLLAPSED */}
                    {!expanded && expandableSlots.length > 0 && (
                        <div className="flex gap-2">
                            <SlotButton
                                id={makeId(expandableSlots[0])}
                                label={expandableSlots[0]}
                                isSelected={
                                    selectedSlot?.date === date &&
                                    selectedSlot?.slot === expandableSlots[0]
                                }
                                onClick={() =>
                                    handleSelect(expandableSlots[0])
                                }
                            />

                            {expandableSlots.length > 1 && (
                                <motion.button
                                    layout
                                    onClick={() => setExpanded(true)}
                                    className="flex w-1/2 h-[45px] items-center justify-center gap-1
                                    rounded-[10px] border border-primary-light
                                    text-sm text-[#3064A3]"
                                >
                                    More <ChevronDown size={16} />
                                </motion.button>
                            )}
                        </div>
                    )}

                    {/* EXPANDED */}
                    {expanded &&
                        chunkArray(expandableSlots, 2).map((row, i) => (
                            <motion.div key={i} layout className="flex gap-2">
                                {row.map((slot) => (
                                    <SlotButton
                                        key={slot}
                                        id={makeId(slot)}
                                        label={slot}
                                        isSelected={
                                            selectedSlot?.date === date &&
                                            selectedSlot?.slot === slot
                                        }
                                        onClick={() =>
                                            handleSelect(slot)
                                        }
                                    />
                                ))}
                            </motion.div>
                        ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SlotCard;