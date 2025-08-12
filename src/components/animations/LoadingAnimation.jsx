import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/lotties/Double circular Loader.json';

export default function LoadingAnimation({ size = 150 }) {
  return (
    <div className="flex justify-center items-center h-full">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        style={{ width: size, height: size }} 
      />
    </div>
  );
}
