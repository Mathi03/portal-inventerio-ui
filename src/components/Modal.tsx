// src/components/Modal.tsx
'use client';

import { ReactNode, CSSProperties, useEffect, useRef } from 'react';
import { useModalStore } from '@/hooks/modalStorage';

type ModalProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  size?: { width?: CSSProperties['width']; height?: CSSProperties['height'] };
  refreshKey?: any;
};

export default function Modal({
  open,
  onClose,
  children,
  size,
  refreshKey
}: ModalProps) {
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);
  const replaceContent = useModalStore((s) => s.replaceContent);
  const setSize = useModalStore((s) => s.setSize);
  const isModalOpen = useModalStore((s) => s.isModalOpen);

  const modalIdRef = useRef<string | null>(null);
  const lastRefreshKeyRef = useRef<any>(undefined);
  const lastSizeRef = useRef<typeof size | undefined>(undefined);

  useEffect(() => {
    if (open) {
      // Si el modal no está abierto, abrirlo
      if (!modalIdRef.current || !isModalOpen(modalIdRef.current)) {
        modalIdRef.current = openModal({
          content: children,
          key: refreshKey,
          size,
          onClose: () => {
            modalIdRef.current = null;
            lastRefreshKeyRef.current = undefined;
            lastSizeRef.current = undefined;
            onClose?.();
          }
        });
        lastRefreshKeyRef.current = refreshKey;
        lastSizeRef.current = size;
      } else {
        // El modal ya está abierto, actualizar contenido si cambió la key
        if (refreshKey !== lastRefreshKeyRef.current) {
          replaceContent(modalIdRef.current, children, refreshKey);
          lastRefreshKeyRef.current = refreshKey;
        }

        // Actualizar tamaño si cambió
        if (!shallowEqualSize(lastSizeRef.current, size)) {
          setSize(modalIdRef.current, size);
          lastSizeRef.current = size;
        }
      }
    } else {
      // Cerrar el modal si está abierto
      if (modalIdRef.current && isModalOpen(modalIdRef.current)) {
        closeModal(modalIdRef.current);
        modalIdRef.current = null;
        lastRefreshKeyRef.current = undefined;
        lastSizeRef.current = undefined;
      }
    }
  }, [
    open,
    refreshKey,
    size,
    children,
    onClose,
    openModal,
    closeModal,
    replaceContent,
    setSize,
    isModalOpen
  ]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (modalIdRef.current && isModalOpen(modalIdRef.current)) {
        closeModal(modalIdRef.current);
      }
    };
  }, [closeModal, isModalOpen]);

  return null;
}

function shallowEqualSize(
  a?: { width?: any; height?: any },
  b?: { width?: any; height?: any }
) {
  return (
    (a?.width ?? undefined) === (b?.width ?? undefined) &&
    (a?.height ?? undefined) === (b?.height ?? undefined)
  );
}
