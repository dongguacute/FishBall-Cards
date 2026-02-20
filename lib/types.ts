export interface Student {
  id: string;
  name: string;
  class: string;
  createdAt: Date;
  credit: number;
  drawCount?: number; // 已抽积分次数
  prizeDrawCount?: number; // 剩余可抽取奖励次数
}