import Sidebar from './Sidebar.jsx';
import Logo from '../../assets/Logo.jsx';

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FBFBFA]">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Logo */}
        <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white border-b border-dark-100 shadow-2xs sticky top-0 z-20">
          <Logo />
        </header>

        {/* Main Content Viewport */}
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
