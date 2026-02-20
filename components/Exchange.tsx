"use client";

import React, { useState, useEffect } from "react";
import { Student } from "@/lib/types";
import { useStudents } from "@/lib/store";
import { 
  getAvailablePrizes, 
  getStudentRewards, 
  buyPrize, 
  useReward,
  StudentReward 
} from "@/lib/exchange";

interface ExchangeProps {
  student: Student;
}

export const Exchange: React.FC<ExchangeProps> = ({ student }) => {
  const { updateStudentCredit, students } = useStudents();
  
  // 获取最新的学生数据
  const currentStudent = students.find(s => s.id === student.id) || student;

  const [studentRewards, setStudentRewards] = useState<StudentReward[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const [isMounted, setIsMounted] = useState(false);

  // 加载该学生的已拥有奖励
  const loadRewards = () => {
    const allRewards = getStudentRewards();
    // 过滤出当前学生的奖励
    setStudentRewards(allRewards.filter(r => r.studentId === currentStudent.id));
  };

  useEffect(() => {
    setIsMounted(true);
    loadRewards();
    
    const handleUpdate = () => {
      loadRewards();
    };
    
    window.addEventListener('storage-settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    return () => {
      window.removeEventListener('storage-settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentStudent.id]);

  const handleBuy = (prizeId: string) => {
    const result = buyPrize(currentStudent.id, prizeId, (sId, newCredit) => {
      // 同步更新全局 store 中的学生积分
      updateStudentCredit(sId, newCredit);
    });

    if (result.success) {
      setMessage({ text: '兑换成功！', type: 'success' });
      loadRewards();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }

    setTimeout(() => setMessage({ text: '', type: null }), 3000);
  };

  const handleUseReward = (rewardId: string) => {
    const result = useReward(rewardId);
    if (result.success) {
      loadRewards();
    }
  };

  const availablePrizes = getAvailablePrizes();

  return (
    <div className="bg-white dark:bg-black font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
              {currentStudent.name} 的兑换中心
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              班级：{currentStudent.class}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              可用积分
            </span>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
              <span className="text-xl font-bold text-black dark:text-white font-mono">
                {currentStudent.credit || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message.text && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] transition-all animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] sm:w-auto text-center ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prizes Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              可兑换奖励
            </h2>
            
            {availablePrizes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePrizes.map((prize) => (
                  <div 
                    key={prize.id}
                    className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">所需积分</span>
                        <span className="text-base font-bold text-black dark:text-white font-mono">{prize.price}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-black dark:text-white mb-3">{prize.name}</h3>
                    <button
                      onClick={() => handleBuy(prize.id)}
                      disabled={(student.credit || 0) < prize.price}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                        (student.credit || 0) >= prize.price
                          ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-md shadow-black/10 dark:shadow-white/5'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      {(student.credit || 0) >= prize.price ? '立即兑换' : '积分不足'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-2xl">
                <p className="text-xs text-zinc-400">商店空空如也，请在设置中添加奖品。</p>
              </div>
            )}
          </div>

          {/* Owned Rewards Sidebar */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              已兑换 ({studentRewards.length})
            </h2>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {studentRewards.length > 0 ? (
                [...studentRewards].reverse().map((reward) => (
                  <div 
                    key={reward.id}
                    className={`p-3 rounded-xl border shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500 transition-all ${
                      reward.used 
                        ? 'border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-60' 
                        : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      reward.used 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' 
                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-500'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${
                        reward.used ? 'text-zinc-500 line-through' : 'text-black dark:text-white'
                      }`}>
                        {reward.prizeName}
                      </p>
                      <p className="text-[9px] text-zinc-400 font-mono mt-0.5">
                        {isMounted ? new Date(reward.purchaseDate).toLocaleString('zh-CN') : ''}
                      </p>
                    </div>
                    {!reward.used && (
                      <button
                        onClick={() => handleUseReward(reward.id)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-green-500 transition-colors"
                        title="标记为已使用"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] text-zinc-400">尚未兑换任何奖励</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
        }
      `}</style>
    </div>
  );
};
