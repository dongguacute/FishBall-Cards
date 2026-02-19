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
  onSuccess?: (newRemaining: number) => void,
  multiplier: number = 1
): number {
  if (!max) {
    return 0;
  }

  const baseMax = parseInt(max, 10);
  
  // 爆率随机数必须小于等于卡片现有总数
  // 实际抽取的最大值应该是 multiplier 和 baseMax 之间的较小值
  const actualMax = Math.min(multiplier, baseMax);

  if (actualMax < min) {
    return 0;
  }

  const randomValue = Math.floor(Math.random() * (actualMax - min + 1)) + min;
  
  // 计算积分卡剩余数量并保存
  const remainingCredit = baseMax - randomValue;
  
  // 注意：这里我们不再直接向 localStorage 写入 fishball-cards-count
  // 因为在 DrawCreditModal 中我们是基于 (总卡片数 - 已领积分) 计算的
  // 这里的 baseMax 已经是计算后的“剩余值”了
  
  try {
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