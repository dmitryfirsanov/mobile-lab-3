import { Platform } from 'react-native';

/**
 * Функция для установки разных значений в зависимости от платформы
 * web - значение, которое будет использоваться на веб
 * native - значение, которое будет использоваться на мобильных устройствах
 */
export function useClientOnlyValue<T>(web: T, native: T): T {
  return Platform.OS === 'web' ? web : native;
} 