"use client"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { motion, AnimatePresence, useDragControls, type Variants } from "framer-motion"
import { X, Minimize2, Send, Save, Trash2, Paperclip, Edit3, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEmail } from "@/contexts/email-context"
import TiptapEditor from "@/components/rich-text-editor"

interface EmailComposeProps {
  onClose: () => void
}

export default function EmailCompose({ onClose }: EmailComposeProps) {
  const { addEmail, setSelectedFolder } = useEmail()
  const [isMinimized, setIsMinimized] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Fix hydration issue
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMinimized && isMounted) {
      const updatePosition = () => {
        setPosition({
          x: window.innerWidth - 80,
          y: window.innerHeight - 80,
        })
      }
      updatePosition()
      window.addEventListener("resize", updatePosition)
      return () => window.removeEventListener("resize", updatePosition)
    }
  }, [isMinimized, isMounted])

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSend = () => {
    if (!to.trim()) {
      showNotification("Please enter a recipient email address", "error")
      return
    }
    if (!subject.trim()) {
      showNotification("Please enter a subject", "error")
      return
    }

    const newEmail = {
      sender: "You",
      subject: subject.trim(),
      preview: content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
      content: content,
      isRead: true,
      labels: [],
      folder: "sent",
      to: to.trim(),
      cc: cc.trim() || undefined,
      bcc: bcc.trim() || undefined,
    }

    addEmail(newEmail)
    showNotification("Email sent successfully!", "success")

    setTimeout(() => {
      setSelectedFolder("sent")
    }, 1000)

    setTimeout(() => {
      setTo("")
      setCc("")
      setBcc("")
      setSubject("")
      setContent("")
      onClose()
    }, 1500)
  }

  const handleSaveDraft = () => {
    if (!to.trim() && !subject.trim() && !content.trim()) {
      showNotification("Cannot save empty draft", "error")
      return
    }

    const draftEmail = {
      sender: "You (Draft)",
      subject: subject.trim() || "(No Subject)",
      preview: content.replace(/<[^>]*>/g, "").substring(0, 100) + "..." || "(No Content)",
      content: content,
      isRead: true,
      labels: ["Draft"],
      folder: "drafts",
      to: to.trim() || undefined,
      cc: cc.trim() || undefined,
      bcc: bcc.trim() || undefined,
    }

    addEmail(draftEmail)
    showNotification("Draft saved successfully!", "success")

    setTimeout(() => {
      setSelectedFolder("drafts")
    }, 1000)

    setTimeout(() => {
      setTo("")
      setCc("")
      setBcc("")
      setSubject("")
      setContent("")
      onClose()
    }, 1500)
  }

  const handleDelete = () => {
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    setContent("")
    onClose()
  }

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }

  const minimizedVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  }

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null
  }

  if (isMinimized) {
    return (
      <>
        <AnimatePresence>
          {notification && (
            <motion.div
              key="minimized-notification" // Added explicit key
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
                notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            key="minimized-button" // Added explicit key
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            initial={{ x: position.x, y: position.y }}
            animate={{ x: position.x, y: position.y }}
            variants={minimizedVariants}
            className="fixed w-14 h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-lg cursor-pointer pointer-events-auto transition-colors"
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      {" "}
      {/* Replaced AnimatePresence with a Fragment */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="full-modal-notification" // Added explicit key
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={() => setIsMinimized(true)}
      >
        <motion.div
          key="main-compose-modal" // Added explicit key
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <label htmlFor="to-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                To
              </label>
              <Input
                id="to-input"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
                className="flex-1 border-none shadow-none focus:ring-0 bg-transparent"
              />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCc(!showCc)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Cc
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Bcc
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {showCc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="cc-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                    Cc
                  </label>
                  <Input
                    id="cc-input"
                    type="email"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="Carbon copy"
                    className="flex-1 border-none shadow-none focus:ring-0 bg-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showBcc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="bcc-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                    Bcc
                  </label>
                  <Input
                    id="bcc-input"
                    type="email"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="Blind carbon copy"
                    className="flex-1 border-none shadow-none focus:ring-0 bg-transparent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <label htmlFor="subject-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                Subject
              </label>
              <Input
                id="subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 border-none shadow-none focus:ring-0 bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden">
            <TiptapEditor content={content} onChange={setContent} placeholder="Compose your message..." />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
