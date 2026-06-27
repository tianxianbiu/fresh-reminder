import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useFoodStore } from '@/store/foodStore';
import {
  getStatusCount,
  getCategoryCount,
  getFoodStatus,
  getExpiryDisplayText,
  getGreeting,
  formatDateDisplay,
  sortFoods,
} from '@/utils/foodUtils';
import StatCard from '@/components/ui/StatCard';
import FoodCard from '@/components/food/FoodCard';
import { FOOD_CATEGORIES, CATEGORY_EMOJIS, CATEGORY_COLORS } from '@/types/food';
import type { FoodCategory } from '@/types/food';

export default function Dashboard() {
  const navigate = useNavigate();
  const { foods, settings } = useFoodStore();

  const { fresh, expiringSoon, expired } = getStatusCount(foods, settings.warningDays);
  const categoryCounts = getCategoryCount(foods);
  const totalCategories = Object.values(categoryCounts).filter((c) => c > 0).length;

  const sortedByExpiry = sortFoods(foods, 'expiryDate', 'asc', settings.warningDays);
  const expiringFoods = sortedByExpiry.filter(
    (f) => getFoodStatus(f, settings.warningDays) !== 'fresh'
  );
  const topExpiring = expiringFoods.slice(0, 6);

  const today = new Date();
  const todayStr = formatDateDisplay(today);

  const categoriesWithItems = FOOD_CATEGORIES.filter(
    (cat) => (categoryCounts[cat as FoodCategory] || 0) > 0
  );

  return (
    <div className="space-y-8">
      {/* 问候区域 */}
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-500 text-sm">{todayStr}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
              {getGreeting()}！👋
            </h1>
            <p className="text-gray-500 mt-1">
              你的家里有 <span className="font-semibold text-brand-600">{foods.length}</span> 样食物
              {expiringSoon > 0 && (
                <span>
                  ，其中 <span className="font-semibold text-orange-500">{expiringSoon}</span> 样即将过期
                </span>
              )}
              {expired > 0 && (
                <span>
                  ，<span className="font-semibold text-red-500">{expired}</span> 样已过期
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigate('/add')}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            添加食品
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="全部食品"
          value={foods.length}
          icon={Package}
          color="blue"
          subtitle="样"
          delay={0}
        />
        <StatCard
          title="新鲜"
          value={fresh}
          icon={CheckCircle}
          color="green"
          subtitle="样"
          delay={50}
        />
        <StatCard
          title="即将过期"
          value={expiringSoon}
          icon={Clock}
          color="orange"
          subtitle={`${settings.warningDays}天内`}
          delay={100}
        />
        <StatCard
          title="已过期"
          value={expired}
          icon={AlertTriangle}
          color="red"
          subtitle="样"
          delay={150}
        />
      </div>

      {/* 快过期提醒 */}
      {topExpiring.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">需要注意</h2>
              {expiringSoon > 0 && (
                <span className="badge bg-orange-100 text-orange-600">
                  {expiringSoon} 样即将过期
                </span>
              )}
              {expired > 0 && (
                <span className="badge bg-red-100 text-red-600">
                  {expired} 样已过期
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/inventory?status=expiring-soon')}
              className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topExpiring.map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* 分类概览 */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">分类概览</h2>
            <span className="badge bg-gray-100 text-gray-600">
              {totalCategories} 个分类
            </span>
          </div>
          <button
            onClick={() => navigate('/inventory')}
            className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            全部库存
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="card p-5">
          {categoriesWithItems.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {categoriesWithItems.map((category) => {
                const count = categoryCounts[category as FoodCategory] || 0;
                const emoji = CATEGORY_EMOJIS[category as FoodCategory];
                const colorClass = CATEGORY_COLORS[category as FoodCategory];
                return (
                  <button
                    key={category}
                    onClick={() => navigate(`/inventory?category=${encodeURIComponent(category)}`)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 hover:shadow-md ${colorClass}`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-medium">{category}</span>
                    <span className="text-xs font-bold opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>还没有添加任何食品</p>
              <button
                onClick={() => navigate('/add')}
                className="btn-primary mt-4 text-sm"
              >
                添加第一个食品
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 最近添加 */}
      {foods.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '350ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">全部食品</h2>
            </div>
            <button
              onClick={() => navigate('/inventory')}
              className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              查看更多
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedByExpiry.slice(0, 4).map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
