"use client";

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { useStudents } from '@/lib/store';
import { giftPoints } from '@/lib/exchange';

interface GiftPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromStudent: Student | null;
  onGiftSuccess: (drawChances: number) => void;
}

export const GiftPointsModal: React.FC<GiftPointsModalProps> = ({
  isOpen,
  onClose,
  fromStudent,
  onGiftSuccess,
}) => {
  const { students, updateStudentCredit, updateStudentPrizeDrawCount } = useStudents();
  
  // 获取最新的学生数据
  const currentFromStudent = students.find(s => s.id === fromStudent?.id) || fromStudent;

  const [selectedToStudentId, setSelectedToStudentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !currentFromStudent) return null;

  // 过滤掉自己，并限制为同班同学，同时支持搜索
  const otherStudents = students.filter(s => 
    s.id !== currentFromStudent.id && 
    s.class === currentFromStudent.class &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.class.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleGift = async () => {
    if (!selectedToStudentId) {
      setError('请选择接收礼物的学生');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // 模拟一点延迟增加仪式感
    setTimeout(() => {
      const result = giftPoints(
        currentFromStudent.id,
        selectedToStudentId,
        (id, newCredit) => updateStudentCredit(id, newCredit),
        (id, newCount) => updateStudentPrizeDrawCount(id, newCount)
      );

      if (result.success) {
        onGiftSuccess(result.drawChances);
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">送礼物</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl">🎁</div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">规则</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  送出 <span className="text-yellow-600 dark:text-yellow-400 font-bold">1 积分</span> 给 <span className="text-blue-600 dark:text-blue-400 font-bold">同班</span> 同学，
                  你将获得 <span className="text-yellow-600 dark:text-yellow-400 font-bold">2 次</span> 抽奖机会！
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">选择接收礼物的 <span className="text-blue-600 dark:text-blue-400 font-bold">{currentFromStudent.class}</span> 同学</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="搜索姓名或班级..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="max-h-48 overflow-y-auto border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-1 space-y-1">
                {otherStudents.length > 0 ? (
                  otherStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedToStudentId(s.id);
                        setError(null);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        selectedToStudentId === s.id
                          ? 'bg-yellow-400 text-black shadow-md scale-[1.02]'
                          : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-sm">{s.name}</p>
                      </div>
                      {selectedToStudentId === s.id && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center py-4 text-sm text-zinc-500">没找到其他同学</p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleGift}
                disabled={isSubmitting || !selectedToStudentId}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在送出...
                  </>
                ) : (
                  <>
                    <span>确认送出礼物</span>
                    <span className="text-xs opacity-60 font-normal">(扣除 1 积分)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};