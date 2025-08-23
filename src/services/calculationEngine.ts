import { 
  LifeSettlementPolicy, 
  InvestmentSelection, 
  CalculationInput, 
  CalculationResults, 
  PolicyReturn, 
  AnnualReturn 
} from '../types/policy.types';

export class CalculationEngine {
  
  /**
   * חישוב תשואות עבור פוליסת Life Settlement יחידה
   */
  static calculatePolicyReturn(
    policy: LifeSettlementPolicy, 
    units: number, 
    leMethod: 'highest' | 'average' | 'actual',
    includeCosts: { managementFees: boolean; openingCosts: boolean },
    exchangeRate: number
  ): PolicyReturn {
    
    // חישוב עלויות בסיסיות
    const totalPurchaseCost = policy.purchaseCost * units;
    const totalFaceValue = policy.faceValue * units;
    
    // חישוב תוחלת חיים לפי השיטה
    let adjustedLE = policy.lifeExpectancy;
    switch (leMethod) {
      case 'highest':
        adjustedLE = policy.lifeExpectancy * 1.2; // 20% יותר זמן
        break;
      case 'average':
        adjustedLE = policy.lifeExpectancy;
        break;
      case 'actual':
        adjustedLE = policy.lifeExpectancy * 0.9; // 10% פחות זמן (נתונים אמיתיים)
        break;
    }
    
    // חישוב עלויות נוספות
    const monthsToMaturity = adjustedLE * 12;
    const totalMonthlyPremiums = policy.monthlyPremium * units * monthsToMaturity;
    
    let totalManagementFees = 0;
    let totalOpeningCosts = 0;
    
    if (includeCosts.managementFees) {
      totalManagementFees = policy.monthlyManagementFee * units * monthsToMaturity;
      // הפחתת הנחות ניהול
      if (policy.managementDiscount) {
        totalManagementFees -= policy.managementDiscount * units;
      }
    }
    
    if (includeCosts.openingCosts) {
      totalOpeningCosts = (policy.openingCost * units) / exchangeRate; // המרה לדולר
      // הפחתת הנחות פתיחה
      if (policy.openingDiscount) {
        totalOpeningCosts -= (policy.openingDiscount * units) / exchangeRate;
      }
    }
    
    // חישוב עלות כוללת
    const totalCosts = totalPurchaseCost + totalMonthlyPremiums + totalManagementFees + totalOpeningCosts;
    
    // חישוב רווח נטו
    const netProfit = totalFaceValue - totalCosts;
    
    // חישוב תשואה שנתית
    const annualizedReturn = (Math.pow(totalFaceValue / totalCosts, 1 / adjustedLE) - 1) * 100;
    
    // חישוב ריבית דריבית
    const compoundReturn = (Math.pow(1 + (annualizedReturn / 100), adjustedLE) - 1) * 100;
    
    // חישוב אחוז תשואה כוללת
    const totalReturnPercentage = ((totalFaceValue - totalCosts) / totalCosts) * 100;
    
    return {
      totalReturn: totalFaceValue,
      netProfit,
      annualizedReturn,
      compoundReturn,
      totalReturnPercentage,
      timeToMaturity: adjustedLE
    };
  }
  
