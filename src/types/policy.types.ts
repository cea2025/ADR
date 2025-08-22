export interface LifeSettlementPolicy {
  id: string;
  name: string; // "פוליסת כוכב", "משה וחנה"
  age: number | { male: number; female: number }; // גיל יחיד או זוג
  coupleType: 'single' | 'couple';
  insuranceCompany: string;
  companyRating: 'A' | 'A+' | 'AA' | 'AA+' | 'AAA';
  faceValue: number; // סכום פדיון (דולר)
  lifeExpectancy: number; // LE בשנים
  openingCost: number; // עלות פתיחת תיק (שקל)
  monthlyManagementFee: number; // דמי ניהול חודשיים (דולר)
  purchaseCost: number; // עלות רכישה ראשונית
  monthlyPremium: number; // פרמיה חודשית (דולר)
  managementDiscount?: number; // הנחת דמי ניהול (סכום קבוע)
  openingDiscount?: number; // הנחת פתיחת תיק (סכום קבוע)
  isActive?: boolean; // האם הפוליסה פעילה
}

export interface InvestmentSelection {
  policyId: string;
  units: number; // כמות יחידות
}

export interface CalculationInput {
  selectedPolicies: InvestmentSelection[];
  leCalculationMethod: 'highest' | 'average' | 'actual'; // LE הגבוה/ממוצע/אמיתי
  includeCostsInReturn: {
    managementFees: boolean;
    openingCosts: boolean;
  };
  exchangeRate?: number; // שער דולר ידני
}

export interface PolicyReturn {
  totalReturn: number; // סכום כספי דולר
  netProfit: number;
  annualizedReturn: number; // ריבית באחוזים לשנה
  compoundReturn: number; // ריבית דריבית לשנה
  totalReturnPercentage: number; // אחוזים לכל התקופה
  timeToMaturity: number; // שנים עד פקיעה
}

export interface AnnualReturn {
  year: number;
  cumulativeReturn: number;
  annualReturn: number;
  withCompounding: number;
  withoutCompounding: number;
}

export interface CalculationResults {
  totalPurchaseCost: number;
  totalManagementFees: number;
  totalOpeningCosts: number;
  expectedReturns: {
    individual: PolicyReturn[]; // תשואה לכל פוליסה
    average: PolicyReturn; // ממוצע כל הפוליסות
    actual: PolicyReturn; // לפי LE אמיתי (מנהלים בלבד)
  };
  annualBreakdown: AnnualReturn[]; // פירוט שנתי
  currencyConversion: {
    usdToIls: number;
    totalInILS: number;
  };
}
