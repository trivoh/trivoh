"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Email {
  id: string
  sender: string
  subject: string
  preview: string
  content: string
  timestamp: string
  isRead: boolean
  labels: string[]
  folder: string
  to?: string
  cc?: string
  bcc?: string
  isStarred?: boolean
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface EmailContextType {
  emails: Email[]
  selectedEmail: Email | null
  selectedFolder: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSelectedEmail: (email: Email | null) => void
  setSelectedFolder: (folder: string) => void
  markAsRead: (emailId: string) => void
  toggleStar: (emailId: string) => void
  deleteEmail: (emailId: string) => void
  addEmail: (email: Omit<Email, "id" | "timestamp">) => void
  getEmailsByFolder: (folder: string) => Email[]
  getFilteredEmails: (folder: string, search?: string) => Email[]
  getUnreadCount: (folder: string) => number
  showComposeModal: boolean // Add this line
  setShowComposeModal: (show: boolean) => void // Add this line
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

// Sample emails for demonstration
const sampleEmails: Email[] = [
  {
    id: "1",
    sender: "John Doe",
    subject: "Meeting Tomorrow",
    preview: "Hi, just wanted to confirm our meeting tomorrow at 2 PM. Please let me know if you need to reschedule.",
    content:
      "Hi,\n\nJust wanted to confirm our meeting tomorrow at 2 PM. Please let me know if you need to reschedule.\n\nBest regards,\nJohn",
    timestamp: "2 hours ago",
    isRead: false,
    labels: ["Work"],
    folder: "inbox",
    isStarred: false,
  },
  {
    id: "2",
    sender: "Sarah Wilson",
    subject: "Project Update",
    preview: "The latest project milestone has been completed. Here's a summary of what we've accomplished...",
    content: "The latest project milestone has been completed. Here's a summary of what we've accomplished this week.",
    timestamp: "5 hours ago",
    isRead: true,
    labels: ["Work", "Important"],
    folder: "inbox",
    isStarred: false,
  },
  {
    id: "3",
    sender: "Mike Johnson",
    subject: "Weekend Plans",
    preview: "Hey! Are you free this weekend? I was thinking we could go hiking or maybe catch a movie.",
    content: "Hey! Are you free this weekend? I was thinking we could go hiking or maybe catch a movie.",
    timestamp: "1 day ago",
    isRead: false,
    labels: ["Personal"],
    folder: "desired",
    isStarred: true,
  },
  {
    id: "4",
    sender: "Newsletter",
    subject: "Weekly Tech News",
    preview: "This week in technology: AI breakthroughs, new smartphone releases, and cybersecurity updates.",
    content: "This week in technology: AI breakthroughs, new smartphone releases, and cybersecurity updates.",
    timestamp: "2 days ago",
    isRead: true,
    labels: [],
    folder: "sent",
    isStarred: false,
  },
  {
    id: "5",
    sender: "You (Draft)",
    subject: "Unfinished Email",
    preview: "This is a draft email that I started writing but haven't finished yet...",
    content: "This is a draft email that I started writing but haven't finished yet. I need to complete this later.",
    timestamp: "3 days ago",
    isRead: true,
    labels: ["Draft"],
    folder: "drafts",
    isStarred: false,
  },
  {
    id: "6",
    sender: "Spam Sender",
    subject: "You've Won $1,000,000!",
    preview: "Congratulations! You've won our lottery. Click here to claim your prize...",
    content: "This is obviously spam content. Don't click any links!",
    timestamp: "1 week ago",
    isRead: false,
    labels: [],
    folder: "spam",
    isStarred: false,
  },
]

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(sampleEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [showComposeModal, setShowComposeModal] = useState(false) // Add this line

  const addEmail = (emailData: Omit<Email, "id" | "timestamp">) => {
    const newEmail: Email = {
      ...emailData,
      id: Date.now().toString(),
      timestamp: "Just now",
      isStarred: false,
    }
    setEmails((prev) => [newEmail, ...prev])
  }

  const deleteEmail = (emailId: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== emailId))
    // If the deleted email was selected, clear selection
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  const getEmailsByFolder = (folder: string): Email[] => {
    return emails.filter((email) => email.folder === folder)
  }

  const getFilteredEmails = (folder: string, search?: string): Email[] => {
    const folderEmails = getEmailsByFolder(folder)

    // Use the search parameter if provided, otherwise use the context searchQuery
    const searchTerm = search !== undefined ? search : searchQuery

    // Return all emails if no search query
    if (!searchTerm || !searchTerm.trim()) {
      return folderEmails
    }

    const lowerCaseQuery = searchTerm.toLowerCase().trim()
    return folderEmails.filter(
      (email) =>
        email.sender.toLowerCase().includes(lowerCaseQuery) ||
        email.subject.toLowerCase().includes(lowerCaseQuery) ||
        email.preview.toLowerCase().includes(lowerCaseQuery) ||
        email.content.toLowerCase().includes(lowerCaseQuery) ||
        email.labels.some((label) => label.toLowerCase().includes(lowerCaseQuery)),
    )
  }

  const getUnreadCount = (folder: string): number => {
    return emails.filter((email) => email.folder === folder && !email.isRead).length
  }

  const markAsRead = (emailId: string) => {
    setEmails((prev) => prev.map((email) => (email.id === emailId ? { ...email, isRead: true } : email)))
  }

  const toggleStar = (emailId: string) => {
    setEmails((prev) => prev.map((email) => (email.id === emailId ? { ...email, isStarred: !email.isStarred } : email)))
  }

  return (
    <EmailContext.Provider
      value={{
        emails,
        selectedEmail,
        selectedFolder,
        searchQuery,
        setSearchQuery,
        setSelectedEmail,
        setSelectedFolder,
        markAsRead,
        toggleStar,
        deleteEmail,
        addEmail,
        getEmailsByFolder,
        getFilteredEmails,
        getUnreadCount,
        showComposeModal, // Add this line
        setShowComposeModal, // Add this line
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export function useEmail() {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider")
  }
  return context
}
