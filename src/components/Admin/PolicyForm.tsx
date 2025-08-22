import React, { useState, useEffect } from 'react';
import { X, Save, User, Users } from 'lucide-react';
import { LifeSettlementPolicy } from '../../types/policy.types';

interface PolicyFormProps {
  policy?: LifeSettlementPolicy;
  onSave: (policy: any) => void;
  onCancel: () => void;
  title: string;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ policy, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 75,
    coupleType: 'single' as 'single' | 'couple',
    maleAge: 75,
    femaleAge: 72,
    insuranceCompany: '',
    companyRating: 'AA',
    faceValue: 1000000,
    purchaseCost: 200000,
    lifeExpectancy: 8.5,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name,
        age: typeof policy.age === 'number' ? policy.age : 75,
        coupleType: policy.coupleType,
        maleAge: typeof policy.age === 'object' ? policy.age.male : 75,
        femaleAge: typeof policy.age === 'object' ? policy.age.female : 72,
        insuranceCompany: policy.insuranceCompany,
        companyRating: policy.companyRating,
        faceValue: policy.faceValue,
        purchaseCost: policy.purchaseCost,
        lifeExpectancy: policy.lifeExpectancy,
        isActive: policy.isActive ?? true
      });
    }
  }, [policy]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם הפוליסה נדרש';
    }

    if (!formData.insuranceCompany.trim()) {
      newErrors.insuranceCompany = 'חברת ביטוח נדרשת';
    }

    if (formData.faceValue <= 0) {
      newErrors.faceValue = 'ערך נקוב חייב להיות גדול מאפס';
    }

    if (formData.purchaseCost <= 0) {
      newErrors.purchaseCost = 'עלות רכישה חייבת להיות גדולה מאפס';
    }

    if (formData.purchaseCost >= formData.faceValue) {
      newErrors.purchaseCost = 'עלות הרכישה חייבת להיות קטנה מהערך הנקוב';
    }

    if (formData.coupleType === 'single') {
      if (formData.age < 18 || formData.age > 120) {
        newErrors.age = 'גיל חייב להיות בין 18 ל-120';
      }
    } else {
      if (formData.maleAge < 18 || formData.maleAge > 120) {
        newErrors.maleAge = 'גיל הגבר חייב להיות בין 18 ל-120';
      }
      if (formData.femaleAge < 18 || formData.femaleAge > 120) {
        newErrors.femaleAge = 'גיל האישה חייב להיות בין 18 ל-120';
      }
    }

    if (formData.lifeExpectancy <= 0 || formData.lifeExpectancy > 50) {
      newErrors.lifeExpectancy = 'תוחלת חיים חייבת להיות בין 0.1 ל-50 שנים';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const policyData = {
      ...(policy && { id: policy.id }),
      name: formData.name.trim(),
      age: formData.coupleType === 'single' 
        ? formData.age 
        : { male: formData.maleAge, female: formData.femaleAge },
      coupleType: formData.coupleType,
      insuranceCompany: formData.insuranceCompany.trim(),
      companyRating: formData.companyRating,
      faceValue: formData.faceValue,
      purchaseCost: formData.purchaseCost,
      lifeExpectancy: formData.lifeExpectancy,
      isActive: formData.isActive
    };

    onSave(policyData as any);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const insuranceCompanies = [
    'AIG', 'MetLife', 'Prudential', 'New York Life', 'MassMutual',
    'Northwestern Mutual', 'Lincoln National', 'Principal Financial',
    'John Hancock', 'Transamerica'
  ];

  const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-adr-brown">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם הפוליסה *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="לדוגמה: פוליסת כוכב"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג פוליסה
              </label>
              <div className="flex space-x-4 space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="single"
                    checked={formData.coupleType === 'single'}
                    onChange={(e) => handleInputChange('coupleType', e.target.value)}
                    className="mr-2"
                  />
                  <User className="w-4 h-4 ml-1" />
                  יחיד
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="couple"
                    checked={formData.coupleType === 'couple'}
                    onChange={(e) => handleInputChange('coupleType', e.target.value)}
                    className="mr-2"
                  />
                  <Users className="w-4 h-4 ml-1" />
                  זוג
                </label>
              </div>
            </div>
          </div>

          {/* Age Section */}
          {formData.coupleType === 'single' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                גיל *
              </label>
              <input
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  גיל הגבר *
                </label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.maleAge}
                  onChange={(e) => handleInputChange('maleAge', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                    errors.maleAge ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.maleAge && <p className="mt-1 text-sm text-red-600">{errors.maleAge}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  גיל האישה *
                </label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.femaleAge}
                  onChange={(e) => handleInputChange('femaleAge', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                    errors.femaleAge ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.femaleAge && <p className="mt-1 text-sm text-red-600">{errors.femaleAge}</p>}
              </div>
            </div>
          )}

          {/* Insurance Company & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חברת ביטוח *
              </label>
              <select
                value={formData.insuranceCompany}
                onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.insuranceCompany ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">בחר חברת ביטוח</option>
                {insuranceCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              {errors.insuranceCompany && <p className="mt-1 text-sm text-red-600">{errors.insuranceCompany}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                דירוג חברה
              </label>
              <select
                value={formData.companyRating}
                onChange={(e) => handleInputChange('companyRating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent"
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ערך נקוב ($) *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={formData.faceValue}
                onChange={(e) => handleInputChange('faceValue', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.faceValue ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.faceValue && <p className="mt-1 text-sm text-red-600">{errors.faceValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                עלות רכישה ($) *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={formData.purchaseCost}
                onChange={(e) => handleInputChange('purchaseCost', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.purchaseCost ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.purchaseCost && <p className="mt-1 text-sm text-red-600">{errors.purchaseCost}</p>}
            </div>
          </div>

          {/* Life Expectancy & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תוחלת חיים (שנים) *
              </label>
              <input
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={formData.lifeExpectancy}
                onChange={(e) => handleInputChange('lifeExpectancy', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-adr-brown focus:border-transparent ${
                  errors.lifeExpectancy ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lifeExpectancy && <p className="mt-1 text-sm text-red-600">{errors.lifeExpectancy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס פוליסה
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <span>פוליסה פעילה</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">סיכום פיננסי</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">יחס רכישה:</span>
                <span className="font-medium mr-2">
                  {formData.faceValue > 0 ? ((formData.purchaseCost / formData.faceValue) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">פוטנציאל רווח:</span>
                <span className="font-medium mr-2">
                  ${(formData.faceValue - formData.purchaseCost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-adr-brown text-white rounded-lg hover:bg-adr-light-brown transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>שמור</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyForm;
