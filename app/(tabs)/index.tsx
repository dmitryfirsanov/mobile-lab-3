import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { scheduleService, ScheduleItem } from '../../services/scheduleService';

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка расписания при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadSchedule();
    }, [])
  );

  // Функция загрузки расписания
  const loadSchedule = async () => {
    setLoading(true);
    try {
      const items = await scheduleService.getAll();
      console.log('Загруженные предметы:', JSON.stringify(items));
      setScheduleItems(items);
    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить расписание');
    } finally {
      setLoading(false);
    }
  };

  // Удаление элемента расписания
  const handleDelete = async (id: number) => {
    try {
      await scheduleService.remove(id);
      // Обновляем список после удаления
      setScheduleItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении элемента расписания:', error);
      Alert.alert('Ошибка', 'Не удалось удалить элемент расписания');
    }
  };

  // Рендер элемента расписания
  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => {
    console.log('Отрисовка элемента:', item);
    return (
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleDay}>{item.dayOfWeek}</Text>
          <Text style={styles.scheduleTime}>Время: {item.time}</Text>
          <View style={styles.lessonTypeContainer}>
            <Text style={[styles.lessonType, 
              item.lessonType === 'Лекция' ? styles.lectureType : styles.practiceType]}>
              {item.lessonType || 'Не указан'}
            </Text>
          </View>
          <Text style={styles.scheduleSubject}>Предмет: {item.subject}</Text>
          <Text style={styles.scheduleTeacher}>Преподаватель: {item.teacherName}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Удаление занятия',
              'Вы уверены, что хотите удалить это занятие?',
              [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Удалить', style: 'destructive', onPress: () => handleDelete(item.id) }
              ]
            );
          }}
        >
          <FontAwesome name="trash" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    );
  };

  // Если данные загружаются
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка расписания...</Text>
      </View>
    );
  }

  // Если расписание пустое
  if (scheduleItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Расписание заданий</Text>
        <Text style={styles.text}>Расписание пока пусто</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.navigate('/add-schedule')}
        >
          <FontAwesome name="plus" size={16} color="white" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>Добавить занятие</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Отображение расписания с элементами:', scheduleItems.length);

  // Если есть элементы расписания
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Расписание заданий</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={scheduleItems}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scheduleList}
          style={{width: '100%'}}
        />
      </View>
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => router.navigate('/add-schedule')}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scheduleList: {
    width: '100%',
    paddingBottom: 80, // Отступ для плавающей кнопки
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 6,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  scheduleSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  scheduleTeacher: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lessonTypeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  lessonType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  lectureType: {
    backgroundColor: '#e57373',  // lighter red
  },
  practiceType: {
    backgroundColor: '#66bb6a',  // lighter green
  },
}); 