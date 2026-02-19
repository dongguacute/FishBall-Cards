"use client";

import React, { useState } from 'react';
import { useStudents } from '@/lib/store';
import { DrawCreditModal } from './DrawCreditModal';
import { Student } from '@/lib/types';

export const StudentList: React.FC = () => {
  const { students, selectedClass, setSelectedClass, filteredStudents, removeStudent } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);

  // 获取所有唯一的班级
  const allClasses = Array.from(new Set(students.map(student => student.class)));

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 班级筛选器 */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">班级筛选：</span>
        <div className="flex gap-2 flex-wrap">
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

      {/* 学生列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-zinc-400 dark:text-zinc-600 text-lg mb-2">暂无学生</div>
            <div className="text-zinc-500 dark:text-zinc-500 text-sm">点击添加按钮来添加第一个学生</div>
          </div>
        ) : (
          filteredStudents.map(student => (
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
                    removeStudent(student.id);
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
    </div>
  );
};