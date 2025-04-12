import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Инициализация базы данных с использованием современного API
export const initDatabase = async (): Promise<void> => {
  console.log('Инициализация базы данных...');

  try {
    // Открываем базу данных с использованием асинхронного API
    db = await SQLite.openDatabaseAsync('student_schedule.db');
    console.log('База данных успешно открыта');

    // Создаем таблицы
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY NOT NULL,
        lastName TEXT,
        firstName TEXT,
        middleName TEXT,
        birthDate TEXT,
        groupNumber TEXT
      );
      
      CREATE TABLE IF NOT EXISTS schedule_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL,
        subject TEXT NOT NULL,
        teacherName TEXT NOT NULL,
        dayOfWeek TEXT NOT NULL,
        lessonType TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    // Проверка наличия столбца lessonType
    try {
      await executeQuery('SELECT lessonType FROM schedule_items LIMIT 1');
    } catch (err) {
      // Если столбец не существует, добавляем его
      console.log('Добавление столбца lessonType в таблицу schedule_items');
      await db.execAsync('ALTER TABLE schedule_items ADD COLUMN lessonType TEXT');
    }

    console.log('Таблицы созданы или уже существуют');
    
    // Проверяем количество элементов в таблице
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM schedule_items');
    const count = result?.count || 0;
    console.log(`В таблице расписания уже есть ${count} элементов`);
    
    // Если таблица пуста, добавляем тестовые данные
    if (count === 0) {
      console.log('Добавляем тестовые данные...');
      await createTestData();
    }
    
    console.log('Инициализация базы данных завершена успешно');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    throw error;
  }
};

// Выполнение SQL запроса с возвратом всех строк результата
export const executeQuery = async <T>(sql: string, params: any[] = []): Promise<T[]> => {
  if (!db) {
    throw new Error('База данных не инициализирована');
  }
  
  console.log(`Выполнение SQL запроса: ${sql}, params: ${JSON.stringify(params)}`);
  
  try {
    const result = await db.getAllAsync<T>(sql, ...params);
    console.log(`Результат запроса (${result.length} строк):`, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Ошибка при выполнении SQL запроса:', error);
    throw error;
  }
};

// Выполнение SQL запроса для вставки/обновления/удаления
export const executeUpdate = async (sql: string, params: any[] = []): Promise<{ lastInsertRowId: number, changes: number }> => {
  if (!db) {
    throw new Error('База данных не инициализирована');
  }
  
  console.log(`Выполнение SQL запроса обновления: ${sql}, params: ${JSON.stringify(params)}`);
  
  try {
    const result = await db.runAsync(sql, ...params);
    const lastInsertRowId = result.lastInsertRowId;
    const changes = result.changes;
    
    console.log(`Результат обновления: lastInsertRowId=${lastInsertRowId}, changes=${changes}`);
    return { lastInsertRowId, changes };
  } catch (error) {
    console.error('Ошибка при выполнении SQL запроса обновления:', error);
    throw error;
  }
};

// Прямой запрос к базе данных для отладки
export const debugQueryAllTables = async (): Promise<void> => {
  try {
    console.log("=== Отладочная информация о таблицах ===");
    
    // Получаем список всех таблиц
    const tables = await executeQuery<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log("Таблицы в базе данных:", tables.map(t => t.name).join(", "));
    
    // Получаем данные из таблицы расписания
    const scheduleItems = await executeQuery(
      "SELECT * FROM schedule_items"
    );
    console.log("Данные в таблице schedule_items:", JSON.stringify(scheduleItems));
    
    // Получаем данные из таблицы профиля
    const profiles = await executeQuery(
      "SELECT * FROM profile"
    );
    console.log("Данные в таблице profile:", JSON.stringify(profiles));
    
    console.log("=== Отладка завершена ===");
  } catch (error) {
    console.error("Ошибка при выполнении отладочного запроса:", error);
  }
};

// Временная таблица для тестирования, если основная не работает
const createTestData = async () => {
  try {
    // Добавляем тестовые данные
    await executeUpdate(`
      INSERT INTO schedule_items (time, subject, teacherName, dayOfWeek, lessonType, createdAt)
      VALUES 
        ('10:00-11:30', 'Математика', 'Иванов И.И.', 'Понедельник', 'Лекция', ?)
    `, [new Date().toISOString()]);
    
    await executeUpdate(`
      INSERT INTO schedule_items (time, subject, teacherName, dayOfWeek, lessonType, createdAt)
      VALUES 
        ('12:00-13:30', 'Физика', 'Петров П.П.', 'Вторник', 'Практика', ?)
    `, [new Date().toISOString()]);
    
    await executeUpdate(`
      INSERT INTO schedule_items (time, subject, teacherName, dayOfWeek, lessonType, createdAt)
      VALUES 
        ('14:00-15:30', 'Информатика', 'Сидоров С.С.', 'Среда', 'Лекция', ?)
    `, [new Date().toISOString()]);
    
    console.log('Тестовые данные добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
  }
};

export const getDatabase = () => db; 