import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  Leaf,
} from 'lucide-react';
import { useFoodStore } from '@/store/foodStore';
import { getStatusCount } from '@/utils/foodUtils';

const navItems = [
  { path: '/', label: '仪表盘', icon: LayoutDashboard },
  { path: '/inventory', label: '食品库存', icon: Package },
  { path: '/add', label: '添加食品', icon: PlusCircle },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { foods, settings } = useFoodStore();
  const { expired, expiringSoon } = getStatusCount(foods, settings.warningDays);
  const alertCount = expired + expiringSoon;

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-soft">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">鲜尝提醒</h1>
              <p className="text-xs text-gray-400">别再浪费食物</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-link group relative ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.label}</span>
                {item.path === '/' && alertCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gradient-to-r from-brand-50 to-green-50 rounded-xl p-4">
            <p className="text-sm font-medium text-brand-700">小贴士 💡</p>
            <p className="text-xs text-brand-600 mt-1 leading-relaxed">
              定期检查冰箱，把即将过期的食物放在最显眼的位置！
            </p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-h-screen pb-20 md:pb-0">
        <div className="container max-w-6xl py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative ${
                  isActive ? 'text-brand-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.path === '/' && alertCount > 0 && (
                  <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
