// Character.tsx
import React, { useState, useEffect, useRef } from 'react';
import { globalPosition } from './globals'; // Import the global variable
import { NPCs } from '../convex/openai';

interface CharacterProps {
  spriteSheet: Record<string, string[]>;
}

const Character: React.FC<CharacterProps> = ({ spriteSheet }) => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [direction, setDirection] = useState<string>('down');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [, forceUpdate] = useState<number>(0); // Used to force a re-render
  const animationRef = useRef<number>();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const speed = 0.25;

  const moveCharacter = () => {
    const step = speed;

    // Modify the global variable directly
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
      setDirection('up');
      const top = Math.max(globalPosition.top - step, 0);
      if (!collisionDetection(top*4, globalPosition.left*4)) {
        globalPosition.top = top;
      }
    }
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
      setDirection('down');
      const top = Math.min(globalPosition.top + step, 100);
      if (!collisionDetection(top*4, globalPosition.left*4)) {
        globalPosition.top = top;
      }
    }
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
      setDirection('left');
      const left = Math.max(globalPosition.left - step, 0);
      if (!collisionDetection(globalPosition.top*4, left*4)) {
        globalPosition.left = left;
      }
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
      setDirection('right');
      const left = Math.min(globalPosition.left + step, 100);
      if (!collisionDetection(globalPosition.top*4, left*4)) {
        globalPosition.left = left;
      }
    }

    forceUpdate((prev) => prev + 1); // Force re-render to reflect the changes

    animationRef.current = requestAnimationFrame(moveCharacter);
  };

  useEffect(() => {
    if (isMoving) {
      animationRef.current = requestAnimationFrame(moveCharacter);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMoving]);

  useEffect(() => {
    const handleKeyToggle = (event: KeyboardEvent, isKeyDown: boolean) => {
      keysPressed.current[event.key] = isKeyDown;
      setIsMoving(Object.values(keysPressed.current).some(Boolean));
    };

    window.addEventListener('keydown', (event) => handleKeyToggle(event, true));
    window.addEventListener('keyup', (event) => handleKeyToggle(event, false));

    return () => {
      window.removeEventListener('keydown', (event) => handleKeyToggle(event, true));
      window.removeEventListener('keyup', (event) => handleKeyToggle(event, false));
    };
  }, []);

  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    if (isMoving) {
      frameInterval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % spriteSheet[direction].length);
      }, 100);
    }
    return () => {
      clearInterval(frameInterval);
    };
  }, [spriteSheet, direction, isMoving]);

  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        backgroundImage: `url(${spriteSheet[direction][currentFrame]})`,
        backgroundSize: 'cover',
        imageRendering: 'pixelated',
        position: 'absolute',
        top: `${globalPosition.top}%`, // Use global variable
        left: `${globalPosition.left}%`, // Use global variable
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
    />
  );
};

let map = Array.from({ length: 400 }, () => Array(400).fill(1));


// for (let i = 240; i < 264; i++) {
//   for (let j = 116; j < 140; j++) {
//     map[j][i] = 6; // NPC
//   }
// }


for (let i = 40; i < 360; i++) {
  for (let j = 190; j < 212; j++) {
    map[i][j] = 0; // Vertical path
  }
  if (i <= 196) {
    if (i >= 40) {
      for (let j = i; j < i + 16; j++) {
        map[285][j] = 0; // bottom left Horizontal path
        map[286][j] = 0; // Horizontal path
        map[287][j] = 0; // Horizontal path
        map[288][j] = 0; // Horizontal path
        map[289][j] = 0; // Horizontal path
        map[290][j] = 0; // Horizontal
      }
    } 
    if (i >= 88) { 
      for (let j = i; j < i + 16; j++) {
        map[115][j] = 0; // top left Horizontal path
        map[116][j] = 0; // top left Horizontal path
        map[117][j] = 0; // top left Horizontal path
        map[118][j] = 0; // Horizontal path
        map[119][j] = 0; // Horizontal path
        map[120][j] = 0; // Horizontal
        map[121][j] = 0; // Horizontal
      }
    }
  }
  if (i >= 204) {
    if (i <= 340) {
      for (let j = i; j < i + 16; j++) {
        map[294][j] = 0; // bottom right Horizontal path
        map[295][j] = 0; // bottom right Horizontal path
        map[296][j] = 0; // bottom right Horizontal path
        map[297][j] = 0; // bottom right Horizontal path
        map[298][j] = 0; // bottom right Horizontal path
        map[299][j] = 0; // bottom right Horizontal path
        map[300][j] = 0; // bottom right Horizontal path
        map[301][j] = 0; // bottom right Horizontal path
        map[302][j] = 0; // bottom right Horizontal path
      }
    }
    if (i <= 330) {
      for (let j = i; j < i + 16; j++) {
        map[148][j] = 0; // top right Horizontal path
        map[149][j] = 0; // top right Horizontal path
        map[150][j] = 0; // Horizontal path
        map[151][j] = 0; // Horizontal path
        map[152][j] = 0; // Horizontal path
        map[153][j] = 0; // Horizontal path
        map[154][j] = 0; // Horizontal path
      }
    }
  }
}

function collisionDetection(top: number, left: number) {
  npc = NPCs[0];
  switch (map[top][left]) {
    case 0 : return false; // No collision
    case 1 : return true; // Check if tile is a wall
    default : {npc = NPCs[map[top][left] - 1]; return true;} // Check if tile is an NPC
  }

  // if (top < 0 || left < 0 || top >= 400 || left >= 400) 
  //     return true; // Check if out of bounds
  // if ( map[top][left] === 1) {
  //   return true; // Check if tile is a walldd
  // }
  // if (map[top][left] != 0 && map[top][left] != 1) {
  //   npc = NPCs[map[top][left] - 1];
  //   return true; // Check if tile is an NPC
  // }
  // return false; // No collision
}

export default Character;
var npc = NPCs[0];
export function getNPC() {
  return npc;
}