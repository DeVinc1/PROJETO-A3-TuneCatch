import React from 'react';

function TopBackground({ height }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-0" 
      style={{
        height: height, 
        background: 'linear-gradient(to bottom, #FFF9F9, rgba(255, 249, 249, 0.8))', 
      }}
    ></div>
  );
}

export default TopBackground;