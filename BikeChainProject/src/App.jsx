import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="text-black">
      <div id="logo" className="flex size- justify-center">
        <img src={"/bikeChainLogo.svg"} alt="Your SVG" />
      </div>
      
      <div id="mainContent"className="flex justify-center text-black rounded">
        {/* Map div */}
        <div className="w-2/3 m-4 border-2 border-black shadow-lg rounded-md">
          Map
        </div>

        {/* Info panel here */}
        <div className="w-1/3 m-4 border-2 border-black shadow-lg rounded-md">
          <h1>Available Bikes</h1>
        </div>

        
      </div>
    </div>
  )
}

export default App
