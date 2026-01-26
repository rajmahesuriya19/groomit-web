import React, { useEffect } from 'react'
import SupportItems from '@/common/SupportItems/SupportItems'
import { ChevronLeft, PlusIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AddressList from './AddressList'
import { fetchAddresses } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice'
import { useLoader } from '@/contexts/loaderContext/LoaderContext'

const Addresses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const addresses = useSelector((state) => state.addresses.addresses);

    useEffect(() => {
        showLoader();
        dispatch(fetchAddresses()).finally(() => hideLoader());
    }, [dispatch]);
    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
                padding: '10px 45px 10px 20px'
            }}>
                <div className='flex items-center gap-4'>
                    <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                    <div className='font-filson font-bold text-xl text-primary-dark'>Service Address</div>
                </div>

                <button className="flex items-center justify-center gap-1 rounded-[10px] border border-primary-line p-[7px]" onClick={() => navigate('/user/address/add')}>
                    <PlusIcon size={24} />
                </button>
            </div>

            <div className={`mb-28`}>
                <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <div className="rounded-[15px] bg-white shadow-md p-4 flex flex-col gap-4 w-full">
                            {addresses.map((address, index) => (
                                <AddressList
                                    key={address?.address_id}
                                    address={address}
                                    isLast={index === addresses.length - 1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Divider Section */}
                    <div className="hidden md:flex justify-center">
                        <div className="h-full w-[1px] bg-[#E4E4E4]" />
                    </div>

                    {/* Right Section */}
                    <div className="space-y-4 w-full min-w-0 hidden md:block">
                        {/* Support List */}
                        <SupportItems />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Addresses;