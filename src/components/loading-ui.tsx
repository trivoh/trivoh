"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const SkeletonBox = ({ 
  className, 
  delay = 0 
}: { 
  className?: string
  delay?: number 
}) => (
  <motion.div
    className={cn("bg-muted rounded-md", className)}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
)

const SidebarSkeleton = () => (
  <div className="w-64 bg-background border-r border-border p-4 space-y-4">
    {/* Logo/Title */}
    <div className="flex items-center gap-2 mb-6">
      <SkeletonBox className="w-8 h-8 rounded-full" />
      <SkeletonBox className="w-20 h-5" delay={0.1} />
    </div>
    
    {/* Compose Button */}
    <SkeletonBox className="w-full h-10 rounded-lg" delay={0.2} />
    
    {/* Navigation Items */}
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <SkeletonBox className="w-4 h-4" delay={0.3 + i * 0.1} />
          <SkeletonBox className="w-16 h-4" delay={0.4 + i * 0.1} />
        </div>
      ))}
    </div>
    
    {/* Labels Section */}
    <div className="pt-4 border-t border-border">
      <SkeletonBox className="w-12 h-4 mb-3" delay={0.8} />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 pl-4">
            <SkeletonBox className="w-3 h-3 rounded-full" delay={0.9 + i * 0.1} />
            <SkeletonBox className="w-14 h-3" delay={1.0 + i * 0.1} />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const EmailListSkeleton = () => (
  <div className="w-80 bg-background border-r border-border">
    {/* Header */}
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="w-24 h-6" />
        <SkeletonBox className="w-8 h-8 rounded-full" delay={0.1} />
      </div>
      <SkeletonBox className="w-full h-9 rounded-lg" delay={0.2} />
    </div>
    
    {/* Email List */}
    <div className="divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="p-4 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <SkeletonBox className="w-8 h-8 rounded-full" delay={0.3 + i * 0.05} />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <SkeletonBox className="w-20 h-4" delay={0.4 + i * 0.05} />
                <SkeletonBox className="w-12 h-3" delay={0.5 + i * 0.05} />
              </div>
              <SkeletonBox className="w-32 h-4" delay={0.6 + i * 0.05} />
            </div>
          </div>
          <SkeletonBox className="w-full h-4" delay={0.7 + i * 0.05} />
          <SkeletonBox className="w-3/4 h-4" delay={0.8 + i * 0.05} />
        </motion.div>
      ))}
    </div>
  </div>
)

const EmailContentSkeleton = () => (
  <div className="flex-1 bg-background">
    {/* Header */}
    <div className="p-6 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <SkeletonBox className="w-32 h-5" delay={0.1} />
            <SkeletonBox className="w-24 h-4" delay={0.2} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-8 h-8 rounded-full" delay={0.3} />
          <SkeletonBox className="w-8 h-8 rounded-full" delay={0.4} />
          <SkeletonBox className="w-8 h-8 rounded-full" delay={0.5} />
        </div>
      </div>
      <SkeletonBox className="w-96 h-6" delay={0.6} />
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <SkeletonBox className="w-full h-4" delay={0.7} />
        <SkeletonBox className="w-full h-4" delay={0.8} />
        <SkeletonBox className="w-3/4 h-4" delay={0.9} />
      </div>
      
      <div className="space-y-2">
        <SkeletonBox className="w-full h-4" delay={1.0} />
        <SkeletonBox className="w-5/6 h-4" delay={1.1} />
        <SkeletonBox className="w-full h-4" delay={1.2} />
        <SkeletonBox className="w-2/3 h-4" delay={1.3} />
      </div>
      
      <div className="space-y-2">
        <SkeletonBox className="w-full h-4" delay={1.4} />
        <SkeletonBox className="w-4/5 h-4" delay={1.5} />
        <SkeletonBox className="w-full h-4" delay={1.6} />
      </div>
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t border-border mt-8">
      <div className="flex items-center gap-2">
        <SkeletonBox className="w-16 h-8 rounded-md" delay={1.7} />
        <SkeletonBox className="w-16 h-8 rounded-md" delay={1.8} />
        <SkeletonBox className="w-20 h-8 rounded-md" delay={1.9} />
      </div>
    </div>
  </div>
)

export default function LoadingUI() {
  return (
    <motion.div
      className="h-screen bg-background flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SidebarSkeleton />
      <EmailListSkeleton />
      <EmailContentSkeleton />
    </motion.div>
  )
}