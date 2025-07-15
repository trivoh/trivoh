"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationSidebar } from "@/components/notification-sidebar"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pk", name: "Pakistan", flag: "🇵🇰" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
]

export function TopBar() {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  return (
    <>
      <div className="h-14 bg-gray-100 flex items-center">
        {/* Left Section - Logo */}
        <div className="w-80 p-[20px] flex items-center space-x-4 bg-white  border-gray-200">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">✓</span>
          </div>
          <h1 className="text-xl font-semibold text-teal-600">Mail</h1>
        </div>

        {/* Middle Section - New button and Search */}
        <div className="flex-1 flex items-center pl-5 ">
          <button className="text-teal-600 font-medium text-lg">New</button>

          <div className="flex-1 flex justify-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search here..." className="pl-10 bg-white border-gray-200 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Section - Language, Notification, User */}
        <div className="flex items-center space-x-4 px-4">
          {/* Language Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 text-gray-600"
            >
              <span>🇺🇸</span>
              <span>Eng (US)</span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setSelectedLanguage(lang)
                        setShowLanguageDropdown(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <Button variant="ghost" size="sm" className="relative" onClick={() => setShowNotificationSidebar(true)}>
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></span>
          </Button>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-2"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">Mustiq</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>

            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Notification Sidebar */}
      <NotificationSidebar isOpen={showNotificationSidebar} onClose={() => setShowNotificationSidebar(false)} />
    </>
  )
}
