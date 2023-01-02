import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
     </BrowserRouter>
  );
}

export default App;