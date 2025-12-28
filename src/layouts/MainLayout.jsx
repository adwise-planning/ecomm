import React, { useState } from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, BarChart3, Zap, Settings, LogOut, Menu, X, Layers, 
  CreditCard, Sun, Moon, Table, Users
} from 'lucide-react';

const SidebarItem = ({ to, icon, label }) => {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-medium' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!user) return <Navigate to="/login" />;

  // Role Based Access Control Logic
  const isL4 = user.role === 'L4';
  const isL1 = user.role === 'L1';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-200">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <BarChart3 className="fill-current" />
            <span>EcomEZ</span>
          </div>
          <button className="md:hidden ml-auto text-slate-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/orders" icon={Table} label="Tabular View" />
          <SidebarItem to="/analytics" icon={BarChart3} label="RTO Analysis" />
          <SidebarItem to="/recommendations" icon={Zap} label="AI Insights" />
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-8">Management</div>
          <SidebarItem to="/integrations" icon={Layers} label="Integrations" />
          
          {!isL4 && <SidebarItem to="/team" icon={Users} label="Team" />}
          {(isL1 || !isL4) && <SidebarItem to="/billing" icon={CreditCard} label="Billing" />}
          {!isL4 && <SidebarItem to="/settings" icon={Settings} label="Settings" />}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-red-500 w-full transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 transition-colors">
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role} - {user.company}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;