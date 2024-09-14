import React, { useState, useEffect, useRef } from 'react';

interface CharacterProps {
  spriteSheet: Record<string, string[]>; // Object containing directions with corresponding sprite images
}

const Character: React.FC<CharacterProps> = ({ spriteSheet }) => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [direction, setDirection] = useState<string>('down'); // Initial direction
  const [isMoving, setIsMoving] = useState<boolean>(false); // State to control movement
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 50, left: 50 }); // Character position
  const animationRef = useRef<number>(); // Ref to store animation frame id
  const keysPressed = useRef<{ [key: string]: boolean }>({}); // Ref to store currently pressed keys

  // Define the speed as a constant or state
  const speed = 0.3; // Adjust this value to change the character speed (higher is faster, lower is slower)

  const preloadImages = (images: string[]) => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  };

  useEffect(() => {
    // Preload all images
    Object.values(spriteSheet).forEach((frames) => preloadImages(frames));
  }, [spriteSheet]);

  const moveCharacter = () => {
    const step = speed * 0.5; // Multiply the base step by the speed factor

    // Adjust position based on direction and currently pressed keys
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
      setDirection('up');
      setPosition((prevPosition) => ({ ...prevPosition, top: Math.max(prevPosition.top - step, 0) }));
    }
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
      setDirection('down');
      setPosition((prevPosition) => ({ ...prevPosition, top: Math.min(prevPosition.top + step, 100) }));
    }
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
      setDirection('left');
      setPosition((prevPosition) => ({ ...prevPosition, left: Math.max(prevPosition.left - step, 0) }));
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
      setDirection('right');
      setPosition((prevPosition) => ({ ...prevPosition, left: Math.min(prevPosition.left + step, 100) }));
    }

    animationRef.current = requestAnimationFrame(moveCharacter); // Request next frame
  };

  useEffect(() => {
    if (isMoving) {
      animationRef.current = requestAnimationFrame(moveCharacter); // Start animation loop
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current); // Stop animation loop
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current); // Cleanup on unmount
    };
  }, [isMoving]); // Run effect when isMoving changes

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keysPressed.current[event.key]) {
        keysPressed.current[event.key] = true; // Track key press state
        setIsMoving(true); // Start movement on key press
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = false; // Clear key press state
      if (!Object.values(keysPressed.current).some(Boolean)) {
        setIsMoving(false); // Stop movement if no keys are pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Animate sprite frames
  useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    if (isMoving) {
      frameInterval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % spriteSheet[direction].length);
      }, 100); // Adjust speed of animation
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
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
    />
  );
};

export default Character;
