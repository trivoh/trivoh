"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, Mail, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const notifications = [
  {
    id: 1,
    type: "email",
    title: "New email from John Doe",
    message: "Project update regarding Q4 review",
    time: "2 min ago",
    icon: Mail,
    unread: true,
  },
  {
    id: 2,
    type: "calendar",
    title: "Meeting reminder",
    message: "Design review meeting in 30 minutes",
    time: "30 min ago",
    icon: Calendar,
    unread: true,
  },
  {
    id: 3,
    type: "user",
    title: "Profile updated",
    message: "Your profile information has been updated",
    time: "1 hour ago",
    icon: User,
    unread: false,
  },
]

export function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    notification.unread ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${notification.unread ? "bg-blue-100" : "bg-gray-100"}`}>
                      <notification.icon
                        className={`w-4 h-4 ${notification.unread ? "text-blue-600" : "text-gray-600"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notification.unread ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full bg-transparent">
                View All Notifications
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
