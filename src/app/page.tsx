"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { EmailList } from "@/components/email-list"
import { EmailContent } from "@/components/email-content"
import ComposeModal from "@/components/compose-modal" // This is EmailCompose
import { TopBar } from "@/components/top-bar"
import { useEmail } from "@/contexts/email-context"

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  // Destructure setShowComposeModal from useEmail context
  const { selectedEmail, showComposeModal, setSelectedEmail, setShowComposeModal } = useEmail()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <TopBar onToggleMobileSidebar={() => setShowMobileSidebar(!showMobileSidebar)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && showMobileSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 bg-opacity-20 backdrop-blur-sm z-40"
                onClick={() => setShowMobileSidebar(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col transition-colors duration-300"
              >
                <Sidebar collapsed={false} onToggle={() => setShowMobileSidebar(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-72 bg-white dark:bg-gray-900  border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300">
            <Sidebar collapsed={false} onToggle={() => {}} />
          </div>
        )}
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Email List */}
          <motion.div
            initial={false}
            animate={{
              width: isMobile ? (selectedEmail ? "0%" : "100%") : selectedEmail ? "40%" : "100%",
              opacity: isMobile ? (selectedEmail ? 0 : 1) : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300 ${
              isMobile && selectedEmail ? "hidden" : "" // Explicitly hide on mobile when email is selected
            }`}
          >
            <EmailList />
          </motion.div>
          {/* Email Content */}
          <AnimatePresence>
            {selectedEmail && (
              <motion.div
                initial={{ x: isMobile ? "100%" : 0, opacity: isMobile ? 0 : 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isMobile ? "100%" : 0, opacity: isMobile ? 0 : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white dark:bg-gray-900 flex-1 overflow-hidden h-full transition-colors duration-300" // Removed fixed inset-0
              >
                <EmailContent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Corrected ComposeModal usage: onClose now updates the context state */}
      <AnimatePresence>
        {showComposeModal && <ComposeModal onClose={() => setShowComposeModal(false)} />}
      </AnimatePresence>
    </div>
  )
}
