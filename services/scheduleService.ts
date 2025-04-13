import { executeQuery, executeUpdate } from './databaseService';

const WEEKDAY_ORDER = {
  'Понедельник': 1,
  'Вторник': 2,
  'Среда': 3,
  'Четверг': 4,
  'Пятница': 5,
  'Суббота': 6,
  'Воскресенье': 7
};

export type ScheduleItem = {
  id: number;
  time: string;
  subject: string;
  teacherName: string;
  dayOfWeek: string;
  lessonType: string;
  createdAt: string;
};

export const scheduleService = {
  getAll: async (): Promise<ScheduleItem[]> => {
    try {
      const items = await executeQuery<ScheduleItem>(
        'SELECT * FROM schedule_items'
      );
      
      return items.sort((a, b) => {
        const dayOrderA = WEEKDAY_ORDER[a.dayOfWeek as keyof typeof WEEKDAY_ORDER] || 0;
        const dayOrderB = WEEKDAY_ORDER[b.dayOfWeek as keyof typeof WEEKDAY_ORDER] || 0;
        
        if (dayOrderA !== dayOrderB) {
          return dayOrderA - dayOrderB;
        }
        
        const startTimeA = a.time.split('-')[0] || '';
        const startTimeB = b.time.split('-')[0] || '';
        
        return startTimeA.localeCompare(startTimeB);
      });
    } catch (e) {
      console.error('Ошибка при получении расписания:', e);
      return [];
    }
  },

  add: async (item: Omit<ScheduleItem, 'id' | 'createdAt'>): Promise<ScheduleItem> => {
    try {
      const createdAt = new Date().toISOString();
      
      const result = await executeUpdate(
        'INSERT INTO schedule_items (time, subject, teacherName, dayOfWeek, lessonType, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [item.time, item.subject, item.teacherName, item.dayOfWeek, item.lessonType, createdAt]
      );
      
      return {
        id: Number(result.lastInsertRowId),
        ...item,
        createdAt
      };
    } catch (e) {
      console.error('Ошибка при добавлении элемента расписания:', e);
      throw new Error('Не удалось сохранить элемент расписания');
    }
  },

  remove: async (id: number): Promise<void> => {
    try {
      await executeUpdate(
        'DELETE FROM schedule_items WHERE id = ?',
        [id]
      );
    } catch (e) {
      console.error('Ошибка при удалении элемента расписания:', e);
      throw new Error('Не удалось удалить элемент расписания');
    }
  },

  clear: async (): Promise<void> => {
    try {
      await executeUpdate('DELETE FROM schedule_items');
    } catch (e) {
      console.error('Ошибка при очистке расписания:', e);
      throw new Error('Не удалось очистить расписание');
    }
  }
};