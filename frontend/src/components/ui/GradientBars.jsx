import { useState } from 'react';
import './GradientBars.css';

export function GradientBars() {
  const [numBars] = useState(15);

  const calculateHeight = (index, total) => {
    const position = index / (total - 1);
    const maxHeight = 100;
    const minHeight = 30;
    
    const center = 0.5;
    const distanceFromCenter = Math.abs(position - center);
    const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2);
    
    return minHeight + (maxHeight - minHeight) * heightPercentage;
  };

  return (
    <div className="gradient-bars-container">
      <div className="gradient-bars-wrapper">
        {Array.from({ length: numBars }).map((_, index) => {
          const height = calculateHeight(index, numBars);
          return (
            <div
              key={index}
              className="gradient-bar"
              style={{
                transform: `scaleY(${height / 100})`,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

