import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const addNotification = (message, type = 'info') => {
    toast(message, { type });
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
