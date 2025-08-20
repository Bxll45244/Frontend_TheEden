import React, { useState, useEffect } from 'react';
import LoadingAnimation from './components/animations/LoadingAnimation'; 

function App({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // จำลองการโหลด
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <LoadingAnimation /> 
        </div>
      ) : (
        <main className="flex-grow">
          {children}
        </main>
      )}
    </div>
  );
}

export default App;