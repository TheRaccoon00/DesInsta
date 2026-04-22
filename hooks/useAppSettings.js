import { useAppSettingsContext } from '../context/AppSettingsContext';

/**
 * Hook to access application settings and management methods.
 * Now consumes a global context to ensure synchronization across components.
 */
export function useAppSettings() {
  return useAppSettingsContext();
}
