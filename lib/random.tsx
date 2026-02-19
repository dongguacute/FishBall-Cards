"use client";

import { Student } from "./types";

// 获取现有积分卡剩余数量
export const MaxCredit = typeof window !== 'undefined' ? localStorage.getItem('fishball-cards-count') : null;

// 生成随机积分卡数量并更新学生积分
export function generateRandomCredit(
  min: number,
  max: string | null,
  student?: Student,
  updateCredit?: (id: string, newCredit: number) => void,
  onSuccess?: (newRemaining: number) => void
): number {
  if (!max) {
    throw new Error('MaxCredit is not set');
  }
  const maxValue = parseInt(max, 10);
  const randomValue = Math.floor(Math.random() * (maxValue - min + 1)) + min;
  
  // 计算积分卡剩余数量并保存
  const remainingCredit = maxValue - randomValue;
  try {
    localStorage.setItem('fishball-cards-count', remainingCredit.toString());
    
    // 如果提供了成功回调，则调用它
    if (onSuccess) {
      onSuccess(remainingCredit);
    }
    
    // 如果提供了学生和更新函数，则更新学生积分
    if (student && updateCredit) {
      const newTotalCredit = (student.credit || 0) + randomValue;
      updateCredit(student.id, newTotalCredit);
    }
  } catch (error) {
    console.error('Failed to save random credit:', error);
    return 0;
  }
  return randomValue;
}