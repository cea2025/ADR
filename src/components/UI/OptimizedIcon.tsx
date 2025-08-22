import { useMemo } from 'react';
import { 
  Box, 
  DollarSign, 
  Calendar, 
  Building2, 
  Star, 
  TrendingUp, 
  Calculator, 
  Settings,
  Menu,
  X,
  Plus,
  Minus,
  RefreshCw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface OptimizedIconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconMap = {
  Box,
  DollarSign,
  Calendar,
  Building2,
  Star,
  TrendingUp,
  Calculator,
  Settings,
  Menu,
  X,
  Plus,
  Minus,
  RefreshCw,
  ChevronRight,
  ChevronLeft
};

const OptimizedIcon: React.FC<OptimizedIconProps> = ({ 
  name, 
  className = '', 
  size = 24 
}) => {
  const IconComponent = useMemo(() => {
    return iconMap[name as keyof typeof iconMap];
  }, [name]);
  
  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return <div className={`w-${size} h-${size} bg-gray-300 rounded`} />;
  }
  
  return (
    <IconComponent 
      className={className} 
      size={size}
    />
  );
};

export default OptimizedIcon;
