import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ChevronDown } from 'lucide-react';

import Tip from "../../assets/icon/tip-black.svg";
import TipRed from "../../assets/icon/dollar-circle.svg";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    margin: 0,
    padding: 0,
    '&::before': { display: 'none' },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ChevronDown size={24} className="text-primary-light" />}
        {...props}
    />
))(() => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(180deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: { margin: 0 },
    [`&.${accordionSummaryClasses.root}`]: { margin: 0, padding: 0 },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({ padding: 0 }));

export default function TipServiceAccordion({ tipOptions }) {
    const [expanded, setExpanded] = React.useState(true);
    const tipSent = !!tipOptions?.appt_detail?.tip;

    const [selectedTip, setSelectedTip] = React.useState(null);
    const [customTip, setCustomTip] = React.useState('');

    // Set first tip as default once tipOptions are loaded
    React.useEffect(() => {
        if (!tipSent && tipOptions?.tip_option?.length > 0) {
            setSelectedTip(tipOptions.tip_option[0]);
        }
    }, [tipOptions, tipSent]);

    const handleTipSelect = (tip) => {
        setSelectedTip(tip);
        setCustomTip('');
    };

    return (
        <div className="w-full mt-3">
            <Accordion expanded={expanded}>
                <AccordionSummary onClick={() => setExpanded(!expanded)}>
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-[#F2F2F2] rounded-[10px] w-[40px] h-[40px]">
                            <img src={Tip} alt="Tip" className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <span className="font-bold text-base">Tip Groomer</span>
                            <p className="text-sm">Appreciate their job by giving a Tip!</p>
                        </div>
                    </div>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="py-3 flex flex-col gap-4">
                        {tipSent ? (
                            <>
                                <div className="text-xs">
                                    *100% of your tip will be allocated directly to the groomer.
                                </div>
                                <div className="h-[52px] rounded-[10px] border p-4 flex flex-col flex-[1_0_0] items-center justify-center border-primary-line">
                                    <div className="text-base font-bold">${tipOptions?.appt_detail?.tip}</div>
                                    <div className="text-xs text-primary-light">Tip sent to groomer successfully</div>
                                </div>
                            </>
                        ) : (
                            // Tip not sent — usual flow
                            <>
                                <div className="flex justify-between gap-2 flex-wrap">
                                    {tipOptions?.tip_option?.map((tip) => (
                                        <div
                                            key={tip.percentage}
                                            className={`h-[52px] rounded-[10px] border p-4 flex flex-col flex-[1_0_0] items-center justify-center cursor-pointer ${selectedTip === tip ? 'border-brand' : 'border-primary-line'
                                                }`}
                                            onClick={() => handleTipSelect(tip)}
                                        >
                                            <div className="text-xs text-brand">{tip.percentage}%</div>
                                            <div className="text-base">${tip.amount.toFixed(2)}</div>
                                        </div>
                                    ))}

                                    <div
                                        className={`h-[52px] rounded-[10px] border flex flex-col flex-[1_0_0] items-center justify-center p-4 cursor-pointer ${selectedTip === 'custom' ? 'border-brand' : 'border-primary-line'
                                            }`}
                                        onClick={() => setSelectedTip('custom')}
                                    >
                                        <div className="text-base">Other</div>
                                    </div>
                                </div>

                                {selectedTip !== 'custom' && <div className="text-xs">
                                    *100% of your tip will be allocated directly to the groomer.
                                </div>}

                                {selectedTip === 'custom' && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-primary-dark font-inter">
                                                Enter Custom Amount
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder="Enter Amount"
                                                    value={customTip}
                                                    onChange={(e) => setCustomTip(e.target.value)}
                                                    className="w-full rounded-md border border-primary-line px-4 pr-[110px] py-2 text-base font-inter placeholder:text-gray-300"
                                                />
                                                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                                                    <img src={TipRed} alt="TipRed" className="w-7 h-7" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs">
                                            *100% of your tip will be allocated directly to the groomer.
                                        </div>
                                    </>
                                )}

                                <button
                                    disabled={!selectedTip && !customTip}
                                    className={`w-full h-[38px] rounded-[10px] text-white font-medium bg-primary-dark ${!selectedTip && !customTip ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                        }`}
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

