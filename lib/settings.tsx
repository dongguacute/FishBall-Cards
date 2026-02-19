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

  // 初始化设置
  useEffect(() => {
    const darkMode = loadDarkModeFromCookie();
    const count = loadCardCountFromStorage();

    setIsDarkMode(darkMode);
    setCardCountState(count);

    // 应用主题到文档
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
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
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    cardCount,
    setCardCount,
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