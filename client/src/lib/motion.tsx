import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal primitives.
 *
 * `Reveal` fades + slides an element up into place the first time it
 * enters the viewport. `RevealGroup` staggers its direct motion children.
 * Both respect the user's OS-level "reduce motion" preference — when set,
 * content simply appears with no movement.
 */

const DISTANCE = 28;

function useVariants(distance: number): Variants {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  as?: "div" | "span";
}

export const Reveal = ({
  children,
  className,
  delay = 0,
  distance = DISTANCE,
  as = "div",
}: RevealProps) => {
  const variants = useVariants(distance);
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
};

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export const RevealGroup = ({
  children,
  className,
  stagger = 0.08,
}: RevealGroupProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
}

export const RevealItem = ({
  children,
  className,
  distance = DISTANCE,
}: RevealItemProps) => {
  const variants = useVariants(distance);

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
};
