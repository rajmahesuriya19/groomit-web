import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image404 from '../../assets/images/404.png';

const Page404 = () => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col justify-center items-center gap-2">
      <div className="inline w-80">
        <img src={Image404} alt="" className="w-full" />
      </div>
      <div className="flex flex-row items-end mt-5 mb-2">
        <h1 className="text-5xl font-semibold text-gray-800 mr-3">Oops!</h1>
        <h2 className="text-2xl font-medium text-gray-800">Page not found</h2>
      </div>
      <p className="text-sm font-medium text-gray-400 mb-5">The Page you are looking for doesn't exist or an other error occurred.</p>
      <button onClick={handleClickBack}>
        Go Back
      </button>
    </div>
  );
};

export default Page404;
