"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Email {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  labels: string[]
  avatar?: string
  folder: string
}

export interface Label {
  id: string
  name: string
  color: string
  count: number
}

interface EmailContextType {
  emails: Email[]
  selectedEmail: Email | null
  selectedFolder: string
  showComposeModal: boolean
  labels: Label[]
  setSelectedEmail: (email: Email | null) => void
  setSelectedFolder: (folder: string) => void
  setShowComposeModal: (show: boolean) => void
  markAsRead: (emailId: string) => void
  toggleStar: (emailId: string) => void
  getEmailsByFolder: (folder: string) => Email[]
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "AI Mail sender",
    senderEmail: "ai@mailsender.com",
    subject: "Networking and other information from March forth in Business Monthly",
    preview: "Hey! How are you doing? How are you doing? A cluster come by default a general for discussion...",
    content: `Hey! How are you doing? How are you doing? A cluster come by default a general for discussion, you can add more rooms if needed...`,
    timestamp: "11:30am",
    isRead: false,
    isStarred: false,
    labels: [],
    folder: "inbox",
  },
  {
    id: "2",
    sender: "Sender",
    senderEmail: "sender@example.com",
    subject: "Invitation to London Tech...",
    preview: "Hey! I am inviting to to the plan technology partner for that trivia meeting...",
    content: `Hey! I am inviting to to the plan technology partner for that trivia meeting and the events at the london teach with and exclusive...`,
    timestamp: "9:30am",
    isRead: true,
    isStarred: false,
    labels: [],
    folder: "inbox",
  },
  {
    id: "3",
    sender: "John Doe",
    senderEmail: "john@example.com",
    subject: "Meeting Request",
    preview: "Would you like to schedule a meeting for next week?",
    content: "Hi there, I hope this email finds you well. I wanted to reach out to schedule a meeting...",
    timestamp: "Yesterday",
    isRead: false,
    isStarred: true,
    labels: [],
    folder: "desired",
  },
  {
    id: "4",
    sender: "Sarah Wilson",
    senderEmail: "sarah@company.com",
    subject: "Project Update",
    preview: "The latest updates on our current project status...",
    content: "Hi team, here are the latest updates on our project...",
    timestamp: "2 days ago",
    isRead: true,
    isStarred: false,
    labels: [],
    folder: "sent",
  },
  {
    id: "5",
    sender: "Draft Email",
    senderEmail: "draft@local.com",
    subject: "Unsent Message",
    preview: "This is a draft email that hasn't been sent yet...",
    content: "This is the content of a draft email...",
    timestamp: "3 days ago",
    isRead: false,
    isStarred: false,
    labels: [],
    folder: "drafts",
  },
  {
    id: "6",
    sender: "Spam Sender",
    senderEmail: "spam@spam.com",
    subject: "You've won a million dollars!",
    preview: "Congratulations! You've won our lottery...",
    content: "This is obviously spam content...",
    timestamp: "1 week ago",
    isRead: false,
    isStarred: false,
    labels: [],
    folder: "spam",
  },
]

const mockLabels: Label[] = [
  { id: "1", name: "Clients", color: "bg-red-400", count: 0 },
  { id: "2", name: "Personals", color: "bg-blue-400", count: 0 },
  { id: "3", name: "Tech Team", color: "bg-yellow-400", count: 0 },
]

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails] = useState<Email[]>(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [labels] = useState<Label[]>(mockLabels)

  const getEmailsByFolder = (folder: string): Email[] => {
    return emails.filter((email) => email.folder === folder)
  }

  const markAsRead = (emailId: string) => {
    // Implementation for marking email as read
  }

  const toggleStar = (emailId: string) => {
    // Implementation for toggling star
  }

  return (
    <EmailContext.Provider
      value={{
        emails,
        selectedEmail,
        selectedFolder,
        showComposeModal,
        labels,
        setSelectedEmail,
        setSelectedFolder,
        setShowComposeModal,
        markAsRead,
        toggleStar,
        getEmailsByFolder,
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
