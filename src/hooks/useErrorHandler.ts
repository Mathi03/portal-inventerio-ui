import { useCallback } from 'react';
import { useSnackbar } from '@telefonica/mistica';

const DEFAULT_ERROR_MESSAGE =
  'Ha ocurrido un error inesperado. Inténtalo nuevamente.';

const normalizeMessage = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const [first] = value;
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && first !== null) {
      return normalizeMessage((first as Record<string, unknown>).message);
    }
  }
  if (typeof value === 'object' && value !== null) {
    const maybeMessage =
      (value as Record<string, unknown>).message ??
      (value as Record<string, unknown>).error ??
      (value as Record<string, unknown>).title;
    return normalizeMessage(maybeMessage);
  }
  return undefined;
};

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = DEFAULT_ERROR_MESSAGE
): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  if (typeof error === 'object' && error !== null) {
    const axiosResponse = (error as { response?: { data?: unknown } })
      ?.response?.data;
    const normalized =
      normalizeMessage(axiosResponse) ??
      normalizeMessage((error as Record<string, unknown>).message);
    if (normalized) return normalized;
  }

  return fallbackMessage;
};

export const useErrorHandler = (
  fallbackMessage = DEFAULT_ERROR_MESSAGE
) => {
  const { openSnackbar } = useSnackbar();

  const notifyError = useCallback(
    (error: unknown, overrideMessage?: string) => {
      const message =
        overrideMessage ?? getErrorMessage(error, fallbackMessage);
      openSnackbar({ message, type: 'CRITICAL' });
      return message;
    },
    [fallbackMessage, openSnackbar]
  );

  const showError = useCallback(
    (message: string) => openSnackbar({ message, type: 'CRITICAL' }),
    [openSnackbar]
  );

  return {
    notifyError,
    showError,
    getErrorMessage: (error: unknown) =>
      getErrorMessage(error, fallbackMessage)
  };
};

export default useErrorHandler;

