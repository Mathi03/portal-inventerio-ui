'use client';

import { useModalStore } from '@/hooks/modalStorage';

export default function Modal() {
  const {
    isOpen,
    content,
    closeModal,
    height = '90%',
    width = '90%'
  } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div
        className="bg-white p-2 rounded-xl shadow-lg"
        style={{ width, height }}
      >
        {content}
      </div>
    </div>
  );
}
