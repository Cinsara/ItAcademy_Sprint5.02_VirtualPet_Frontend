import React from 'react';
import '../css/PetAnimation.css';

// Importaciones de sprites
import pet_dragon_orange_sprite_sheet from '../assets/sprites/pet_dragon_orange_sprite_sheet.png';
import pet_dragon_green_sprite_sheet from '../assets/sprites/pet_dragon_green_sprite_sheet.png';
import pet_dragon_blue_sprite_sheet from '../assets/sprites/pet_dragon_blue_sprite_sheet.png';
// (importa más según necesites)

const spriteMap = {
  dragon_orange: pet_dragon_orange_sprite_sheet,
  dragon_green: pet_dragon_green_sprite_sheet,
  dragon_blue: pet_dragon_blue_sprite_sheet
};

const frameCounts = {
  dragon_orange: 4,
  dragon_green: 4,
  dragon_blue: 4,
  // Añade más si los tienes
};

const PetAnimation = ({ type }) => {
  const frameSize = 128; // cada frame es 128x128

  return (
    <div
      className="pet-sprite"
      style={{
        width: `${frameSize}px`,
        height: `${frameSize}px`,
        backgroundImage: `url(${spriteMap[type]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${frameSize * 2}px ${frameSize * 2}px`, // 256x256
        animation: 'pet-run-grid 1.2s steps(1) infinite',
        imageRendering: 'pixelated',
        transform: 'scale(2)',
}}
    />
  );
};

export default PetAnimation;

