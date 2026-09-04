import Sidebar from './Sidebar.jsx';

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <div className="hidden shrink-0 md:block"><Sidebar /></div>
      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto max-w-5xl animate-fade-up">{children}</div>
      </main>
    </div>
  );
}
