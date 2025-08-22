interface MobileBreadcrumbProps {
  steps: string[];
  currentStep: number;
}

const MobileBreadcrumb: React.FC<MobileBreadcrumbProps> = ({ steps, currentStep }) => (
  <div className="md:hidden bg-gray-50 p-3 mb-4 rounded-lg">
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      <span className="text-sm text-gray-500 whitespace-nowrap">
        שלב {currentStep} מתוך {steps.length}
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-adr-brown h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
    <div className="mt-2">
      <span className="text-sm font-medium text-adr-brown">
        {steps[currentStep - 1]}
      </span>
    </div>
  </div>
);

export default MobileBreadcrumb;
