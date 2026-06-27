import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
  Plus,
  X,
  Filter,
  MapPin,
} from 'lucide-react';
import { useFoodStore } from '@/store/foodStore';
import FoodCard from '@/components/food/FoodCard';
import { filterFoods, sortFoods } from '@/utils/foodUtils';
import {
  FOOD_CATEGORIES,
  CATEGORY_EMOJIS,
  STORAGE_LOCATIONS,
  LOCATION_EMOJIS,
  type FoodCategory,
  type FoodStatus,
  type SortField,
  type SortOrder,
  type StorageLocation,
} from '@/types/food';

const statusOptions: { value: FoodStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: '全部', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'fresh', label: '新鲜', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'expiring-soon', label: '即将过期', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'expired', label: '已过期', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'expiryDate', label: '过期时间' },
  { value: 'purchaseDate', label: '购买时间' },
  { value: 'name', label: '名称' },
  { value: 'createdAt', label: '添加时间' },
];

export default function Inventory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { foods, settings } = useFoodStore();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<FoodCategory | 'all'>(
    (searchParams.get('category') as FoodCategory) || 'all'
  );
  const [location, setLocation] = useState<StorageLocation | 'all'>(
    (searchParams.get('location') as StorageLocation) || 'all'
  );
  const [status, setStatus] = useState<FoodStatus | 'all'>(
    (searchParams.get('status') as FoodStatus) || 'all'
  );
  const [sortField, setSortField] = useState<SortField>('expiryDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (location !== 'all') params.location = location;
    if (status !== 'all') params.status = status;
    setSearchParams(params, { replace: true });
  }, [search, category, location, status, setSearchParams]);

  const filteredFoods = filterFoods(foods, search, category, location, status, settings.warningDays);
  const sortedFoods = sortFoods(filteredFoods, sortField, sortOrder, settings.warningDays);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setLocation('all');
    setStatus('all');
  };

  const hasActiveFilters = search || category !== 'all' || location !== 'all' || status !== 'all';

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">食品库存</h1>
          <p className="text-gray-500 text-sm mt-1">
            共 <span className="font-semibold text-gray-700">{sortedFoods.length}</span> 样食品
            {hasActiveFilters && (
              <span className="text-gray-400">（已筛选）</span>
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

      {/* 搜索和筛选 */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
        {/* 搜索栏 */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索食品名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-12 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${
              hasActiveFilters ? 'ring-2 ring-brand-300' : ''
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">筛选</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* 快速筛选标签 - 状态 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatus(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                status === option.value
                  ? option.color + ' ring-2 ring-offset-1'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 展开的筛选面板 */}
        {showFilters && (
          <div className="card p-5 animate-slide-down space-y-5">
            {/* 分类筛选 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">食品分类</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    清除筛选
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category === 'all'
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部分类
                </button>
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      category === cat
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{CATEGORY_EMOJIS[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 存放位置筛选 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">存放位置</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setLocation('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    location === 'all'
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部位置
                </button>
                {STORAGE_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      location === loc
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{LOCATION_EMOJIS[loc]}</span>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* 排序 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">排序方式</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleSort(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      sortField === option.value
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    {sortField === option.value && (
                      <span className="text-xs">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 食品列表 */}
      <div className="animate-slide-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
        {sortedFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFoods.map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {hasActiveFilters ? '没有找到匹配的食品' : '还没有添加任何食品'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? '试试调整筛选条件，或者清除筛选查看全部食品'
                : '点击下方按钮，开始记录你家的食品吧！'}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="btn-secondary">
                清除筛选条件
              </button>
            ) : (
              <button
                onClick={() => navigate('/add')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加第一个食品
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
