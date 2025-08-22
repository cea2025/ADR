import { LifeSettlementPolicy } from '../types/policy.types';

export const SAMPLE_POLICIES: LifeSettlementPolicy[] = [
  {
    id: 'policy-1',
    name: 'פוליסת כוכב',
    age: 78,
    coupleType: 'single',
    insuranceCompany: 'AIG',
    companyRating: 'AA',
    faceValue: 50000,
    lifeExpectancy: 8,
    openingCost: 500,
    monthlyManagementFee: 150,
    purchaseCost: 12000,
    monthlyPremium: 200
  },
  {
    id: 'policy-2',
    name: 'משה וחנה',
    age: { male: 82, female: 79 },
    coupleType: 'couple',
    insuranceCompany: 'MetLife',
    companyRating: 'A+',
    faceValue: 75000,
    lifeExpectancy: 12,
    openingCost: 750,
    monthlyManagementFee: 200,
    purchaseCost: 18000,
    monthlyPremium: 250
  },
  {
    id: 'policy-3',
    name: 'פוליסת יהלום',
    age: 75,
    coupleType: 'single',
    insuranceCompany: 'Prudential',
    companyRating: 'AAA',
    faceValue: 100000,
    lifeExpectancy: 10,
    openingCost: 1000,
    monthlyManagementFee: 300,
    purchaseCost: 25000,
    monthlyPremium: 400
  },
  {
    id: 'policy-4',
    name: 'פוליסת זהב',
    age: 80,
    coupleType: 'single',
    insuranceCompany: 'New York Life',
    companyRating: 'AA+',
    faceValue: 60000,
    lifeExpectancy: 7,
    openingCost: 600,
    monthlyManagementFee: 180,
    purchaseCost: 15000,
    monthlyPremium: 220
  },
  {
    id: 'policy-5',
    name: 'פוליסת כסף',
    age: { male: 85, female: 83 },
    coupleType: 'couple',
    insuranceCompany: 'Guardian',
    companyRating: 'A',
    faceValue: 45000,
    lifeExpectancy: 9,
    openingCost: 450,
    monthlyManagementFee: 120,
    purchaseCost: 11000,
    monthlyPremium: 180
  }
];

export const COMPANY_RATINGS = ['A', 'A+', 'AA', 'AA+', 'AAA'] as const;

export const MAX_UNITS_PER_POLICY = 10;
export const MAX_TOTAL_POLICIES = 10;

export const DEFAULT_EXCHANGE_RATE = 3.65; // USD to ILS
export const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.io/v4/latest/USD';
