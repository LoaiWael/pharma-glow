import React from 'react'
import { motion, type HTMLMotionProps, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'
import {
  containerVariants,
  itemFadeUpVariants,
} from '@/lib/animation-variants'

export interface PageFadeInProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
}

export const PageFadeIn: React.FC<PageFadeInProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.4,
  yOffset = 16,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: yOffset }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface AnimationContainerProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  className?: string
  staggerChildren?: number
  delayChildren?: number
  variants?: Variants
}

export const AnimationContainer: React.FC<AnimationContainerProps> = ({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  variants = containerVariants,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      custom={{ staggerChildren, delayChildren }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface AnimationItemProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode
  className?: string
  variants?: Variants
}

export const AnimationItem: React.FC<AnimationItemProps> = ({
  children,
  className,
  variants = itemFadeUpVariants,
  ...props
}) => {
  return (
    <motion.div
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
