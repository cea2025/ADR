import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, DollarSign, 
  Calendar, Building2, User, Filter 
} from 'lucide-react';
import { SAMPLE_POLICIES } from '../../constants/policies';
import { LifeSettlementPolicy } from '../../types/policy.types';

const PolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<LifeSettlementPolicy[]>(SAMPLE_POLICIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LifeSettlementPolicy | null>(null);
  const [filterCompany, setFilterCompany] = useState('');

  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCompany === '' || policy.company === filterCompany)
  );

  const companies = [...new Set(policies.map(p => p.company))];

  const handleDeletePolicy = (policyId: string) => {
    if (window.confirm('��� ��� ���� ������� ����� ������ ��?')) {
      setPolicies(policies.filter(p => p.id !== policyId));
    }
  };

  const formatAge = (age: number | { male: number; female: number }) => {
    if (typeof age === 'number') return `${age} ����`;
    return `${age.male}/${age.female} ����`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateAverageAge = () => {
    if (policies.length === 0) return 0;
    return Math.round(policies.reduce((sum, p) => {
      const age = typeof p.age === 'number' ? p.age : (p.age.male + p.age.female) / 2;
      return sum + age;
    }, 0) / policies.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">����� �������</h2>
          <p className="text-gray-600">����� ������ ������� Life Settlements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 space-x-reverse bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>���� ������</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">��"� �������</p>
              <p className="text-2xl font-bold text-blue-800">{policies.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">������� ������</p>
              <p className="text-2xl font-bold text-green-800">{policies.length}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">��"� �����</p>
              <p className="text-2xl font-bold text-yellow-800">
                {formatCurrency(policies.reduce((sum, p) => sum + p.purchaseCost, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">����� ���</p>
              <p className="text-2xl font-bold text-purple-800">{calculateAverageAge()} ����</p>
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
                placeholder="����� ������..."
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
                <option value="">�� ������</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ������
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ���
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ����
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ���� �����
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ��� ����
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  �����
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ������
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                    <div className="text-xs text-green-600">����</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAge(policy.age)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(policy.purchaseCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(policy.faceValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      policy.rating === 'AAA' ? 'bg-green-100 text-green-800' :
                      policy.rating.startsWith('AA') ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingPolicy(policy)}
                        className="text-adr-brown hover:text-adr-light-brown"
                        title="�����"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="text-red-600 hover:text-red-800"
                        title="�����"
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
          <p className="text-gray-500">�� ����� ������� �������� ������</p>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-adr-brown mb-4">���� ������ ����</h3>
            <p className="text-gray-600 mb-4">���� ����� ���� ���� �����</p>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
            >
              ����
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-adr-brown mb-4">����� {editingPolicy.name}</h3>
            <p className="text-gray-600 mb-4">���� ����� ���� ���� �����</p>
            <button
              onClick={() => setEditingPolicy(null)}
              className="bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
            >
              ����
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
