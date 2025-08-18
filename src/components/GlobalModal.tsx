'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '@/hooks/modalStorage';

export default function GlobalModal() {
  const { isOpen, content, size, closeModal } = useModalStore();

  // Bloqueo de scroll + marca en body para estilo global
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const width = size?.width ?? '90%';
  const height = size?.height ?? '90%';

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center"
      onClick={closeModal} // click en backdrop cierra
    >
      <div
        className="bg-white rounded-xl shadow-lg p-2"
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()} // evita cerrar al click interno
        role="dialog"
        aria-modal="true"
      >
        <EscListener onEsc={closeModal} />
        {content}
      </div>
    </div>,
    document.body
  );
}

function EscListener({ onEsc }: { onEsc: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onEsc(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onEsc]);
  return null;
}
