// src/hooks/modalStorage.ts
import { create } from 'zustand';
import type { CSSProperties, ReactNode } from 'react';

export type ModalSize = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

type ModalState = {
  isOpen: boolean;
  content: ReactNode | null;
  contentKey?: any;              // <--- clave para controlar actualizaciones
  size: ModalSize;
  onClose?: () => void;

  openModal: (opts: { content: ReactNode; key?: any; size?: ModalSize; onClose?: () => void }) => void;
  closeModal: () => void;
  replaceContent: (content: ReactNode, key?: any) => void;
  setSize: (size?: ModalSize) => void;
};

const DEFAULT_SIZE: ModalSize = { width: '90%', height: '90%' };

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  content: null,
  contentKey: undefined,
  size: DEFAULT_SIZE,
  onClose: undefined,

  openModal: ({ content, key, size, onClose }) => {
    set({
      isOpen: true,
      content,
      contentKey: key,
      size: size ?? DEFAULT_SIZE,
      onClose,
    });
  },

  closeModal: () => {
    const { onClose } = get();
    try { onClose?.(); } finally {
      set({ isOpen: false, content: null, contentKey: undefined, onClose: undefined, size: DEFAULT_SIZE });
    }
  },

  replaceContent: (content, key) => set((s) => {
    // si la key no cambia, no hagas nada (evita rerenders)
    if (key !== undefined && s.contentKey === key) return s;
    return { content, contentKey: key };
  }),

  setSize: (size) => set({ size: size ?? DEFAULT_SIZE }),
}));
