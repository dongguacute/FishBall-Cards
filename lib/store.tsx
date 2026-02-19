"use client";

import React, { createContext, useContext, useState } from 'react';
import { Student } from './types';

interface StudentContextType {
  students: Student[];
  addStudent: (name: string, studentClass: string) => void;
  removeStudent: (id: string) => void;
  selectedClass: string;
  setSelectedClass: (className: string) => void;
  filteredStudents: Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('全部');

  const addStudent = (name: string, studentClass: string) => {
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      class: studentClass,
      createdAt: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const filteredStudents = selectedClass === '全部'
    ? students
    : students.filter(student => student.class === selectedClass);

  const value = {
    students,
    addStudent,
    removeStudent,
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