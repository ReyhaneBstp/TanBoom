"use client";

import { motion } from "motion/react";
import type { MotionProps } from "motion/react";
import React from "react";

type AllowedTags = keyof JSX.IntrinsicElements;

type Props<T extends AllowedTags> = {
  as?: T;
  children?: React.ReactNode;
  className?: string;
} & Omit<MotionProps, "transition"> & {
    transition?: MotionProps["transition"];
  } & Omit<React.ComponentPropsWithoutRef<T>, keyof MotionProps>;

function Motion<T extends AllowedTags = "div">({
  as = "div" as T,
  children,
  className,
  ...rest
}: Props<T>) {
  //@ts-expect-error framer-motion تایپ جنریک دقیق نیست ولی کار می‌کنه
  const MotionComponent = motion[as] ?? motion.div;
  return (
    <MotionComponent className={className} {...rest}>
      {children}
    </MotionComponent>
  );
}

export default Motion;