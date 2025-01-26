import React, { useEffect, useState, useRef } from "react";

interface ScrollingMarqueeProps {
  text?: string;
  speed?: number; // Higher number = faster speed (1-100)
}

const ScrollingMarquee: React.FC<ScrollingMarqueeProps> = ({
  text = "Breaking News: This is a sample scrolling text",
  speed = 50, // Default medium speed
}) => {
  const [position, setPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const intervalTime = Math.max(1, Math.floor(50 - speed * 0.45));

    const animate = () => {
      setPosition((prevPosition) => {
        const pixelMove = Math.ceil(speed / 20);
        const newPosition = prevPosition - pixelMove;

        if (contentRef.current && containerRef.current) {
          if (-newPosition >= contentRef.current.offsetWidth) {
            return containerRef.current.offsetWidth;
          }
        }
        return newPosition;
      });
    };

    const interval = setInterval(animate, intervalTime);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="w-full overflow-hidden bg-blue-900 text-white">
      <div ref={containerRef} className="relative flex h-10 items-center">
        <div
          ref={contentRef}
          className="absolute whitespace-nowrap"
          style={{ transform: `translateX(${position}px)` }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default ScrollingMarquee;
