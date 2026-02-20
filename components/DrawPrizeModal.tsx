"use client";

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { useStudents } from '@/lib/store';
import { drawRandomPrize } from '@/lib/exchange';

interface DrawPrizeModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  initialDrawChances?: number;
}

export const DrawPrizeModal: React.FC<DrawPrizeModalProps> = ({ 
  student, 
  isOpen, 
  onClose,
  initialDrawChances = 1
}) => {
  const { updateStudentPrizeDrawCount, students } = useStudents();
  
  // 获取最新的学生数据
  const currentStudent = students.find(s => s.id === student?.id) || student;

  const [drawnPrize, setDrawnPrize] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawChances, setDrawChances] = useState(initialDrawChances);

  // 当弹窗打开时，根据传入的 initialDrawChances 重置剩余次数
  React.useEffect(() => {
    if (isOpen && currentStudent) {
      // 只有在弹窗刚打开且还没有抽取结果时，才重置状态
      // 避免在抽奖过程中因为 currentStudent.prizeDrawCount 变化而导致 drawnPrize 被重置为 null
      if (drawnPrize === null && !isDrawing) {
        const currentChances = currentStudent.prizeDrawCount || 0;
        setDrawChances(currentChances > 0 ? currentChances : initialDrawChances);
        setDrawnPrize(null);
        setError(null);
      }
    }
  }, [isOpen]); // 仅在弹窗打开状态变化时触发重置逻辑

  if (!isOpen || !currentStudent) return null;

  const handleDraw = () => {
    // 实时检查学生剩余的奖励抽取次数
    const remainingChances = currentStudent.prizeDrawCount || 0;
    
    if (remainingChances <= 0 && drawChances <= 0) {
      setError('抽取次数已用完，请通过“送礼物”获取次数');
      return;
    }
    
    setIsDrawing(true);
    setError(null);
    setDrawnPrize(null);

    // 模拟抽取动画效果
    setTimeout(() => {
      try {
        // 再次检查次数，防止快速点击导致的并发问题
        const currentRemaining = currentStudent.prizeDrawCount || 0;
        if (currentRemaining <= 0) {
          setError('抽取次数已用完');
          setIsDrawing(false);
          return;
        }

        const result = drawRandomPrize(currentStudent.id);
        console.log('抽奖结果:', result);
        
        if (!result.success) {
          setError(result.message);
          setIsDrawing(false);
        } else {
          // 先设置奖品，再更新次数，确保 UI 渲染正确
          setDrawnPrize(result.prizeName);
          setDrawChances(prev => Math.max(0, prev - 1));
          
          // 更新全局 store
          updateStudentPrizeDrawCount(currentStudent.id, Math.max(0, currentRemaining - 1));
          
          // 延迟停止加载动画，确保结果能被看到
          setTimeout(() => {
            setIsDrawing(false);
          }, 100);
        }
      } catch (err: any) {
        console.error('抽取奖励失败:', err);
        setError('抽取失败，请重试');
        setIsDrawing(false);
      }
    }, 1200);
  };

  const handleClose = () => {
    setDrawnPrize(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            为 {currentStudent.name} 抽取奖励
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            点击下方按钮随机抽取一个精美奖励
          </p>

          <div className="relative h-40 flex items-center justify-center mb-8">
            {isDrawing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-zinc-500 animate-pulse">正在为您挑选奖励...</p>
              </div>
            ) : error ? (
              <div className="animate-in fade-in zoom-in duration-300 text-center">
                <div className="text-5xl mb-3">😅</div>
                <p className="text-red-500 font-bold">{error}</p>
              </div>
            ) : drawnPrize !== null ? (
              <div className="animate-in zoom-in duration-500 text-center">
                <div className="text-5xl mb-4 animate-bounce">🎁</div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">恭喜获得</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 px-4 py-2 bg-yellow-400 dark:text-black rounded-xl inline-block shadow-lg">
                  {drawnPrize}
                </h3>
              </div>
            ) : (
              <div className="w-32 h-40 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-3 group hover:border-yellow-400/50 transition-colors">
                <span className="text-5xl text-zinc-200 dark:text-zinc-700 group-hover:scale-110 transition-transform duration-300">?</span>
                <span className="text-xs text-zinc-400 font-medium">神秘奖励</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(drawnPrize === null || (currentStudent.prizeDrawCount || 0) > 0) && !error ? (
              <button
                onClick={handleDraw}
                disabled={isDrawing || (currentStudent.prizeDrawCount || 0) <= 0}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-zinc-900/10 dark:shadow-none"
              >
                {isDrawing ? '抽取中...' : (currentStudent.prizeDrawCount || 0) > 0 ? (drawnPrize !== null ? '继续抽取' : '开始抽取') : '次数已用完'}
              </button>
            ) : null}

            {(drawnPrize !== null || error) && !isDrawing && (
              <button
                onClick={(currentStudent.prizeDrawCount || 0) > 0 && !error ? handleDraw : handleClose}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  (currentStudent.prizeDrawCount || 0) > 0 && !error
                    ? 'hidden'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {error ? '好吧' : '太棒了！'}
              </button>
            )}
            
            {!isDrawing && drawnPrize === null && !error && (
              <button
                onClick={onClose}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2"
              >
                取消
              </button>
            )}

            {drawnPrize !== null && (currentStudent.prizeDrawCount || 0) > 0 && !isDrawing && (
              <button
                onClick={handleClose}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2"
              >
                结束抽取
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};