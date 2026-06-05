import { useNavigate } from 'react-router-dom';
import { Users, Truck, Settings, Recycle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const roles = [
    {
      title: '居民入口',
      subtitle: '选择品类 · 填写成色 · 获取估价',
      icon: Users,
      path: '/resident',
      gradient: 'from-forest to-forest-light',
      hoverShadow: 'hover:shadow-forest-light/40',
    },
    {
      title: '回收员入口',
      subtitle: '查看估价 · 管理预约 · 处理回收',
      icon: Truck,
      path: '/collector',
      gradient: 'from-forest-light to-emerald-600',
      hoverShadow: 'hover:shadow-emerald-500/40',
    },
    {
      title: '管理员入口',
      subtitle: '品类管理 · 范围配置 · 系统维护',
      icon: Settings,
      path: '/admin',
      gradient: 'from-amber-dark to-amber',
      hoverShadow: 'hover:shadow-amber/40',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-dark via-forest to-forest-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-mint rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-6">
          <Recycle className="w-12 h-12 text-amber" />
          <h1 className="text-5xl font-black text-white tracking-tight">
            废旧家电回收估价
          </h1>
        </div>
        <p className="text-forest-200 text-lg font-light tracking-wide">
          绿色回收 · 透明估价 · 便捷预约
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role) => (
          <button
            key={role.path}
            onClick={() => navigate(role.path)}
            className={`group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-left transition-all duration-500 hover:scale-105 hover:bg-white/15 ${role.hoverShadow} hover:shadow-2xl`}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} mb-6 shadow-lg`}>
              <role.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-light transition-colors">
              {role.title}
            </h2>
            <p className="text-forest-200 text-sm leading-relaxed">
              {role.subtitle}
            </p>
            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber/30 transition-all duration-300">
              <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <p className="relative z-10 text-forest-200/60 text-xs mt-16">
        数据保存在浏览器本地，刷新不丢失
      </p>
    </div>
  );
}
