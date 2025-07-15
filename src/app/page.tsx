"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { EmailList } from "@/components/email-list"
import { EmailContent } from "@/components/email-content"
import { ComposeModal } from "@/components/compose-modal"
import { TopBar } from "@/components/top-bar"
import { useEmail } from "@/contexts/email-context"
 
export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectedEmail, showComposeModal } = useEmail()

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 ">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Responsive width */}
        <motion.div
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white border-r border-gray-200 flex-shrink-0"
        >
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </motion.div>

        <div className="flex flex-1 overflow-hidden">
          <motion.div
            initial={false}
            animate={{
              width: selectedEmail ? "40%" : "100%",
              opacity: 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white border-r border-gray-200 flex-shrink-0"
          >
            <EmailList />
          </motion.div>

          <AnimatePresence>
            {selectedEmail && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "60%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white  flex-1 overflow-hidden"
              >
                <EmailContent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>{showComposeModal && <ComposeModal />}</AnimatePresence>

     </div>
  )
}
