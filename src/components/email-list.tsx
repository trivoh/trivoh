"use client"

import { motion } from "framer-motion"
import { Star, MoreHorizontal, Grid3X3, ChevronDown } from "lucide-react"
import { useEmail } from "@/contexts/email-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"

function EmailListContent() {
  const { selectedEmail, setSelectedEmail, selectedFolder, getEmailsByFolder } = useEmail()
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const folderEmails = getEmailsByFolder(selectedFolder)
  const folderTitle = selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)

  return (
    <div className="h-full flex flex-col">
      {/* AI Mail sender Card */}
      <div className="p-4 bg-gray-100">
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-white text-xs">🤖</span>
            </div>
            <span className="text-sm font-medium text-gray-700">AI Mail sender</span>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center justify-center text-center">
              <Grid3X3 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 text-teal-600"
              >
                <span className="text-sm font-medium">Sort: Received Date</span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Received Date</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Sender</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Subject</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Size</button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {folderEmails.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No emails in {folderTitle.toLowerCase()}</p>
          </div>
        ) : (
          folderEmails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedEmail(email)}
              className={`cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedEmail?.id === email.id ? "bg-blue-50 border-blue-200" : ""
              } ${!email.isRead ? "bg-white font-medium" : "bg-gray-50"}`}
            >
              <div className="flex items-start space-x-3 p-4">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-medium">{email.sender.charAt(0)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${!email.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {email.sender}
                      </span>
                      {email.sender === "Sender" && <span className="w-2 h-2 bg-orange-400 rounded-full"></span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{email.timestamp}</span>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Star
                          className={`w-4 h-4 ${email.isStarred ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>

                  <p className={`text-sm mb-1 ${!email.isRead ? "font-medium text-gray-900" : "text-gray-700"}`}>
                    {email.subject}
                  </p>

                  <p className="text-sm text-gray-500 line-clamp-2">{email.preview}</p>

                  {email.labels.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      {email.labels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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

function EmailListSkeleton() {
  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-4 border-b border-gray-200">
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

export function EmailList() {
  return (
    <Suspense fallback={<EmailListSkeleton />}>
      <EmailListContent />
    </Suspense>
  )
}
