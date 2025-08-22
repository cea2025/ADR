import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useCalculator } from '../../hooks/useCalculator';
import { UserType } from '../../types/user.types';

const Header: React.FC = () => {
  const { userType, setUserType } = useCalculator();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userTypes: { value: UserType; label: string }[] = [
    { value: 'website', label: 'אתר' },
    { value: 'representative', label: 'נציג' },
    { value: 'manager', label: 'מנהל' }
  ];

  return (
    <header className="bg-adr-brown text-white shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 md:space-x-4 space-x-reverse">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-adr-gold rounded-lg flex items-center justify-center">
              <span className="text-adr-brown text-xl md:text-2xl font-bold">ADR</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-2xl font-bold">מחשבון Life Settlements</h1>
              <p className="text-adr-gold text-xs md:text-sm">חברת ADR - השקעות מתקדמות</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">ADR Calculator</h1>
            </div>
          </div>

          {/* Desktop User Type Selector */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <label className="text-adr-gold text-sm font-medium">סוג משתמש:</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="bg-adr-light-brown text-white px-3 py-2 rounded-lg border border-adr-gold focus:ring-2 focus:ring-adr-gold focus:border-transparent"
            >
              {userTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-adr-gold hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="תפריט ניווט"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-adr-gold pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-adr-gold text-sm font-medium mb-2">סוג משתמש:</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-full bg-adr-light-brown text-white px-3 py-3 rounded-lg border border-adr-gold focus:ring-2 focus:ring-adr-gold focus:border-transparent"
                >
                  {userTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-center">
                <p className="text-adr-gold text-sm">
                  משתמש נוכחי: <span className="text-white font-medium">{userTypes.find(t => t.value === userType)?.label}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
