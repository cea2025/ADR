import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-adr-cream font-hebrew">
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
