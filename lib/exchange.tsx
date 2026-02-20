"use client";

import { Prize } from "./settings";

// localStorage 相关常量
const STUDENT_REWARDS_STORAGE_KEY = 'fishball-student-rewards';
const CARD_COUNT_STORAGE_KEY = 'fishball-cards-count';

/**
 * 学生拥有的奖励记录
 */
export interface StudentReward {
  id: string;
  prizeId: string;
  prizeName: string;
  purchaseDate: number;
  studentId: string;
  used?: boolean;
}

/**
 * 标记奖励为已使用
 */
export function useReward(rewardId: string): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: '环境错误' };
  try {
    const rewards = getStudentRewards();
    const updatedRewards = rewards.map(r => 
      r.id === rewardId ? { ...r, used: true } : r
    );
    localStorage.setItem(STUDENT_REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));
    
    window.dispatchEvent(new Event('storage-settings-updated'));
    window.dispatchEvent(new Event('storage'));
    
    return { success: true, message: '标记成功' };
  } catch (error) {
    console.error('标记奖励使用失败:', error);
    return { success: false, message: '标记失败' };
  }
}

/**
 * 获取所有可购买的奖品列表
 */
export function getAvailablePrizes(): Prize[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('fishball-prizes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载奖品列表失败:', error);
    return [];
  }
}

/**
 * 获取学生已拥有的奖励列表
 */
export function getStudentRewards(): StudentReward[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STUDENT_REWARDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载学生奖励失败:', error);
    return [];
  }
}

/**
 * 获取学生当前积分 (从 students 列表中获取)
 */
export function getStudentPoints(studentId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('fishball-cards-students');
    if (stored) {
      const students = JSON.parse(stored);
      const student = students.find((s: any) => s.id === studentId);
      return student ? (student.credit || 0) : 0;
    }
  } catch (error) {
    return 0;
  }
  return 0;
}

/**
 * 赠送积分并获得抽奖机会
 * @param fromStudentId 赠送者ID
 * @param toStudentId 接收者ID
 * @param onUpdateSuccess 成功后的回调
 * @param onUpdatePrizeDrawCount 成功后更新奖励抽取次数的回调
 * @returns { success: boolean, message: string, drawChances: number }
 */
export function giftPoints(
  fromStudentId: string,
  toStudentId: string,
  onUpdateSuccess?: (studentId: string, newCredit: number) => void,
  onUpdatePrizeDrawCount?: (studentId: string, newCount: number) => void
): { success: boolean; message: string; drawChances: number } {
  if (typeof window === 'undefined') return { success: false, message: '环境错误', drawChances: 0 };
  if (fromStudentId === toStudentId) return { success: false, message: '不能送给自己哦', drawChances: 0 };

  const fromPoints = getStudentPoints(fromStudentId);
  if (fromPoints < 1) {
    return { success: false, message: '积分不足，至少需要 1 积分', drawChances: 0 };
  }

  try {
    const storedStudents = localStorage.getItem('fishball-cards-students');
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      const toPoints = getStudentPoints(toStudentId);
      
      const newFromPoints = fromPoints - 1;
      const newToPoints = toPoints + 1;

      const updatedStudents = students.map((s: any) => {
        if (s.id === fromStudentId) {
          const currentPrizeDrawCount = s.prizeDrawCount || 0;
          return { ...s, credit: newFromPoints, prizeDrawCount: currentPrizeDrawCount + 2 };
        }
        if (s.id === toStudentId) return { ...s, credit: newToPoints };
        return s;
      });

      localStorage.setItem('fishball-cards-students', JSON.stringify(updatedStudents));
      
      if (onUpdateSuccess) {
        onUpdateSuccess(fromStudentId, newFromPoints);
        onUpdateSuccess(toStudentId, newToPoints);
      }

      if (onUpdatePrizeDrawCount) {
        const fromStudent = students.find((s: any) => s.id === fromStudentId);
        onUpdatePrizeDrawCount(fromStudentId, (fromStudent?.prizeDrawCount || 0) + 2);
      }

      // 触发自定义事件
      window.dispatchEvent(new Event('storage-settings-updated'));
      window.dispatchEvent(new Event('storage'));

      return { success: true, message: '赠送成功！获得 2 次抽取奖励机会', drawChances: 2 };
    }
    return { success: false, message: '学生数据不存在', drawChances: 0 };
  } catch (error) {
    console.error('赠送积分失败:', error);
    return { success: false, message: '赠送失败，请稍后重试', drawChances: 0 };
  }
}

