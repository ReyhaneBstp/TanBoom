import { create } from 'zustand';

interface SnackbarState {
  message: string;
  type: 'error' | 'success' | 'info';
  isVisible: boolean;
}

interface GlobalState {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  snackbar: SnackbarState;
  showSnackbar: (message: string, type?: 'error' | 'success' | 'info') => void;
  hideSnackbar: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoading: false,
  loadingText: 'لطفاً منتظر بمانید',
  showLoading: (text) =>
    set({ isLoading: true, loadingText: text ?? 'لطفاً منتظر بمانید' }),
  hideLoading: () => set({ isLoading: false }),
  snackbar: { message: '', type: 'info', isVisible: false },
  showSnackbar: (message, type = 'info') =>
    set({ snackbar: { message, type, isVisible: true } }),
  hideSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, isVisible: false } })),
}));