"use client";

import React, { useState } from "react";
import { StudentProvider } from "@/lib/store";
import { FloatingDock } from "@/components/FloatingDock";
import { StudentList } from "@/components/StudentList";
import { AddStudentModal } from "@/components/AddStudentModal";

function HomeContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* 学生列表区域 */}
      <div className="container mx-auto px-4 py-8">

        <StudentList />
      </div>

      {/* 浮动操作栏 */}
      <FloatingDock onAddStudent={() => setIsAddModalOpen(true)} activeTab="students" />

      {/* 添加学生模态框 */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
