import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Edit3, Check, X, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useExchangeRate } from '../../hooks/useExchangeRate';

interface ExchangeRateDisplayProps {
  onRateChange?: (rate: number) => void;
  className?: string;
}

const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({ 
  onRateChange, 
  className = '' 
}) => {
  const { 
    exchangeRate, 
    isLoading, 
    isError, 
    refreshRate, 
    setManualRate, 
    formatRate, 
    formatLastUpdated 
  } = useExchangeRate();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (exchangeRate?.rate && onRateChange) {
      onRateChange(exchangeRate.rate);
    }
  }, [exchangeRate?.rate, onRateChange]);

  const handleEdit = () => {
    if (exchangeRate) {
      setEditValue(formatRate(exchangeRate.rate));
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue > 0) {
      setManualRate(numValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRate();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!exchangeRate) {
    return (
      <div className={`flex items-center space-x-2 space-x-reverse text-gray-500 ${className}`}>
        <DollarSign className="w-4 h-4" />
        <span className="text-sm">טוען שער חליפין...</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          <DollarSign className="w-5 h-5 text-adr-brown" />
          <span className="font-medium text-adr-brown">שער דולר-שקל</span>
        </div>
        
        <div className="flex items-center space-x-1 space-x-reverse">
          {/* Source indicator */}
          <div className="flex items-center space-x-1 space-x-reverse text-xs">
            {exchangeRate.source === 'api' ? (
              <>
                <Wifi className="w-3 h-3 text-green-500" />
                <span className="text-green-600">אוטומטי</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-blue-500" />
                <span className="text-blue-600">ידני</span>
              </>
            )}
          </div>

          {/* Error indicator */}
          {isError && (
            <div title="שגיאה בעדכון שער">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            </div>
          )}

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="p-1 text-gray-400 hover:text-adr-brown transition-colors disabled:opacity-50"
            title="רענן שער"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Edit button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-adr-brown transition-colors"
              title="עריכה ידנית"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          {isEditing ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-20 px-2 py-1 text-lg font-bold text-adr-brown border border-adr-brown rounded focus:ring-2 focus:ring-adr-brown focus:border-transparent"
                step="0.0001"
                min="0"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                title="שמור"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="בטל"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-2xl font-bold text-adr-brown">
              ₪{formatRate(exchangeRate.rate)}
            </div>
          )}
        </div>

        <div className="text-left">
          <div className="text-xs text-gray-500">
            עודכן: {formatLastUpdated(exchangeRate.lastUpdated)}
          </div>
          {exchangeRate.source === 'api' && (
            <div className="text-xs text-green-600">
              שער רשמי נוכחי
            </div>
          )}
          {exchangeRate.source === 'manual' && (
            <div className="text-xs text-blue-600">
              שער ידני
            </div>
          )}
        </div>
      </div>

      {isError && exchangeRate.source === 'manual' && (
        <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
          ⚠️ לא ניתן לעדכן שער אוטומטי, משתמש בשער ידני
        </div>
      )}
    </div>
  );
};

export default ExchangeRateDisplay;
