import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const { isRefreshing, pullDistance, pullProgress } = usePullToRefresh({ onRefresh });

  return (
    <div className="relative">
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="flex items-center justify-center py-4">
            <div 
              className="flex items-center space-x-2 space-x-reverse bg-adr-brown text-white px-4 py-2 rounded-full shadow-lg"
              style={{
                transform: `scale(${0.8 + pullProgress * 0.2})`,
                opacity: pullProgress
              }}
            >
              <RefreshCw 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              <span className="text-sm font-medium">
                {isRefreshing ? 'מעדכן...' : 'החלק למטה לרענון'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      {children}
    </div>
  );
};

export default PullToRefresh;
