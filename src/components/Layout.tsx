import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Truck, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Home },
  { path: '/resident', label: '居民', icon: Users },
  { path: '/collector', label: '回收员', icon: Truck },
  { path: '/admin', label: '管理员', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-forest flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-amber rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">回</span>
            </div>
            <span className="text-white font-bold text-lg">回收估价</span>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                    : 'text-forest-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-forest-200/50 text-xs text-center">本地存储 · 无需联网</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-forest-50 scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
