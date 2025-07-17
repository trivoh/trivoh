"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutPanelTop,
  Send,
  Paperclip,
  Mic,
  Smile,
  Camera,
  Info,
  MoreVertical,
  ChevronDown,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmail } from "@/contexts/email-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense, useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { DeleteModal } from "@/components/DeleteModal"
import { Toaster, toast } from "react-hot-toast"
import TiptapEditor from "@/components/rich-text-editor"

interface ReplyState {
  content: string
  isRecording: boolean
}

interface ThreadMessage {
  id: string
  sender: string
  timestamp: string
  content: string
  isStarred?: boolean
  inReplyToSender?: string // New field to indicate who this message is replying to
}

function EmailContentInner() {
  const { selectedEmail, setSelectedEmail, deleteEmail, toggleStar } = useEmail()
  const [replyState, setReplyState] = useState<ReplyState>({
    content: "",
    isRecording: false,
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showRichReplyEditor, setShowRichReplyEditor] = useState(false)
  const [richEditorContent, setRichEditorContent] = useState("")
  const [replyToSender, setReplyToSender] = useState<string | null>(null) // To store who is being replied to
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null) // Tracks which dropdown is open

  // Initial hardcoded messages for the thread
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([
    {
      id: "thread-msg-1",
      sender: "John Doe",
      timestamp: "2 minutes ago",
      content: "Thanks for the update! This looks great.",
      isStarred: false,
    },
    {
      id: "thread-msg-2",
      sender: "Sarah Wilson",
      timestamp: "5 minutes ago",
      content: "I agree with John. Let's proceed with this approach.",
      isStarred: false,
    },
  ])

  const replyInputRef = useRef<HTMLDivElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const mainEmailDropdownRef = useRef<HTMLDivElement>(null) // Ref for main email's dropdown

  // Scroll to the bottom when the rich editor appears or new replies are added
  useEffect(() => {
    if (showRichReplyEditor && editorContainerRef.current) {
      editorContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    } else if (replyInputRef.current) {
      replyInputRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [showRichReplyEditor, threadMessages]) // Depend on threadMessages to scroll when new replies are added

  // Effect to close main email dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mainEmailDropdownRef.current && !mainEmailDropdownRef.current.contains(event.target as Node)) {
        if (openDropdownId === "main-email") {
          setOpenDropdownId(null)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId]) // Re-run effect when dropdown state changes

  if (!selectedEmail) return null

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyState((prev) => ({ ...prev, content: e.target.value }))
  }

  const handleSendReply = () => {
    let contentToSend = ""
    if (showRichReplyEditor) {
      contentToSend = richEditorContent.trim()
    } else {
      contentToSend = replyState.content.trim()
    }

    if (!contentToSend) {
      toast.error("Reply cannot be empty!")
      return
    }

    const newReply: ThreadMessage = {
      id: Date.now().toString(),
      sender: "You", // Assuming the user is "You"
      timestamp: "Just now",
      content: contentToSend,
      isStarred: false,
      inReplyToSender: replyToSender || undefined, // Add who is being replied to
    }

    setThreadMessages((prev) => [...prev, newReply]) // Add to threadMessages
    setReplyState({ content: "", isRecording: false })
    setRichEditorContent("")
    setShowRichReplyEditor(false) // Close editor after sending
    setReplyToSender(null) // Clear reply target
    toast.success("Reply sent!")
  }

  const handleVoiceRecording = () => {
    setReplyState((prev) => ({ ...prev, isRecording: !prev.isRecording }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  const handleDeleteMainEmailClick = () => {
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null) // Close any open dropdowns
  }

  const handleConfirmDeleteMainEmail = () => {
    if (selectedEmail) {
      deleteEmail(selectedEmail.id)
      setSelectedEmail(null) // Clear selected email after deletion
      toast.success("Email deleted successfully!")
    }
    setIsDeleteModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleReplyInputFocus = () => {
    setShowRichReplyEditor(true)
    setReplyToSender(null) // Clear specific reply target if focusing on general input
  }

  const handleReplyToSpecificMessage = (sender: string) => {
    setReplyToSender(sender)
    setShowRichReplyEditor(true)
    setRichEditorContent(`Replying to ${sender}:<br><br>`) // Pre-fill editor
  }

  const handleDeleteThreadMessage = (messageId: string, messageSender: string) => {
    setThreadMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    toast.success(`Message from ${messageSender} deleted!`)
  }

  const handleToggleThreadMessageStar = (messageId: string) => {
    setThreadMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg)))
    toast.success("Message starred/unstarred!")
  }

  const handleToggleMainEmailStar = () => {
    if (selectedEmail) {
      toggleStar(selectedEmail.id)
      toast.success(selectedEmail.isStarred ? "Email unstarred!" : "Email starred!")
      setOpenDropdownId(null) // Close dropdown
    }
  }

  const handleMainEmailMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenDropdownId(openDropdownId === "main-email" ? null : "main-email")
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-950">
      <Toaster />
      {/* Header Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          {/* Left section: Navigation and Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmail(null)}
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteMainEmailClick}
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="relative" ref={mainEmailDropdownRef}>
              {" "}
              {/* Attach ref here */}
              <Button
                variant="ghost"
                size="sm"
                 className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
            </div>
          </div>
          {/* Right section: Message count & controls */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>7 of 32,105</span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LayoutPanelTop className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">{selectedEmail.subject}</h1>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {selectedEmail.sender.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">{selectedEmail.sender}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                to me • {selectedEmail.timestamp}
                <ChevronDown className="inline-block w-3 h-3 ml-1" />
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Main Email Content with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e0; /* light gray */
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a0aec0; /* medium gray */
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4b5563; /* dark gray 600 */
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6b7280; /* dark gray 500 */
          }
        `}</style>
        {/* Email Message Card */}
        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-4">
            {/* Message Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{selectedEmail.sender.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-50 text-sm">{selectedEmail.sender}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedEmail.timestamp}</p>
                </div>
              </div>
              {/* Message Actions */}
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleToggleMainEmailStar}>
                  <Star
                    className={`w-4 h-4 ${selectedEmail.isStarred ? "text-yellow-500 fill-yellow-500" : "text-gray-400 hover:text-yellow-400"}`}
                  />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleReplyToSpecificMessage(selectedEmail.sender)}
                >
                  <Reply className="w-4 h-4 text-gray-400" />
                </Button>
                <div className="relative" ref={mainEmailDropdownRef}>
                  {" "}
                  {/* Attach ref here */}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleMainEmailMoreClick}>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </Button>
                  <AnimatePresence>
                    {openDropdownId === "main-email" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                      >
                        <button
                          onClick={handleToggleMainEmailStar}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200"
                        >
                          <Star className="w-4 h-4" />
                          <span>{selectedEmail.isStarred ? "Unstar" : "Star"}</span>
                        </button>
                        <button
                          onClick={handleDeleteMainEmailClick}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* Message Content */}
            <div className="prose max-w-none">
              <div
                className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
              />
            </div>
            {/* Message Footer Actions */}
            <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              {/* Reaction count */}
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  👍 4
                </span>
              </div>
              {/* Emoji reaction button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-full px-3 py-1"
              >
                <Smile className="w-4 h-4" />
              </Button>
              {/* Reply button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-full px-3 py-1 flex items-center"
                onClick={() => handleReplyToSpecificMessage(selectedEmail.sender)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
              {/* Forward button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-full px-3 py-1 flex items-center"
              >
                <Forward className="w-3 h-3 mr-1" />
                Forward
              </Button>
            </div>
          </div>
          {/* Replied Messages Section */}
          <div className="space-y-3">
            {threadMessages.map((message) => (
              <ThreadMessageCard
                key={message.id}
                message={message}
                onReply={handleReplyToSpecificMessage}
                onDelete={handleDeleteThreadMessage}
                onToggleStar={handleToggleThreadMessageStar}
                openDropdownId={openDropdownId} // Pass openDropdownId
                setOpenDropdownId={setOpenDropdownId} // Pass setter
              />
            ))}
          </div>
        </div>
      </div>
      {/* Reply Input / Rich Editor Section */}
      <div
        ref={editorContainerRef}
        className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-4"
      >
        <AnimatePresence mode="wait">
          {showRichReplyEditor ? (
            <motion.div
              key="rich-editor"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="mb-4"
            >
              <TiptapEditor
                content={richEditorContent}
                onChange={setRichEditorContent}
                placeholder={replyToSender ? `Replying to ${replyToSender}...` : "Compose your reply..."}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleSendReply}
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg h-10 font-bold text-xl"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowRichReplyEditor(false)
                    setReplyToSender(null)
                    setRichEditorContent("")
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="simple-reply-input"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="flex items-center space-x-3"
            >
              {/* Emoji Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full flex-shrink-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Smile className="w-5 h-5" />
              </Button>
              {/* Input Field with Icons Inside */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={replyState.content}
                  onChange={handleReplyChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Reply"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  onFocus={handleReplyInputFocus} // Trigger rich editor on focus
                />
                {/* Icons inside input - right side */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400 transform rotate-45" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Camera className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </div>
              {/* Voice/Send Button - Outside Input */}
              {replyState.content.trim() ? (
                <Button
                  onClick={handleSendReply}
                  className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceRecording}
                  className={`h-10 w-10 p-0 rounded-full flex-shrink-0 ${
                    replyState.isRecording
                      ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Recording Indicator */}
        {replyState.isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-sm text-red-600 dark:text-red-400 mt-2"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>Recording...</span>
          </motion.div>
        )}
      </div>
      {/* Delete Modal for main email */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDeleteMainEmail}
        title="Delete Email" // Changed title for clarity
        message="Are you sure you want to delete this email? This action cannot be undone."
      />
    </div>
  )
}

