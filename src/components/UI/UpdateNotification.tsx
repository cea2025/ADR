import { RefreshCw, X } from 'lucide-react';
import { useServiceWorker } from '../../hooks/useServiceWorker';

const UpdateNotification: React.FC = () => {
  const { isUpdated, skipWaiting } = useServiceWorker();

  if (!isUpdated) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-adr-brown text-white p-4 z-50 safe-area-top">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">
            עדכון חדש זמין
          </span>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={skipWaiting}
            className="bg-adr-gold text-adr-brown px-3 py-1 rounded text-sm font-medium hover:bg-adr-light-brown transition-colors"
          >
            עדכן עכשיו
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="text-adr-gold hover:text-white transition-colors"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
