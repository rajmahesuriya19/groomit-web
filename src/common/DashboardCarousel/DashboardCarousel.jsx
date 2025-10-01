import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { Box } from '@mui/material';
import Share from '../../assets/icon/share-white.svg';

const slides = [
    {
        id: 1,
        type: 'refer',
    },
    {
        id: 2,
        type: 'pick-book-groom',
    },
    {
        id: 3,
        type: 'mobile-grooming',
    },
];

const DashboardCarousel = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Box className="rounded-2xl p-1 bg-white shadow-md overflow-hidden relative">
                <SwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents animateTransitions={true}
                    springConfig={{
                        duration: '1s',
                        easeFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        delay: '0s',
                    }}>
                    {slides.map((slide, index) => (
                        <Box
                            key={slide.id}
                            className={`w-full h-full transform transition-transform duration-500 ${index === activeStep ? 'scale-100' : 'scale-95 opacity-70'
                                }`}
                        >
                            {/* First Slide */}
                            {slide.type === 'refer' && (
                                <div className="bg-[#E4F5FF] rounded-xl pt-4 px-6 h-full">
                                    <div className='flex justify-between items-center h-full'>
                                        <div>
                                            <h3 className="flex items-center font-inter font-bold text-xl">
                                                Refer a Friend
                                            </h3>
                                            <p className="font-inter text-sm text-gray-700 leading-6">
                                                And Both Receive <span className='text-[#3064A3]'>$25 Credits</span>
                                            </p>
                                            <button className="flex items-center justify-center gap-2 w-full bg-primary-dark rounded-lg h-10 my-3 text-white font-inter font-bold text-base hover:bg-primary-light transition-all">
                                                #GROOM123 <img src={Share} className="w-4 h-4" alt="Share" />
                                            </button>
                                        </div>

                                        <div>
                                            <img src="https://dev.groomit.me/v7/images/webapp/icons/banner-cat.svg" alt="Cat" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Second Slide */}
                            {slide.type === 'pick-book-groom' && (
                                <div className="bg-[#FFECEC] rounded-xl pt-4 px-6 h-full">
                                    <div className='flex justify-between items-center h-full'>
                                        <div>
                                            <h3 className="flex items-center font-filson font-bold text-lg">
                                                PICK IT! <span className='font-inter ml-2 font-normal text-xs'>Choose Groomer & Service</span>
                                            </h3>
                                            <h3 className="flex items-center font-filson font-bold text-2xl">
                                                BOOK IT! <span className='font-inter ml-2 font-normal text-xs'>Schedule Appointment</span>
                                            </h3>
                                            <h3 className="flex items-center font-filson font-bold text-3xl text-brand">
                                                GROOMIT! <span className='font-inter ml-2 font-normal text-xs text-black'>We Come to You</span>
                                            </h3>
                                        </div>

                                        <div>
                                            <img src="https://dev.groomit.me/v7/images/webapp/icons/banner-dog.svg" alt="Cat" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Third Slide */}
                            {slide.type === 'mobile-grooming' && (
                                <div className="bg-[#FFF2E4] rounded-xl pt-4 md:py-0 pl-6 h-full">
                                    <div className='flex justify-between items-center h-full'>
                                        <div>
                                            <h3 className="flex items-center font-inter font-bold text-base">
                                                Mobile Pet Grooming at Your Doorstep
                                            </h3>
                                            <p className="mt-3 font-inter font-bold text-xl text-[#ED9F00] leading-6">
                                                500+ <span className='font-inter font-normal text-sm text-primary-dark'>Groomers Thrive with Groomit</span>
                                            </p>
                                        </div>

                                        <div>
                                            <img
                                                src="https://dev.groomit.me/v7/images/webapp/icons/dashboard-van.png"
                                                className="hidden md:block mt-4"
                                                alt="Mobile Van"
                                            />

                                            <img
                                                src="https://dev.groomit.me/v7/images/webapp/icons/dashboard-van-mobile.png"
                                                className="block md:hidden"
                                                alt="Mobile Van"
                                            />
                                        </div>

                                    </div>
                                </div>
                            )}
                        </Box>
                    ))}
                </SwipeableViews>
            </Box>

            {/* Dots */}
            <Box className="flex justify-center mt-4">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`mx-1 cursor-pointer transition-all duration-300 ${index === activeStep
                            ? 'w-4 bg-primary-dark rounded-full scale-110'
                            : 'w-[6px] h-[6px] bg-gray-300 rounded-full'
                            }`}
                    />
                ))}
            </Box>
        </>
    );
};

export default DashboardCarousel;
