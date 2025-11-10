'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '@/hooks/modalStorage';

export default function GlobalModal() {
  const modals = useModalStore((s) => s.modals);
  const closeModal = useModalStore((s) => s.closeModal);

  // Bloqueo de scroll cuando hay modales abiertos
  useEffect(() => {
    if (modals.length > 0) {
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
  }, [modals.length]);

  if (modals.length === 0) return null;

  return createPortal(
    <>
      {modals.map((modal, index) => {
        const width = modal.size?.width ?? '90%';
        const height = modal.size?.height ?? '90%';
        // const zIndex = 1000 + index * 10;

        return (
          <div
            key={modal.id}
            className="fixed inset-0 flex items-center justify-center"
            style={{
              //zIndex,
              backgroundColor:
                index === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
            }}
            onClick={() => closeModal(modal.id)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-2"
              style={{ width, height }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <EscListener
                onEsc={() => closeModal(modal.id)}
                isTopModal={index === modals.length - 1}
              />
              {modal.content}
            </div>
          </div>
        );
      })}
    </>,
    document.body
  );
}

function EscListener({
  onEsc,
  isTopModal
}: {
  onEsc: () => void;
  isTopModal: boolean;
}) {
  useEffect(() => {
    // Solo el modal superior debe responder a ESC
    if (!isTopModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onEsc();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEsc, isTopModal]);

  return null;
}
