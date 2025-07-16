"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Bell, Settings, LogOut, Menu, Sun, Moon, Monitor, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationSidebar } from "@/components/notification-sidebar"
import { useEmail } from "@/contexts/email-context"
import { useTheme } from "next-themes"
import Image from "next/image" // Import Next.js Image component

interface TopBarProps {
  onToggleMobileSidebar: () => void
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pk", name: "Pakistan", flag: "🇵🇰" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
]

export function TopBar({ onToggleMobileSidebar }: TopBarProps) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const { setShowComposeModal, searchQuery, setSearchQuery } = useEmail()
  const { theme, setTheme } = useTheme()

  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus mobile search input when it appears
  useEffect(() => {
    if (showMobileSearch) {
      mobileSearchInputRef.current?.focus()
    }
  }, [showMobileSearch])

  return (
    <>
      <div className="h-14 bg-white dark:bg-gray-900 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
        {/* Mobile Search Expanded State */}
        <AnimatePresence mode="wait">
          {showMobileSearch ? (
            <motion.div
              key="mobile-search-expanded"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 items-center space-x-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  ref={mobileSearchInputRef}
                  placeholder="Search emails..."
                  className="pl-10 bg-gray-50 border-gray-200 rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileSearch(false)}>
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </motion.div>
          ) : (
            // Default Top Bar State (Mobile & Desktop)
            <motion.div
              key="default-top-bar"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 items-center justify-between md:justify-start"
            >
              {/* Left Section - Hamburger Menu (Mobile Only) and Logo */}
              <div className="flex items-center space-x-4 md:w-80  md:border-gray-200 dark:md:border-gray-700 pr-4">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={onToggleMobileSidebar}>
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
                {/* Logo for both mobile and desktop */}
                <div className="flex text-center justify-center items-center space-x-2">
                  <Image
                    src="/logo.png"
                    alt="Mail App Logo"
                    width={39} // Corresponds to w-8
                    height={39} // Corresponds to h-8
                    className="rounded-lg" // Maintain rounded corners if desired
                  />
                  <h1 className="text-xl font-semibold text-teal-600 hidden md:block">Mail</h1>
                </div>
              </div>

              {/* Middle Section - New button and Desktop Search */}
              <div className="flex-1 flex items-center space-x-6 hidden md:flex ">
                <button   className="text-teal-600 font-medium text-lg">
                  New
                </button>
                <div className="flex-1 flex justify-center">
                  <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <Input
                      placeholder="Search here..."
                      className="pl-10 bg-gray-50 border-gray-200 rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section - Mobile Search Icon, Language, Notification, User */}
              <div className="flex items-center space-x-4 pl-4">
                {/* Mobile Search Icon */}
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowMobileSearch(true)}>
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>

                {/* Language Dropdown (Desktop Only) */}
                <div className="relative hidden md:block" ref={languageDropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
                  >
                    <span>{selectedLanguage.flag}</span>
                    <span>{selectedLanguage.name.split(" ")[0]} (US)</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <AnimatePresence>
                    {showLanguageDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
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
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-200"
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notification Bell (Always visible) */}
                <Button variant="ghost" size="sm" className="relative" onClick={() => setShowNotificationSidebar(true)}>
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></span>
                </Button>

                {/* User Profile with Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-2"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                    <div className="flex flex-col items-start hidden md:flex">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Mustiq</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Admin</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 hidden md:block" />
                  </Button>
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 }}
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </motion.button>
                        {/* Theme Toggle */}
                        <div className="flex justify-around p-2 border-t border-b border-gray-200 dark:border-gray-700 my-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTheme("light")
                              setShowUserDropdown(false)
                            }}
                            className={`rounded-full ${theme === "light" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                          >
                            <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTheme("dark")
                              setShowUserDropdown(false)
                            }}
                            className={`rounded-full ${theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                          >
                            <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTheme("system")
                              setShowUserDropdown(false)
                            }}
                            className={`rounded-full ${theme === "system" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                          >
                            <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </Button>
                        </div>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification Sidebar */}
      <NotificationSidebar isOpen={showNotificationSidebar} onClose={() => setShowNotificationSidebar(false)} />
    </>
  )
}
