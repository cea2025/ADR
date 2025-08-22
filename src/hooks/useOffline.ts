import { useState, useEffect } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

export const useOffline = () => {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    lastOnline: navigator.onLine ? new Date() : null,
    lastOffline: !navigator.onLine ? new Date() : null
  });

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOnline: true,
        isOffline: false,
        lastOnline: new Date()
      }));
      
      // Sync offline data when coming back online
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SYNC_OFFLINE_DATA' });
      }
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOnline: false,
        isOffline: true,
        lastOffline: new Date()
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectivity = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to check connectivity
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const getOfflineDuration = (): number | null => {
    if (!state.lastOffline) return null;
    return Date.now() - state.lastOffline.getTime();
  };

  const getOnlineDuration = (): number | null => {
    if (!state.lastOnline) return null;
    return Date.now() - state.lastOnline.getTime();
  };

  return {
    ...state,
    checkConnectivity,
    getOfflineDuration,
    getOnlineDuration
  };
};