/**
 * 随机抽取一个奖品
 * @param studentId 学生ID
 * @returns { success: boolean, prizeName: string, message: string }
 */
export function drawRandomPrize(studentId: string): { success: boolean; prizeName: string; message: string } {
  if (typeof window === 'undefined') return { success: false, prizeName: '', message: '环境错误' };

  const prizes = getAvailablePrizes();
  if (prizes.length === 0) {
    return { success: false, prizeName: '', message: '暂无可用奖品，请联系老师添加' };
  }

  try {
    // 随机选择一个奖品
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];

    // 记录学生奖励
    const studentRewards = getStudentRewards();
    const newReward: StudentReward = {
      id: Math.random().toString(36).substring(2, 9),
      prizeId: prize.id,
      prizeName: prize.name,
      purchaseDate: Date.now(),
      studentId: studentId,
    };
    
    const updatedRewards = [...studentRewards, newReward];
    localStorage.setItem(STUDENT_REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));

    // 触发自定义事件
    window.dispatchEvent(new Event('storage-settings-updated'));
    window.dispatchEvent(new Event('storage'));

    return { success: true, prizeName: prize.name, message: '抽取成功' };
  } catch (error) {
    console.error('抽取奖品失败:', error);
    return { success: false, prizeName: '', message: '抽取失败，请稍后重试' };
  }
}

/**
 * 购买奖品
 * @param studentId 学生ID
 * @param prizeId 奖品ID
 * @param onUpdateSuccess 成功后的回调，用于更新外部状态
 * @returns { success: boolean, message: string }
 */
export function buyPrize(
  studentId: string, 
  prizeId: string,
  onUpdateSuccess?: (studentId: string, newCredit: number) => void
): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: '环境错误' };

  // 1. 获取奖品信息
  const availablePrizes = getAvailablePrizes();
  const prize = availablePrizes.find(p => p.id === prizeId);
  
  if (!prize) {
    return { success: false, message: '奖品不存在' };
  }

  // 2. 检查积分是否足够
  const currentPoints = getStudentPoints(studentId);
  if (currentPoints < prize.price) {
    return { success: false, message: '积分不足' };
  }

  try {
    // 3. 扣除积分 (更新 students 列表)
    const storedStudents = localStorage.getItem('fishball-cards-students');
    if (storedStudents) {
      const students = JSON.parse(storedStudents);
      const newPoints = currentPoints - prize.price;
      const updatedStudents = students.map((s: any) => 
        s.id === studentId ? { ...s, credit: newPoints } : s
      );
      localStorage.setItem('fishball-cards-students', JSON.stringify(updatedStudents));
      
      // 调用回调更新全局 store 状态
      if (onUpdateSuccess) {
        onUpdateSuccess(studentId, newPoints);
      }
    }

    // 4. 记录学生奖励
    const studentRewards = getStudentRewards();
    const newReward: StudentReward = {
      id: Math.random().toString(36).substring(2, 9),
      prizeId: prize.id,
      prizeName: prize.name,
      purchaseDate: Date.now(),
      studentId: studentId, // 增加学生ID标识
    };
    
    const updatedRewards = [...studentRewards, newReward];
    localStorage.setItem(STUDENT_REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));

    // 5. 触发自定义事件
    window.dispatchEvent(new Event('storage-settings-updated'));
    window.dispatchEvent(new Event('storage'));

    return { success: true, message: '购买成功' };
  } catch (error) {
    console.error('购买奖品失败:', error);
    return { success: false, message: '购买失败，请稍后重试' };
  }
}
