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
  resetSettings: () => void;
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

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [cardCount, setCardCountState] = useState<number>(10);
  const [isCardCountSet, setIsCardCountSet] = useState<boolean>(false);

  const handleStorageUpdate = () => {
    const count = loadCardCountFromStorage();
    setCardCountState(count <= 0 ? 10 : count);
  };

  // 初始化设置
  useEffect(() => {
    const darkMode = loadDarkModeFromCookie();
    const count = loadCardCountFromStorage();
    const isSet = localStorage.getItem(IS_CARD_COUNT_SET_KEY) === 'true';

    setIsDarkMode(darkMode);
    // 初始化时，如果卡片数量为 0 或 -1，强制设为 10
    const finalCount = count <= 0 ? 10 : count;
    setCardCountState(finalCount);
    setIsCardCountSet(isSet);

    // 如果初始化发现是非法值，同步回存储
    if (count <= 0) {
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

  const resetSettings = () => {
    setCardCountState(10);
    setIsCardCountSet(false);
    localStorage.removeItem(CARD_COUNT_STORAGE_KEY);
    localStorage.removeItem(IS_CARD_COUNT_SET_KEY);
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    cardCount,
    setCardCount,
    updateCardCount,
    isCardCountSet,
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