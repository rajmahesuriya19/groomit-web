import Visa from '../../../assets/cards/Visa-light.svg';
import JCB from '../../../assets/cards/jcb-icon.svg';
import Fallback from '../../../assets/cards/fall-card.svg';
import MasterCard from '../../../assets/cards/mastercard-icon.svg';

const Cards = ({ cards, charged }) => {
    if (!cards || cards.length === 0) {
        return (
            <div className="flex items-center justify-center py-4 text-gray-500 font-inter text-sm">
                No payment methods available
            </div>
        );
    }

    // Card provider logos map
    const cardLogos = {
        visa: Visa,
        mastercard: MasterCard,
        jcb: JCB,
    };

    return (
        <div className="flex flex-col">
            {cards.map((card) => {
                const {
                    billing_id,
                    card_number,
                    default_card,
                    card_provider,
                    payment_type_name
                } = card;

                const logo =
                    cardLogos[card_provider?.toLowerCase()] || Fallback;

                return (
                    <div
                        key={billing_id}
                        className={`flex items-center gap-4 transition ${default_card === "Y" ? "bg-[#FFF9E6]" : "bg-white"
                            }`}
                    >
                        <img
                            src={logo}
                            alt={card_provider || "Card"}
                            className="w-[45px] h-[30px] object-contain"
                        />

                        <div className="flex-1">
                            <div className='font-inter font-bold text-base text-primary-dark'>{payment_type_name}</div>
                            <p className="font-inter font-normal text-sm text-primary-dark">
                                {`${card_provider ? card_provider?.toUpperCase() : 'Card'}`} •••• {card_number}
                            </p>
                        </div>

                        <div>
                            <div className='font-inter font-bold text-xl text-primary-dark'>${charged}</div>
                            <p className="font-inter font-normal text-sm text-primary-dark">
                                Amount Paid
                            </p>
                        </div>
                    </div>
                );
            })}

            <button className="mt-3 w-full h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base hover:bg-gray-50 transition">
                View Full Receipt
            </button>
        </div>
    );
};

export default Cards