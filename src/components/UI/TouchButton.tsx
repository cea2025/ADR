import { ReactNode } from 'react';

interface TouchButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const TouchButton: React.FC<TouchButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseClasses = "touch-button font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-adr-light-brown to-adr-bronze text-white hover:from-adr-bronze hover:to-adr-light-brown",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-adr-brown text-adr-brown hover:bg-adr-brown hover:text-white"
  };
  
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default TouchButton;
