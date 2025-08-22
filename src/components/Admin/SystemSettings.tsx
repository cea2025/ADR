import React, { useState } from 'react';
import { 
  Save, DollarSign, Calculator, 
  Globe, Bell, Shield, RefreshCw 
} from 'lucide-react';
import { useCalculator } from '../../hooks/useCalculator';

const SystemSettings: React.FC = () => {
  const { exchangeRate, setExchangeRate } = useCalculator();
  
  const [settings, setSettings] = useState({
    exchangeRate: exchangeRate,
    defaultOpeningCost: 5000,
    defaultManagementFee: 50,
    defaultMonthlyPremium: 200,
    maxUnitsPerPolicy: 10,
    maxPoliciesPerCalculation: 10,
    autoUpdateExchangeRate: false,
    enableNotifications: true,
    enableOfflineMode: true,
    dataRetentionDays: 365,
    sessionTimeoutMinutes: 120
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Update exchange rate in calculator
    setExchangeRate(settings.exchangeRate);
    
    // Save other settings to localStorage
    localStorage.setItem('adr-system-settings', JSON.stringify(settings));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?')) {
      const defaultSettings = {
        exchangeRate: 3.7,
        defaultOpeningCost: 5000,
        defaultManagementFee: 50,
        defaultMonthlyPremium: 200,
        maxUnitsPerPolicy: 10,
        maxPoliciesPerCalculation: 10,
        autoUpdateExchangeRate: false,
        enableNotifications: true,
        enableOfflineMode: true,
        dataRetentionDays: 365,
        sessionTimeoutMinutes: 120
      };
      setSettings(defaultSettings);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">הגדרות מערכת</h2>
          <p className="text-gray-600">ניהול הגדרות כלליות של המערכת</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>אפס</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-adr-brown text-white hover:bg-adr-light-brown'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'נשמר!' : 'שמור'}</span>
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Financial Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-adr-brown ml-2" />
            <h3 className="text-lg font-semibold text-adr-brown">הגדרות פיננסיות</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שער חליפין דולר-שקל
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.01"
                value={settings.exchangeRate}
                onChange={(e) => updateSetting('exchangeRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">עדכן את שער החליפין הנוכחי</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עלות פתיחת תיק ברירת מחדל (₪)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.defaultOpeningCost}
                onChange={(e) => updateSetting('defaultOpeningCost', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                דמי ניהול חודשיים ברירת מחדל ($)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={settings.defaultManagementFee}
                onChange={(e) => updateSetting('defaultManagementFee', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                פרמיה חודשית ברירת מחדל ($)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={settings.defaultMonthlyPremium}
                onChange={(e) => updateSetting('defaultMonthlyPremium', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Calculator Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Calculator className="w-5 h-5 text-adr-brown ml-2" />
            <h3 className="text-lg font-semibold text-adr-brown">הגדרות מחשבון</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מקסימום יחידות לפוליסה
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxUnitsPerPolicy}
                onChange={(e) => updateSetting('maxUnitsPerPolicy', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מקסימום פוליסות בחישוב
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxPoliciesPerCalculation}
                onChange={(e) => updateSetting('maxPoliciesPerCalculation', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">עדכון אוטומטי של שער החליפין</h4>
                <p className="text-xs text-gray-500">עדכון יומי מבנק ישראל</p>
              </div>
              <button
                onClick={() => updateSetting('autoUpdateExchangeRate', !settings.autoUpdateExchangeRate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoUpdateExchangeRate ? 'bg-adr-brown' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoUpdateExchangeRate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-adr-brown ml-2" />
            <h3 className="text-lg font-semibold text-adr-brown">הגדרות מערכת</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שמירת נתונים (ימים)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={settings.dataRetentionDays}
                onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">כמה זמן לשמור נתוני חישובים</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                זמן תפוגת סשן (דקות)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">הודעות מערכת</h4>
                <p className="text-xs text-gray-500">התראות על עדכונים ושינויים</p>
              </div>
              <button
                onClick={() => updateSetting('enableNotifications', !settings.enableNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableNotifications ? 'bg-adr-brown' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">מצב אופליין</h4>
                <p className="text-xs text-gray-500">שמירה מקומית לעבודה ללא אינטרנט</p>
              </div>
              <button
                onClick={() => updateSetting('enableOfflineMode', !settings.enableOfflineMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableOfflineMode ? 'bg-adr-brown' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableOfflineMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-adr-brown ml-2" />
            <h3 className="text-lg font-semibold text-adr-brown">הגדרות אבטחה</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-yellow-600 ml-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">הגדרות אבטחה מתקדמות</h4>
                  <p className="text-xs text-yellow-600">יהיו זמינות עם מערכת האימות של Google</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">אימות דו-שלבי</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">בקרוב</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">הגבלת IP</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">בקרוב</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">לוג ביטחון</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">בקרוב</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">סיכום הגדרות נוכחיות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">שער חליפין:</span>
            <span className="font-medium mr-2">{settings.exchangeRate} ₪/$</span>
          </div>
          <div>
            <span className="text-gray-600">עלות פתיחה:</span>
            <span className="font-medium mr-2">{settings.defaultOpeningCost.toLocaleString()} ₪</span>
          </div>
          <div>
            <span className="text-gray-600">דמי ניהול:</span>
            <span className="font-medium mr-2">${settings.defaultManagementFee}</span>
          </div>
          <div>
            <span className="text-gray-600">מקס יחידות:</span>
            <span className="font-medium mr-2">{settings.maxUnitsPerPolicy}</span>
          </div>
          <div>
            <span className="text-gray-600">מקס פוליסות:</span>
            <span className="font-medium mr-2">{settings.maxPoliciesPerCalculation}</span>
          </div>
          <div>
            <span className="text-gray-600">שמירת נתונים:</span>
            <span className="font-medium mr-2">{settings.dataRetentionDays} ימים</span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">עזרה והדרכה</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• <strong>שער חליפין:</strong> משפיע על כל החישובים במערכת</p>
          <p>• <strong>עלויות ברירת מחדל:</strong> ישמשו בפוליסות חדשות</p>
          <p>• <strong>מגבלות מחשבון:</strong> קובעות את גבולות השימוש</p>
          <p>• <strong>הגדרות מערכת:</strong> משפיעות על ביצועים ואבטחה</p>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
