import { FoodItem, FoodStatus, FoodCategory, StorageLocation } from '@/types/food';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

export function calculateExpiryDate(
  startDate: string,
  shelfLifeDays: number
): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + shelfLifeDays);
  return formatDate(date);
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getFoodStatus(
  food: FoodItem,
  warningDays: number
): FoodStatus {
  let effectiveExpiryDate = food.expiryDate;

  if (food.isOpened && food.openedDate && food.openedShelfLifeDays) {
    effectiveExpiryDate = calculateExpiryDate(
      food.openedDate,
      food.openedShelfLifeDays
    );
  }

  const daysLeft = getDaysUntilExpiry(effectiveExpiryDate);

  if (daysLeft <= 0) {
    return 'expired';
  } else if (daysLeft <= warningDays) {
    return 'expiring-soon';
  }
  return 'fresh';
}

export function getStatusText(status: FoodStatus): string {
  switch (status) {
    case 'fresh':
      return '新鲜';
    case 'expiring-soon':
      return '即将过期';
    case 'expired':
      return '已过期';
  }
}

export function getStatusColor(status: FoodStatus): string {
  switch (status) {
    case 'fresh':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'expiring-soon':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200';
  }
}

export function getStatusBgColor(status: FoodStatus): string {
  switch (status) {
    case 'fresh':
      return 'bg-green-500';
    case 'expiring-soon':
      return 'bg-orange-500';
    case 'expired':
      return 'bg-red-500';
  }
}

export function getExpiryDisplayText(food: FoodItem, warningDays: number): string {
  const status = getFoodStatus(food, warningDays);
  let effectiveExpiryDate = food.expiryDate;

  if (food.isOpened && food.openedDate && food.openedShelfLifeDays) {
    effectiveExpiryDate = calculateExpiryDate(
      food.openedDate,
      food.openedShelfLifeDays
    );
  }

  const daysLeft = getDaysUntilExpiry(effectiveExpiryDate);

  if (daysLeft < 0) {
    return `已过期 ${Math.abs(daysLeft)} 天`;
  } else if (daysLeft === 0) {
    return '今天到期';
  } else if (daysLeft === 1) {
    return '明天到期';
  } else {
    return `还剩 ${daysLeft} 天`;
  }
}

export function getCategoryCount(foods: FoodItem[]): Record<FoodCategory, number> {
  const counts: Record<string, number> = {};
  foods.forEach((food) => {
    counts[food.category] = (counts[food.category] || 0) + 1;
  });
  return counts as Record<FoodCategory, number>;
}

export function getStatusCount(
  foods: FoodItem[],
  warningDays: number
): { fresh: number; expiringSoon: number; expired: number } {
  let fresh = 0;
  let expiringSoon = 0;
  let expired = 0;

  foods.forEach((food) => {
    const status = getFoodStatus(food, warningDays);
    if (status === 'fresh') fresh++;
    else if (status === 'expiring-soon') expiringSoon++;
    else expired++;
  });

  return { fresh, expiringSoon, expired };
}

export function sortFoods(
  foods: FoodItem[],
  sortField: string,
  sortOrder: 'asc' | 'desc',
  warningDays: number
): FoodItem[] {
  const sorted = [...foods];

  if (sortField === 'expiryDate') {
    sorted.sort((a, b) => {
      const daysA = getDaysUntilExpiry(a.expiryDate);
      const daysB = getDaysUntilExpiry(b.expiryDate);
      return sortOrder === 'asc' ? daysA - daysB : daysB - daysA;
    });
  } else if (sortField === 'name') {
    sorted.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'zh-CN');
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  } else if (sortField === 'purchaseDate') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.purchaseDate).getTime();
      const dateB = new Date(b.purchaseDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  } else if (sortField === 'createdAt') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  return sorted;
}

export function filterFoods(
  foods: FoodItem[],
  search: string,
  category: FoodCategory | 'all',
  location: StorageLocation | 'all',
  status: FoodStatus | 'all',
  warningDays: number
): FoodItem[] {
  return foods.filter((food) => {
    if (search && !food.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (category !== 'all' && food.category !== category) {
      return false;
    }

    if (location !== 'all' && food.storageLocation !== location) {
      return false;
    }

    if (status !== 'all') {
      const foodStatus = getFoodStatus(food, warningDays);
      if (foodStatus !== status) {
        return false;
      }
    }

    return true;
  });
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 17) return '下午好';
  if (hour < 19) return '傍晚好';
  return '晚上好';
}