  /**
   * חישוב מפורט לכל הפוליסות הנבחרות
   */
  static calculatePortfolioReturns(
    policies: LifeSettlementPolicy[],
    selectedPolicies: InvestmentSelection[],
    calculationInput: CalculationInput
  ): CalculationResults {
    
    const { leCalculationMethod, includeCostsInReturn, exchangeRate = 3.7 } = calculationInput;
    
    // חישוב תשואות לכל פוליסה בנפרד
    const individualReturns: PolicyReturn[] = selectedPolicies.map(selection => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) {
        throw new Error(`Policy not found: ${selection.policyId}`);
      }
      
      return this.calculatePolicyReturn(
        policy, 
        selection.units, 
        leCalculationMethod, 
        includeCostsInReturn, 
        exchangeRate
      );
    });
    
    // חישוב סיכומים - עלות רכישה בלבד
    const totalPurchaseCost = selectedPolicies.reduce((sum, selection) => {
      const policy = policies.find(p => p.id === selection.policyId);
      return sum + (policy?.purchaseCost || 0) * selection.units;
    }, 0);
    
    // חישוב פרמיות חודשיות לכל הפוליסות
    const totalMonthlyPremiums = selectedPolicies.reduce((sum, selection) => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) return sum;
      
      const adjustedLE = this.getAdjustedLE(policy.lifeExpectancy, leCalculationMethod);
      const monthsToMaturity = adjustedLE * 12;
      const premiums = policy.monthlyPremium * selection.units * monthsToMaturity;
      
      return sum + premiums;
    }, 0);
    
    const totalManagementFees = includeCostsInReturn.managementFees 
      ? selectedPolicies.reduce((sum, selection) => {
          const policy = policies.find(p => p.id === selection.policyId);
          if (!policy) return sum;
          
          const adjustedLE = this.getAdjustedLE(policy.lifeExpectancy, leCalculationMethod);
          const monthsToMaturity = adjustedLE * 12;
          let fees = policy.monthlyManagementFee * selection.units * monthsToMaturity;
          
          if (policy.managementDiscount) {
            fees -= policy.managementDiscount * selection.units;
          }
          
          return sum + fees;
        }, 0)
      : 0;
    
    const totalOpeningCosts = includeCostsInReturn.openingCosts
      ? selectedPolicies.reduce((sum, selection) => {
          const policy = policies.find(p => p.id === selection.policyId);
          if (!policy) return sum;
          
          let costs = (policy.openingCost * selection.units) / exchangeRate;
          
          if (policy.openingDiscount) {
            costs -= (policy.openingDiscount * selection.units) / exchangeRate;
          }
          
          return sum + costs;
        }, 0)
      : 0;
    
    // חישוב עלות חודשית (פרמיות + דמי ניהול)
    const monthlyCost = selectedPolicies.reduce((sum, selection) => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) return sum;
      
      const monthlyPremium = policy.monthlyPremium * selection.units;
      const monthlyManagement = includeCostsInReturn.managementFees 
        ? policy.monthlyManagementFee * selection.units 
        : 0;
      
      return sum + monthlyPremium + monthlyManagement;
    }, 0);

    // חישוב ממוצעים משוקללים - כולל את כל העלויות
    const totalInvestment = totalPurchaseCost + totalMonthlyPremiums + totalManagementFees + totalOpeningCosts;
    const totalFaceValue = individualReturns.reduce((sum, ret) => sum + ret.totalReturn, 0);
    const totalNetProfit = individualReturns.reduce((sum, ret) => sum + ret.netProfit, 0);
    
    // ממוצע משוקלל של תוחלת חיים
    const weightedAverageLE = selectedPolicies.reduce((sum, selection) => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) return sum;
      
      const weight = (policy.purchaseCost * selection.units) / totalPurchaseCost;
      const adjustedLE = this.getAdjustedLE(policy.lifeExpectancy, leCalculationMethod);
      
      return sum + (adjustedLE * weight);
    }, 0);
    
    const averageReturn: PolicyReturn = {
      totalReturn: totalFaceValue,
      netProfit: totalNetProfit,
      annualizedReturn: (Math.pow(totalFaceValue / totalInvestment, 1 / weightedAverageLE) - 1) * 100,
      compoundReturn: (Math.pow(1 + ((totalNetProfit / totalInvestment) / weightedAverageLE), weightedAverageLE) - 1) * 100,
      totalReturnPercentage: (totalNetProfit / totalInvestment) * 100,
      timeToMaturity: weightedAverageLE
    };
    
    // חישוב פירוט שנתי
    const annualBreakdown: AnnualReturn[] = [];
    for (let year = 1; year <= Math.ceil(weightedAverageLE); year++) {
      const yearlyReturn = totalInvestment * (averageReturn.annualizedReturn / 100);
      const cumulativeReturn = yearlyReturn * year;
      const withCompounding = totalInvestment * Math.pow(1 + (averageReturn.annualizedReturn / 100), year) - totalInvestment;
      
      annualBreakdown.push({
        year,
        cumulativeReturn,
        annualReturn: yearlyReturn,
        withCompounding,
        withoutCompounding: yearlyReturn
      });
    }
    
    return {
      totalPurchaseCost,
      totalMonthlyPremiums,
      totalManagementFees,
      totalOpeningCosts,
      totalInvestment,
      monthlyCost, // עלות חודשית כוללת
      expectedReturns: {
        individual: individualReturns,
        average: averageReturn,
        actual: averageReturn // בגרסה זו זהה לממוצע
      },
      annualBreakdown,
      currencyConversion: {
        usdToIls: exchangeRate,
        totalInILS: totalFaceValue * exchangeRate
      }
    };
  }
  
  /**
   * חישוב תוחלת חיים מותאמת לפי השיטה
   */
  private static getAdjustedLE(baseLE: number, method: 'highest' | 'average' | 'actual'): number {
    switch (method) {
      case 'highest':
        return baseLE * 1.2;
      case 'average':
        return baseLE;
      case 'actual':
        return baseLE * 0.9;
      default:
        return baseLE;
    }
  }
  
  /**
   * בדיקת תקינות נתוני חישוב
   */
  static validateCalculationInput(
    policies: LifeSettlementPolicy[],
    selectedPolicies: InvestmentSelection[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (selectedPolicies.length === 0) {
      errors.push('יש לבחור לפחות פוליסה אחת');
    }
    
    if (selectedPolicies.length > 10) {
      errors.push('ניתן לבחור עד 10 פוליסות בלבד');
    }
    
    selectedPolicies.forEach(selection => {
      const policy = policies.find(p => p.id === selection.policyId);
      
      if (!policy) {
        errors.push(`פוליסה לא נמצאה: ${selection.policyId}`);
        return;
      }
      
      if (selection.units <= 0 || selection.units > 10) {
        errors.push(`כמות יחידות לא תקינה עבור ${policy.name}: ${selection.units}`);
      }
      
      if (policy.purchaseCost <= 0) {
        errors.push(`עלות רכישה לא תקינה עבור ${policy.name}`);
      }
      
      if (policy.faceValue <= policy.purchaseCost) {
        errors.push(`ערך נקוב קטן מעלות הרכישה עבור ${policy.name}`);
      }
      
      if (policy.lifeExpectancy <= 0 || policy.lifeExpectancy > 50) {
        errors.push(`תוחלת חיים לא תקינה עבור ${policy.name}: ${policy.lifeExpectancy}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * חישוב סיכון השקעה
   */
  static calculateRiskMetrics(
    policies: LifeSettlementPolicy[],
    selectedPolicies: InvestmentSelection[]
  ) {

    
    // חישוב פיזור גילאים
    const ages = selectedPolicies.map(selection => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) return 0;
      
      return typeof policy.age === 'number' ? policy.age : (policy.age.male + policy.age.female) / 2;
    });
    
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
    const ageVariance = ages.reduce((sum, age) => sum + Math.pow(age - averageAge, 2), 0) / ages.length;
    const ageStandardDeviation = Math.sqrt(ageVariance);
    
    // חישוב פיזור חברות
    const companies = selectedPolicies.map(selection => {
      const policy = policies.find(p => p.id === selection.policyId);
      return policy?.insuranceCompany || '';
    });
    
    const uniqueCompanies = new Set(companies).size;
    const diversificationRatio = uniqueCompanies / selectedPolicies.length;
    
    // ציון סיכון (1-10, כאשר 1 = סיכון נמוך)
    let riskScore = 5; // ציון בסיס
    
    // התאמת ציון לפי גיל
    if (averageAge > 85) riskScore -= 2; // גיל גבוה = סיכון נמוך יותר
    else if (averageAge < 70) riskScore += 2; // גיל נמוך = סיכון גבוה יותר
    
    // התאמת ציון לפי פיזור
    if (ageStandardDeviation > 5) riskScore += 1; // פיזור גדול = סיכון גבוה יותר
    if (diversificationRatio < 0.5) riskScore += 1; // ריכוז חברות = סיכון גבוה יותר
    
    // חישוב דירוגי חברות
    const avgRating = selectedPolicies.reduce((sum, selection) => {
      const policy = policies.find(p => p.id === selection.policyId);
      if (!policy) return sum;
      
      const ratingValues = { 'A': 1, 'A+': 2, 'AA': 3, 'AA+': 4, 'AAA': 5 };
      return sum + (ratingValues[policy.companyRating] || 1);
    }, 0) / selectedPolicies.length;
    
    if (avgRating < 2.5) riskScore += 1; // דירוג נמוך = סיכון גבוה יותר
    
    riskScore = Math.max(1, Math.min(10, riskScore)); // הגבלה ל-1-10
    
    return {
      riskScore,
      averageAge,
      ageStandardDeviation,
      diversificationRatio,
      averageRating: avgRating,
      recommendedAction: riskScore <= 4 ? 'השקעה מומלצת' : 
                        riskScore <= 7 ? 'השקעה זהירה' : 'השקעה מסוכנת'
    };
  }
}

/**
 * פונקציה ראשית לחישוב תשואות
 */
export const calculateReturns = (
  policies: LifeSettlementPolicy[],
  calculationInput: CalculationInput
): CalculationResults => {
  
  // בדיקת תקינות
  const validation = CalculationEngine.validateCalculationInput(policies, calculationInput.selectedPolicies);
  if (!validation.isValid) {
    throw new Error(`שגיאות בנתונים: ${validation.errors.join(', ')}`);
  }
  
  return CalculationEngine.calculatePortfolioReturns(
    policies, 
    calculationInput.selectedPolicies, 
    calculationInput
  );
};
