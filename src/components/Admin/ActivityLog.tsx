import React, { useState, useEffect } from 'react';
import { 
  Activity, Calendar, User, 
  FileText, Settings, Trash2, Edit, Plus 
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'calculation' | 'settings';
  entityType: 'policy' | 'user' | 'calculation' | 'system';
  entityId?: string;
  entityName?: string;
  details: string;
  ipAddress?: string;
}

const ActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    // Generate sample log data
    const sampleLogs: LogEntry[] = [
      {
        id: 'log-1',
        timestamp: new Date(),
        userId: 'user-1',
        userName: 'חיים אלעזר אלטר',
        action: 'update',
        entityType: 'policy',
        entityId: 'policy-1',
        entityName: 'פוליסת כוכב',
        details: 'עדכן עלות רכישה מ-$200,000 ל-$210,000',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        userId: 'user-2',
        userName: 'שרה כהן',
        action: 'calculation',
        entityType: 'calculation',
        details: 'ביצע חישוב תשואה עבור 3 פוליסות - סה"כ השקעה $450,000',
        ipAddress: '192.168.1.101'
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        userId: 'user-1',
        userName: 'חיים אלעזר אלטר',
        action: 'create',
        entityType: 'policy',
        entityId: 'policy-new',
        entityName: 'פוליסת דוד ורחל',
        details: 'יצר פוליסה חדשה - זוג בני 78/75, AIG, $1.2M',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        userId: 'user-3',
        userName: 'משה לוי',
        action: 'login',
        entityType: 'system',
        details: 'התחבר למערכת',
        ipAddress: '192.168.1.102'
      },
      {
        id: 'log-5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        userId: 'user-1',
        userName: 'חיים אלעזר אלטר',
        action: 'settings',
        entityType: 'system',
        details: 'עדכן שער חליפין מ-3.65 ל-3.70',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'log-6',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        userId: 'user-2',
        userName: 'שרה כהן',
        action: 'delete',
        entityType: 'policy',
        entityId: 'policy-old',
        entityName: 'פוליסת ישנה',
        details: 'מחק פוליסה לא פעילה',
        ipAddress: '192.168.1.101'
      }
    ];
    
    setLogs(sampleLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || log.entityType === filterEntity;
    
    let matchesDate = true;
    const now = new Date();
    const logDate = new Date(log.timestamp);
    
    switch (dateRange) {
      case 'today':
        matchesDate = logDate.toDateString() === now.toDateString();
        break;
      case 'week':
        matchesDate = (now.getTime() - logDate.getTime()) <= (7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        matchesDate = (now.getTime() - logDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
        break;
    }
    
    return matchesAction && matchesEntity && matchesDate;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4 text-green-600" />;
      case 'update': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'login': return <User className="w-4 h-4 text-purple-600" />;
      case 'calculation': return <Activity className="w-4 h-4 text-orange-600" />;
      case 'settings': return <Settings className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels = {
      'create': 'יצירה',
      'update': 'עדכון',
      'delete': 'מחיקה',
      'login': 'התחברות',
      'calculation': 'חישוב',
      'settings': 'הגדרות'
    };
    return labels[action as keyof typeof labels] || action;
  };

  const getEntityLabel = (entityType: string) => {
    const labels = {
      'policy': 'פוליסה',
      'user': 'משתמש',
      'calculation': 'חישוב',
      'system': 'מערכת'
    };
    return labels[entityType as keyof typeof labels] || entityType;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">לוג פעילות</h2>
          <p className="text-gray-600">מעקב אחר כל הפעולות במערכת</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
          <Activity className="w-4 h-4" />
          <span>מציג {filteredLogs.length} פעולות</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">יצירות היום</p>
              <p className="text-2xl font-bold text-green-800">
                {logs.filter(l => l.action === 'create' && 
                  new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Plus className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">עדכונים היום</p>
              <p className="text-2xl font-bold text-blue-800">
                {logs.filter(l => l.action === 'update' && 
                  new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">חישובים היום</p>
              <p className="text-2xl font-bold text-orange-800">
                {logs.filter(l => l.action === 'calculation' && 
                  new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">התחברויות היום</p>
              <p className="text-2xl font-bold text-purple-800">
                {logs.filter(l => l.action === 'login' && 
                  new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-40">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="all">כל הפעולות</option>
              <option value="create">יצירה</option>
              <option value="update">עדכון</option>
              <option value="delete">מחיקה</option>
              <option value="login">התחברות</option>
              <option value="calculation">חישוב</option>
              <option value="settings">הגדרות</option>
            </select>
          </div>

          <div className="md:w-40">
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="all">כל הישויות</option>
              <option value="policy">פוליסות</option>
              <option value="user">משתמשים</option>
              <option value="calculation">חישובים</option>
              <option value="system">מערכת</option>
            </select>
          </div>

          <div className="md:w-40">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="today">היום</option>
              <option value="week">השבוע</option>
              <option value="month">החודש</option>
              <option value="all">הכל</option>
            </select>
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={() => {
                setFilterAction('all');
                setFilterEntity('all');
                setDateRange('today');
              }}
              className="text-adr-brown hover:text-adr-light-brown text-sm"
            >
              נקה מסננים
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            לוג פעילות - {filteredLogs.length} פעולות
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">אין פעילות במסננים שנבחרו</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActionIcon(log.action)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="text-sm font-medium text-gray-900">{log.userName}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{getActionLabel(log.action)}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{getEntityLabel(log.entityType)}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(log.timestamp)}</span>
                          <span>{formatTime(log.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-700">{log.details}</p>
                      
                      {log.entityName && (
                        <div className="mt-2 flex items-center space-x-2 space-x-reverse">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{log.entityName}</span>
                          {log.entityId && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">ID: {log.entityId}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {log.ipAddress && (
                        <div className="mt-1 text-xs text-gray-400">
                          IP: {log.ipAddress}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">ייצוא נתונים</h3>
        <div className="flex space-x-4 space-x-reverse">
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            <span>ייצא ל-CSV</span>
          </button>
          
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>דוח שבועי</span>
          </button>
          
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span>הגדרות לוג</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
