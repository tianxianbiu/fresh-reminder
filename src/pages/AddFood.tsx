import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Calendar,
  Package,
  Hash,
  FileText,
  ToggleLeft,
  ToggleRight,
  Sparkles,
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
import { getTodayString, calculateExpiryDate } from '@/utils/foodUtils';

const quickPresets: Record<string, { category: FoodCategory; shelfLifeDays: number; unit: string; storageLocation: StorageLocation }> = {
  '牛奶': { category: '乳制品', shelfLifeDays: 7, unit: '盒', storageLocation: '冰箱冷藏' },
  '鸡蛋': { category: '肉禽蛋', shelfLifeDays: 30, unit: '个', storageLocation: '冰箱冷藏' },
  '面包': { category: '零食饮料', shelfLifeDays: 5, unit: '袋', storageLocation: '零食柜' },
  '苹果': { category: '蔬菜水果', shelfLifeDays: 14, unit: '斤', storageLocation: '水果篮' },
  '青菜': { category: '蔬菜水果', shelfLifeDays: 3, unit: '把', storageLocation: '冰箱冷藏' },
  '酸奶': { category: '乳制品', shelfLifeDays: 21, unit: '杯', storageLocation: '冰箱冷藏' },
};

export default function AddFood() {
  const navigate = useNavigate();
  const { addFood } = useFoodStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('蔬菜水果');
  const [storageLocation, setStorageLocation] = useState<StorageLocation>('冰箱冷藏');
  const [purchaseDate, setPurchaseDate] = useState(getTodayString());
  const [productionDate, setProductionDate] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(7);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('个');
  const [isOpened, setIsOpened] = useState(false);
  const [openedShelfLifeDays, setOpenedShelfLifeDays] = useState<number>(3);
  const [notes, setNotes] = useState('');

  const handleQuickAdd = (presetName: string) => {
    const preset = quickPresets[presetName];
    if (preset) {
      setName(presetName);
      setCategory(preset.category);
      setShelfLifeDays(preset.shelfLifeDays);
      setUnit(preset.unit);
      setStorageLocation(preset.storageLocation);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('请输入食品名称');
      return;
    }

    const baseDate = productionDate || purchaseDate;
    const expiryDate = calculateExpiryDate(baseDate, shelfLifeDays);

    addFood({
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
      openedDate: isOpened ? getTodayString() : undefined,
      openedShelfLifeDays: isOpened ? openedShelfLifeDays : undefined,
      notes: notes.trim() || undefined,
    });

    navigate('/inventory');
  };

  const previewExpiryDate = calculateExpiryDate(
    productionDate || purchaseDate,
    shelfLifeDays
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">添加食品</h1>
          <p className="text-gray-500 text-sm">记录新购入的食品信息</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 快捷录入 */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '50ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-gray-700">快捷录入</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(quickPresets).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickAdd(preset)}
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors border border-amber-100"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 基本信息 */}
        <div className="card p-5 space-y-5 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            基本信息
          </h2>

          {/* 食品名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              食品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：有机牛奶"
              className="input-base"
              autoFocus
            />
          </div>

          {/* 分类选择 */}
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
                      ? `${CATEGORY_COLORS[cat]} border-2 ring-2 ring-offset-1`
                      : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{CATEGORY_EMOJIS[cat]}</span>
                  <span className="text-xs font-medium">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 存放位置 */}
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
                      ? `${LOCATION_COLORS[loc]} border-2 ring-2 ring-offset-1`
                      : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{LOCATION_EMOJIS[loc]}</span>
                  <span className="text-xs font-medium">{loc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 数量和单位 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
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

          {/* 购买日期 */}
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

          {/* 生产日期（可选） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生产日期 <span className="text-gray-400 text-xs font-normal">（可选）</span>
            </label>
            <input
              type="date"
              value={productionDate}
              onChange={(e) => setProductionDate(e.target.value)}
              className="input-base"
              placeholder="不填则以购买日期为准"
            />
            <p className="text-xs text-gray-400 mt-1">不填写则以购买日期开始计算保质期</p>
          </div>

          {/* 保质期 */}
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

          {/* 过期日期预览 */}
          <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
            <p className="text-sm text-brand-700">
              <span className="font-medium">预计过期日期：</span>
              <span className="font-bold text-lg ml-1">{previewExpiryDate}</span>
            </p>
          </div>

          {/* 是否开封 */}
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
                <p className="text-sm text-amber-700">
                  开封后保质期会缩短，请设置开封后的保质期
                </p>
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
            placeholder="例如：冷藏保存、给孩子买的、需要尽快食用..."
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-3 pb-6 animate-slide-up" style={{ animationDelay: '250ms', opacity: 0, animationFillMode: 'forwards' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            保存食品
          </button>
        </div>
      </form>
    </div>
  );
}
