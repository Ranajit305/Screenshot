import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Screenshot from './Screenshot';


const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Screenshot />} />
    </Routes>
  );
};

export default App