
import { TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { CalculationResults } from '../../types/policy.types';

interface ResultsDisplayProps {
  results: CalculationResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const formatCurrency = (amount: number, currency: 'USD' | 'ILS' = 'USD') => {
    const symbol = currency === 'USD' ? '$' : '₪';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleExportPDF = () => {
    // כאן יהיה ייצוא PDF
    console.log('ייצוא PDF...');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-adr-brown mb-2">תוצאות החישוב</h3>
        <p className="text-lg text-adr-light-brown">סיכום התשואה הצפויה מההשקעה</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
          </div>
          <h4 className="text-adr-gold text-xs md:text-sm font-medium mb-2">סה"כ השקעה</h4>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {formatCurrency(results.totalPurchaseCost)}
          </p>
          <p className="text-adr-gold text-xs md:text-sm mt-1">
            {formatCurrency(results.currencyConversion.totalInILS, 'ILS')}
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
          </div>
          <h4 className="text-adr-gold text-xs md:text-sm font-medium mb-2">תשואה צפויה</h4>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {formatCurrency(results.expectedReturns.average.totalReturn)}
          </p>
          <p className="text-adr-gold text-xs md:text-sm mt-1">
            {formatPercentage(results.expectedReturns.average.totalReturnPercentage)}
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
          </div>
          <h4 className="text-adr-gold text-xs md:text-sm font-medium mb-2">רווח נטו</h4>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {formatCurrency(results.expectedReturns.average.netProfit)}
          </p>
          <p className="text-adr-gold text-xs md:text-sm mt-1">
            {formatPercentage(results.expectedReturns.average.annualizedReturn)} לשנה
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-adr-gold" />
          </div>
          <h4 className="text-adr-gold text-xs md:text-sm font-medium mb-2">תקופה עד פקיעה</h4>
          <p className="text-white text-2xl md:text-3xl font-bold">
            {results.expectedReturns.average.timeToMaturity}
          </p>
          <p className="text-adr-gold text-xs md:text-sm mt-1">שנים</p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Investment Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-adr-brown">
          <h4 className="text-lg md:text-xl font-bold text-adr-brown mb-3 md:mb-4">פירוט השקעה</h4>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">עלות רכישה</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.totalPurchaseCost)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">עלויות פרמיות</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.totalMonthlyPremiums)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">דמי ניהול</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.totalManagementFees)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">עלויות פתיחה</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.totalOpeningCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 bg-adr-cream rounded-lg px-3 md:px-4">
              <span className="font-bold text-adr-brown text-sm md:text-base">סה"כ עלויות</span>
              <span className="font-bold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.totalInvestment)}
              </span>
            </div>
          </div>
        </div>

        {/* Return Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-adr-brown">
          <h4 className="text-lg md:text-xl font-bold text-adr-brown mb-3 md:mb-4">ניתוח תשואה</h4>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">תשואה שנתית</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatPercentage(results.expectedReturns.average.annualizedReturn)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">ריבית דריבית</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatPercentage(results.expectedReturns.average.compoundReturn)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-adr-cream">
              <span className="text-adr-light-brown text-sm md:text-base">תשואה כוללת</span>
              <span className="font-semibold text-adr-brown text-sm md:text-base">
                {formatPercentage(results.expectedReturns.average.totalReturnPercentage)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 bg-adr-cream rounded-lg px-3 md:px-4">
              <span className="font-bold text-adr-brown text-sm md:text-base">רווח נטו</span>
              <span className="font-bold text-adr-brown text-sm md:text-base">
                {formatCurrency(results.expectedReturns.average.netProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Conversion */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-adr-brown">
        <h4 className="text-lg md:text-xl font-bold text-adr-brown mb-3 md:mb-4">המרת מטבע</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-center">
          <div>
            <p className="text-adr-light-brown text-xs md:text-sm mb-2">שער חליפין</p>
            <p className="text-xl md:text-2xl font-bold text-adr-brown">
              1$ = ₪{results.currencyConversion.usdToIls}
            </p>
          </div>
          <div>
            <p className="text-adr-light-brown text-xs md:text-sm mb-2">השקעה בדולרים</p>
            <p className="text-xl md:text-2xl font-bold text-adr-brown">
              {formatCurrency(results.totalInvestment)}
            </p>
          </div>
          <div>
            <p className="text-adr-light-brown text-xs md:text-sm mb-2">השקעה בשקלים</p>
            <p className="text-xl md:text-2xl font-bold text-adr-brown">
              {formatCurrency(results.totalInvestment * results.currencyConversion.usdToIls, 'ILS')}
            </p>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="text-center">
        <button
          onClick={handleExportPDF}
          className="btn-primary flex items-center mx-auto space-x-2 space-x-reverse"
        >
          <Download className="w-5 h-5" />
          <span>ייצא ל-PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
