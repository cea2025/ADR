import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isUpdated: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isUpdated: false,
    registration: null
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isInstalled: true,
          registration
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({
                  ...prev,
                  isUpdated: true
                }));
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        // Handle service worker errors
        navigator.serviceWorker.addEventListener('error', (error) => {
          console.error('Service Worker error:', error);
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.update();
        setState(prev => ({
          ...prev,
          isUpdated: false
        }));
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  };

  const skipWaiting = async () => {
    if (state.registration && state.registration.waiting) {
      try {
        state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        setState(prev => ({
          ...prev,
          isUpdated: false
        }));
      } catch (error) {
        console.error('Skip waiting failed:', error);
      }
    }
  };

  return {
    ...state,
    updateServiceWorker,
    skipWaiting
  };
};
