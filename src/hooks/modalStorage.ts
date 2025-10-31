// src/hooks/modalStorage.ts
import { create } from 'zustand';
import type { CSSProperties, ReactNode } from 'react';

export type ModalSize = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
};

type ModalItem = {
  id: string;
  content: ReactNode;
  contentKey?: any;
  size: ModalSize;
  onClose?: () => void;
};

type ModalState = {
  modals: ModalItem[];

  openModal: (opts: {
    content: ReactNode;
    key?: any;
    size?: ModalSize;
    onClose?: () => void;
    id?: string;
  }) => string;

  closeModal: (id?: string) => void;
  closeAllModals: () => void;

  replaceContent: (id: string, content: ReactNode, key?: any) => void;
  setSize: (id: string, size?: ModalSize) => void;

  getTopModal: () => ModalItem | null;
  isModalOpen: (id: string) => boolean;
};

const DEFAULT_SIZE: ModalSize = { width: '90%', height: '90%' };

const generateId = () =>
  `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useModalStore = create<ModalState>((set, get) => ({
  modals: [],

  openModal: ({ content, key, size, onClose, id }) => {
    const modalId = id ?? generateId();

    set((state) => ({
      modals: [
        ...state.modals,
        {
          id: modalId,
          content,
          contentKey: key,
          size: size ?? DEFAULT_SIZE,
          onClose
        }
      ]
    }));

    return modalId;
  },

  closeModal: (id) => {
    const state = get();

    // Si no se proporciona ID, cerrar el modal superior
    const modalToClose = id
      ? state.modals.find((m) => m.id === id)
      : state.modals[state.modals.length - 1];

    if (!modalToClose) return;

    // Ejecutar callback de cierre
    try {
      modalToClose.onClose?.();
    } catch (error) {
      console.error('Error in modal onClose callback:', error);
    }

    // Remover el modal del stack
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== modalToClose.id)
    }));
  },

  closeAllModals: () => {
    const { modals } = get();

    // Ejecutar todos los callbacks en orden inverso
    [...modals].reverse().forEach((modal) => {
      try {
        modal.onClose?.();
      } catch (error) {
        console.error('Error in modal onClose callback:', error);
      }
    });

    set({ modals: [] });
  },

  replaceContent: (id, content, key) => {
    set((state) => ({
      modals: state.modals.map((modal) => {
        if (modal.id !== id) return modal;

        // Si la key no cambia, no actualizar (evita re-renders)
        if (key !== undefined && modal.contentKey === key) {
          return modal;
        }

        return { ...modal, content, contentKey: key };
      })
    }));
  },

  setSize: (id, size) => {
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === id ? { ...modal, size: size ?? DEFAULT_SIZE } : modal
      )
    }));
  },

  getTopModal: () => {
    const { modals } = get();
    return modals.length > 0 ? modals[modals.length - 1] : null;
  },

  isModalOpen: (id) => {
    return get().modals.some((m) => m.id === id);
  }
}));
