"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/settings";

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode, cardCount, setCardCount } = useSettings();
  const [inputValue, setInputValue] = useState<string>(cardCount.toString());

  const handleCardCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setCardCount(numValue);
    }
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
            Settings
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Manage your application preferences and theme.
          </p>
        </div>

        <div className="space-y-12">
          {/* Theme Section */}
          <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-sm font-medium text-black dark:text-white uppercase tracking-wider">
                  Appearance
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Customize how the interface looks on your device.
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
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Currently using {isDarkMode ? 'dark' : 'light'} theme
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
                  Card Configuration
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Adjust the number of cards displayed in your list.
                </p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <label htmlFor="cardCount" className="text-sm font-medium text-black dark:text-white">
                      Cards per page
                    </label>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {cardCount}
                    </span>
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
                      className="flex-1 h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                      placeholder="Enter count"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const newValue = Math.max(1, cardCount - 5);
                          setInputValue(newValue.toString());
                          setCardCount(newValue);
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const newValue = Math.min(100, cardCount + 5);
                          setInputValue(newValue.toString());
                          setCardCount(newValue);
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-500 italic">
                    Tip: Use the buttons to quickly adjust by 5 units.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            FishBall Cards Settings • Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};
