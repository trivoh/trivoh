'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function TestDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Tailwind v4 Dark Mode Test</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">Current theme: {theme}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">Resolved theme: {resolvedTheme}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">HTML class: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</p>
      <div className="flex gap-2 mt-3">
        <button 
          onClick={() => setTheme('light')}
          className="px-3 py-1 bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 rounded text-sm hover:bg-yellow-300 dark:hover:bg-yellow-500"
        >
          Light
        </button>
        <button 
          onClick={() => setTheme('dark')}
          className="px-3 py-1 bg-gray-700 dark:bg-gray-600 text-white rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-500"
        >
          Dark
        </button>
        <button 
          onClick={() => setTheme('system')}
          className="px-3 py-1 bg-blue-200 dark:bg-blue-600 text-gray-900 dark:text-gray-100 rounded text-sm hover:bg-blue-300 dark:hover:bg-blue-500"
        >
          System
        </button>
      </div>
      <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
        <p className="text-gray-900 dark:text-gray-100 text-sm">This text should change color in dark mode</p>
        <div className="mt-2 w-full h-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded"></div>
      </div>
    </div>
  )
}
 