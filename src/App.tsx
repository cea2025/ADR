import { lazy, Suspense } from 'react';
import Layout from './components/UI/Layout'
import Header from './components/UI/Header'
import MobileBottomNav from './components/UI/MobileBottomNav'
import PullToRefresh from './components/UI/PullToRefresh'
import ErrorBoundary from './components/UI/ErrorBoundary'
import UpdateNotification from './components/UI/UpdateNotification'
import OfflineIndicator from './components/UI/OfflineIndicator'
import SkipLink from './components/UI/SkipLink'
import AccessibilitySettings from './components/UI/AccessibilitySettings'
import { AccessibilityProvider } from './components/UI/AccessibilityProvider'
import { CalculatorProvider } from './hooks/useCalculator'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'

// Lazy loading לקומפוננטות כבדות
const Calculator = lazy(() => import('./components/Calculator'));

function App() {
  // Performance monitoring
  usePerformanceMonitor();
  
  const handleRefresh = async () => {
    // כאן יהיה רענון שער חליפין או נתונים אחרים
    console.log('Refreshing...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // סימולציה
  };

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <CalculatorProvider>
          <Layout>
            <SkipLink />
            <UpdateNotification />
            <OfflineIndicator />
            <Header />
            <PullToRefresh onRefresh={handleRefresh}>
              <main id="main-content" className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adr-brown"></div>
                  </div>
                }>
                  <Calculator />
                </Suspense>
              </main>
            </PullToRefresh>
            <MobileBottomNav />
            <AccessibilitySettings />
          </Layout>
        </CalculatorProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  )
}

export default App
