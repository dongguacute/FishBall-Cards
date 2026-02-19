"use client";


// 获取现有积分卡剩余数量
export const MaxCredit = typeof window !== 'undefined' ? localStorage.getItem('fishball-cards-count') : null;

// 生成随机积分卡数量
export function generateRandomCredit(min: number, max: string | null): number {
  if (!max) {
    throw new Error('MaxCredit is not set');
  }
  const maxValue = parseInt(max, 10);
  const randomValue = Math.floor(Math.random() * (maxValue - min + 1)) + min;
  // 计算积分卡剩余数量并保存
  const credit = maxValue - randomValue;
  try {
    localStorage.setItem('fishball-cards-count', credit.toString());
  } catch (error) {
    console.error('Failed to save random credit:', error);
    return 0;
  }
  return randomValue;
}