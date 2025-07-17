"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button" // Using shadcn/ui Button

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void // Added onConfirm prop
  title?: string
  message?: string
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm, // Destructure onConfirm
  title = "Delete Message",
  message = "Are you sure you want to delete this message? This action cannot be undone.",
}: DeleteModalProps) {
  const handleDelete = () => {
    onConfirm() // Call the onConfirm prop
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.3,
              }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </Button>
              {/* Modal Content */}
              <div className="p-8 text-center">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
                  className="mx-auto mb-6"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </motion.div>
                </motion.div>
                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
                >
                  {title}
                </motion.h3>
                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                >
                  {message}
                </motion.p>
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center space-x-4"
                >
                  {/* Cancel Button */}
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Cancel</span>
                  </Button>
                  {/* Delete Button */}
                  <Button
                    onClick={handleDelete}
                    className="px-6 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg shadow-red-600/25"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
