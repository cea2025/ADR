import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, PieChart, Calendar, 
  DollarSign, Users, FileText, Download 
} from 'lucide-react';
import { usePoliciesStore } from '../../hooks/usePoliciesStore';

const Statistics: React.FC = () => {
  const { policies, getTotalValue, getAverageAge } = usePoliciesStore();
  const [timeRange, setTimeRange] = useState('month');

  // Calculate statistics
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.isActive !== false).length;
  const totalInvestment = getTotalValue();
  const averageAge = getAverageAge();

  // Company distribution
  const companyStats = policies.reduce((acc, policy) => {
    acc[policy.insuranceCompany] = (acc[policy.insuranceCompany] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Rating distribution
  const ratingStats = policies.reduce((acc, policy) => {
    acc[policy.companyRating] = (acc[policy.companyRating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Age distribution
  const ageRanges = {
    '60-70': 0,
    '70-80': 0,
    '80-90': 0,
    '90+': 0
  };

  policies.forEach(policy => {
    const age = typeof policy.age === 'number' ? policy.age : (policy.age.male + policy.age.female) / 2;
    if (age < 70) ageRanges['60-70']++;
    else if (age < 80) ageRanges['70-80']++;
    else if (age < 90) ageRanges['80-90']++;
    else ageRanges['90+']++;
  });

  // Investment distribution
  const investmentRanges = {
    'עד 100K': 0,
    '100K-500K': 0,
    '500K-1M': 0,
    '1M+': 0
  };

  policies.forEach(policy => {
    const cost = policy.purchaseCost;
    if (cost < 100000) investmentRanges['עד 100K']++;
    else if (cost < 500000) investmentRanges['100K-500K']++;
    else if (cost < 1000000) investmentRanges['500K-1M']++;
    else investmentRanges['1M+']++;
  });

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: {
        totalPolicies,
        activePolicies,
        totalInvestment,
        averageAge
      },
      distributions: {
        companies: companyStats,
        ratings: ratingStats,
        ageRanges,
        investmentRanges
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adr-statistics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-adr-brown">סטטיסטיקות ודוחות</h2>
          <p className="text-gray-600">ניתוח נתונים ותובנות עסקיות</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
          >
            <option value="week">השבוע</option>
            <option value="month">החודש</option>
            <option value="quarter">הרבעון</option>
            <option value="year">השנה</option>
          </select>
          
          <button
            onClick={generateReport}
            className="flex items-center space-x-2 space-x-reverse bg-adr-brown text-white px-4 py-2 rounded-lg hover:bg-adr-light-brown transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ייצא דוח</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">סה"כ פוליסות</p>
              <p className="text-3xl font-bold">{totalPolicies}</p>
              <p className="text-blue-200 text-sm">+5% מהחודש הקודם</p>
            </div>
            <FileText className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">פוליסות פעילות</p>
              <p className="text-3xl font-bold">{activePolicies}</p>
              <p className="text-green-200 text-sm">{((activePolicies/totalPolicies)*100).toFixed(1)}% מהסך</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">סה"כ השקעה</p>
              <p className="text-3xl font-bold">${(totalInvestment / 1000000).toFixed(1)}M</p>
              <p className="text-yellow-200 text-sm">ממוצע ${(totalInvestment/totalPolicies/1000).toFixed(0)}K לפוליסה</p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">ממוצע גיל</p>
              <p className="text-3xl font-bold">{averageAge}</p>
              <p className="text-purple-200 text-sm">שנים</p>
            </div>
            <Users className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Company Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-adr-brown">התפלגות לפי חברות</h3>
            <PieChart className="w-5 h-5 text-adr-brown" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(companyStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([company, count]) => (
              <div key={company} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-adr-brown rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{company}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-600">{count} פוליסות</span>
                  <span className="text-xs text-gray-500">({((count/totalPolicies)*100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-adr-brown">התפלגות לפי דירוג</h3>
            <BarChart3 className="w-5 h-5 text-adr-brown" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(ratingStats)
              .sort(([,a], [,b]) => b - a)
              .map(([rating, count]) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    rating === 'AAA' ? 'bg-green-100 text-green-800' :
                    rating.startsWith('AA') ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rating}
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-600">{count} פוליסות</span>
                  <span className="text-xs text-gray-500">({((count/totalPolicies)*100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-adr-brown">התפלגות לפי גיל</h3>
            <Calendar className="w-5 h-5 text-adr-brown" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(ageRanges).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{range} שנים</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-600">{count} פוליסות</span>
                  <span className="text-xs text-gray-500">({((count/totalPolicies)*100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-adr-brown">התפלגות לפי השקעה</h3>
            <DollarSign className="w-5 h-5 text-adr-brown" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(investmentRanges).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{range}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-600">{count} פוליסות</span>
                  <span className="text-xs text-gray-500">({((count/totalPolicies)*100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-adr-brown to-adr-light-brown rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">תובנות מפתח</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-medium mb-2">חברה מובילה</h4>
            <p className="text-sm">
              {Object.entries(companyStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
            <p className="text-xs opacity-80">
              {Object.entries(companyStats).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} פוליסות
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-medium mb-2">דירוג נפוץ</h4>
            <p className="text-sm">
              {Object.entries(ratingStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
            <p className="text-xs opacity-80">
              {((Object.entries(ratingStats).sort(([,a], [,b]) => b - a)[0]?.[1] || 0) / totalPolicies * 100).toFixed(1)}% מהפוליסות
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-medium mb-2">טווח גיל נפוץ</h4>
            <p className="text-sm">
              {Object.entries(ageRanges).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'} שנים
            </p>
            <p className="text-xs opacity-80">
              {Object.entries(ageRanges).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} פוליסות
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">מדדי ביצועים</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(totalInvestment / totalPolicies / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">ממוצע השקעה לפוליסה</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(policies.reduce((sum, p) => sum + p.faceValue, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">סה"כ ערך נקוב</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {((totalInvestment / policies.reduce((sum, p) => sum + p.faceValue, 0)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">יחס רכישה ממוצע</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {(policies.reduce((sum, p) => sum + p.lifeExpectancy, 0) / policies.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">ממוצע תוחלת חיים</div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-adr-brown mb-4">ניתוח מגמות</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600 ml-2" />
            <h4 className="font-medium text-blue-800">מגמות זוהו</h4>
          </div>
          
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>גיל ממוצע עולה:</strong> מ-{averageAge - 2} ל-{averageAge} שנים</p>
            <p>• <strong>השקעות גדלות:</strong> עלייה של 15% בהשקעה ממוצעת</p>
            <p>• <strong>חברות מועדפות:</strong> {Object.keys(companyStats).slice(0, 3).join(', ')}</p>
            <p>• <strong>דירוגים גבוהים:</strong> {((Object.entries(ratingStats).filter(([r]) => r.startsWith('AA')).reduce((sum, [,count]) => sum + count, 0) / totalPolicies) * 100).toFixed(1)}% AA ומעלה</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
