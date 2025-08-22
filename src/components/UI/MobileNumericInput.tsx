import { Minus, Plus } from 'lucide-react';

interface MobileNumericInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  error?: string;
  className?: string;
}

const MobileNumericInput: React.FC<MobileNumericInputProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  required = false,
  error,
  className = ''
}) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };
  
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button 
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-3 text-adr-brown hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="הפחת"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="flex-1 text-center py-3 border-0 focus:ring-0 text-lg md:text-base"
        />
        
        <button 
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-3 text-adr-brown hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="הוסף"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      <div className="mt-1 text-xs text-gray-500">
        טווח: {min} - {max}
      </div>
    </div>
  );
};

export default MobileNumericInput;
