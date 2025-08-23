import { useState, useEffect, useCallback } from 'react';
import { exchangeRateService, ExchangeRateData } from '../services/exchangeRateService';

interface UseExchangeRateReturn {
  exchangeRate: ExchangeRateData | null;
  isLoading: boolean;
  isError: boolean;
  refreshRate: () => Promise<void>;
  setManualRate: (rate: number) => void;
  formatRate: (rate: number) => string;
  formatLastUpdated: (lastUpdated: string) => string;
}

export const useExchangeRate = (): UseExchangeRateReturn => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadExchangeRate = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const rate = await exchangeRateService.getCurrentRate();
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to load exchange rate:', error);
      setIsError(true);
      // Set default rate on error
      setExchangeRate({
        rate: 3.7,
        lastUpdated: new Date().toISOString(),
        source: 'manual'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshRate = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const rate = await exchangeRateService.refreshRate();
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to refresh exchange rate:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setManualRate = useCallback((rate: number) => {
    try {
      const manualRate = exchangeRateService.setManualRate(rate);
      setExchangeRate(manualRate);
      setIsError(false);
    } catch (error) {
      console.error('Failed to set manual rate:', error);
      setIsError(true);
    }
  }, []);

  const formatRate = useCallback((rate: number) => {
    return exchangeRateService.formatRate(rate);
  }, []);

  const formatLastUpdated = useCallback((lastUpdated: string) => {
    return exchangeRateService.formatLastUpdated(lastUpdated);
  }, []);

  useEffect(() => {
    loadExchangeRate();
  }, [loadExchangeRate]);

  return {
    exchangeRate,
    isLoading,
    isError,
    refreshRate,
    setManualRate,
    formatRate,
    formatLastUpdated
  };
};
