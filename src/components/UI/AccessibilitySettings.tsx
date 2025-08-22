import { useState } from 'react';
import { Settings, Eye, Type, Zap, X } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilitySettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isHighContrast,
    isLargeText,
    isReducedMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion
  } = useAccessibility();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-adr-brown rounded-full shadow-lg flex items-center justify-center text-white hover:bg-adr-light-brown transition-colors"
        aria-label="הגדרות נגישות"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-adr-brown">הגדרות נגישות</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="סגור"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings */}
            <div className="p-4 space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Eye className="w-5 h-5 text-adr-brown" />
                  <div>
                    <h4 className="font-medium text-gray-900">ניגודיות גבוהה</h4>
                    <p className="text-sm text-gray-500">שיפור הניגודיות לצבעים</p>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isHighContrast ? 'bg-adr-brown' : 'bg-gray-200'
                  }`}
                  aria-label={`${isHighContrast ? 'כבוי' : 'פועל'} ניגודיות גבוהה`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Type className="w-5 h-5 text-adr-brown" />
                  <div>
                    <h4 className="font-medium text-gray-900">טקסט גדול</h4>
                    <p className="text-sm text-gray-500">הגדלת גודל הטקסט</p>
                  </div>
                </div>
                <button
                  onClick={toggleLargeText}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isLargeText ? 'bg-adr-brown' : 'bg-gray-200'
                  }`}
                  aria-label={`${isLargeText ? 'כבוי' : 'פועל'} טקסט גדול`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLargeText ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Zap className="w-5 h-5 text-adr-brown" />
                  <div>
                    <h4 className="font-medium text-gray-900">הפחתת תנועה</h4>
                    <p className="text-sm text-gray-500">הפחתת אנימציות</p>
                  </div>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isReducedMotion ? 'bg-adr-brown' : 'bg-gray-200'
                  }`}
                  aria-label={`${isReducedMotion ? 'כבוי' : 'פועל'} הפחתת תנועה`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isReducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                הגדרות אלו נשמרות בדפדפן שלך
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilitySettings;
