import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, setDefaultAddress } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';

const AddressSelector = () => {
  const addresses = useSelector((state) => state.addresses.addresses);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses?.find(addr => addr.is_default) || addresses?.[0] || null
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsOpen(false);

    dispatch(setDefaultAddress({ address_id: address.address_id }))
      .unwrap()
      .then(() => {
        dispatch(fetchAddresses());
      });
  };

  if (!addresses?.length) return null;

  return (
    <div className="relative w-full max-w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-full border border-[#7C868A80]
          bg-white transition-all duration-200 focus:outline-none
          ${isOpen ? 'ring-2 ring-red-100 border-red-300' : ''}`}
      >
        {/* Icon */}
        <MapPin size={22} className="text-red-500 flex-shrink-0" />

        {/* Address Text */}
        <div className="flex-1 min-w-0 text-left">
          {selectedAddress ? (
            <p className="text-sm font-semibold leading-none text-primary-dark truncate">
              {selectedAddress.address1}, {selectedAddress.zip}
            </p>
          ) : (
            <p className="text-sm text-gray-400">Select an address</p>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          size={22}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {addresses
            .filter((address) => address.address_id !== selectedAddress?.address_id)
            .map((address) => (
              <button
                key={address.address_id}
                onClick={() => handleAddressSelect(address)}
                className={`w-full px-4 py-3 text-left text-sm border-b last:border-b-0 hover:bg-gray-50 transition-colors
                ${selectedAddress?.address_id === address.address_id
                    ? 'bg-red-50 text-red-900'
                    : 'text-gray-700'}`}
              >
                {address.address1}, {address.zip}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
