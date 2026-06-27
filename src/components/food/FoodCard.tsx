import { useNavigate } from 'react-router-dom';
import { PackageOpen, Clock, Edit2, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import { FoodItem } from '@/types/food';
import { useFoodStore } from '@/store/foodStore';
import {
  getFoodStatus,
  getExpiryDisplayText,
  getStatusColor,
  getStatusBgColor,
  formatDateDisplay,
} from '@/utils/foodUtils';
import { CATEGORY_EMOJIS, CATEGORY_COLORS, LOCATION_EMOJIS } from '@/types/food';

interface FoodCardProps {
  food: FoodItem;
  index?: number;
}

export default function FoodCard({ food, index = 0 }: FoodCardProps) {
  const navigate = useNavigate();
  const { settings, toggleOpened, deleteFood } = useFoodStore();
  const status = getFoodStatus(food, settings.warningDays);
  const statusColor = getStatusColor(status);
  const statusBgColor = getStatusBgColor(status);
  const expiryText = getExpiryDisplayText(food, settings.warningDays);
  const categoryColor = CATEGORY_COLORS[food.category];
  const categoryEmoji = CATEGORY_EMOJIS[food.category];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定要删除「${food.name}」吗？`)) {
      deleteFood(food.id);
    }
  };

  const handleToggleOpened = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOpened(food.id);
  };

  const animationDelay = `${Math.min(index * 50, 400)}ms`;

  return (
    <div
      className={`card card-hover cursor-pointer overflow-hidden relative animate-slide-up`}
      style={{ animationDelay, opacity: 0, animationFillMode: 'forwards' }}
      onClick={() => navigate(`/food/${food.id}`)}
    >
      {/* 状态角标 */}
      <div
        className={`absolute top-3 right-3 z-10 ${
          status === 'expired' ? 'animate-pulse-soft' : ''
        }`}
      >
        <span className={`badge ${statusColor} border`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusBgColor}`}></span>
          {status === 'fresh' ? '新鲜' : status === 'expiring-soon' ? '即将过期' : '已过期'}
        </span>
      </div>

      {/* 卡片内容 */}
      <div className="p-5">
        {/* 顶部：图标和分类 */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${categoryColor} border`}
          >
            {categoryEmoji}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-semibold text-gray-800 truncate pr-16">{food.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{food.category}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <span>{LOCATION_EMOJIS[food.storageLocation] || '📦'}</span>
                {food.storageLocation}
              </span>
            </div>
          </div>
        </div>

        {/* 过期信息 */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock
              className={`w-4 h-4 ${
                status === 'expired'
                  ? 'text-red-500'
                  : status === 'expiring-soon'
                  ? 'text-orange-500'
                  : 'text-gray-400'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                status === 'expired'
                  ? 'text-red-600'
                  : status === 'expiring-soon'
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {expiryText}
            </span>
          </div>
          <p className="text-xs text-gray-400 ml-5.5">
            过期日期：{formatDateDisplay(food.expiryDate)}
          </p>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-500">
              <PackageOpen className="w-4 h-4" />
              <span className="text-sm font-medium">
                {food.quantity} {food.unit}
              </span>
            </div>
            {food.isOpened && (
              <span className="badge bg-amber-50 text-amber-600 border border-amber-100">
                已开封
              </span>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleOpened}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              title={food.isOpened ? '标记为未开封' : '标记为已开封'}
            >
              {food.isOpened ? (
                <ToggleRight className="w-5 h-5 text-brand-500" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/food/${food.id}?edit=true`);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-brand-600"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 过期进度条 */}
      <div className="h-1 bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ${statusBgColor}`}
          style={{
            width: `${Math.max(0, Math.min(100, (() => {
              const totalDays = food.shelfLifeDays;
              const passedDays = totalDays - Math.max(0, Math.ceil(
                (new Date(food.expiryDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              ));
              return (passedDays / totalDays) * 100;
            })()))}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
