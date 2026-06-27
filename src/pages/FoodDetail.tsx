import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Package,
  Hash,
  FileText,
  ToggleLeft,
  ToggleRight,
  Clock,
  Save,
  X,
  MapPin,
} from 'lucide-react';
import { useFoodStore } from '@/store/foodStore';
import {
  FOOD_CATEGORIES,
  COMMON_UNITS,
  CATEGORY_EMOJIS,
  CATEGORY_COLORS,
  STORAGE_LOCATIONS,
  LOCATION_EMOJIS,
  LOCATION_COLORS,
  type FoodCategory,
  type StorageLocation,
} from '@/types/food';
import {
  formatDateDisplay,
  getFoodStatus,
  getExpiryDisplayText,
  getStatusColor,
  getStatusBgColor,
  calculateExpiryDate,
  getTodayString,
} from '@/utils/foodUtils';

export default function FoodDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const { getFoodById, updateFood, deleteFood, toggleOpened, settings } = useFoodStore();
  const food = id ? getFoodById(id) : undefined;

  const [editing, setEditing] = useState(isEditMode);
  const [name, setName] = useState(food?.name || '');
  const [category, setCategory] = useState<FoodCategory>(food?.category || '蔬菜水果');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>(food?.storageLocation || '冰箱冷藏');
  const [purchaseDate, setPurchaseDate] = useState(food?.purchaseDate || getTodayString());
  const [productionDate, setProductionDate] = useState(food?.productionDate || '');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(food?.shelfLifeDays || 7);
  const [quantity, setQuantity] = useState<number>(food?.quantity || 1);
  const [unit, setUnit] = useState(food?.unit || '个');
  const [isOpened, setIsOpened] = useState(food?.isOpened || false);
  const [openedShelfLifeDays, setOpenedShelfLifeDays] = useState<number>(
    food?.openedShelfLifeDays || 3
  );
  const [notes, setNotes] = useState(food?.notes || '');

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCategory(food.category);
      setStorageLocation(food.storageLocation);
      setPurchaseDate(food.purchaseDate);
      setProductionDate(food.productionDate || '');
      setShelfLifeDays(food.shelfLifeDays);
      setQuantity(food.quantity);
      setUnit(food.unit);
      setIsOpened(food.isOpened);
      setOpenedShelfLifeDays(food.openedShelfLifeDays || 3);
      setNotes(food.notes || '');
    }
  }, [food]);

  if (!food) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">食品不存在</h2>
          <p className="text-gray-500 mb-6">该食品可能已被删除</p>
          <button onClick={() => navigate('/inventory')} className="btn-primary">
            返回库存列表
          </button>
        </div>
      </div>
    );
  }

  const status = getFoodStatus(food, settings.warningDays);
  const statusColor = getStatusColor(status);
  const statusBgColor = getStatusBgColor(status);
  const expiryText = getExpiryDisplayText(food, settings.warningDays);
  const categoryColor = CATEGORY_COLORS[food.category];
  const categoryEmoji = CATEGORY_EMOJIS[food.category];

  const previewExpiryDate = calculateExpiryDate(
    productionDate || purchaseDate,
    shelfLifeDays
  );

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入食品名称');
      return;
    }

    const baseDate = productionDate || purchaseDate;
    const expiryDate = calculateExpiryDate(baseDate, shelfLifeDays);

    updateFood(food.id, {
      name: name.trim(),
      category,
      storageLocation,
      purchaseDate,
      productionDate: productionDate || undefined,
      shelfLifeDays,
      expiryDate,
      quantity,
      unit,
      isOpened,
      openedDate: isOpened && !food.isOpened ? getTodayString() : food.openedDate,
      openedShelfLifeDays: isOpened ? openedShelfLifeDays : undefined,
      notes: notes.trim() || undefined,
    });

    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`确定要删除「${food.name}」吗？此操作不可恢复。`)) {
      deleteFood(food.id);
      navigate('/inventory');
    }
  };

  const handleToggleOpened = () => {
    toggleOpened(food.id);
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {editing ? '编辑食品' : '食品详情'}
            </h1>
            <p className="text-gray-500 text-sm">{food.category}</p>
          </div>
        </div>
        {!editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 状态卡片 */}
      <div
        className={`card p-6 mb-6 animate-slide-up ${
          status === 'expired' ? 'border-red-200' : ''
        }`}
        style={{ animationDelay: '50ms', opacity: 0, animationFillMode: 'forwards' }}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${categoryColor} border`}
          >
            {categoryEmoji}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{food.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`badge ${statusColor} border`}>
                <span className={`w-2 h-2 rounded-full ${statusBgColor} ${status !== 'fresh' ? 'animate-pulse' : ''}`}></span>
                {status === 'fresh' ? '新鲜' : status === 'expiring-soon' ? '即将过期' : '已过期'}
              </span>
              {food.isOpened && (
                <span className="badge bg-amber-50 text-amber-600 border border-amber-200">
                  已开封
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Clock
              className={`w-6 h-6 ${
                status === 'expired'
                  ? 'text-red-500'
                  : status === 'expiring-soon'
                  ? 'text-orange-500'
                  : 'text-brand-500'
              }`}
            />
            <div>
              <p
                className={`text-lg font-bold ${
                  status === 'expired'
                    ? 'text-red-600'
                    : status === 'expiring-soon'
                    ? 'text-orange-600'
                    : 'text-gray-800'
                }`}
              >
                {expiryText}
              </p>
              <p className="text-sm text-gray-500">
                过期日期：{formatDateDisplay(food.expiryDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑模式 */}
      {editing ? (
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="card p-5 space-y-5 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-500" />
              基本信息
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食品分类
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      category === cat
                        ? `${CATEGORY_COLORS[cat]} border-2`
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{CATEGORY_EMOJIS[cat]}</span>
                    <span className="text-xs font-medium">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                存放位置
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {STORAGE_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setStorageLocation(loc)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      storageLocation === loc
                        ? `${LOCATION_COLORS[loc]} border-2`
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{LOCATION_EMOJIS[loc]}</span>
                    <span className="text-xs font-medium">{loc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  数量
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  单位
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input-base appearance-none cursor-pointer"
                >
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 保质期信息 */}
          <div className="card p-5 space-y-5 animate-slide-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              保质期信息
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                购买日期
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生产日期 <span className="text-gray-400 text-xs font-normal">（可选）</span>
              </label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保质期（天）
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="365"
                  value={shelfLifeDays}
                  onChange={(e) => setShelfLifeDays(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <input
                  type="number"
                  min="1"
                  value={shelfLifeDays}
                  onChange={(e) => setShelfLifeDays(Number(e.target.value) || 1)}
                  className="input-base w-24 text-center"
                />
                <span className="text-gray-500 text-sm w-6">天</span>
              </div>
            </div>

            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="text-sm text-brand-700">
                <span className="font-medium">预计过期日期：</span>
                <span className="font-bold text-lg ml-1">{previewExpiryDate}</span>
              </p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">是否已开封</span>
                <button
                  type="button"
                  onClick={() => setIsOpened(!isOpened)}
                  className="text-gray-500"
                >
                  {isOpened ? (
                    <ToggleRight className="w-8 h-8 text-brand-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              </div>

              {isOpened && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-3 animate-slide-down">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-amber-700 whitespace-nowrap">
                      开封后保质期
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={openedShelfLifeDays}
                      onChange={(e) => setOpenedShelfLifeDays(Number(e.target.value) || 1)}
                      className="input-base flex-1"
                    />
                    <span className="text-amber-700 text-sm">天</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 备注 */}
          <div className="card p-5 space-y-4 animate-slide-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              备注
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '250ms', opacity: 0, animationFillMode: 'forwards' }}>
            <button
              onClick={() => setEditing(false)}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              取消
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              保存修改
            </button>
          </div>
        </div>
      ) : (
        /* 查看模式 */
        <div className="space-y-6">
          {/* 详细信息 */}
          <div className="card p-5 space-y-4 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
            <h2 className="font-semibold text-gray-800">详细信息</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  数量
                </span>
                <span className="font-medium text-gray-800">
                  {food.quantity} {food.unit}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  存放位置
                </span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  <span>{LOCATION_EMOJIS[food.storageLocation] || '📦'}</span>
                  {food.storageLocation}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  购买日期
                </span>
                <span className="font-medium text-gray-800">
                  {formatDateDisplay(food.purchaseDate)}
                </span>
              </div>

              {food.productionDate && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    生产日期
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDateDisplay(food.productionDate)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">保质期</span>
                <span className="font-medium text-gray-800">
                  {food.shelfLifeDays} 天
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-2">
                  <ToggleRight className="w-4 h-4" />
                  开封状态
                </span>
                <button
                  onClick={handleToggleOpened}
                  className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1"
                >
                  {food.isOpened ? '已开封' : '未开封'}
                  <span className="text-xs text-gray-400">（点击切换）</span>
                </button>
              </div>

              {food.isOpened && food.openedDate && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">开封日期</span>
                  <span className="font-medium text-gray-800">
                    {formatDateDisplay(food.openedDate)}
                  </span>
                </div>
              )}

              {food.isOpened && food.openedShelfLifeDays && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">开封后保质期</span>
                  <span className="font-medium text-amber-600">
                    {food.openedShelfLifeDays} 天
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 备注 */}
          {food.notes && (
            <div className="card p-5 animate-slide-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                备注
              </h2>
              <p className="text-gray-600 leading-relaxed">{food.notes}</p>
            </div>
          )}

          {/* 添加时间 */}
          <div className="text-center text-xs text-gray-400 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p>添加于 {new Date(food.createdAt).toLocaleString('zh-CN')}</p>
            {food.updatedAt !== food.createdAt && (
              <p>最后更新于 {new Date(food.updatedAt).toLocaleString('zh-CN')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
