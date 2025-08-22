import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export const usePerformanceMonitor = () => {
  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        return navigation.loadEventEnd - navigation.loadEventStart;
      }
    }
    return 0;
  }, []);

  const measureFirstPaint = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : 0;
    }
    return 0;
  }, []);

  const measureFirstContentfulPaint = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
    }
    return 0;
  }, []);

  const measureLargestContentfulPaint = useCallback(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry ? lastEntry.startTime : 0);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 5000);
      });
    }
    return Promise.resolve(0);
  }, []);

  const measureCumulativeLayoutShift = useCallback(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      return new Promise<number>((resolve) => {
        let cumulativeLayoutShift = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              cumulativeLayoutShift += layoutShiftEntry.value || 0;
            }
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Measure for 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(cumulativeLayoutShift);
        }, 5000);
      });
    }
    return Promise.resolve(0);
  }, []);

  const getPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const loadTime = measureLoadTime();
    const firstPaint = measureFirstPaint();
    const firstContentfulPaint = measureFirstContentfulPaint();
    const largestContentfulPaint = await measureLargestContentfulPaint();
    const cumulativeLayoutShift = await measureCumulativeLayoutShift();

    return {
      loadTime,
      firstPaint,
      firstContentfulPaint,
      largestContentfulPaint,
      cumulativeLayoutShift
    };
  }, [measureLoadTime, measureFirstPaint, measureFirstContentfulPaint, measureLargestContentfulPaint, measureCumulativeLayoutShift]);

  const logPerformanceMetrics = useCallback(async () => {
    const metrics = await getPerformanceMetrics();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // כאן יהיה שליחה לשרת analytics
      console.log('Performance data sent to analytics:', metrics);
    }
  }, [getPerformanceMetrics]);

  useEffect(() => {
    // Measure performance after component mounts
    const timer = setTimeout(() => {
      logPerformanceMetrics();
    }, 1000);

    return () => clearTimeout(timer);
  }, [logPerformanceMetrics]);

  return {
    getPerformanceMetrics,
    logPerformanceMetrics,
    measureLoadTime,
    measureFirstPaint,
    measureFirstContentfulPaint,
    measureLargestContentfulPaint,
    measureCumulativeLayoutShift
  };
};
