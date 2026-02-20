"use client";

import React, { useState } from 'react';
import { useStudents } from '@/lib/store';
import { DrawCreditModal } from './DrawCreditModal';
import { DrawPrizeModal } from './DrawPrizeModal';
import { GiftPointsModal } from './GiftPointsModal';
import { ConfirmModal } from './ConfirmModal';
import { Exchange } from './Exchange';
import { Student } from '@/lib/types';

export const StudentList: React.FC = () => {
  const { students, selectedClass, setSelectedClass, filteredStudents, removeStudent, updateStudentCredit } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isDrawPrizeModalOpen, setIsDrawPrizeModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [drawChances, setDrawChances] = useState(1);
  const [drawPrizeChances, setDrawPrizeChances] = useState(1);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取所有唯一的班级
  const allClasses = Array.from(new Set(students.map(student => student.class)));

  // 应用搜索过滤
  const displayedStudents = filteredStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsActionModalOpen(true);
  };

  const handleStartDraw = () => {
    setIsActionModalOpen(false);
    setIsDrawModalOpen(true);
  };

  const handleStartDrawPrize = () => {
    setIsActionModalOpen(false);
    setDrawPrizeChances(1);
    setIsDrawPrizeModalOpen(true);
  };

  const handleStartGift = () => {
    setIsActionModalOpen(false);
    setIsGiftModalOpen(true);
  };

  const handleGiftSuccess = (chances: number) => {
    setIsGiftModalOpen(false);
    // 强制更新选中的学生状态，确保后续弹窗拿到最新数据
    if (selectedStudent) {
      const updatedStudent = students.find(s => s.id === selectedStudent.id);
      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
      }
    }
    setDrawPrizeChances(chances);
    // 延迟打开抽奖弹窗，避免状态更新冲突
    setTimeout(() => {
      setIsDrawPrizeModalOpen(true);
    }, 100);
  };

  const handleStartExchange = () => {
    setIsActionModalOpen(false);
    setIsExchangeOpen(true);
  };

  const handleAddPoints = () => {
    if (selectedStudent) {
      const currentCredit = selectedStudent.credit || 0;
      updateStudentCredit(selectedStudent.id, currentCredit + pointsToAdd);
      setIsAddPointsModalOpen(false);
      setPointsToAdd(1);
      // 更新本地状态以反映变化
      const updatedStudent = { ...selectedStudent, credit: currentCredit + pointsToAdd };
      setSelectedStudent(updatedStudent);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 搜索和班级筛选器 */}
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl leading-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-all"
            placeholder="搜索学生姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">班级筛选：</span>
          <div className="flex gap-2 flex-wrap flex-1">
            <button
              onClick={() => setSelectedClass('全部')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedClass === '全部'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              全部 ({students.length})
            </button>
            {allClasses.map(className => {
              const count = students.filter(s => s.class === className).length;
              return (
                <button
                  key={className}
                  onClick={() => setSelectedClass(className)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedClass === className
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {className} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 学生操作选择弹窗 */}
      {isActionModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsActionModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{selectedStudent.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">请选择要进行的操作</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleStartDraw}
                className="flex items-center justify-between px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 dark:bg-black/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <span>抽取积分</span>
                </div>
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={handleStartDrawPrize}
                className="flex items-center justify-between px-6 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 active:scale-[0.98] transition-all group shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:grayscale disabled:active:scale-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                      <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p>抽取奖励</p>
                    <p className="text-[10px] font-normal opacity-80">剩余: {(students.find(s => s.id === selectedStudent.id)?.prizeDrawCount || 0)} 次</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(students.find(s => s.id === selectedStudent.id)?.prizeDrawCount || 0) === 0 && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">需送分获取</span>}
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleStartGift}
                disabled={(students.find(s => s.id === selectedStudent.id)?.credit || 0) < 1}
                className="flex items-center justify-between px-6 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 active:scale-[0.98] transition-all group shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:grayscale disabled:active:scale-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p>送礼物</p>
                    <p className="text-[10px] font-normal opacity-80">送1分得2次抽奖</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(students.find(s => s.id === selectedStudent.id)?.credit || 0) < 1 && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">积分不足</span>}
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={handleStartExchange}
                className="flex items-center justify-between px-6 py-4 bg-yellow-400 text-black rounded-2xl font-bold hover:bg-yellow-500 active:scale-[0.98] transition-all group shadow-lg shadow-yellow-400/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/5">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                      <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                  </div>
                  <span>积分兑换</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">{(students.find(s => s.id === selectedStudent.id)?.credit || 0)} 积分</span>
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsActionModalOpen(false);
                  setIsAddPointsModalOpen(true);
                }}
                className="flex items-center justify-between px-6 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all group shadow-lg shadow-blue-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span>直接加分</span>
                </div>
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button 
              onClick={() => setIsActionModalOpen(false)}
              className="w-full mt-6 py-3 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 兑换中心弹窗 */}
      {isExchangeOpen && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsExchangeOpen(false)} />
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-black rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsExchangeOpen(false)}
              className="absolute top-6 right-6 z-[70] p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-y-auto">
              <Exchange student={selectedStudent} />
            </div>
          </div>
        </div>
      )}

      {/* 直接加分弹窗 */}
      {isAddPointsModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddPointsModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">给 {selectedStudent.name} 加分</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">请输入要添加的积分数量</p>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={() => setPointsToAdd(Math.max(1, pointsToAdd - 1))}
                className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                -
              </button>
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 w-16 text-center">
                {pointsToAdd}
              </div>
              <button 
                onClick={() => setPointsToAdd(pointsToAdd + 1)}
                className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {[1, 5, 10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => setPointsToAdd(val)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    pointsToAdd === val 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddPoints}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
              >
                确认添加
              </button>
              <button 
                onClick={() => setIsAddPointsModalOpen(false)}
                className="w-full py-3 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 学生列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStudents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-zinc-400 dark:text-zinc-600 text-lg mb-2">暂无匹配学生</div>
            <div className="text-zinc-500 dark:text-zinc-500 text-sm">
              {searchQuery ? '尝试更换搜索关键词' : '点击添加按钮来添加第一个学生'}
            </div>
          </div>
        ) : (
          displayedStudents.map(student => (
            <div
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-lg mb-1">
                    {student.name}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {student.class}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      积分：{student.credit || 0}
                    </span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-2">
                    {student.createdAt.toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStudentToDelete(student);
                    setIsDeleteConfirmOpen(true);
                  }}
                  className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                  title="删除学生"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 抽取积分弹窗 */}
      <DrawCreditModal
        isOpen={isDrawModalOpen}
        student={selectedStudent}
        onClose={() => setIsDrawModalOpen(false)}
      />

      {/* 抽取奖励弹窗 */}
      <DrawPrizeModal
        isOpen={isDrawPrizeModalOpen}
        student={selectedStudent}
        onClose={() => setIsDrawPrizeModalOpen(false)}
        initialDrawChances={drawPrizeChances}
      />

      {/* 送礼物弹窗 */}
      <GiftPointsModal
        isOpen={isGiftModalOpen}
        fromStudent={selectedStudent}
        onClose={() => setIsGiftModalOpen(false)}
        onGiftSuccess={handleGiftSuccess}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="确认删除"
        message={`确定要删除学生 ${studentToDelete?.name} 吗？删除后该学生账号上的积分将自动收回。`}
        confirmText="确认删除"
        variant="danger"
        onConfirm={() => {
          if (studentToDelete) {
            removeStudent(studentToDelete.id);
          }
        }}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setStudentToDelete(null);
        }}
      />
    </div>
  );
};