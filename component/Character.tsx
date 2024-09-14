// Character.tsx
import React, { useState, useEffect, useRef } from 'react';
import { globalPosition } from './globals'; // Import the global variable

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
  const speed = 0.3;

  const moveCharacter = () => {
    // const step = speed;
    const step = 1;

    // Modify the global variable directly
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
      setDirection('up');
      const top = Math.max(globalPosition.top - step, 0);
      if (!collisionDetection(top, globalPosition.left)) {
        globalPosition.top = top;
      }
    }
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
      setDirection('down');
      const top = Math.min(globalPosition.top + step, 100);
      if (!collisionDetection(top, globalPosition.left)) {
        globalPosition.top = top;
      }
    }
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
      setDirection('left');
      const left = Math.max(globalPosition.left - step, 0);
      if (!collisionDetection(globalPosition.top, left)) {
        globalPosition.left = left;
      }
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
      setDirection('right');
      const left = Math.min(globalPosition.left + step, 100);
      if (!collisionDetection(globalPosition.top, left)) {
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

let map = Array.from({ length: 100 }, () => Array(100).fill(1));

for (let i = 10; i < 90; i++) {
  map[i][49] = 0;
  map[i][50] = 0; // Vertical path
  map[i][51] = 0; // Vertical path 
  map[i][52] = 0; // Vertical path
  if (i <= 49) {
    if (i > 10) {
      map[71][i] = 0; // 
      map[72][i] = 0; // bottom left Horizontal path
      map[73][i] = 0; // Horizontal path
      map[74][i] = 0; // Horizontal path
    } 
    if (i >= 22) { 
      map[29][i] = 0; // top left Horizontal path
      map[30][i] = 0; // top left Horizontal path 
      map[31][i] = 0; // Horizontal path
      map[32][i] = 0; // Horizontal path
    }
  }
  if (i >= 51) {
      if (i <= 85) {
        map[74][i] = 0; // bottom right Horizontal path
        map[75][i] = 0; // bottom right Horizontal path
        map[76][i] = 0; // Horizontal path
        map[77][i] = 0; // Horizontal
      }
      if (i <= 87) {
      map[37][i] = 0; // top right Horizontal path
      map[38][i] = 0; // top right Horizontal path
      map[39][i] = 0; // Horizontal path
      map[40][i] = 0; // Horizontal path
    }
  }
}

function collisionDetection(top: number, left: number) {
  return map[top][left] === 1; // Check if tile is a wall
}

export default Character;
