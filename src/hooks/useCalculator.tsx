import { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  LifeSettlementPolicy, 
  InvestmentSelection
} from '../types/policy.types';
import { UserType } from '../types/user.types';
import { DEFAULT_EXCHANGE_RATE } from '../constants/policies';
import { usePoliciesStore } from './usePoliciesStore';

interface CalculatorStore {
  // State
  selectedPolicies: InvestmentSelection[];
  userType: UserType;
  exchangeRate: number;
  
  // Actions
  addPolicy: (policy: InvestmentSelection) => void;
  removePolicy: (policyId: string) => void;
  updatePolicyUnits: (policyId: string, units: number) => void;
  setUserType: (type: UserType) => void;
  setExchangeRate: (rate: number) => void;
  clearSelection: () => void;
  
  // Computed
  getSelectedPoliciesData: () => LifeSettlementPolicy[];
  getTotalInvestment: () => number;
}

const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedPolicies: [],
      userType: 'website',
      exchangeRate: DEFAULT_EXCHANGE_RATE,
      
      // Actions
      addPolicy: (policy) => {
        const { selectedPolicies } = get();
        const exists = selectedPolicies.find(p => p.policyId === policy.policyId);
        
        if (exists) {
          set({
            selectedPolicies: selectedPolicies.map(p => 
              p.policyId === policy.policyId 
                ? { ...p, units: Math.min(p.units + policy.units, 10) }
                : p
            )
          });
        } else {
          set({
            selectedPolicies: [...selectedPolicies, policy]
          });
        }
      },
      
      removePolicy: (policyId) => {
        set({
          selectedPolicies: get().selectedPolicies.filter(p => p.policyId !== policyId)
        });
      },
      
      updatePolicyUnits: (policyId, units) => {
        set({
          selectedPolicies: get().selectedPolicies.map(p => 
            p.policyId === policyId ? { ...p, units } : p
          )
        });
      },
      
      setUserType: (type) => set({ userType: type }),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
      
      clearSelection: () => set({ selectedPolicies: [] }),
      
      // Computed
      getSelectedPoliciesData: () => {
        const { selectedPolicies } = get();
        const policiesStore = usePoliciesStore.getState();
        return selectedPolicies.map(selection => {
          const policy = policiesStore.policies.find(p => p.id === selection.policyId);
          return policy!;
        }).filter(Boolean);
      },
      
      getTotalInvestment: () => {
        const { selectedPolicies } = get();
        const policiesStore = usePoliciesStore.getState();
        return selectedPolicies.reduce((total, selection) => {
          const policy = policiesStore.policies.find(p => p.id === selection.policyId);
          return total + (policy?.purchaseCost || 0) * selection.units;
        }, 0);
      }
    }),
    {
      name: 'adr-calculator-storage',
      partialize: (state) => ({
        selectedPolicies: state.selectedPolicies,
        userType: state.userType,
        exchangeRate: state.exchangeRate
      })
    }
  )
);

// Context for React components
const CalculatorContext = createContext<CalculatorStore | null>(null);

export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useCalculatorStore();
  return (
    <CalculatorContext.Provider value={store}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
};
