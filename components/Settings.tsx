"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/settings";
import { useStudents } from "@/lib/store";

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, cardCount, setCardCount, isCardCountSet, resetSettings } = useSettings();
  const { students, clearAllData } = useStudents();
  const [inputValue, setInputValue] = useState<string>(cardCount.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 锁定逻辑：只要设置过一次就被锁定
  const isLocked = isCardCountSet;

  // 当外部 cardCount 改变时（例如通过清除、初始化或回收），同步更新本地 inputValue
  React.useEffect(() => {
    setInputValue(cardCount.toString());
  }, [cardCount]);

  const handleSave = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setIsSaving(true);
      setCardCount(numValue);
      // 模拟保存效果
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleResetAll = () => {
    // 仅清除卡片数量设置，不清除学生列表
    resetSettings();
    setShowResetConfirm(false);
  };

  const handleCardCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue <= 0) {
      setInputValue(cardCount.toString());
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            设置
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            管理您的应用偏好和主题。
          </p>
        </div>

        <div className="space-y-12">
          {/* Theme Section */}
          <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-sm font-medium text-black dark:text-white uppercase tracking-wider">
                  外观
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  自定义界面在您设备上的显示方式。
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {isDarkMode ? (
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {isDarkMode ? '深色模式' : '浅色模式'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        当前正在使用 {isDarkMode ? '深色' : '浅色'} 主题
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-black bg-zinc-200 dark:bg-zinc-700"
                  >
                    <span
                      className={`${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Card Settings Section */}
          <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-sm font-medium text-black dark:text-white uppercase tracking-wider">
                  卡片配置
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  调整积分卡总数
                </p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                      <label htmlFor="cardCount" className="text-sm font-medium text-black dark:text-white">
                        每页卡片数
                      </label>
                      <div className="flex items-center gap-3">
                        {isLocked && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">剩余</span>
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                              {Math.max(0, cardCount - students.reduce((acc, s) => acc + (s.credit || 0), 0))}
                            </span>
                          </div>
                        )}
                        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                          总计 {cardCount}
                        </span>
                      </div>
                    </div>
                  <div className="flex gap-3">
                    <input
                      id="cardCount"
                      type="number"
                      min="1"
                      max="100"
                      value={inputValue}
                      onChange={handleCardCountChange}
                      onBlur={handleInputBlur}
                      disabled={isLocked}
                      className={`flex-1 h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                        isLocked ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900' : ''
                      }`}
                      placeholder="输入数量"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const newValue = Math.max(1, parseInt(inputValue, 10) - 5);
                          setInputValue(newValue.toString());
                        }}
                        disabled={isLocked}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors ${
                          isLocked ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const newValue = Math.min(100, parseInt(inputValue, 10) + 5);
                          setInputValue(newValue.toString());
                        }}
                        disabled={isLocked}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors ${
                          isLocked ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 italic">
                        提示：使用按钮可以快速调整 5 个单位。
                      </p>
                      {isLocked && (
                        <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">
                          设置已锁定。如需更改请先在下方重置。
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || isLocked}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSaving || isLocked
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                          : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-95'
                      }`}
                    >
                      {isSaving ? '保存中...' : '保存设置'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border-t border-red-100 dark:border-red-900/30 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                  危险区域
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  重置应用设置。
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                  {!showResetConfirm ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          重置卡片设置
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          清除已保存的卡片数量设置，解锁编辑功能。
                        </p>
                      </div>
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        重置设置
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        确定要重置卡片设置吗？
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleResetAll}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          确定重置
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            FishBall Cards 设置 • 版本 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};
