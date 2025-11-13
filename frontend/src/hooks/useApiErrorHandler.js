import { useEffect } from 'react';
import eventEmitter from '../services/eventEmitter';
import { useNotification } from '../context/NotificationContext';

export const useApiErrorHandler = () => {
  const { addNotification } = useNotification();

  useEffect(() => {
    const handleError = (error) => {
      const message = error.response?.data?.error || error.message || 'An unexpected error occurred.';
      addNotification(message, 'error');
    };

    eventEmitter.subscribe('api-error', handleError);

    return () => {
      eventEmitter.unsubscribe('api-error', handleError);
    };
  }, [addNotification]);
};
