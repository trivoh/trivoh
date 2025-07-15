"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  X,
  Minimize2,
  Maximize2,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Paperclip,
  Send,
  Type,
  AlignLeft,
  List,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEmail } from "@/contexts/email-context"

export function ComposeModal() {
  const { setShowComposeModal } = useEmail()
  const [isMinimized, setIsMinimized] = useState(false)
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)

  const handleSend = () => {
    // Handle send logic here
    setShowComposeModal(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowComposeModal(false)
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`bg-white rounded-lg shadow-2xl w-full max-w-2xl ${
          isMinimized ? "h-16" : "h-[600px]"
        } flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">New Message</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComposeModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            {/* Recipients */}
            <div className="p-4 space-y-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-12">To</label>
                <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Recipients" className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCcBcc(!showCcBcc)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Cc Bcc
                </Button>
              </div>

              {showCcBcc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700 w-12">Cc</label>
                    <Input
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="Carbon copy"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700 w-12">Bcc</label>
                    <Input
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="Blind carbon copy"
                      className="flex-1"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-12">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <Button variant="ghost" size="sm">
                  <Type className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <Button variant="ghost" size="sm">
                  <Link className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Compose your message..."
                className="w-full h-full resize-none border-none focus:ring-0 text-base"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="outline" size="sm">
                    Save Draft
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
