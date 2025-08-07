"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface WobbleCardProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  wobbleIntensity?: number;
  scaleIntensity?: number;
  gradientFrom?: string;
  gradientTo?: string;
  backgroundColor?: string;
  enableNoise?: boolean;
  noiseOpacity?: number;
  hoverScale?: number;
  transitionDuration?: number;
  borderRadius?: string;
}

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  wobbleIntensity = 20,
  scaleIntensity = 1.03,
  gradientFrom = "rgba(255,255,255,0.5)",
  gradientTo = "rgba(255,255,255,0)",
  backgroundColor = "bg-indigo-800",
  enableNoise = true,
  noiseOpacity = 0.1,
  hoverScale = 1,
  transitionDuration = 0.1,
  borderRadius = "rounded-2xl",
}: WobbleCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  
  // Use motion values for smoother animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Use springs for more natural movement
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    
    const { clientX, clientY } = event;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (clientX - centerX) / wobbleIntensity;
    const y = (clientY - centerY) / wobbleIntensity;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [wobbleIntensity, mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const cardTransform = isHovering && hoverScale !== 1 
    ? `scale(${hoverScale})` 
    : "scale(1)";

  return (
    <motion.section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: cardTransform,
        x: springX,
        y: springY,
      }}
      transition={{
        transform: { duration: transitionDuration, ease: "easeOut" },
        scale: { duration: 0.2, ease: "easeOut" }
      }}
      className={cn(
        "mx-auto w-full relative overflow-hidden cursor-pointer",
        backgroundColor,
        borderRadius,
        containerClassName
      )}
    >
      <div
        className={cn(
          "relative h-full sm:mx-0 overflow-hidden",
          borderRadius
        )}
        style={{
          backgroundImage: `radial-gradient(88% 100% at top, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `
            0 10px 32px rgba(34, 42, 53, 0.12),
            0 1px 1px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(34, 42, 53, 0.05),
            0 4px 6px rgba(34, 42, 53, 0.08),
            0 24px 108px rgba(47, 48, 55, 0.10)
          `,
        }}
      >
        <motion.div
          style={{
            x: isHovering ? springX.get() * -1 : 0,
            y: isHovering ? springY.get() * -1 : 0,
            scale: isHovering ? scaleIntensity : 1,
          }}
          transition={{
            duration: transitionDuration,
            ease: "easeOut"
          }}
          className={cn("h-full px-4 py-20 sm:px-10 relative z-10", className)}
        >
          {enableNoise && <Noise opacity={noiseOpacity} />}
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

interface NoiseProps {
  opacity?: number;
  scale?: number;
  maskGradient?: string;
  backgroundSize?: string;
}

const Noise = ({ 
  opacity = 0.1, 
  scale = 1.2,
  maskGradient = "radial-gradient(#fff, transparent 75%)",
  backgroundSize = "30%"
}: NoiseProps) => {
  return (
    <div
      className="absolute inset-0 w-full h-full transform pointer-events-none"
      style={{
        opacity,
        transform: `scale(${scale})`,
        maskImage: maskGradient,
        WebkitMaskImage: maskGradient,
        backgroundImage: "url(/images/pattern.webp)",
        backgroundSize,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

// Export individual components for flexibility
export { Noise };

// Preset variants for common use cases
export const WobbleCardPresets = {
  default: {},
  
  subtle: {
    wobbleIntensity: 30,
    scaleIntensity: 1.01,
    hoverScale: 1.02,
  },
  
  intense: {
    wobbleIntensity: 15,
    scaleIntensity: 1.05,
    hoverScale: 1.03,
  },
  
  minimal: {
    wobbleIntensity: 40,
    scaleIntensity: 1,
    enableNoise: false,
    backgroundColor: "bg-white",
    gradientFrom: "rgba(0,0,0,0.05)",
    gradientTo: "rgba(0,0,0,0)",
  },
  
  glassmorphism: {
    backgroundColor: "bg-white/10",
    gradientFrom: "rgba(255,255,255,0.2)",
    gradientTo: "rgba(255,255,255,0)",
    backdropBlur: true,
  }
} as const;

// Hook for custom wobble effects
export const useWobbleAnimation = (intensity: number = 20) => {
  const [isActive, setIsActive] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const activate = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (event.clientX - centerX) / intensity;
    const y = (event.clientY - centerY) / intensity;
    
    mouseX.set(x);
    mouseY.set(y);
    setIsActive(true);
  }, [intensity, mouseX, mouseY]);

  const deactivate = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsActive(false);
  }, [mouseX, mouseY]);

  return {
    isActive,
    springX,
    springY,
    activate,
    deactivate,
  };
};