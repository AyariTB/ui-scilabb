import { ReactNode } from 'react';
import TopNavbar from './TopNavbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen antialiased bg-gray-50">
      <TopNavbar />
      <main className="min-h-screen flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
