// 设置管理
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  // 明暗模式
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // 卡片数量
  cardCount: number;
  setCardCount: (count: number) => void;
  updateCardCount: (count: number) => void;
  isCardCountSet: boolean;

  // 爆率 (倍率，例如 1x, 2x, 5x)
  dropRate: number;
  setDropRate: (rate: number) => void;

  // 奖品管理
  prizes: Prize[];
  addPrize: (name: string, price: number) => void;
  removePrize: (id: string) => void;
  updatePrize: (id: string, name: string, price: number) => void;
  clearPrizes: () => void;

  resetSettings: () => void;
}

export interface Prize {
  id: string;
  name: string;
  price: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Cookies 相关常量和函数
const DARK_MODE_COOKIE_KEY = 'fishball-cards-dark-mode';
const COOKIE_EXPIRES_DAYS = 365;

// 设置 cookies
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// 获取 cookies
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// localStorage 相关常量
const CARD_COUNT_STORAGE_KEY = 'fishball-cards-count';
const IS_CARD_COUNT_SET_KEY = 'fishball-cards-count-set';
const DROP_RATE_STORAGE_KEY = 'fishball-drop-rate';
const PRIZES_STORAGE_KEY = 'fishball-prizes';

// 加载明暗模式设置
const loadDarkModeFromCookie = (): boolean => {
  const cookieValue = getCookie(DARK_MODE_COOKIE_KEY);
  if (cookieValue === null) {
    // 默认使用系统偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return cookieValue === 'true';
};

// 保存明暗模式设置到 cookies
const saveDarkModeToCookie = (isDark: boolean) => {
  setCookie(DARK_MODE_COOKIE_KEY, isDark.toString(), COOKIE_EXPIRES_DAYS);
};

// 加载卡片数量设置
const loadCardCountFromStorage = (): number => {
  try {
    const stored = localStorage.getItem(CARD_COUNT_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('加载卡片数量设置失败:', error);
  }
  return 10; // 默认值
};

// 保存卡片数量设置到 localStorage
const saveCardCountToStorage = (count: number) => {
  try {
    localStorage.setItem(CARD_COUNT_STORAGE_KEY, count.toString());
  } catch (error) {
    console.error('保存卡片数量设置失败:', error);
  }
};

// 加载爆率设置
const loadDropRateFromStorage = (): number => {
  try {
    const stored = localStorage.getItem(DROP_RATE_STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('加载爆率设置失败:', error);
  }
  return 1; // 默认值 1 倍
};

// 保存爆率设置到 localStorage
const saveDropRateToStorage = (rate: number) => {
  try {
    localStorage.setItem(DROP_RATE_STORAGE_KEY, rate.toString());
  } catch (error) {
    console.error('保存爆率设置失败:', error);
  }
};

// 加载奖品列表
const loadPrizesFromStorage = (): Prize[] => {
  try {
    const stored = localStorage.getItem(PRIZES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('加载奖品列表失败:', error);
  }
  return [];
};

// 保存奖品列表
const savePrizesToStorage = (prizes: Prize[]) => {
  try {
    localStorage.setItem(PRIZES_STORAGE_KEY, JSON.stringify(prizes));
  } catch (error) {
    console.error('保存奖品列表失败:', error);
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [cardCount, setCardCountState] = useState<number>(10);
  const [isCardCountSet, setIsCardCountSet] = useState<boolean>(false);
  const [dropRate, setDropRateState] = useState<number>(30);
  const [prizes, setPrizesState] = useState<Prize[]>([]);

  const handleStorageUpdate = () => {
    const count = loadCardCountFromStorage();
    setCardCountState(count <= 0 ? 10 : count);
    const rate = loadDropRateFromStorage();
    setDropRateState(rate);
    const storedPrizes = loadPrizesFromStorage();
    setPrizesState(storedPrizes);
  };

  // 初始化设置
  useEffect(() => {
    const darkMode = loadDarkModeFromCookie();
    const count = loadCardCountFromStorage();
    const isSet = localStorage.getItem(IS_CARD_COUNT_SET_KEY) === 'true';
    const rate = loadDropRateFromStorage();
    const storedPrizes = loadPrizesFromStorage();

    setIsDarkMode(darkMode);
    // 初始化时，如果卡片数量为 0 或 -1，强制设为 10
    const finalCount = count <= 0 ? 10 : count;
    setCardCountState(finalCount);
    setIsCardCountSet(isSet);
    setDropRateState(rate);
    setPrizesState(storedPrizes);

    // 如果初始化发现是非法值，且已经设置过，同步回存储
    if (isSet && count <= 0) {
      saveCardCountToStorage(10);
    }

    // 应用主题到文档
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    window.addEventListener('storage-settings-updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate); // 监听跨标签页更新

    return () => {
      window.removeEventListener('storage-settings-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // 切换明暗模式
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    saveDarkModeToCookie(newDarkMode);

    // 应用主题到文档
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  // 设置卡片数量
  const setCardCount = (count: number) => {
    if (count > 0) {
      setCardCountState(count);
      saveCardCountToStorage(count);
      setIsCardCountSet(true);
      localStorage.setItem(IS_CARD_COUNT_SET_KEY, 'true');
    }
  };

  // 内部更新卡片数量（用于回收积分等逻辑，不改变 isCardCountSet 状态）
  const updateCardCount = (count: number) => {
    setCardCountState(count);
    saveCardCountToStorage(count);
    // 触发一个自定义事件，通知其他可能的监听者
    window.dispatchEvent(new Event('storage-settings-updated'));
  };

  // 设置爆率
  const setDropRate = (rate: number) => {
    if (rate >= 1) {
      setDropRateState(rate);
      saveDropRateToStorage(rate);
      window.dispatchEvent(new Event('storage-settings-updated'));
    }
  };

  // 添加奖品
  const addPrize = (name: string, price: number) => {
    const newPrize: Prize = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      price,
    };
    const newPrizes = [...prizes, newPrize];
    setPrizesState(newPrizes);
    savePrizesToStorage(newPrizes);
    window.dispatchEvent(new Event('storage-settings-updated'));
  };

  // 删除奖品
  const removePrize = (id: string) => {
    const newPrizes = prizes.filter(p => p.id !== id);
    setPrizesState(newPrizes);
    savePrizesToStorage(newPrizes);
    window.dispatchEvent(new Event('storage-settings-updated'));
  };

  // 更新奖品
  const updatePrize = (id: string, name: string, price: number) => {
    const newPrizes = prizes.map(p => p.id === id ? { ...p, name, price } : p);
    setPrizesState(newPrizes);
    savePrizesToStorage(newPrizes);
    window.dispatchEvent(new Event('storage-settings-updated'));
  };

  // 清除所有奖品
  const clearPrizes = () => {
    setPrizesState([]);
    savePrizesToStorage([]);
    window.dispatchEvent(new Event('storage-settings-updated'));
  };

  const resetSettings = () => {
    setCardCountState(10);
    setIsCardCountSet(false);
    setDropRateState(1);
    setPrizesState([]);
    localStorage.removeItem(CARD_COUNT_STORAGE_KEY);
    localStorage.removeItem(IS_CARD_COUNT_SET_KEY);
    localStorage.removeItem(DROP_RATE_STORAGE_KEY);
    localStorage.removeItem(PRIZES_STORAGE_KEY);
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    cardCount,
    setCardCount,
    updateCardCount,
    isCardCountSet,
    dropRate,
    setDropRate,
    prizes,
    addPrize,
    removePrize,
    updatePrize,
    clearPrizes,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};