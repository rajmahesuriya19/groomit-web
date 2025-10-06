// components/CopyTooltip.jsx
import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

const CopyTooltip = ({ textToCopy, children }) => {
    const [tooltip, setTooltip] = useState('Click to copy');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setTooltip('ID Copied!');
        setTimeout(() => setTooltip('Click to copy'), 2000);
    };

    return (
        <Tooltip
            title={tooltip}
            arrow
            placement="top"
            componentsProps={{
                tooltip: { sx: { bgcolor: 'black', color: 'white', fontSize: 12, p: '6px 12px', borderRadius: 1 } },
                arrow: { sx: { color: 'black' } },
            }}
        >
            <div onClick={handleCopy} className="cursor-pointer">
                {children}
            </div>
        </Tooltip>
    );
};

export default CopyTooltip;
