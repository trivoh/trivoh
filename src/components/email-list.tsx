"use client"

import type React from "react"

import { Suspense, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, Grid3X3, ChevronDown, Trash2, Star, X } from "lucide-react"
import { useEmail, type Email } from "@/contexts/email-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface EmailListContentProps {
  folderEmails: Email[]
  selectedEmail: Email | null
  setSelectedEmail: (email: Email | null) => void
  selectedFolder: string
  markAsRead: (emailId: string) => void
  toggleStar: (emailId: string) => void
  deleteEmail: (emailId: string) => void
}

function EmailListContent({
  folderEmails,
  selectedEmail,
  setSelectedEmail,
  selectedFolder,
  markAsRead,
  toggleStar,
  deleteEmail,
}: EmailListContentProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState<string | null>(null) // State to control which email's dropdown is open
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const folderTitle = selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)

  // Ref for the filter dropdown
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Refs for each email item's dropdown
  const emailDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Effect to close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFilterDropdown])

  // Effect to close email dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.values(emailDropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowDeleteDropdown(null)
        }
      })
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDeleteDropdown])

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    if (!email.isRead) {
      markAsRead(email.id)
    }
    setShowDeleteDropdown(null) // Close any open dropdown when selecting a new email
  }

  const handleDeleteEmail = (emailId: string, emailSubject: string) => {
    deleteEmail(emailId)
    setShowDeleteModal(null)
    setShowDeleteDropdown(null) // Close dropdown after delete
    showNotification(`Email "${emailSubject}" deleted successfully!`, "success")
  }

  const handleToggleStar = (emailId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleStar(emailId)
    setShowDeleteDropdown(null) // Close dropdown after star/unstar
  }

  const handleMoreClick = (emailId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowDeleteDropdown(showDeleteDropdown === emailId ? null : emailId)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        .thin-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
        .dark .thin-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
      `}</style>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
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

      {/* Header Section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900     dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{folderTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {folderEmails.length} {folderEmails.length === 1 ? "email" : "emails"}
        </p>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 space-y-3">
        {/* AI Mail sender Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-white text-xs">🤖</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Mail sender</span>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-2 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="relative" ref={filterDropdownRef}>
              {" "}
              {/* Attach ref here */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                <span className="text-sm font-medium">Sort: Received Date</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Received Date
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Sender
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Subject
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Size
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto thin-scrollbar pt-4">
        {folderEmails.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No emails in {folderTitle.toLowerCase()}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {selectedFolder === "drafts" && "Your draft emails will appear here"}
                {selectedFolder === "sent" && "Your sent emails will appear here"}
                {selectedFolder === "inbox" && "New emails will appear here"}
                {selectedFolder === "spam" && "Spam emails will appear here"}
                {selectedFolder === "desired" && "Your desired emails will appear here"}
              </p>
            </div>
          </div>
        ) : (
          folderEmails.map((email, index) => {
            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleEmailClick(email)}
                className={`cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-3 mx-4 p-4 group relative ${
                  selectedEmail?.id === email.id
                    ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">{email.sender.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            !email.isRead ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {email.sender}
                        </span>
                        {!email.isRead && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Star Button - Always Visible */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto transition-opacity"
                          onClick={(e) => handleToggleStar(email.id, e)}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              email.isStarred ? "text-yellow-500 fill-yellow-500" : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                        </Button>
                        {/* More Options - Always Visible */}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto transition-opacity"
                            onClick={(e) => handleMoreClick(email.id, e)}
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </Button>
                          {/* Custom Dropdown */}
                          <AnimatePresence>
                            {showDeleteDropdown === email.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleStar(email.id, e)
                                    setShowDeleteDropdown(null) // Close dropdown after click
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                  <Star className="w-4 h-4" />
                                  <span>{email.isStarred ? "Unstar" : "Star"}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowDeleteModal(email.id)
                                    setShowDeleteDropdown(null) // Close dropdown after click
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{email.timestamp}</span>
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-1 ${
                        !email.isRead
                          ? "font-bold text-gray-900 dark:text-gray-100"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {email.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{email.preview}</p>
                    {email.labels.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2">
                        {email.labels.map((label) => (
                          <span
                            key={label}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Email</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(null)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this email? This action cannot be undone.
                </p>
                {showDeleteModal && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {folderEmails.find((email) => email.id === showDeleteModal)?.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      From: {folderEmails.find((email) => email.id === showDeleteModal)?.sender}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(null)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const email = folderEmails.find((e) => e.id === showDeleteModal)
                    if (email) {
                      handleDeleteEmail(email.id, email.subject)
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function EmailList() {
  const { selectedEmail, setSelectedEmail, selectedFolder, getFilteredEmails, markAsRead, toggleStar, deleteEmail } =
    useEmail()
  const folderEmails = getFilteredEmails(selectedFolder)

  return (
    <Suspense fallback={<EmailListSkeleton />}>
      <EmailListContent
        folderEmails={folderEmails}
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        selectedFolder={selectedFolder}
        markAsRead={markAsRead}
        toggleStar={toggleStar}
        deleteEmail={deleteEmail}
      />
    </Suspense>
  )
}

function EmailListSkeleton() {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex-1 p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
