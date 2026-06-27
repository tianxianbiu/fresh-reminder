import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Clock,
  Download,
  Upload,
  Trash2,
  Info,
  Leaf,
} from 'lucide-react';
import { useFoodStore } from '@/store/foodStore';
import type { FoodItem } from '@/types/food';

export default function Settings() {
  const { settings, updateSettings, foods, importData, clearAllData } = useFoodStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const dataStr = JSON.stringify(foods, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `鲜尝提醒-食品数据-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as FoodItem[];
        if (Array.isArray(data)) {
          if (confirm(`确定要导入 ${data.length} 条食品数据吗？这将覆盖当前所有现有数据。`)) {
            importData(data);
            alert('导入成功！');
          }
        } else {
          alert('文件格式不正确，请选择正确的JSON文件。');
        }
      } catch {
        alert('文件解析失败，请确保是有效的JSON文件。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-brand-600" />
          </div>
          设置
        </h1>
        <p className="text-gray-500 text-sm mt-2 ml-13">
          个性化你的食品管理偏好设置
        </p>
      </div>

      {/* 提醒设置 */}
      <div className="card p-5 space-y-5 animate-slide-up" style={{ animationDelay: '50ms', opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-500" />
          过期提醒
        </h2>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">提前提醒天数</p>
                <p className="text-sm text-gray-500">在食品过期前多少天开始提醒</p>
              </div>
            </label>
            <div className="flex items-center gap-4 mt-3">
              <input
                type="range"
                min="1"
                max="14"
                value={settings.warningDays}
                onChange={(e) => updateSettings({ warningDays: Number(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-brand-600">
                  {settings.warningDays}
                </span>
                <span className="text-sm text-gray-500"> 天</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1天</span>
              <span>14天</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-gray-700">浏览器通知</p>
              <p className="text-sm text-gray-500">
                {settings.notificationsEnabled
                  ? '已启用浏览器桌面通知'
                  : '未启用浏览器通知'}
              </p>
            </div>
            <button
              onClick={() => {
                if (!settings.notificationsEnabled) {
                  if ('Notification' in window) {
                    Notification.requestPermission().then((permission) => {
                      if (permission === 'granted') {
                        updateSettings({ notificationsEnabled: true });
                      }
                    });
                  }
                } else {
                  updateSettings({ notificationsEnabled: false });
                }
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                settings.notificationsEnabled ? 'bg-brand-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="card p-5 space-y-5 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-500" />
          数据管理
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-700">导出数据</p>
              <p className="text-sm text-gray-500">将所有食品数据导出为JSON文件</p>
            </div>
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-700">导入数据</p>
              <p className="text-sm text-gray-500">从JSON文件导入食品数据</p>
            </div>
            <label className="btn-secondary flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              导入
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
            <div>
              <p className="font-medium text-red-700">清空所有数据</p>
              <p className="text-sm text-red-500">删除所有食品数据，不可恢复</p>
            </div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  确认清空
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 关于 */}
      <div className="card p-5 space-y-4 animate-slide-up" style={{ animationDelay: '150ms', opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-500" />
          关于
        </h2>

        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-soft-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">鲜尝提醒</h3>
          <p className="text-gray-500 text-sm mt-1">别再浪费食物</p>
          <p className="text-gray-400 text-xs mt-4">版本 1.0.0</p>
        </div>

        <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
          <p className="text-sm text-brand-700 leading-relaxed">
            💡 <strong>小贴士：</strong>定期检查你的食品库存，把即将过期的食物放在冰箱最显眼的位置，
            这样你就不会忘记它们啦！减少食物浪费，从记录开始。
          </p>
        </div>

        <div className="text-center text-xs text-gray-400 pt-2">
          <p>数据保存在你的浏览器本地</p>
          <p>请定期备份数据以防丢失</p>
        </div>
      </div>
    </div>
  );
}
