import { executeQuery, executeUpdate, withTransaction } from './databaseService';

export type UserProfile = {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  groupNumber: string;
};

export const profileService = {
  // Получить профиль пользователя
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const profiles = await executeQuery<UserProfile>('SELECT * FROM profile LIMIT 1');
      return profiles.length > 0 ? profiles[0] : null;
    } catch (e) {
      console.error('Ошибка при получении профиля пользователя:', e);
      return null;
    }
  },

  // Сохранить или обновить профиль пользователя
  saveProfile: async (profile: Omit<UserProfile, 'id'>): Promise<UserProfile> => {
    try {
      const existingProfile = await profileService.getProfile();
      
      if (existingProfile) {
        // Обновляем существующий профиль
        await executeUpdate(
          `UPDATE profile SET 
            lastName = ?, 
            firstName = ?, 
            middleName = ?, 
            birthDate = ?, 
            groupNumber = ? 
          WHERE id = 1`,
          [
            profile.lastName,
            profile.firstName,
            profile.middleName,
            profile.birthDate,
            profile.groupNumber
          ]
        );
        
        return { ...profile, id: 1 };
      } else {
        // Создаем новый профиль
        await executeUpdate(
          `INSERT INTO profile (id, lastName, firstName, middleName, birthDate, groupNumber) 
           VALUES (1, ?, ?, ?, ?, ?)`,
          [
            profile.lastName,
            profile.firstName,
            profile.middleName,
            profile.birthDate,
            profile.groupNumber
          ]
        );
        
        return { ...profile, id: 1 };
      }
    } catch (e) {
      console.error('Ошибка при сохранении профиля пользователя:', e);
      throw new Error('Не удалось сохранить профиль пользователя');
    }
  }
}; 