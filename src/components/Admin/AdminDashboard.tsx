import React, { useState } from 'react';
import { 
  Users, Settings, Shield, Activity, 
  BarChart3, FileText, DollarSign, TrendingUp 
} from 'lucide-react';
import { useCalculator } from '../../hooks/useCalculator';
import { hasPermission } from '../../types/user.types';

interface AdminTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType;
}

const AdminDashboard: React.FC = () => {
  const { userType } = useCalculator();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!hasPermission(userType, 'policyManagement')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">אין הרשאה</h2>
          <p className="text-gray-600">רק מנהלים יכולים לגשת לדף זה</p>
        </div>
      </div>
    );
  }

  const tabs: AdminTab[] = [
    { id: 'dashboard', label: 'לוח בקרה', icon: BarChart3, component: DashboardOverview },
    { id: 'users', label: 'ניהול משתמשים', icon: Users, component: PlaceholderComponent },
    { id: 'permissions', label: 'הרשאות', icon: Shield, component: PlaceholderComponent },
    { id: 'policies', label: 'ניהול פוליסות', icon: FileText, component: PlaceholderComponent },
    { id: 'settings', label: 'הגדרות מערכת', icon: Settings, component: PlaceholderComponent },
    { id: 'activity', label: 'לוג פעילות', icon: Activity, component: PlaceholderComponent },
    { id: 'statistics', label: 'סטטיסטיקות', icon: TrendingUp, component: PlaceholderComponent }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-adr-brown">פאנל ניהול</h1>
            <p className="text-gray-600 mt-1">ניהול מערכת ADR Life Settlements</p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-adr-brown rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-adr-brown">מנהל מערכת</p>
              <p className="text-xs text-gray-500">גישה מלאה</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-adr-brown text-adr-brown bg-adr-cream'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">סה"כ משתמשים</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">חישובים היום</p>
              <p className="text-2xl font-bold">89</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">פוליסות פעילות</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <FileText className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">סה"כ השקעות</p>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">פעולות מהירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg border border-gray-200 hover:border-adr-brown transition-colors">
            <Users className="w-5 h-5 text-adr-brown" />
            <span className="font-medium">הוסף משתמש חדש</span>
          </button>
          
          <button className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg border border-gray-200 hover:border-adr-brown transition-colors">
            <FileText className="w-5 h-5 text-adr-brown" />
            <span className="font-medium">הוסף פוליסה</span>
          </button>
          
          <button className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg border border-gray-200 hover:border-adr-brown transition-colors">
            <Settings className="w-5 h-5 text-adr-brown" />
            <span className="font-medium">עדכן הגדרות</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">פעילות אחרונה</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">משתמש חדש נרשם</p>
              <p className="text-xs text-gray-500">לפני 5 דקות</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">חישוב חדש בוצע</p>
              <p className="text-xs text-gray-500">לפני 12 דקות</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">שער החליפין עודכן</p>
              <p className="text-xs text-gray-500">לפני 1 שעה</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">בבניה</h3>
        <p className="text-gray-500">תכונה זו תהיה זמינה בקרוב</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
