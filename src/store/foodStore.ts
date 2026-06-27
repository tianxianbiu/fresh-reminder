import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem, AppSettings, FoodCategory } from '@/types/food';
import { generateId, getTodayString, calculateExpiryDate } from '@/utils/foodUtils';

export interface ExportData {
  version: string;
  exportDate: string;
  foods: FoodItem[];
  settings: AppSettings;
}

interface FoodState {
  foods: FoodItem[];
  settings: AppSettings;
  addFood: (food: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt' | 'expiryDate'> & { expiryDate?: string }) => void;
  updateFood: (id: string, updates: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  toggleOpened: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getFoodById: (id: string) => FoodItem | undefined;
  importData: (foods: FoodItem[]) => void;
  importFullData: (data: ExportData) => void;
  exportFullData: () => ExportData;
  clearAllData: () => void;
}

const mockFoods: FoodItem[] = [
  {
    id: generateId(),
    name: '有机牛奶',
    category: '乳制品',
    storageLocation: '冰箱冷藏',
    purchaseDate: getTodayString(),
    productionDate: getTodayString(),
    shelfLifeDays: 7,
    expiryDate: calculateExpiryDate(getTodayString(), 7),
    quantity: 2,
    unit: '盒',
    isOpened: false,
    notes: '冷藏保存',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '土鸡蛋',
    category: '肉禽蛋',
    storageLocation: '冰箱冷藏',
    purchaseDate: getTodayString(),
    productionDate: getTodayString(),
    shelfLifeDays: 30,
    expiryDate: calculateExpiryDate(getTodayString(), 30),
    quantity: 20,
    unit: '个',
    isOpened: true,
    openedDate: getTodayString(),
    openedShelfLifeDays: 20,
    notes: '放在冰箱冷藏',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '新鲜菠菜',
    category: '蔬菜水果',
    storageLocation: '冰箱冷藏',
    purchaseDate: getTodayString(),
    shelfLifeDays: 3,
    expiryDate: calculateExpiryDate(getTodayString(), 3),
    quantity: 1,
    unit: '把',
    isOpened: false,
    notes: '尽快食用',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '全麦面包',
    category: '零食饮料',
    storageLocation: '零食柜',
    purchaseDate: getTodayString(),
    productionDate: getTodayString(),
    shelfLifeDays: 5,
    expiryDate: calculateExpiryDate(getTodayString(), 5),
    quantity: 1,
    unit: '袋',
    isOpened: true,
    openedDate: getTodayString(),
    openedShelfLifeDays: 3,
    notes: '早餐用',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '冷冻水饺',
    category: '冷冻食品',
    storageLocation: '冰箱冷冻',
    purchaseDate: getTodayString(),
    productionDate: getTodayString(),
    shelfLifeDays: 180,
    expiryDate: calculateExpiryDate(getTodayString(), 180),
    quantity: 2,
    unit: '袋',
    isOpened: false,
    notes: '猪肉白菜馅',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '苹果',
    category: '蔬菜水果',
    storageLocation: '水果篮',
    purchaseDate: getTodayString(),
    shelfLifeDays: 14,
    expiryDate: calculateExpiryDate(getTodayString(), 14),
    quantity: 6,
    unit: '个',
    isOpened: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '生抽酱油',
    category: '粮油调味',
    storageLocation: '厨房储物柜',
    purchaseDate: getTodayString(),
    productionDate: getTodayString(),
    shelfLifeDays: 540,
    expiryDate: calculateExpiryDate(getTodayString(), 540),
    quantity: 1,
    unit: '瓶',
    isOpened: true,
    openedDate: getTodayString(),
    openedShelfLifeDays: 180,
    notes: '海天特级',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '三文鱼',
    category: '海鲜水产',
    storageLocation: '冰箱冷藏',
    purchaseDate: getTodayString(),
    shelfLifeDays: 2,
    expiryDate: calculateExpiryDate(getTodayString(), 2),
    quantity: 1,
    unit: '斤',
    isOpened: false,
    notes: '冰鲜，尽快吃',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foods: mockFoods,
      settings: {
        warningDays: 3,
        notificationsEnabled: true,
      },

      addFood: (foodData) => {
        const now = new Date().toISOString();
        const newFood: FoodItem = {
          ...foodData,
          id: generateId(),
          expiryDate: foodData.expiryDate || calculateExpiryDate(
            foodData.productionDate || foodData.purchaseDate,
            foodData.shelfLifeDays
          ),
          createdAt: now,
          updatedAt: now,
        } as FoodItem;
        set((state) => ({
          foods: [newFood, ...state.foods],
        }));
      },

      updateFood: (id, updates) => {
        set((state) => ({
          foods: state.foods.map((food) =>
            food.id === id
              ? { ...food, ...updates, updatedAt: new Date().toISOString() }
              : food
          ),
        }));
      },

      deleteFood: (id) => {
        set((state) => ({
          foods: state.foods.filter((food) => food.id !== id),
        }));
      },

      toggleOpened: (id) => {
        set((state) => ({
          foods: state.foods.map((food) => {
            if (food.id === id) {
              const isOpened = !food.isOpened;
              return {
                ...food,
                isOpened,
                openedDate: isOpened ? getTodayString() : undefined,
                updatedAt: new Date().toISOString(),
              };
            }
            return food;
          }),
        }));
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      getFoodById: (id) => {
        return get().foods.find((food) => food.id === id);
      },

      importData: (foods) => {
        set({ foods });
      },

      importFullData: (data) => {
        set({ foods: data.foods, settings: data.settings });
      },

      exportFullData: () => {
        const state = get();
        return {
          version: '1.0.0',
          exportDate: new Date().toISOString(),
          foods: state.foods,
          settings: state.settings,
        };
      },

      clearAllData: () => {
        set({ foods: [] });
      },
    }),
    {
      name: 'fresh-reminder-storage',
    }
  )
);
