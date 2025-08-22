import { useState } from 'react';
import PolicySelector from './PolicySelector';
import InvestmentForm from './InvestmentForm';
import ResultsDisplay from './ResultsDisplay';
import { CalculationResults } from '../../types/policy.types';

const Calculator: React.FC = () => {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // כאן יהיה החישוב האמיתי
      // כרגע נשתמש בנתונים לדוגמה
      await new Promise(resolve => setTimeout(resolve, 1000)); // סימולציה של חישוב
      
      const mockResults: CalculationResults = {
        totalPurchaseCost: 50000,
        totalManagementFees: 2400,
        totalOpeningCosts: 1500,
        expectedReturns: {
          individual: [],
          average: {
            totalReturn: 75000,
            netProfit: 22600,
            annualizedReturn: 12.5,
            compoundReturn: 11.8,
            totalReturnPercentage: 45.2,
            timeToMaturity: 8
          },
          actual: {
            totalReturn: 75000,
            netProfit: 22600,
            annualizedReturn: 12.5,
            compoundReturn: 11.8,
            totalReturnPercentage: 45.2,
            timeToMaturity: 8
          }
        },
        annualBreakdown: [],
        currencyConversion: {
          usdToIls: 3.65,
          totalInILS: 182500
        }
      };
      
      setResults(mockResults);
    } catch (error) {
      console.error('שגיאה בחישוב:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
      {/* כותרת ראשית */}
      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-adr-brown mb-3 md:mb-4">
          מחשבון Life Settlements
        </h2>
        <p className="text-base md:text-lg text-adr-light-brown">
          חשב את התשואה הצפויה מהשקעה בפוליסות ביטוח חיים
        </p>
      </div>

      {/* בחירת פוליסות */}
      <PolicySelector />

      {/* טופס השקעה */}
      <InvestmentForm onCalculate={handleCalculate} isCalculating={isCalculating} />

      {/* תצוגת תוצאות */}
      {results && <ResultsDisplay results={results} />}

      {/* Loading State */}
      {isCalculating && (
        <div className="text-center py-8 md:py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-adr-brown"></div>
          <p className="mt-3 md:mt-4 text-adr-brown text-base md:text-lg">מחשב...</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
