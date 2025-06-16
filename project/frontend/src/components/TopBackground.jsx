import React from 'react';

function TopBackground({ height }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-0" 
      style={{
        height: height, 
        // CORREÇÃO AQUI: O gradiente agora vai de FFF9F9 sólido para FFF9F9 TOTALMENTE transparente
        background: 'linear-gradient(to bottom, #FFF9F9, rgba(255, 249, 249, 100))', 
      }}
    ></div>
  );
}

export default TopBackground;