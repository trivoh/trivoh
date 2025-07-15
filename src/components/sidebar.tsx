"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox,
  Send,
  FileText,
  Edit3,
  Heart,
  Shield,
  ChevronDown,
  ChevronRight,
  Trash2,
  Archive,
  Tag,
  Plus,
  Search,
  Edit,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEmail } from "@/contexts/email-context"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 0 },
  { id: "desired", label: "Desired", icon: Heart, count: 0 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "drafts", label: "Drafts", icon: FileText, count: 0 },
  { id: "spam", label: "Spam", icon: Shield, count: 0 },
]

const moreItems = [
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
  { id: "tags", label: "Tags", icon: Tag },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { selectedFolder, setSelectedFolder, setShowComposeModal, labels } = useEmail()
  const [showMore, setShowMore] = useState(false)
  const [showLabelsSearch, setShowLabelsSearch] = useState(false)

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Custom Scrollbar Styles */}
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

      {/* Compose Button */}
      <div className="p-4 pb-2">
        {!collapsed ? (
          <Button
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg h-10 font-medium text-sm"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Compose
          </Button>
        ) : (
          <Button
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg h-10 font-medium"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Scrollable Navigation Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Navigation Menu */}
        <nav className="px-[15px] pb-2">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFolder(item.id)}
                className={`w-full justify-start h-9 px-3 text-sm font-normal ${
                  selectedFolder === item.id
                    ? "bg-teal-50 text-teal-600 hover:bg-teal-100  border-teal-600"
                    : "bg-transparent hover:bg-gray-50 text-gray-700"
                }`}
              >
                <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count > 0 && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-2">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Button>
            ))}

            {/* More Section */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMore(!showMore)}
                className="w-full justify-start h-9 px-3 text-sm font-normal bg-transparent hover:bg-gray-50 text-gray-700"
              >
                {showMore ? (
                  <ChevronDown className="w-4 h-4 mr-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-3 flex-shrink-0" />
                )}
                {!collapsed && <span className="flex-1 text-left">More</span>}
              </Button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 space-y-0.5"
                  >
                    {moreItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFolder(item.id)}
                        className={`w-full justify-start h-9 px-3 text-sm font-normal ${
                          selectedFolder === item.id
                            ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                            : "bg-transparent hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                      </Button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          {!collapsed && <div className="border-b border-gray-200 my-4 mx-1"></div>}

          {/* Labels Section */}
          {!collapsed && (
            <div className="mt-4">
              <div className="flex items-center justify-between px-3 mb-3">
                <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wider">LABELS</h3>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100 rounded"
                    onClick={() => setShowLabelsSearch(!showLabelsSearch)}
                  >
                    <Search className="w-3 h-3 text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100 rounded">
                    <Edit className="w-3 h-3 text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100 rounded">
                    <Plus className="w-3 h-3 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Labels Search */}
              <AnimatePresence>
                {showLabelsSearch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 mb-3"
                  >
                    <Input placeholder="Search labels..." className="h-8 text-sm border-gray-200" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Labels List */}
              <div className="space-y-2">
                {labels.map((label) => (
                  <Button
                    key={label.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 px-3 text-sm font-normal bg-transparent hover:bg-gray-50 text-gray-600"
                  >
                    <div className={`w-2 h-2 rounded-full ${label.color} mr-3 flex-shrink-0`} />
                    <span className="flex-1 text-left">{label.name}</span>
                    {/* Optional count badge */}
                    <span className="text-xs text-gray-400">•</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-3 text-sm font-normal text-gray-400 bg-transparent hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left">Add New</span>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}