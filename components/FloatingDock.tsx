"use client";

import React from "react";

interface FloatingDockProps {
  onAddStudent?: () => void;
  activeTab?: 'students' | 'add' | 'settings';
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ onAddStudent, activeTab = 'students' }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* 外部容器：提供液态边缘感和多层阴影 */}
      <div className="relative group">
        {/* 简洁的阴影效果 */}
        <div className="absolute -inset-0.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
        
        {/* 主体容器：极简玻璃效果 */}
        <div className="relative flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm overflow-hidden">
          
          {/* 学生列表选项 */}
          <button className={`relative flex items-center gap-2 px-2 sm:px-4 py-1.5 rounded-full transition-colors duration-200 group/item ${
            activeTab === 'students'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors ${
                activeTab === 'students'
                  ? 'text-white dark:text-zinc-900'
                  : 'text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100'
              }`}
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className={`text-sm font-medium transition-colors hidden sm:inline ${
              activeTab === 'students'
                ? 'text-white dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100'
            }`}>
              学生
            </span>
          </button>

          {/* 简洁的分隔线 */}
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* 添加学生选项 */}
          <button
            onClick={onAddStudent}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 group/item ${
              activeTab === 'add'
                ? 'bg-zinc-900 dark:bg-zinc-100'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors ${
                activeTab === 'add'
                  ? 'text-white dark:text-zinc-900'
                  : 'text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100'
              }`}
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>

          {/* 简洁的分隔线 */}
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* 设置选项 */}
          <button className={`relative flex items-center gap-2 px-2 sm:px-4 py-1.5 rounded-full transition-colors duration-200 group/item ${
            activeTab === 'settings'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors ${
                activeTab === 'settings'
                  ? 'text-white dark:text-zinc-900'
                  : 'text-zinc-500 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100'
              }`}
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className={`text-sm font-medium transition-colors hidden sm:inline ${
              activeTab === 'settings'
                ? 'text-white dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100'
            }`}>
              设置
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
