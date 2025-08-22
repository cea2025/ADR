import { WifiOff } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

const OfflineIndicator: React.FC = () => {
  const { isOffline, getOfflineDuration } = useOffline();

  if (!isOffline) return null;

  const offlineDuration = getOfflineDuration();
  const minutes = offlineDuration ? Math.floor(offlineDuration / 60000) : 0;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-40 safe-area-top">
      <div className="flex items-center justify-center space-x-2 space-x-reverse">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          אין חיבור לאינטרנט
        </span>
        {minutes > 0 && (
          <span className="text-xs opacity-80">
            ({minutes} דקות)
          </span>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
