import React from 'react';
import petMap from './PetMap';
import accessoryPositionMap from './accessoryPositionMap';

const PetAvatar = ({ type, accessories = [] }) => {
  if (!type || !petMap[type]) return null;
  const petImage = petMap[type];


  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
      <img
        src={petImage}
        alt={type}
        style={{
          width: '100%',
          height: 'auto',
          imageRendering: 'auto',
          display: 'block',
        }}
      />
      {accessories.map((acc, i) => {
        const pos = accessoryPositionMap[type]?.[acc.name.toLowerCase()] || {};
        return (
          <img
            key={i}
            src={acc.imageUrl}
            alt={acc.name}
            style={{
              position: 'absolute',
              top: pos.top || '20%',
              left: pos.left || '30%',
              width: pos.width || '40%',
              pointerEvents: 'none',
              imageRendering: 'auto',
            }}
          />
        );
      })}
    </div>
  );
};

export default PetAvatar;


