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
    const step = speed;

    // Modify the global variable directly
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
      setDirection('up');
      globalPosition.top = Math.max(globalPosition.top - step, 0);
    }
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
      setDirection('down');
      globalPosition.top = Math.min(globalPosition.top + step, 100);
    }
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
      setDirection('left');
      globalPosition.left = Math.max(globalPosition.left - step, 0);
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
      setDirection('right');
      globalPosition.left = Math.min(globalPosition.left + step, 100);
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

export default Character;
