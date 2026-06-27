export type FoodCategory =
  | '蔬菜水果'
  | '肉禽蛋'
  | '海鲜水产'
  | '乳制品'
  | '粮油调味'
  | '零食饮料'
  | '冷冻食品'
  | '方便速食'
  | '其他';

export type StorageLocation =
  | '冰箱冷藏'
  | '冰箱冷冻'
  | '零食柜'
  | '水果篮'
  | '厨房储物柜'
  | '餐桌'
  | '其他';

export type FoodStatus = 'fresh' | 'expiring-soon' | 'expired';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  storageLocation: StorageLocation;
  purchaseDate: string;
  productionDate?: string;
  shelfLifeDays: number;
  expiryDate: string;
  quantity: number;
  unit: string;
  isOpened: boolean;
  openedDate?: string;
  openedShelfLifeDays?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  warningDays: number;
  notificationsEnabled: boolean;
}

export type SortField = 'expiryDate' | 'purchaseDate' | 'name' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  category: FoodCategory | 'all';
  location: StorageLocation | 'all';
  status: FoodStatus | 'all';
  sortField: SortField;
  sortOrder: SortOrder;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  '蔬菜水果',
  '肉禽蛋',
  '海鲜水产',
  '乳制品',
  '粮油调味',
  '零食饮料',
  '冷冻食品',
  '方便速食',
  '其他',
];

export const CATEGORY_EMOJIS: Record<FoodCategory, string> = {
  '蔬菜水果': '🥬',
  '肉禽蛋': '🥩',
  '海鲜水产': '🦐',
  '乳制品': '🥛',
  '粮油调味': '🍚',
  '零食饮料': '🍪',
  '冷冻食品': '🧊',
  '方便速食': '🍜',
  '其他': '📦',
};

export const CATEGORY_COLORS: Record<FoodCategory, string> = {
  '蔬菜水果': 'bg-green-100 text-green-700 border-green-200',
  '肉禽蛋': 'bg-red-100 text-red-700 border-red-200',
  '海鲜水产': 'bg-blue-100 text-blue-700 border-blue-200',
  '乳制品': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '粮油调味': 'bg-amber-100 text-amber-700 border-amber-200',
  '零食饮料': 'bg-pink-100 text-pink-700 border-pink-200',
  '冷冻食品': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '方便速食': 'bg-orange-100 text-orange-700 border-orange-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const STORAGE_LOCATIONS: StorageLocation[] = [
  '冰箱冷藏',
  '冰箱冷冻',
  '零食柜',
  '水果篮',
  '厨房储物柜',
  '餐桌',
  '其他',
];

export const LOCATION_EMOJIS: Record<StorageLocation, string> = {
  '冰箱冷藏': '🧊',
  '冰箱冷冻': '❄️',
  '零食柜': '🍿',
  '水果篮': '🍎',
  '厨房储物柜': '🗄️',
  '餐桌': '🍽️',
  '其他': '📦',
};

export const LOCATION_COLORS: Record<StorageLocation, string> = {
  '冰箱冷藏': 'bg-blue-100 text-blue-700 border-blue-200',
  '冰箱冷冻': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  '零食柜': 'bg-pink-100 text-pink-700 border-pink-200',
  '水果篮': 'bg-green-100 text-green-700 border-green-200',
  '厨房储物柜': 'bg-amber-100 text-amber-700 border-amber-200',
  '餐桌': 'bg-orange-100 text-orange-700 border-orange-200',
  '其他': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const COMMON_UNITS = ['个', '包', '袋', '瓶', '盒', '斤', '克', '千克', '升', '毫升'];
