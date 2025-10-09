import React from 'react'

const Card = ({ children, borderColor }) => (
    <div
        className={`mb-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition`}
        style={borderColor ? { borderTop: `4px solid ${borderColor}` } : {}}
    >
        {children}
    </div>
);

export default Card