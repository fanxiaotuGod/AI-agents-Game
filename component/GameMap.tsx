import React from 'react';
import Character from './Character';
import './GameMap.css';
// Correct and consistent paths to your sprite images
const spriteSheet = {
  up: [
    '../Assets/guardian_walk/skeleton_sprites-00-00.png',
    '../Assets/guardian_walk/skeleton_sprites-01-00.png',
    '../Assets/guardian_walk/skeleton_sprites-02-00.png',
    '../Assets/guardian_walk/skeleton_sprites-03-00.png',
    '../Assets/guardian_walk/skeleton_sprites-04-00.png',
    '../Assets/guardian_walk/skeleton_sprites-05-00.png',
    '../Assets/guardian_walk/skeleton_sprites-06-00.png',
    '../Assets/guardian_walk/skeleton_sprites-07-00.png',
    '../Assets/guardian_walk/skeleton_sprites-08-00.png',
  ],
  down: [
    '../Assets/guardian_walk/skeleton_sprites-00-02.png',
    '../Assets/guardian_walk/skeleton_sprites-01-02.png',
    '../Assets/guardian_walk/skeleton_sprites-02-02.png',
    '../Assets/guardian_walk/skeleton_sprites-03-02.png',
    '../Assets/guardian_walk/skeleton_sprites-04-02.png',
    '../Assets/guardian_walk/skeleton_sprites-05-02.png',
    '../Assets/guardian_walk/skeleton_sprites-06-02.png',
    '../Assets/guardian_walk/skeleton_sprites-07-02.png',
    '../Assets/guardian_walk/skeleton_sprites-08-02.png',
  ],
  left: [
    '../Assets/guardian_walk/skeleton_sprites-00-01.png',
    '../Assets/guardian_walk/skeleton_sprites-01-01.png',
    '../Assets/guardian_walk/skeleton_sprites-02-01.png',
    '../Assets/guardian_walk/skeleton_sprites-03-01.png',
    '../Assets/guardian_walk/skeleton_sprites-04-01.png',
    '../Assets/guardian_walk/skeleton_sprites-05-01.png',
    '../Assets/guardian_walk/skeleton_sprites-06-01.png',
    '../Assets/guardian_walk/skeleton_sprites-07-01.png',
    '../Assets/guardian_walk/skeleton_sprites-08-01.png',
  ],
  right: [
    '../Assets/guardian_walk/skeleton_sprites-00-03.png',
    '../Assets/guardian_walk/skeleton_sprites-01-03.png',
    '../Assets/guardian_walk/skeleton_sprites-02-03.png',
    '../Assets/guardian_walk/skeleton_sprites-03-03.png',
    '../Assets/guardian_walk/skeleton_sprites-04-03.png',
    '../Assets/guardian_walk/skeleton_sprites-05-03.png',
    '../Assets/guardian_walk/skeleton_sprites-06-03.png',
    '../Assets/guardian_walk/skeleton_sprites-07-03.png',
    '../Assets/guardian_walk/skeleton_sprites-08-03.png',
  ],
};


const GameMap: React.FC = () => {
  return (
    <div className="map-container">
      <Character spriteSheet={spriteSheet} />
    </div>
  );
};

export default GameMap;
