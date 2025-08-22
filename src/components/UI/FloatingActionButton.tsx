import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  className = '' 
}) => (
  <div className={`md:hidden fixed bottom-20 right-4 z-40 ${className}`}>
    <button 
      onClick={onClick}
      className="w-14 h-14 bg-adr-brown rounded-full shadow-lg flex items-center justify-center hover:bg-adr-light-brown transition-colors active:scale-95"
      aria-label="הוסף פוליסה"
    >
      <Plus className="w-6 h-6 text-white" />
    </button>
  </div>
);

export default FloatingActionButton;
