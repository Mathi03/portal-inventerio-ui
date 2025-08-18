// src/components/Modal.tsx
"use client";

import { ReactNode, CSSProperties, useEffect, useRef } from "react";
import { useModalStore } from "@/hooks/modalStorage";

type ModalProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  size?: { width?: CSSProperties["width"]; height?: CSSProperties["height"] };
  refreshKey?: any;
};

function shallowEqualSize(
  a?: { width?: any; height?: any },
  b?: { width?: any; height?: any }
) {
  return (
    (a?.width ?? undefined) === (b?.width ?? undefined) &&
    (a?.height ?? undefined) === (b?.height ?? undefined)
  );
}

export default function Modal({
  open,
  onClose,
  children,
  size,
  refreshKey,
}: ModalProps) {
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);
  const replaceContent = useModalStore((s) => s.replaceContent);
  const setSize = useModalStore((s) => s.setSize);

  const openedByMe = useRef(false);
  const lastKeyRef = useRef<any>(undefined);
  const lastSizeRef = useRef<typeof size | undefined>(undefined);

  useEffect(() => {
    if (open) {
      if (!openedByMe.current) {
        // Abrir por primera vez
        openModal({
          content: children,
          key: refreshKey,
          size,
          onClose: () => {
            openedByMe.current = false;
            onClose?.(); // <- dispara tu handler onClose
          },
        });
        openedByMe.current = true;
        lastKeyRef.current = refreshKey;
        lastSizeRef.current = size;
      } else {
        if (refreshKey !== lastKeyRef.current) {
          replaceContent(children, refreshKey);
          lastKeyRef.current = refreshKey;
        }
        if (!shallowEqualSize(lastSizeRef.current, size)) {
          setSize(size);
          lastSizeRef.current = size;
        }
      }
    } else {
      if (openedByMe.current) {
        closeModal();
        openedByMe.current = false;
        lastKeyRef.current = undefined;
        lastSizeRef.current = undefined;
      }
    }
    // No dependas de estado del store ni de 'children' (usa refreshKey si quieres refrescar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    refreshKey,
    size,
    onClose,
    openModal,
    closeModal,
    replaceContent,
    setSize,
  ]);

  useEffect(() => {
    return () => {
      if (openedByMe.current) {
        closeModal();
        openedByMe.current = false;
      }
    };
  }, [closeModal]);

  return null;
}
