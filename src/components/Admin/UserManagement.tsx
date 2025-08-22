import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Shield, 
  CheckCircle, XCircle, User
} from 'lucide-react';
import { UserType } from '../../types/user.types';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'user-1',
      name: 'חיים אלעזר אלטר',
      email: 'chaim@adr.com',
      type: 'manager',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'user-2',
      name: 'שרה כהן',
      email: 'sarah@adr.com',
      type: 'representative',
      isActive: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'user-3',
      name: 'משה לוי',
      email: 'moshe@adr.com',
      type: 'representative',
      isActive: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date('2024-02-01')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<UserType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${user?.name}"?`)) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const getUserTypeLabel = (type: UserType) => {
    const labels = {
      'website': 'אתר',
      'representative': 'נציג',
      'manager': 'מנהל'
    };
    return labels[type];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'כרגע';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    return `לפני ${diffDays} ימים`;
  };

  const activeUsersCount = users.filter(u => u.isActive).length;
  const managerCount = users.filter(u => u.type === 'manager').length;
  const representativeCount = users.filter(u => u.type === 'representative').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">ניהול משתמשים</h2>
          <p className="text-gray-600">ניהול רשימת המשתמשים והרשאותיהם</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 space-x-reverse bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף משתמש</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">סה"כ משתמשים</p>
              <p className="text-2xl font-bold text-blue-800">{users.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">משתמשים פעילים</p>
              <p className="text-2xl font-bold text-green-800">{activeUsersCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">מנהלים</p>
              <p className="text-2xl font-bold text-purple-800">{managerCount}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">נציגים</p>
              <p className="text-2xl font-bold text-yellow-800">{representativeCount}</p>
            </div>
            <User className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי שם או אימייל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:w-40">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as UserType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="all">כל הסוגים</option>
              <option value="manager">מנהלים</option>
              <option value="representative">נציגים</option>
              <option value="website">אתר</option>
            </select>
          </div>

          <div className="md:w-32">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  משתמש
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סוג
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  התחברות אחרונה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  נוצר
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-adr-brown rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.type === 'manager' ? 'bg-red-100 text-red-800' :
                      user.type === 'representative' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getUserTypeLabel(user.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 ml-1" />
                          פעיל
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 ml-1" />
                          לא פעיל
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{formatDate(user.lastLogin)}</div>
                      <div className="text-xs text-gray-500">{getTimeAgo(user.lastLogin)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-adr-brown hover:text-adr-light-brown"
                        title="עריכה"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="מחיקה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">לא נמצאו משתמשים המתאימים לחיפוש</p>
        </div>
      )}

      {/* Add Form Modal Placeholder */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-adr-brown mb-4">הוסף משתמש חדש</h3>
            <p className="text-gray-600 mb-4">טופס הוספת משתמש יהיה זמין בקרוב</p>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Modal Placeholder */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-adr-brown mb-4">עריכת {editingUser.name}</h3>
            <p className="text-gray-600 mb-4">טופס עריכת משתמש יהיה זמין בקרוב</p>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
