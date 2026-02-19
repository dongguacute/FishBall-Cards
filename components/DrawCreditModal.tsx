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
  const { cardCount, updateCardCount } = useSettings();
  const { updateStudentCredit } = useStudents();
  const [drawnValue, setDrawnValue] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isOpen || !student) return null;

  const handleDraw = () => {
    setIsDrawing(true);
    // 模拟抽取动画效果
    setTimeout(() => {
      try {
        const value = generateRandomCredit(
          1, 
          cardCount.toString(), 
          student, 
          updateStudentCredit
        );
        setDrawnValue(value);
      } catch (error) {
        console.error('抽取积分失败:', error);
      } finally {
        setIsDrawing(false);
      }
    }, 800);
  };

  const handleClose = () => {
    setDrawnValue(null);
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
            点击下方按钮随机抽取 1-{cardCount} 积分
          </p>

          <div className="relative h-32 flex items-center justify-center mb-8">
            {isDrawing ? (
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full animate-bounce"></div>
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
            {drawnValue === null ? (
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
                太棒了！
              </button>
            )}
            
            {!isDrawing && drawnValue === null && (
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