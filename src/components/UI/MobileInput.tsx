import { ReactNode } from 'react';

interface MobileInputProps {
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

const MobileInput: React.FC<MobileInputProps> = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  icon,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-adr-brown focus:border-transparent
            text-lg md:text-base transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default MobileInput;
