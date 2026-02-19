"use client";

import React, { useState } from "react";
import { StudentProvider } from "@/lib/store";
import { FloatingDock } from "@/components/FloatingDock";
import { StudentList } from "@/components/StudentList";
import { AddStudentModal } from "@/components/AddStudentModal";
import { Settings } from "@/components/Settings";

function HomeContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'settings'>('students');

  const handleTabChange = (tab: 'students' | 'settings') => {
    setActiveTab(tab);
  };

  const handleAddStudent = () => {
    if (activeTab === 'students') {
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* 页面内容 */}
      {activeTab === 'students' ? (
        <>
          {/* 学生列表区域 */}
          <div className="container mx-auto px-4 py-8">
            <StudentList />
          </div>

          {/* 添加学生模态框 */}
          <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </>
      ) : (
        <Settings />
      )}

      {/* 浮动操作栏 */}
      <FloatingDock
        onAddStudent={handleAddStudent}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default function Home() {
  return (
    <StudentProvider>
      <HomeContent />
    </StudentProvider>
  );
}
