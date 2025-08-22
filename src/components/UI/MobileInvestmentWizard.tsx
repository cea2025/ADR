import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MobileBreadcrumb from './MobileBreadcrumb';
import TouchButton from './TouchButton';

interface Step {
  id: number;
  title: string;
  component: React.ComponentType<any>;
}

interface MobileInvestmentWizardProps {
  steps: Step[];
  initialData?: any;
  onComplete: (data: any) => void;
}

const MobileInvestmentWizard: React.FC<MobileInvestmentWizardProps> = ({ 
  steps, 
  initialData = {}, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    onComplete(formData);
  };
  
  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };
  
  const currentStepData = steps.find(s => s.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;
  
  if (!currentStepData) return null;
  
  const StepComponent = currentStepData.component;
  
  return (
    <div className="md:hidden">
      {/* Breadcrumb */}
      <MobileBreadcrumb 
        steps={steps.map(s => s.title)} 
        currentStep={currentStep} 
      />
      
      {/* Step Content */}
      <div className="px-4 pb-20">
        <StepComponent 
          data={formData} 
          onChange={updateFormData}
        />
      </div>
      
      {/* Navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
        <div className="flex space-x-3 rtl:space-x-reverse">
          {!isFirstStep && (
            <TouchButton 
              variant="secondary" 
              onClick={handlePrev}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <ChevronRight className="w-4 h-4" />
              <span>הקודם</span>
            </TouchButton>
          )}
          
          <TouchButton 
            onClick={isLastStep ? handleComplete : handleNext}
            className={`flex items-center space-x-2 space-x-reverse ${!isFirstStep ? 'flex-1' : 'w-full'}`}
          >
            <span>{isLastStep ? 'חשב תוצאות' : 'הבא'}</span>
            {!isLastStep && <ChevronLeft className="w-4 h-4" />}
          </TouchButton>
        </div>
      </div>
    </div>
  );
};

export default MobileInvestmentWizard;
