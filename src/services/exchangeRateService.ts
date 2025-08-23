interface ExchangeRateResponse {
  rates: {
    ILS: number;
  };
  date: string;
}

interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
  source: 'api' | 'manual';
}

class ExchangeRateService {
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
  private readonly FALLBACK_API = 'https://api.fxapi.com/fx/latest?api_key=fxapi-demo&currencies=ILS&base=USD';
  private readonly STORAGE_KEY = 'adr-exchange-rate';
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  private defaultRate = 3.7; // Default fallback rate

  async getCurrentRate(): Promise<ExchangeRateData> {
    try {
      // Try to get cached rate first
      const cached = this.getCachedRate();
      if (cached && this.isRateValid(cached)) {
        return cached;
      }

      // Try to fetch from API
      const apiRate = await this.fetchFromAPI();
      if (apiRate) {
        this.saveToStorage(apiRate);
        return apiRate;
      }

      // Return cached even if expired, or default
      return cached || this.getDefaultRate();
    } catch (error) {
      console.warn('Failed to get exchange rate:', error);
      const cached = this.getCachedRate();
      return cached || this.getDefaultRate();
    }
  }

  private async fetchFromAPI(): Promise<ExchangeRateData | null> {
    try {
      // Try primary API
      const response = await fetch(this.API_URL);
      if (response.ok) {
        const data: ExchangeRateResponse = await response.json();
        if (data.rates?.ILS) {
          return {
            rate: data.rates.ILS,
            lastUpdated: new Date().toISOString(),
            source: 'api'
          };
        }
      }
    } catch (error) {
      console.warn('Primary API failed, trying fallback:', error);
    }

    try {
      // Try fallback API
      const response = await fetch(this.FALLBACK_API);
      if (response.ok) {
        const data = await response.json();
        if (data.rates?.ILS) {
          return {
            rate: data.rates.ILS,
            lastUpdated: new Date().toISOString(),
            source: 'api'
          };
        }
      }
    } catch (error) {
      console.warn('Fallback API also failed:', error);
    }

    return null;
  }

  private getCachedRate(): ExchangeRateData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private isRateValid(rate: ExchangeRateData): boolean {
    if (!rate.lastUpdated) return false;
    const age = Date.now() - new Date(rate.lastUpdated).getTime();
    return age < this.CACHE_DURATION;
  }

  private saveToStorage(rate: ExchangeRateData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rate));
    } catch (error) {
      console.warn('Failed to save exchange rate to storage:', error);
    }
  }

  private getDefaultRate(): ExchangeRateData {
    return {
      rate: this.defaultRate,
      lastUpdated: new Date().toISOString(),
      source: 'manual'
    };
  }

  setManualRate(rate: number): ExchangeRateData {
    const manualRate: ExchangeRateData = {
      rate,
      lastUpdated: new Date().toISOString(),
      source: 'manual'
    };
    this.saveToStorage(manualRate);
    return manualRate;
  }

  async refreshRate(): Promise<ExchangeRateData> {
    // Force refresh by clearing cache
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getCurrentRate();
  }

  formatRate(rate: number): string {
    return rate.toFixed(4);
  }

  formatLastUpdated(lastUpdated: string): string {
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'עכשיו';
    } else if (diffInMinutes < 60) {
      return `לפני ${diffInMinutes} דקות`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `לפני ${hours} שעות`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `לפני ${days} ימים`;
    }
  }
}

export const exchangeRateService = new ExchangeRateService();
export type { ExchangeRateData };
