import React, { createContext, useState, useContext, useCallback } from 'react'
import Notification from './Notification'
import { NOTIFICATION_DURATION } from '../../constants'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const showNotification = useCallback(
    (message, type = 'success', duration = NOTIFICATION_DURATION) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      setNotification({ message, type })
      const id = setTimeout(() => {
        setNotification(null)
      }, duration)
      setTimeoutId(id)
    },
    [timeoutId]
  )

  const hideNotification = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setNotification(null)
  }, [timeoutId])

  const contextValue = {
    showNotification,
    hideNotification
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