interface ThreadMessageCardProps {
  message: ThreadMessage
  onReply: (sender: string) => void
  onDelete: (messageId: string, messageSender: string) => void
  onToggleStar: (messageId: string) => void
  openDropdownId: string | null // New prop
  setOpenDropdownId: (id: string | null) => void // New prop
}

function ThreadMessageCard({
  message,
  onReply,
  onDelete,
  onToggleStar,
  openDropdownId,
  setOpenDropdownId,
}: ThreadMessageCardProps) {
  const showMoreDropdown = openDropdownId === message.id // Derive state from prop
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const threadMessageDropdownRef = useRef<HTMLDivElement>(null) // Ref for thread message dropdown

  // Effect to close thread message dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (threadMessageDropdownRef.current && !threadMessageDropdownRef.current.contains(event.target as Node)) {
        if (openDropdownId === message.id) {
          // Only close if this specific dropdown is open
          setOpenDropdownId(null)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId, message.id, setOpenDropdownId]) // Dependencies

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenDropdownId(showMoreDropdown ? null : message.id) // Toggle based on current state
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
    setOpenDropdownId(null) // Close dropdown
  }

  const handleConfirmDelete = () => {
    onDelete(message.id, message.sender)
    setShowDeleteModal(false)
  }

  const handleToggleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleStar(message.id)
    setOpenDropdownId(null) // Close dropdown
  }

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 ml-8 ${
        message.inReplyToSender ? "border-l-4 border-blue-500 dark:border-blue-700" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">{message.sender.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-50 text-sm">{message.sender}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</p>
          </div>
        </div>
        <div className="flex bg-white dark:bg-gray-950 px-3 rounded items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleToggleStarClick}>
            <Star
              className={`w-4 h-4 ${
                message.isStarred ? "text-yellow-500 fill-yellow-500" : "text-gray-400 hover:text-yellow-400"
              }`}
            />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onReply(message.sender)}>
            <Reply className="w-4 h-4 text-gray-400" />
          </Button>
          <div className="relative" ref={threadMessageDropdownRef}>
            {" "}
            {/* Attach ref here */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleMoreClick}>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </Button>
            <AnimatePresence>
              {showMoreDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <button
                    onClick={handleToggleStarClick}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <Star className="w-4 h-4" />
                    <span>{message.isStarred ? "Unstar" : "Star"}</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {message.inReplyToSender && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          In reply to: <span className="font-medium">{message.inReplyToSender}</span>
        </p>
      )}
      <div
        className="text-sm text-gray-900 dark:text-gray-100 mb-3"
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-full px-3 py-1 flex items-center"
        >
          <Smile className="w-3 h-3 mr-1" />
          React
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-full px-3 py-1 flex items-center"
          onClick={() => onReply(message.sender)}
        >
          <Reply className="w-3 h-3 mr-1" />
          Reply
        </Button>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message={`Are you sure you want to delete this message from ${message.sender}? This action cannot be undone.`}
      />
    </div>
  )
}

function EmailContentSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
          <div className="flex space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
        <Skeleton className="h-6 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div>
            <Skeleton className="h-4 w-32 mb-1 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 space-y-4 bg-white dark:bg-gray-950">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export function EmailContent() {
  return (
    <Suspense fallback={<EmailContentSkeleton />}>
      <EmailContentInner />
    </Suspense>
  )
}
