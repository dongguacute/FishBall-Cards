"use client";

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { generateRandomCredit } from '@/lib/random';
import { useSettings } from '@/lib/settings';
import { useStudents } from '@/lib/store';

interface DrawCreditModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DrawCreditModal: React.FC<DrawCreditModalProps> = ({ student, isOpen, onClose }) => {
  const { cardCount, updateCardCount, dropRate } = useSettings();
  const { updateStudentCredit, students } = useStudents();
  const [drawnValue, setDrawnValue] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const handleDraw = () => {
    setIsDrawing(true);
    setError(null);

    // 计算当前所有学生已领取的积分总和
    const totalUsedCredits = students.reduce((acc, s) => acc + (s.credit || 0), 0);
    // 真正的剩余可用积分 = 总卡片数 - 已领取积分
    const actualRemaining = Math.max(0, cardCount - totalUsedCredits);

    // 模拟抽取动画效果
    setTimeout(() => {
      try {
        console.log('开始抽奖, cardCount(总):', cardCount, '已用:', totalUsedCredits, '剩余:', actualRemaining, 'dropRate:', dropRate);
        const value = generateRandomCredit(
          1, 
          actualRemaining.toString(), 
          student, 
          updateStudentCredit,
          (newRemaining) => {
            // 这里我们不需要更新 cardCount，因为 cardCount 在 settings 中是总数
            // 但我们需要确保这个逻辑是闭环的
          },
          dropRate
        );
        
        if (value === 0) {
          setError('卡没了');
        } else {
          console.log('抽奖成功, 获得:', value);
          setDrawnValue(value);
        }
      } catch (err: any) {
        console.error('抽取积分失败:', err);
        setError('抽取失败，请重试');
      } finally {
        setIsDrawing(false);
      }
    }, 800);
  };

  const handleClose = () => {
    setDrawnValue(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            为 {student.name} 抽取积分
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            点击下方按钮随机抽取 1-{dropRate} 积分
          </p>

          <div className="relative h-32 flex items-center justify-center mb-8">
            {isDrawing ? (
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce"></div>
              </div>
            ) : error ? (
              <div className="animate-in fade-in zoom-in duration-300 text-center">
                <div className="text-4xl mb-2">😅</div>
                <p className="text-red-500 font-bold">{error}</p>
              </div>
            ) : drawnValue !== null ? (
              <div className="animate-in zoom-in duration-300">
                <span className="text-6xl font-black text-zinc-900 dark:text-zinc-100">
                  +{drawnValue}
                </span>
              </div>
            ) : (
              <div className="w-24 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                <span className="text-4xl text-zinc-300 dark:text-zinc-600">?</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {drawnValue === null && !error ? (
              <button
                onClick={handleDraw}
                disabled={isDrawing}
                className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDrawing ? '抽取中...' : '开始抽取'}
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                {error ? '好吧' : '太棒了！'}
              </button>
            )}
            
            {!isDrawing && drawnValue === null && !error && (
              <button
                onClick={onClose}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};