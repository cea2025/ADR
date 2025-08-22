import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeSettlementPolicy } from '../types/policy.types';
import { SAMPLE_POLICIES } from '../constants/policies';

interface PoliciesStore {
  // State
  policies: LifeSettlementPolicy[];
  lastModified: number;
  
  // Actions
  addPolicy: (policy: Omit<LifeSettlementPolicy, 'id'>) => LifeSettlementPolicy;
  updatePolicy: (id: string, updates: Partial<LifeSettlementPolicy>) => void;
  deletePolicy: (id: string) => void;
  resetPolicies: () => void;
  
  // Getters
  getPolicyById: (id: string) => LifeSettlementPolicy | undefined;
  getActivePolicies: () => LifeSettlementPolicy[];
  getPoliciesByCompany: (company: string) => LifeSettlementPolicy[];
  getTotalValue: () => number;
  getAverageAge: () => number;
}

export const usePoliciesStore = create<PoliciesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      policies: SAMPLE_POLICIES,
      lastModified: Date.now(),
      
      // Actions
      addPolicy: (policyData) => {
        const newPolicy: LifeSettlementPolicy = {
          ...policyData,
          id: `policy-${Date.now()}`,
          isActive: policyData.isActive ?? true
        };
        
        set((state) => ({
          policies: [...state.policies, newPolicy],
          lastModified: Date.now()
        }));
        
        return newPolicy;
      },
      
      updatePolicy: (id, updates) => {
        set((state) => ({
          policies: state.policies.map(policy =>
            policy.id === id ? { ...policy, ...updates } : policy
          ),
          lastModified: Date.now()
        }));
      },
      
      deletePolicy: (id) => {
        set((state) => ({
          policies: state.policies.filter(policy => policy.id !== id),
          lastModified: Date.now()
        }));
      },
      
      resetPolicies: () => {
        set({
          policies: SAMPLE_POLICIES,
          lastModified: Date.now()
        });
      },
      
      // Getters
      getPolicyById: (id) => {
        return get().policies.find(policy => policy.id === id);
      },
      
      getActivePolicies: () => {
        return get().policies.filter(policy => policy.isActive !== false);
      },
      
      getPoliciesByCompany: (company) => {
        return get().policies.filter(policy => policy.insuranceCompany === company);
      },
      
      getTotalValue: () => {
        return get().policies.reduce((sum, policy) => sum + policy.purchaseCost, 0);
      },
      
      getAverageAge: () => {
        const policies = get().policies;
        if (policies.length === 0) return 0;
        
        const totalAge = policies.reduce((sum, policy) => {
          const age = typeof policy.age === 'number' 
            ? policy.age 
            : (policy.age.male + policy.age.female) / 2;
          return sum + age;
        }, 0);
        
        return Math.round(totalAge / policies.length);
      }
    }),
    {
      name: 'adr-policies-storage',
      partialize: (state) => ({
        policies: state.policies,
        lastModified: state.lastModified
      })
    }
  )
);
