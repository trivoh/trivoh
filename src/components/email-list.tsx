"use client"
import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Grid3X3, ChevronDown } from "lucide-react"
import { useEmail, type Email } from "@/contexts/email-context" // Import Email type from context
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

// Props for EmailListContent
interface EmailListContentProps {
  folderEmails: Email[]
  selectedEmail: Email | null
  setSelectedEmail: (email: Email | null) => void
  selectedFolder: string // Still needed for folderTitle display
}

function EmailListContent({ folderEmails, selectedEmail, setSelectedEmail, selectedFolder }: EmailListContentProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const folderTitle = selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-4">
      {/* "New" Section Title (Mobile Only) - Kept from original, though not explicitly in screenshot */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:hidden transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New</h2>
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
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                <span className="text-sm font-medium">Sort: Received Date</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                    Received Date
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                    Sender
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                    Subject
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                    Size
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Email List */}
      <div className="flex-1 overflow-y-auto pt-4">
        {folderEmails.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">No emails in {folderTitle.toLowerCase()}</p>
          </div>
        ) : (
          folderEmails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} // Adjusted delay for smoother appearance
              onClick={() => setSelectedEmail(email)}
              className={`cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-3 mx-4 p-4
                ${
                  selectedEmail?.id === email.id
                    ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700" // Removed left border
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar - Reverted to initial */}
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
                      {/* Unread dot indicator */}
                      {!email.isRead && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </Button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{email.timestamp}</span>
                    </div>
                  </div>
                  <p
                    className={`text-sm mb-1 ${
                      !email.isRead ? "font-bold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
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
          ))
        )}
      </div>
    </div>
  )
}

export function EmailList() {
  // Get selectedEmail, setSelectedEmail, selectedFolder, and getEmailsByFolder from context
  const { selectedEmail, setSelectedEmail, selectedFolder, getEmailsByFolder } = useEmail()
  const folderEmails = getEmailsByFolder(selectedFolder)

  return (
    <Suspense fallback={<EmailListSkeleton />}>
      <EmailListContent
        folderEmails={folderEmails}
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        selectedFolder={selectedFolder}
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
