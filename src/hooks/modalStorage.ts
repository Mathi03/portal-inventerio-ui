import { create } from 'zustand';
import { ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  content: ReactNode;
  openModal: (
    content: ReactNode,
    width?: React.CSSProperties['width'],
    height?: React.CSSProperties['height']
  ) => void;
  closeModal: () => void;
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  openModal: (content, width, height) =>
    set({ isOpen: true, content, width, height }),
  closeModal: () => set({ isOpen: false, content: null }),
  width: '90%',
  height: '90%'
}));
