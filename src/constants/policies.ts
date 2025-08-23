import { LifeSettlementPolicy } from '../types/policy.types';

export const SAMPLE_POLICIES: LifeSettlementPolicy[] = [
  {
    id: 'policy-1',
    name: 'פוליסת כוכב',
    policyType: 'Universal Life',
    age: 78,
    coupleType: 'single',
    insuranceCompany: 'AIG',
    companyRating: 'AA',
    faceValue: 50000,
    lifeExpectancy: 8,
    openingCost: 2000, // שקלים
    monthlyManagementFee: 12, // דולר
    purchaseCost: 12000,
    monthlyPremium: 54 // דולר
  },
  {
    id: 'policy-2',
    name: 'משה וחנה',
    policyType: 'Whole Life',
    age: { male: 82, female: 79 },
    coupleType: 'couple',
    insuranceCompany: 'MetLife',
    companyRating: 'A+',
    faceValue: 75000,
    lifeExpectancy: 12,
    openingCost: 2000, // שקלים
    monthlyManagementFee: 12, // דולר
    purchaseCost: 18000,
    monthlyPremium: 84 // דולר
  },
  {
    id: 'policy-3',
    name: 'פוליסת יהלום',
    policyType: 'Term Life',
    age: 75,
    coupleType: 'single',
    insuranceCompany: 'Prudential',
    companyRating: 'AAA',
    faceValue: 100000,
    lifeExpectancy: 10,
    openingCost: 2000, // שקלים
    monthlyManagementFee: 12, // דולר
    purchaseCost: 25000,
    monthlyPremium: 120 // דולר
  },
  {
    id: 'policy-4',
    name: 'פוליסת זהב',
    policyType: 'Universal Life',
    age: 80,
    coupleType: 'single',
    insuranceCompany: 'New York Life',
    companyRating: 'AA+',
    faceValue: 60000,
    lifeExpectancy: 7,
    openingCost: 2000, // שקלים
    monthlyManagementFee: 12, // דולר
    purchaseCost: 15000,
    monthlyPremium: 72 // דולר
  },
  {
    id: 'policy-5',
    name: 'פוליסת כסף',
    policyType: 'Whole Life',
    age: { male: 85, female: 83 },
    coupleType: 'couple',
    insuranceCompany: 'Guardian',
    companyRating: 'A',
    faceValue: 45000,
    lifeExpectancy: 9,
    openingCost: 2000, // שקלים
    monthlyManagementFee: 12, // דולר
    purchaseCost: 11000,
    monthlyPremium: 45 // דולר
  }
];

export const COMPANY_RATINGS = ['A', 'A+', 'AA', 'AA+', 'AAA'] as const;

export const POLICY_TYPES = [
  'Term Life',
  'Whole Life', 
  'Universal Life',
  'Variable Life',
  'Variable Universal Life'
] as const;

export const MAX_UNITS_PER_POLICY = 10;
export const MAX_TOTAL_POLICIES = 10;

export const DEFAULT_EXCHANGE_RATE = 3.65; // USD to ILS
export const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.io/v4/latest/USD';
