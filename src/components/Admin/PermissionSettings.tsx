import React, { useState } from 'react';
import { 
  Shield, Save, RefreshCw, Users, 
  CheckCircle, XCircle, Edit 
} from 'lucide-react';
import { PERMISSIONS, UserType } from '../../types/user.types';

interface PermissionMatrix {
  [component: string]: {
    [userType in UserType]: boolean;
  };
}

const PermissionSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionMatrix>(() => {
    const matrix: PermissionMatrix = {};
    PERMISSIONS.forEach(permission => {
      matrix[permission.component] = {
        website: permission.website,
        representative: permission.representative,
        manager: permission.manager
      };
    });
    return matrix;
  });

  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const componentLabels: Record<string, string> = {
    'actualLE': 'LE אמיתי',
    'actualReturns': 'תשואות אמיתיות',
    'policyManagement': 'ניהול פוליסות',
    'allCalculations': 'כל החישובים',
    'exchangeRateEdit': 'עריכת שער חליפין',
    'pdfExport': 'ייצוא PDF',
    'savedCalculations': 'חישובים שמורים',
    'basicCalculator': 'מחשבון בסיסי',
    'highestLE': 'LE הגבוה ביותר',
    'upTo110Age': 'עד גיל 110'
  };

  const userTypeLabels: Record<UserType, string> = {
    'website': 'אתר',
    'representative': 'נציג',
    'manager': 'מנהל'
  };

  const handlePermissionChange = (component: string, userType: UserType, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [component]: {
        ...prev[component],
        [userType]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('adr-permissions', JSON.stringify(permissions));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את כל ההרשאות לברירת המחדל?')) {
      const defaultMatrix: PermissionMatrix = {};
      PERMISSIONS.forEach(permission => {
        defaultMatrix[permission.component] = {
          website: permission.website,
          representative: permission.representative,
          manager: permission.manager
        };
      });
      setPermissions(defaultMatrix);
    }
  };

  const getPermissionCount = (userType: UserType) => {
    return Object.values(permissions).filter(perm => perm[userType]).length;
  };

  const getTotalPermissions = () => {
    return Object.keys(permissions).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">הגדרות הרשאות</h2>
          <p className="text-gray-600">ניהול הרשאות לפי סוג משתמש</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
              editMode 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>{editMode ? 'סיים עריכה' : 'ערוך'}</span>
          </button>
          
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">סה"כ הרשאות</p>
              <p className="text-2xl font-bold text-blue-800">{getTotalPermissions()}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">הרשאות מנהל</p>
              <p className="text-2xl font-bold text-green-800">{getPermissionCount('manager')}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">הרשאות נציג</p>
              <p className="text-2xl font-bold text-yellow-800">{getPermissionCount('representative')}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">הרשאות אתר</p>
              <p className="text-2xl font-bold text-purple-800">{getPermissionCount('website')}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">מטריצת הרשאות</h3>
          <p className="text-sm text-gray-600 mt-1">
            {editMode ? 'לחץ על התיבות כדי לשנות הרשאות' : 'צפייה בלבד - לחץ "ערוך" לשינוי'}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  רכיב
                </th>
                {(['website', 'representative', 'manager'] as UserType[]).map(userType => (
                  <th key={userType} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userTypeLabels[userType]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(permissions).map(([component, perms]) => (
                <tr key={component} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {componentLabels[component] || component}
                    </div>
                    <div className="text-xs text-gray-500">{component}</div>
                  </td>
                  {(['website', 'representative', 'manager'] as UserType[]).map(userType => (
                    <td key={userType} className="px-6 py-4 whitespace-nowrap text-center">
                      {editMode ? (
                        <button
                          onClick={() => handlePermissionChange(component, userType, !perms[userType])}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                            perms[userType] 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {perms[userType] ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      ) : (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          perms[userType] 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {perms[userType] ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">תבניות הרשאות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              const restrictedMatrix = { ...permissions };
              Object.keys(restrictedMatrix).forEach(component => {
                restrictedMatrix[component] = {
                  website: ['basicCalculator', 'highestLE', 'upTo110Age', 'pdfExport'].includes(component),
                  representative: !['actualLE', 'actualReturns', 'policyManagement'].includes(component),
                  manager: true
                };
              });
              setPermissions(restrictedMatrix);
            }}
            className="p-4 border border-gray-300 rounded-lg hover:border-adr-brown transition-colors text-right"
          >
            <h4 className="font-medium text-gray-900 mb-2">מגבלות קפדניות</h4>
            <p className="text-sm text-gray-600">הרשאות מינימליות לכל סוג</p>
          </button>

          <button 
            onClick={() => {
              const balancedMatrix = { ...permissions };
              Object.keys(balancedMatrix).forEach(component => {
                balancedMatrix[component] = {
                  website: !['actualLE', 'actualReturns', 'policyManagement', 'allCalculations', 'exchangeRateEdit'].includes(component),
                  representative: !['actualLE', 'actualReturns', 'policyManagement'].includes(component),
                  manager: true
                };
              });
              setPermissions(balancedMatrix);
            }}
            className="p-4 border border-gray-300 rounded-lg hover:border-adr-brown transition-colors text-right"
          >
            <h4 className="font-medium text-gray-900 mb-2">איזון מומלץ</h4>
            <p className="text-sm text-gray-600">הרשאות מאוזנות לכל סוג</p>
          </button>

          <button 
            onClick={() => {
              const openMatrix = { ...permissions };
              Object.keys(openMatrix).forEach(component => {
                openMatrix[component] = {
                  website: !['policyManagement'].includes(component),
                  representative: true,
                  manager: true
                };
              });
              setPermissions(openMatrix);
            }}
            className="p-4 border border-gray-300 rounded-lg hover:border-adr-brown transition-colors text-right"
          >
            <h4 className="font-medium text-gray-900 mb-2">פתוח יחסית</h4>
            <p className="text-sm text-gray-600">הרשאות רחבות לכולם</p>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">הסבר על הרשאות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">משתמש אתר</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• גישה למחשבון בסיסי</li>
              <li>• ייצוא PDF</li>
              <li>• צפייה בתוצאות</li>
              <li>• שמירת חישובים</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2">נציג מכירות</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• כל הרשאות האתר +</li>
              <li>• עריכת שער חליפין</li>
              <li>• גישה לכל החישובים</li>
              <li>• כלים מתקדמים</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-2">מנהל</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• כל הרשאות הנציג +</li>
              <li>• ניהול פוליסות</li>
              <li>• נתונים אמיתיים</li>
              <li>• פאנל ניהול מלא</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionSettings;
