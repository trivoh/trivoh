"use client"

import { useState, type MouseEvent } from "react"
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
  Save,
  Edit3Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmailCompose from "@/components/compose-modal"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface Label {
  id: string
  name: string
  color: string
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

const colorOptions = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  // Local state management for sidebar
  const [selectedFolder, setSelectedFolder] = useState<string>("inbox")
  const [showComposeModal, setShowComposeModal] = useState<boolean>(false)
  const [labels, setLabels] = useState<Label[]>([
    { id: "1", name: "Work", color: "bg-blue-500" },
    { id: "2", name: "Personal", color: "bg-green-500" },
    { id: "3", name: "Important", color: "bg-red-500" },
  ])

  // UI state
  const [showMore, setShowMore] = useState(false)
  const [showAddLabelModal, setShowAddLabelModal] = useState(false)
  const [showEditLabelsModal, setShowEditLabelsModal] = useState(false)
  const [showInlineSearch, setShowInlineSearch] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [labelSearchTerm, setLabelSearchTerm] = useState("")
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Edit modal state
  const [editingLabels, setEditingLabels] = useState<Label[]>([])
  const [editModalSearchTerm, setEditModalSearchTerm] = useState("")

  // Label management functions
  const addLabel = (name: string, color: string) => {
    const newLabel: Label = {
      id: Date.now().toString(),
      name,
      color,
    }
    setLabels((prev) => [...prev, newLabel])
  }

  const deleteLabel = (id: string) => {
    setLabels((prev) => prev.filter((label) => label.id !== id))
    // If the deleted label was selected, switch to inbox
    if (selectedFolder === id) {
      setSelectedFolder("inbox")
    }
  }

  const updateLabel = (id: string, name: string, color: string) => {
    setLabels((prev) => prev.map((label) => (label.id === id ? { ...label, name, color } : label)))
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddLabel = () => {
    if (newLabelName.trim() === "") {
      showNotification("Label name cannot be empty!", "error")
      return
    }

    const existingLabel = labels.find((label) => label.name.toLowerCase() === newLabelName.toLowerCase())

    if (existingLabel) {
      showNotification("Label with this name already exists!", "error")
      return
    }

    addLabel(newLabelName.trim(), selectedColor)
    showNotification(`Label "${newLabelName}" added successfully!`, "success")
    setNewLabelName("")
    setSelectedColor(colorOptions[0])
    setShowAddLabelModal(false)
  }

  const handleDeleteLabel = (id: string, name: string) => {
    deleteLabel(id)
    showNotification(`Label "${name}" deleted successfully!`, "success")
  }

  const handleSearchToggle = () => {
    setShowInlineSearch(!showInlineSearch)
    if (showInlineSearch) {
      setLabelSearchTerm("")
    }
  }

  const handleEditLabelsOpen = () => {
    setEditingLabels([...labels]) // Create a copy for editing
    setEditModalSearchTerm("") // Reset search term
    setShowEditLabelsModal(true)
  }

  const handleSaveEditedLabels = () => {
    // Validate all labels
    for (const label of editingLabels) {
      if (label.name.trim() === "") {
        showNotification("Label names cannot be empty!", "error")
        return
      }
    }

    // Check for duplicates
    const names = editingLabels.map((label) => label.name.toLowerCase())
    const uniqueNames = new Set(names)
    if (names.length !== uniqueNames.size) {
      showNotification("Duplicate label names are not allowed!", "error")
      return
    }

    setLabels(editingLabels)
    setShowEditLabelsModal(false)
    showNotification("Labels updated successfully!", "success")
  }

  const handleEditLabelChange = (id: string, field: "name" | "color", value: string) => {
    setEditingLabels((prev) => prev.map((label) => (label.id === id ? { ...label, [field]: value } : label)))
  }

  const handleDeleteEditingLabel = (id: string) => {
    setEditingLabels((prev) => prev.filter((label) => label.id !== id))
  }

  const filteredLabels = labels.filter(
    (label) => labelSearchTerm === "" || label.name.toLowerCase().includes(labelSearchTerm.toLowerCase()),
  )

  const filteredEditingLabels = editingLabels.filter(
    (label) => editModalSearchTerm === "" || label.name.toLowerCase().includes(editModalSearchTerm.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-colors duration-300">
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
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
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

      {/* Compose Button */}
      <div className="p-4 pb-2">
        {!collapsed ? (
          <Button
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-[#FF909E] hover:bg-pink-600 text-white rounded-lg h-10 font-bold text-xl"
          >
            <Edit className="w-5 h-5 mr-4" />
            Compose
          </Button>
        ) : (
          <Button
            onClick={() => setShowComposeModal(true)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg h-10 font-medium"
          >
            <Edit className="w-4 h-4" />
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
onClick={() => {
  setSelectedFolder(item.id)
  if (window.innerWidth < 768) onToggle()  
}}
                className={`w-full justify-start h-9 px-3 text-sm font-bold ${
                  selectedFolder === item.id
                    ? "bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-800"
                    : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count > 0 && (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full ml-2">
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
                className="w-full justify-start h-9 px-3 text-sm font-normal bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                            ? "bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-800"
                            : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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
          {!collapsed && <div className="border-b border-gray-200 dark:border-gray-700 my-4 mx-1"></div>}

          {/* Labels Section */}
          {!collapsed && (
            <div className="mt-4">
              <div className="flex items-center justify-between px-3 mb-3">
                <h3 className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  LABELS
                </h3>
                <div className="flex items-center space-x-1">
                  {/* Add New Label Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    onClick={() => setShowAddLabelModal(true)}
                  >
                    <Plus className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </Button>
                  {/* Edit Labels Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    onClick={handleEditLabelsOpen}
                  >
                    <Edit className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </Button>
                  {/* Search Label Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${
                      showInlineSearch ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                    onClick={handleSearchToggle}
                  >
                    <Search className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  </Button>
                </div>
              </div>

              {/* Inline Search Bar */}
              <AnimatePresence>
                {showInlineSearch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-3 mb-3"
                  >
                    <Input
                      placeholder="Search labels..."
                      value={labelSearchTerm}
                      onChange={(e) => setLabelSearchTerm(e.target.value)}
                      className="h-8 text-sm border-gray-300 dark:border-gray-700 bg-transparent focus:border-teal-500 dark:focus:border-teal-400"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Labels List */}
              <div className="space-y-2">
                {filteredLabels.map((label) => (
                  <Button
                    key={label.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFolder(label.id)}
                    className={`w-full justify-start h-8 px-3 font-bold text-sm bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ${
                      selectedFolder === label.id
                        ? "bg-teal-50 dark:bg-teal-900 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-800"
                        : ""
                    }`}
                  >
                    <span className="flex-1 text-left">{label.name}</span>
                    <div className={`w-2 h-2 rounded-full ${label.color} mr-3 flex-shrink-0`} />
                  </Button>
                ))}

                {/* "Add New" button at the end of the list */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddLabelModal(true)}
                  className="w-full justify-start h-8 px-3 text-sm font-normal text-gray-400 dark:text-gray-500 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="flex-1 text-left">Add New</span>
                  <Plus className="w-3 h-3 mr-3 flex-shrink-0" />
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Add Label Modal */}
      <AnimatePresence>
        {showAddLabelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddLabelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-sm p-6 relative"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Label</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddLabelModal(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Label name"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 bg-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddLabel()
                      }
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose Color</p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full p-0 border-2 ${
                          selectedColor === color ? "border-blue-500 dark:border-blue-400" : "border-transparent"
                        } ${color}`}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddLabelModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddLabel} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    Add Label
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Labels Modal */}
      <AnimatePresence>
        {showEditLabelsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditLabelsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col p-6 relative"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Labels</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditLabelsModal(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Bar in Edit Modal */}
              <div className="mb-4">
                <Input
                  placeholder="Search labels to edit..."
                  value={editModalSearchTerm}
                  onChange={(e) => setEditModalSearchTerm(e.target.value)}
                  className="h-9 border-gray-300 dark:border-gray-700 bg-transparent focus:border-teal-500 dark:focus:border-teal-400"
                />
              </div>

              {/* Edit Labels List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {filteredEditingLabels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        value={label.name}
                        onChange={(e) => handleEditLabelChange(label.id, "name", e.target.value)}
                        className="h-8 text-sm border-gray-300 dark:border-gray-700 bg-transparent"
                        placeholder="Label name"
                      />
                      <div className="flex gap-1">
                        {colorOptions.map((color) => (
                          <Button
                            key={color}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLabelChange(label.id, "color", color)}
                            className={`w-6 h-6 rounded-full p-0 border-2 ${
                              label.color === color ? "border-blue-500 dark:border-blue-400" : "border-transparent"
                            } ${color}`}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEditingLabel(label.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {filteredEditingLabels.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No labels to edit.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => setShowEditLabelsModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveEditedLabels} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Compose Modal */}
      {showComposeModal && <EmailCompose onClose={() => setShowComposeModal(false)} />}
    </div>
  )
}
