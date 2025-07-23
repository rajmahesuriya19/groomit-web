import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const addresses = [
  { id: 3982, address: '11 Howard, Howard Street, New York, NY, USA', zipCode: '10013' },
  { id: 3981, address: '11 Howard, Howard Street, New York, NY, USA', zipCode: '10013' },
  { id: 3980, address: '11 Howard, Howard Street, New York, NY, USA', zipCode: '10013' },
  { id: 3979, address: '11 Howard, Howard Street, New York, NY, USA', zipCode: '10013' },
];

const AddressSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses[3]);
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
  };

  return (
    <div className="relative w-full max-w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center space-x-3 px-4 py-2 rounded-full border border-[#7C868A80]
          bg-white transition-all duration-200 focus:outline-none
          ${isOpen ? 'ring-2 ring-red-100 border-red-300' : ''}
        `}
      >
        {/* Icon Box */}
        <MapPin size={22} className="text-red-500 flex-shrink-0" />

        {/* Address Text */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[14px] font-semibold leading-none text-[#2E2E2E] truncate">
            {selectedAddress.address}, {selectedAddress.zipCode}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={22}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {addresses.map((address) => (
            <button
              key={address.id}
              onClick={() => handleAddressSelect(address)}
              className={`
                w-full px-4 py-3 text-left text-sm border-b last:border-b-0
                hover:bg-gray-50 transition-colors
                ${
                  selectedAddress.id === address.id
                    ? 'bg-red-50 text-red-900'
                    : 'text-gray-700'
                }
              `}
            >
              {address.address}, {address.zipCode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
