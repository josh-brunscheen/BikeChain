import React from "react";

function Modal({ toggle }) {
  return (
    <div className="static">
      <div className="fixed h-screen w-screen bg-black z-10 top-0 opacity-75">
        <button onClick={toggle}>X</button>
        {/* Form here for new bike */}
      </div>
      
    </div>
  );
}

export default Modal