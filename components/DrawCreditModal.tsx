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

export const DrawCreditModal: React.FC<DrawCreditModalProps> = ({ 
  student, 
  isOpen, 
  onClose
}) => {
  const { cardCount, dropRate, isCardCountSet } = useSettings();
  const { updateStudentCredit, students } = useStudents();
  
  // 获取最新的学生数据
  const currentStudent = students.find(s => s.id === student?.id) || student;

  const [drawnValue, setDrawnValue] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(true);

  // 当弹窗打开时，重置状态
  React.useEffect(() => {
    if (isOpen) {
      setDrawnValue(null);
      setError(null);
      setCanClose(true);
    }
  }, [isOpen]);

  if (!isOpen || !currentStudent) return null;

  const handleDraw = () => {
    if (!isCardCountSet) {
      setError('请先在设置中设置卡片总数');
      return;
    }

    setIsDrawing(true);
    setError(null);
    setDrawnValue(null);
    setCanClose(false);

    // 计算当前所有学生已领取的积分总和
    const totalUsedCredits = students.reduce((acc, s) => acc + (s.credit || 0), 0);
    // 真正的剩余可用积分 = 总卡片数 - 已领取积分
    const actualRemaining = Math.max(0, cardCount - totalUsedCredits);

    // 模拟抽取动画效果
    setTimeout(() => {
      try {
        const value = generateRandomCredit(
          1, 
          actualRemaining.toString(), 
          currentStudent, 
          updateStudentCredit,
          (newRemaining) => {
            // 这里我们不需要更新 cardCount，因为 cardCount 在 settings 中是总数
          },
          dropRate
        );
        
        if (value === 0) {
          setError('卡没了');
          setCanClose(true);
        } else {
          setDrawnValue(value);
          // 抽取成功后，延迟 1.5 秒才允许关闭，且不提供“继续抽取”按钮
          setTimeout(() => {
            setCanClose(true);
          }, 1500);
        }
      } catch (err: any) {
        console.error('抽取积分失败:', err);
        setError('抽取失败，请重试');
        setCanClose(true);
      } finally {
        setIsDrawing(false);
      }
    }, 800);
  };

  const handleClose = () => {
    if (!canClose) return;
    setDrawnValue(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            为 {currentStudent.name} 抽取积分卡
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            点击下方按钮随机抽取 1-{dropRate} 积分卡
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
            ) : error ? (
              <button
                onClick={handleClose}
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                好吧
              </button>
            ) : (
              <button
                onClick={handleClose}
                disabled={!canClose}
                className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {canClose ? '完成' : '请稍候...'}
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