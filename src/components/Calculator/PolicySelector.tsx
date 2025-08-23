
import { useState } from 'react';
import { Box, DollarSign, Calendar, Building2, Star } from 'lucide-react';
import { useCalculator } from '../../hooks/useCalculator';
import { usePoliciesStore } from '../../hooks/usePoliciesStore';
import { useSwipeable } from 'react-swipeable';

const PolicySelector: React.FC = () => {
  const { selectedPolicies, addPolicy, removePolicy, updatePolicyUnits } = useCalculator();
  const { policies } = usePoliciesStore();
  const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentPolicyIndex((prev: number) => Math.min(prev + 1, policies.length - 1));
    },
    onSwipedRight: () => {
      setCurrentPolicyIndex((prev: number) => Math.max(prev - 1, 0));
    },
    trackMouse: true
  });

  const handlePolicyToggle = (policyId: string, units: number = 1) => {
    const isSelected = selectedPolicies.find(p => p.policyId === policyId);
    
    if (isSelected) {
      removePolicy(policyId);
    } else {
      addPolicy({ policyId, units });
    }
  };

  const handleUnitsChange = (policyId: string, units: number) => {
    if (units > 0 && units <= 10) {
      updatePolicyUnits(policyId, units);
    }
  };

  const getSelectedPolicy = (policyId: string) => {
    return selectedPolicies.find(p => p.policyId === policyId);
  };

  const formatAge = (age: number | { male: number; female: number }) => {
    if (typeof age === 'number') {
      return `${age} שנים`;
    }
    return `${age.male}/${age.female} שנים`;
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA': return 'text-green-400';
      case 'AA+': return 'text-blue-400';
      case 'AA': return 'text-blue-500';
      case 'A+': return 'text-yellow-400';
      case 'A': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-adr-brown mb-2">בחר פוליסות להשקעה</h3>
        <p className="text-adr-light-brown">בחר עד 10 פוליסות שונות, עד 10 יחידות לכל פוליסה</p>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {policies.filter(p => p.isActive !== false).map((policy) => {
          const isSelected = getSelectedPolicy(policy.id);
          const selectedUnits = isSelected?.units || 0;

          return (
            <div
              key={policy.id}
              className={`card-policy transition-all duration-300 cursor-pointer hover:scale-105 ${
                isSelected ? 'ring-4 ring-adr-gold' : ''
              }`}
              onClick={() => handlePolicyToggle(policy.id)}
            >
              {/* Header with Icons */}
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
                  <div className="relative">
                    <Box className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-adr-brown absolute -top-1 -right-1" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold truncate">{policy.name}</h4>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Star className={`w-4 h-4 md:w-5 md:h-5 ${getRatingColor(policy.companyRating)}`} />
                  <span className="text-xs md:text-sm font-medium">{policy.companyRating}</span>
                </div>
              </div>

              {/* Policy Details */}
              <div className="space-y-2 md:space-y-3 text-adr-gold text-sm md:text-base">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1 md:space-x-2 space-x-reverse">
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">פדיון:</span>
                    <span className="sm:hidden">פדיון</span>
                  </span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    ${policy.faceValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1 md:space-x-2 space-x-reverse">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>גיל:</span>
                  </span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    {formatAge(policy.age)}
                  </span>
                </div>

                <div className="hidden sm:flex items-center justify-between">
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <Building2 className="w-4 h-4" />
                    <span>חברה:</span>
                  </span>
                  <span className="text-white font-semibold text-sm">
                    {policy.insuranceCompany}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>סוג:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    {policy.policyType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>LE:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    {policy.lifeExpectancy} שנים
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="hidden sm:inline">עלות רכישה:</span>
                  <span className="sm:hidden">עלות:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    ${policy.purchaseCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="hidden sm:inline">פתיחת תיק:</span>
                  <span className="sm:hidden">פתיחה:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    ₪{policy.openingCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="hidden sm:inline">דמי ניהול:</span>
                  <span className="sm:hidden">ניהול:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    ${policy.monthlyManagementFee}/חודש
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="hidden sm:inline">פרמיה:</span>
                  <span className="sm:hidden">פרמיה:</span>
                  <span className="text-white font-semibold text-xs md:text-sm">
                    ${policy.monthlyPremium}/חודש
                  </span>
                </div>
              </div>

              {/* Units Selection */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-adr-gold">
                  <div className="flex items-center justify-between">
                    <label className="text-adr-gold text-sm font-medium">יחידות:</label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitsChange(policy.id, Math.max(1, selectedUnits - 1));
                        }}
                        className="w-10 h-10 md:w-8 md:h-8 bg-adr-light-brown rounded-full flex items-center justify-center text-white hover:bg-adr-bronze transition-colors active:scale-95"
                      >
                        <span className="text-lg md:text-base font-bold">-</span>
                      </button>
                      <span className="text-white font-bold min-w-[2.5rem] md:min-w-[2rem] text-center text-lg md:text-base">
                        {selectedUnits}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitsChange(policy.id, Math.min(10, selectedUnits + 1));
                        }}
                        className="w-10 h-10 md:w-8 md:h-8 bg-adr-light-brown rounded-full flex items-center justify-center text-white hover:bg-adr-bronze transition-colors active:scale-95"
                      >
                        <span className="text-lg md:text-base font-bold">+</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-adr-gold mt-2 text-center">
                    סה"כ: ${(policy.purchaseCost * selectedUnits).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-adr-gold rounded-full flex items-center justify-center">
                    <span className="text-adr-brown text-sm font-bold">✓</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Swipe View */}
      <div className="sm:hidden" {...swipeHandlers}>
        <div className="relative">
          <div className="text-center mb-4">
            <span className="text-sm text-adr-light-brown">
              {currentPolicyIndex + 1} מתוך {policies.filter(p => p.isActive !== false).length}
            </span>
          </div>
          
          <div className="relative">
            {policies.filter(p => p.isActive !== false).map((policy, index) => {
              const isSelected = getSelectedPolicy(policy.id);
              const selectedUnits = isSelected?.units || 0;
              const isActive = index === currentPolicyIndex;

              return (
                <div
                  key={policy.id}
                  className={`card-policy transition-all duration-300 cursor-pointer ${
                    isActive ? 'block' : 'hidden'
                  } ${isSelected ? 'ring-4 ring-adr-gold' : ''}`}
                  onClick={() => handlePolicyToggle(policy.id)}
                >
                  {/* Header with Icons */}
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
                      <div className="relative">
                        <Box className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-adr-brown absolute -top-1 -right-1" />
                      </div>
                      <h4 className="text-base md:text-lg font-bold truncate">{policy.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Star className={`w-4 h-4 md:w-5 md:h-5 ${getRatingColor(policy.companyRating)}`} />
                      <span className="text-xs md:text-sm font-medium">{policy.companyRating}</span>
                    </div>
                  </div>

                  {/* Policy Details */}
                  <div className="space-y-2 md:space-y-3 text-adr-gold text-sm md:text-base">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 md:space-x-2 space-x-reverse">
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                        <span>פדיון:</span>
                      </span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        ${policy.faceValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 md:space-x-2 space-x-reverse">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>גיל:</span>
                      </span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        {formatAge(policy.age)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>סוג:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        {policy.policyType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>LE:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        {policy.lifeExpectancy} שנים
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>עלות:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        ${policy.purchaseCost.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>פתיחה:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        ₪{policy.openingCost.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>ניהול:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        ${policy.monthlyManagementFee}/חודש
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>פרמיה:</span>
                      <span className="text-white font-semibold text-xs md:text-sm">
                        ${policy.monthlyPremium}/חודש
                      </span>
                    </div>
                  </div>

                  {/* Units Selection */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-adr-gold">
                      <div className="flex items-center justify-between">
                        <label className="text-adr-gold text-sm font-medium">יחידות:</label>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnitsChange(policy.id, Math.max(1, selectedUnits - 1));
                            }}
                            className="w-10 h-10 md:w-8 md:h-8 bg-adr-light-brown rounded-full flex items-center justify-center text-white hover:bg-adr-bronze transition-colors active:scale-95"
                          >
                            <span className="text-lg md:text-base font-bold">-</span>
                          </button>
                          <span className="text-white font-bold min-w-[2.5rem] md:min-w-[2rem] text-center text-lg md:text-base">
                            {selectedUnits}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnitsChange(policy.id, Math.min(10, selectedUnits + 1));
                            }}
                            className="w-10 h-10 md:w-8 md:h-8 bg-adr-light-brown rounded-full flex items-center justify-center text-white hover:bg-adr-bronze transition-colors active:scale-95"
                          >
                            <span className="text-lg md:text-base font-bold">+</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-adr-gold mt-2 text-center">
                        סה"כ: ${(policy.purchaseCost * selectedUnits).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-adr-gold rounded-full flex items-center justify-center">
                        <span className="text-adr-brown text-sm font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Swipe Instructions */}
          <div className="text-center mt-4">
            <p className="text-xs text-adr-light-brown">
              החלק ימינה/שמאלה לעבור בין פוליסות
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedPolicies.length > 0 && (
        <div className="bg-adr-light-brown rounded-lg p-6 text-center">
          <h4 className="text-xl font-bold text-white mb-2">סיכום בחירה</h4>
          <p className="text-adr-brown">
            נבחרו {selectedPolicies.length} פוליסות
          </p>
        </div>
      )}
    </div>
  );
};

export default PolicySelector;
