import React, { useEffect, useState } from 'react';

const SnowdropAnimation = () => {
  const [snowdrops, setSnowdrops] = useState([]);

  useEffect(() => {
    const createSnowdrop = () => {
      const symbols = ['❄', '✦', '✧', '⋆', '∘', '◦'];
      const newSnowdrop = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 8 + 5, // 5-13 seconds
        size: Math.random() * 0.8 + 0.6, // 0.6-1.4em
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        delay: Math.random() * 2,
      };
      
      setSnowdrops(prev => [...prev, newSnowdrop]);
      
      // Remove snowdrop after animation
      setTimeout(() => {
        setSnowdrops(prev => prev.filter(drop => drop.id !== newSnowdrop.id));
      }, (newSnowdrop.animationDuration + newSnowdrop.delay) * 1000);
    };

    const interval = setInterval(createSnowdrop, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {snowdrops.map(drop => (
        <div
          key={drop.id}
          className="snowdrop"
          style={{
            left: `${drop.left}%`,
            fontSize: `${drop.size}em`,
            animationDuration: `${drop.animationDuration}s`,
            animationDelay: `${drop.delay}s`,
            zIndex: -1,
          }}
        >
          {drop.symbol}
        </div>
      ))}
    </div>
  );
};

export default SnowdropAnimation;
