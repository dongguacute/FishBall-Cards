"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student } from './types';
import { useSettings } from './settings';

interface StudentContextType {
  students: Student[];
  addStudent: (name: string, studentClass: string) => void;
  removeStudent: (id: string) => void;
  updateStudentCredit: (id: string, newCredit: number) => void;
  clearAllData: () => void;
  selectedClass: string;
  setSelectedClass: (className: string) => void;
  filteredStudents: Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// localStorage 键名
const STUDENTS_STORAGE_KEY = 'fishball-cards-students';

// 从 localStorage 加载学生数据
const loadStudentsFromStorage = (): Student[] => {
  try {
    const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 将 createdAt 字符串转换回 Date 对象
      return parsed.map((student: any) => ({
        ...student,
        createdAt: new Date(student.createdAt)
      }));
    }
  } catch (error) {
    console.error('加载学生数据失败:', error);
  }
  return [];
};

// 保存学生数据到 localStorage
const saveStudentsToStorage = (students: Student[]) => {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('保存学生数据失败:', error);
  }
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('全部');
  const { cardCount, updateCardCount } = useSettings();

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const storedStudents = loadStudentsFromStorage();
    setStudents(storedStudents);
  }, []);

  const addStudent = (name: string, studentClass: string) => {
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      class: studentClass,
      createdAt: new Date(),
      credit: 0,
    };
    setStudents(prev => {
      const updatedStudents = [...prev, newStudent];
      saveStudentsToStorage(updatedStudents);
      return updatedStudents;
    });
  };

  const removeStudent = (id: string) => {
    setStudents(prev => {
      const updatedStudents = prev.filter(student => student.id !== id);
      saveStudentsToStorage(updatedStudents);
      return updatedStudents;
    });
  };

  const updateStudentCredit = (id: string, newCredit: number) => {
    setStudents(prev => {
      const updatedStudents = prev.map(student =>
        student.id === id ? { ...student, credit: newCredit } : student
      );
      saveStudentsToStorage(updatedStudents);
      return updatedStudents;
    });
  };

  const clearAllData = () => {
    setStudents([]);
    localStorage.removeItem(STUDENTS_STORAGE_KEY);
    // 这里可以添加其他需要清除的数据
  };

  const filteredStudents = selectedClass === '全部'
    ? students
    : students.filter(student => student.class === selectedClass);

  const value = {
    students,
    addStudent,
    removeStudent,
    updateStudentCredit,
    clearAllData,
    selectedClass,
    setSelectedClass,
    filteredStudents,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};