import React from 'react';

function App({ children }) {
  return (

    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}

export default App;