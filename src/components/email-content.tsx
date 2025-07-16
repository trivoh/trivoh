"use client"
import type React from "react"
import { motion } from "framer-motion"
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
  ChevronDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmail } from "@/contexts/email-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense, useState } from "react"
import { Input } from "@/components/ui/input"
import { DeleteModal } from "@/components/DeleteModal"
import { Toaster } from "react-hot-toast"

interface ReplyState {
  content: string
  isRecording: boolean
}

function EmailContentInner() {
  const { selectedEmail, setSelectedEmail } = useEmail()
  const [replyState, setReplyState] = useState<ReplyState>({
    content: "",
    isRecording: false,
  })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  if (!selectedEmail) return null

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyState((prev) => ({ ...prev, content: e.target.value }))
  }

  const handleSendReply = () => {
    if (replyState.content.trim()) {
      console.log("Sending reply:", replyState.content)
      setReplyState({ content: "", isRecording: false })
    }
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

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <Toaster />
      
      {/* Header Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
          {/* Left section: Navigation and Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmail(null)}
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Right section: Message count & controls */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>7 of 32,105</span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              <LayoutPanelTop className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{selectedEmail.subject}</h1>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {selectedEmail.sender.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedEmail.sender}</p>
              <p className="text-sm text-gray-500">
                to me • {selectedEmail.timestamp}
                <ChevronDown className="inline-block w-3 h-3 ml-1" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Email Content with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
        `}</style>
        
        {/* Email Message Card */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
            {/* Message Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{selectedEmail.sender.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{selectedEmail.sender}</p>
                  <p className="text-xs text-gray-500">{selectedEmail.timestamp}</p>
                </div>
              </div>
              
              {/* Message Actions */}
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Reply className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-sm">
                {selectedEmail.content}
              </div>
            </div>

            {/* Message Footer Actions */}
            <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-200">
              {/* Reaction count */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">👍 4</span>
              </div>
              
              {/* Emoji reaction button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {/* Reply button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
              
              {/* Forward button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
              >
                <Forward className="w-3 h-3 mr-1" />
                Forward
              </Button>
            </div>
          </div>

          {/* Replied Messages Section */}
          <div className="space-y-3">
            {/* Example replied message */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 ml-8">
              <div className="flex justify-between items-center ">
                 <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">J</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">John Doe</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
                  <div className="flex bg-white px-3 rounded items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Reply className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              </div>
             
              <div className="text-sm text-gray-900 mb-3">
                Thanks for the update! This looks great.
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                {/* React button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
                >
                  <Smile className="w-3 h-3 mr-1" />
                  React
                </Button>
                {/* Reply button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>

            {/* Another replied message */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 ml-8">
             <div className="flex justify-between items-center">
               <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">S</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Sarah Wilson</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
               <div className="flex bg-white px-3 rounded items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Reply className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
             </div>
             
              <div className="text-sm text-gray-900 mb-3">
                I agree with John. Let's proceed with this approach.
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
                >
                  <Smile className="w-3 h-3 mr-1" />
                  React
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full px-3 py-1 flex items-center"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp-style Sticky Reply Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full flex-shrink-0"
          >
            <Smile className="w-5 h-5 text-gray-500" />
          </Button>

          {/* Input Field with Icons Inside */}
          <div className="flex-1 relative">
            <Input
              type="text"
              value={replyState.content}
              onChange={handleReplyChange}
              onKeyPress={handleKeyPress}
              placeholder="Reply"
              className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
            />
            
            {/* Icons inside input - right side */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
              >
                <Paperclip className="w-4 h-4 text-gray-500 transform rotate-45" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
              >
                <Camera className="w-4 h-4 text-gray-500" />
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
                  ? "bg-red-100 text-red-600"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Recording Indicator */}
        {replyState.isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 text-sm text-red-600 mt-2"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>Recording...</span>
          </motion.div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />
    </div>
  )
}

function EmailContentSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-16" />
          <div className="flex space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
        <Skeleton className="h-6 w-3/4 mb-4" />
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 space-y-4 bg-white">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
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