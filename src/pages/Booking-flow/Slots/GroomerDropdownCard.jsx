import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import FillStar from "@/assets/icon/fill-red-star.svg";
import PetPaw from "@/assets/icon/pet.svg";
import Location from "@/assets/icon/location.svg";
import Clock from "@/assets/icon/clock-black.svg";
import { useNavigate } from "react-router";

const GroomerDropdownCard = ({ onChange }) => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigate = () => {
        navigate("/book/slot/view-groomers")
        onChange();
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* MAIN CARD (HEIGHT NEVER CHANGES) */}
            <div
                className={`
    relative flex justify-between w-full items-start
    bg-white z-20
    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${isOpen
                        ? "gap-3 p-[15px] rounded-t-[15px]"
                        : "rounded-[15px]"
                    }
  `}
                style={{
                    boxShadow: isOpen ? "0 5px 15px rgba(0, 0, 0, 0.15)" : "none",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-[45px] h-[45px] rounded-[10px] bg-gray-200" />

                    <div className="flex flex-col">
                        <div className="text-base font-bold capitalize">Sandra D.</div>
                        <div className="text-sm text-[#3064A3] underline cursor-pointer" onClick={handleNavigate}>
                            Change
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-2 rounded-[10px] bg-[#F2F2F2]"
                >
                    <ChevronDown
                        size={24}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>

            {/* DROPDOWN OVERLAY */}
            {isOpen && (
                <div className="absolute left-0 top-full w-full z-50">
                    <div
                        className="bg-white px-[15px] pb-[15px] animate-dropdown rounded-b-[15px]"
                        style={{
                            boxShadow: "0 5px 5px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <div className="flex flex-col gap-3 text-sm text-primary-dark">
                            <p>
                                My name is Sandra. I am an advocate and animal lover, dogs hold a
                                special place in my heart as I don’t see my life without them
                                since a little girl.
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                <img src={FillStar} alt="rating" className="w-[16px]" />
                                <span className="font-bold">
                                    4.9
                                    <span className="font-normal underline ml-1 cursor-pointer">
                                        (147 Reviews)
                                    </span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <img src={PetPaw} alt="pets" className="w-[16px]" />
                                <span>4 Pets Serviced On Groomit App</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <img src={Location} alt="location" className="w-[16px]" />
                                <span>New York, New Jersey</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <img src={Clock} alt="experience" className="w-[16px]" />
                                <span>10 Years Of Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroomerDropdownCard;
