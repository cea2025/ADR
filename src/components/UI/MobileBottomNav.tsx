import { useState } from 'react';
import { Calculator, TrendingUp, History, Settings } from 'lucide-react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 transition-colors ${
      active 
        ? 'text-adr-brown bg-adr-cream' 
        : 'text-adr-light-brown hover:text-adr-brown'
    }`}
  >
    <div className="w-6 h-6 mb-1">
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const MobileBottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        <NavButton 
          icon={<Calculator className="w-5 h-5" />} 
          label="מחשבון" 
          active={activeTab === 'calculator'}
          onClick={() => setActiveTab('calculator')}
        />
        <NavButton 
          icon={<TrendingUp className="w-5 h-5" />} 
          label="תוצאות" 
          active={activeTab === 'results'}
          onClick={() => setActiveTab('results')}
        />
        <NavButton 
          icon={<History className="w-5 h-5" />} 
          label="היסטוריה" 
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        />
        <NavButton 
          icon={<Settings className="w-5 h-5" />} 
          label="הגדרות" 
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>
    </div>
  );
};

export default MobileBottomNav;
