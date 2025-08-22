import { useState } from 'react';
import { Calculator, Settings, DollarSign } from 'lucide-react';
import { useCalculator } from '../../hooks/useCalculator';
import { hasPermission } from '../../types/user.types';

interface InvestmentFormProps {
  onCalculate: (input: any) => void;
  isCalculating: boolean;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onCalculate, isCalculating }) => {
  const { selectedPolicies, userType, exchangeRate, setExchangeRate, getTotalInvestment } = useCalculator();
  
  const [leMethod, setLeMethod] = useState<'highest' | 'average' | 'actual'>('highest');
  const [includeCosts, setIncludeCosts] = useState({
    managementFees: true,
    openingCosts: true
  });

  const canUseActualLE = hasPermission(userType, 'actualLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPolicies.length === 0) {
      alert('אנא בחר לפחות פוליסה אחת');
      return;
    }

    const calculationInput = {
      selectedPolicies,
      leCalculationMethod: leMethod,
      includeCostsInReturn: includeCosts,
      exchangeRate
    };

    onCalculate(calculationInput);
  };

  const totalInvestment = getTotalInvestment();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 border border-adr-brown">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-adr-brown mb-2">הגדרות חישוב</h3>
        <p className="text-base md:text-lg text-adr-light-brown">הגדר את הפרמטרים לחישוב התשואה</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Investment Summary */}
        <div className="bg-adr-cream rounded-lg p-4 md:p-6">
          <h4 className="text-base md:text-lg font-semibold text-adr-brown mb-3 md:mb-4 flex items-center">
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            סיכום השקעה
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="text-center">
              <p className="text-adr-light-brown text-xs md:text-sm">פוליסות נבחרות</p>
              <p className="text-xl md:text-2xl font-bold text-adr-brown">{selectedPolicies.length}</p>
            </div>
            <div className="text-center">
              <p className="text-adr-light-brown text-xs md:text-sm">סה"כ השקעה</p>
              <p className="text-xl md:text-2xl font-bold text-adr-brown">${totalInvestment.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-adr-light-brown text-xs md:text-sm">בשקלים</p>
              <p className="text-xl md:text-2xl font-bold text-adr-brown">₪{(totalInvestment * exchangeRate).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Life Expectancy Method */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-semibold text-adr-brown flex items-center">
            <Calculator className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            שיטת חישוב Life Expectancy
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="leMethod"
                value="highest"
                checked={leMethod === 'highest'}
                onChange={(e) => setLeMethod(e.target.value as any)}
                className="text-adr-brown focus:ring-adr-gold"
              />
              <span className="text-adr-brown">LE הגבוה</span>
            </label>
            
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="leMethod"
                value="average"
                checked={leMethod === 'average'}
                onChange={(e) => setLeMethod(e.target.value as any)}
                className="text-adr-brown focus:ring-adr-gold"
              />
              <span className="text-adr-brown">LE ממוצע</span>
            </label>
            
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="leMethod"
                value="actual"
                checked={leMethod === 'actual'}
                onChange={(e) => setLeMethod(e.target.value as any)}
                disabled={!canUseActualLE}
                className={`text-adr-brown focus:ring-adr-gold ${!canUseActualLE ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <span className={`${!canUseActualLE ? 'text-adr-light-brown' : 'text-adr-brown'}`}>
                LE אמיתי {!canUseActualLE && '(מנהלים בלבד)'}
              </span>
            </label>
          </div>
        </div>

        {/* Cost Inclusion Options */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-semibold text-adr-brown flex items-center">
            <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            כלילת עלויות בחישוב
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="checkbox"
                checked={includeCosts.managementFees}
                onChange={(e) => setIncludeCosts(prev => ({ ...prev, managementFees: e.target.checked }))}
                className="text-adr-brown focus:ring-adr-gold rounded"
              />
              <span className="text-adr-brown">דמי ניהול חודשיים</span>
            </label>
            
            <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
              <input
                type="checkbox"
                checked={includeCosts.openingCosts}
                onChange={(e) => setIncludeCosts(prev => ({ ...prev, openingCosts: e.target.checked }))}
                className="text-adr-brown focus:ring-adr-gold rounded"
              />
              <span className="text-adr-brown">עלויות פתיחת תיק</span>
            </label>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base md:text-lg font-semibold text-adr-brown">שער חליפין דולר-שקל</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 space-x-reverse">
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                className="input-field w-32 text-center"
                placeholder="3.65"
              />
              <span className="text-adr-brown text-sm md:text-base">₪ לדולר</span>
            </div>
            <button
              type="button"
              onClick={() => setExchangeRate(3.65)}
              className="text-adr-light-brown hover:text-adr-brown text-xs md:text-sm underline"
            >
              איפוס לשער נוכחי
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4 md:pt-6">
          <button
            type="submit"
            disabled={isCalculating || selectedPolicies.length === 0}
            className={`btn-primary w-full sm:w-auto ${(isCalculating || selectedPolicies.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCalculating ? 'מחשב...' : 'חשב תשואה'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;
