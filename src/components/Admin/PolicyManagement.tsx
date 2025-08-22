import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, DollarSign, 
  Calendar, Building2, User, Filter 
} from 'lucide-react';
import { SAMPLE_POLICIES } from '../../constants/policies';
import { LifeSettlementPolicy } from '../../types/policy.types';
import PolicyForm from './PolicyForm';

const PolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<LifeSettlementPolicy[]>(SAMPLE_POLICIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LifeSettlementPolicy | null>(null);
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === '' || policy.insuranceCompany === filterCompany;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && policy.isActive !== false) ||
      (filterStatus === 'inactive' && policy.isActive === false);
    
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const companies = [...new Set(policies.map(p => p.insuranceCompany))];

  const handleDeletePolicy = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את פוליסת "${policy?.name}"?`)) {
      setPolicies(policies.filter(p => p.id !== policyId));
    }
  };

  const handleAddPolicy = (newPolicy: Omit<LifeSettlementPolicy, 'id'>) => {
    const policy: LifeSettlementPolicy = {
      ...newPolicy,
      id: `policy-${Date.now()}`
    };
    setPolicies([...policies, policy]);
    setShowAddForm(false);
  };

  const handleUpdatePolicy = (updatedPolicy: LifeSettlementPolicy) => {
    setPolicies(policies.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
    setEditingPolicy(null);
  };

  const formatAge = (age: number | { male: number; female: number }) => {
    if (typeof age === 'number') return `${age} שנים`;
    return `${age.male}/${age.female} שנים`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAverageAge = () => {
    if (policies.length === 0) return 0;
    return Math.round(policies.reduce((sum, p) => {
      const age = typeof p.age === 'number' ? p.age : (p.age.male + p.age.female) / 2;
      return sum + age;
    }, 0) / policies.length);
  };

  const getTotalInvestment = () => {
    return policies.reduce((sum, p) => sum + p.purchaseCost, 0);
  };

  const getActivePoliciesCount = () => {
    return policies.filter(p => p.isActive !== false).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">ניהול פוליסות</h2>
          <p className="text-gray-600">ניהול ועדכון פוליסות Life Settlements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 space-x-reverse bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף פוליסה חדשה</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">סה"כ פוליסות</p>
              <p className="text-2xl font-bold text-blue-800">{policies.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">פוליסות פעילות</p>
              <p className="text-2xl font-bold text-green-800">{getActivePoliciesCount()}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">סה"כ השקעה</p>
              <p className="text-2xl font-bold text-yellow-800">
                {formatCurrency(getTotalInvestment())}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">ממוצע גיל</p>
              <p className="text-2xl font-bold text-purple-800">{getAverageAge()} שנים</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
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
                placeholder="חיפוש פוליסה לפי שם..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              >
                <option value="">כל החברות</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:w-40">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="active">פעיל</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>מציג {filteredPolicies.length} מתוך {policies.length} פוליסות</span>
        {(searchTerm || filterCompany || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCompany('');
              setFilterStatus('all');
            }}
            className="text-adr-brown hover:text-adr-light-brown"
          >
            נקה מסננים
          </button>
        )}
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פוליסה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  גיל
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  חברת ביטוח
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  עלות רכישה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ערך נקוב
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  דירוג
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                    <div className="text-xs text-gray-500">ID: {policy.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAge(policy.age)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.insuranceCompany}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(policy.purchaseCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(policy.faceValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      policy.companyRating === 'AAA' ? 'bg-green-100 text-green-800' :
                      policy.companyRating.startsWith('AA') ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.companyRating}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      policy.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {policy.isActive !== false ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingPolicy(policy)}
                        className="text-adr-brown hover:text-adr-light-brown"
                        title="עריכה"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
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

      {filteredPolicies.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">לא נמצאו פוליסות המתאימות לחיפוש</p>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <PolicyForm
          onSave={handleAddPolicy}
          onCancel={() => setShowAddForm(false)}
          title="הוסף פוליסה חדשה"
        />
      )}

      {/* Edit Form Modal */}
      {editingPolicy && (
        <PolicyForm
          policy={editingPolicy}
          onSave={handleUpdatePolicy}
          onCancel={() => setEditingPolicy(null)}
          title={`עריכת ${editingPolicy.name}`}
        />
      )}
    </div>
  );
};

export default PolicyManagement;