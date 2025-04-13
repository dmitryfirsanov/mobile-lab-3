import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, View as RNView } from 'react-native';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { scheduleService } from '../../services/scheduleService';
import { debugQueryAllTables } from '../../services/databaseService';

const WEEKDAYS = [
  'Понедельник', 
  'Вторник', 
  'Среда', 
  'Четверг', 
  'Пятница', 
  'Суббота',
  'Воскресенье'
];

const WEEKDAY_SHORTS = {
  'Понедельник': 'Пн', 
  'Вторник': 'Вт', 
  'Среда': 'Ср', 
  'Четверг': 'Чт', 
  'Пятница': 'Пт', 
  'Суббота': 'Сб',
  'Воскресенье': 'Вс'
};

const LESSON_TYPES = ['Лекция', 'Практика'];

export default function AddSchedulePage() {
  const [scheduleItem, setScheduleItem] = useState({
    startTime: '',
    endTime: '',
    subject: '',
    teacherName: '',
    dayOfWeek: '',
    lessonType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setScheduleItem(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const formatTimeForStorage = () => {
    return `${scheduleItem.startTime}-${scheduleItem.endTime}`;
  };

  const saveScheduleItem = async () => {
    if (!scheduleItem.startTime || !scheduleItem.endTime || !scheduleItem.subject || 
        !scheduleItem.teacherName || !scheduleItem.dayOfWeek || !scheduleItem.lessonType) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(scheduleItem.startTime) || !timeRegex.test(scheduleItem.endTime)) {
      Alert.alert('Ошибка', 'Введите время в формате ЧЧ:ММ (например, 09:30)');
      return;
    }

    setIsSubmitting(true);

    try {
      const timeString = formatTimeForStorage();
      console.log('Сохранение элемента расписания:', { ...scheduleItem, time: timeString });
      
      const savedItem = await scheduleService.add({
        time: timeString,
        subject: scheduleItem.subject,
        teacherName: scheduleItem.teacherName,
        dayOfWeek: scheduleItem.dayOfWeek,
        lessonType: scheduleItem.lessonType
      });
      console.log('Элемент успешно сохранен:', savedItem);
      
      await debugQueryAllTables();
      
      setScheduleItem({
        startTime: '',
        endTime: '',
        subject: '',
        teacherName: '',
        dayOfWeek: '',
        lessonType: '',
      });

      Alert.alert('Успешно', 'Занятие добавлено в расписание', [
        { text: 'OK', onPress: () => router.navigate('/') }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить занятие');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Добавление занятия</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>День недели</Text>
          <RNView style={styles.dayButtonsContainer}>
            {WEEKDAYS.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  scheduleItem.dayOfWeek === day && styles.dayButtonSelected
                ]}
                onPress={() => handleChange('dayOfWeek', day)}
                disabled={isSubmitting}
              >
                <Text 
                  style={[
                    styles.dayButtonText,
                    scheduleItem.dayOfWeek === day && styles.dayButtonTextSelected
                  ]}
                >
                  {WEEKDAY_SHORTS[day as keyof typeof WEEKDAY_SHORTS]}
                </Text>
              </TouchableOpacity>
            ))}
          </RNView>
          <Text style={styles.selectedDay}>
            {scheduleItem.dayOfWeek ? `Выбран: ${scheduleItem.dayOfWeek}` : 'Выберите день недели'}
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Тип занятия</Text>
          <RNView style={styles.typeButtonsContainer}>
            {LESSON_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  scheduleItem.lessonType === type && styles.typeButtonSelected
                ]}
                onPress={() => handleChange('lessonType', type)}
                disabled={isSubmitting}
              >
                <Text 
                  style={[
                    styles.typeButtonText,
                    scheduleItem.lessonType === type && styles.typeButtonTextSelected
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </RNView>
          <Text style={styles.selectedType}>
            {scheduleItem.lessonType ? `Выбран: ${scheduleItem.lessonType}` : 'Выберите тип занятия'}
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Время занятия</Text>
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>Начало:</Text>
              <TextInput
                style={styles.timeInput}
                value={scheduleItem.startTime}
                onChangeText={(text) => handleChange('startTime', text)}
                placeholder="09:30"
                keyboardType="numbers-and-punctuation"
                editable={!isSubmitting}
              />
            </View>
            
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>Конец:</Text>
              <TextInput
                style={styles.timeInput}
                value={scheduleItem.endTime}
                onChangeText={(text) => handleChange('endTime', text)}
                placeholder="11:00"
                keyboardType="numbers-and-punctuation"
                editable={!isSubmitting}
              />
            </View>
          </View>
          <Text style={styles.timeHelpText}>Формат: ЧЧ:ММ (например, 09:30)</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Название предмета</Text>
          <TextInput
            style={styles.input}
            value={scheduleItem.subject}
            onChangeText={(text) => handleChange('subject', text)}
            placeholder="Введите название предмета"
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ФИО преподавателя</Text>
          <TextInput
            style={styles.input}
            value={scheduleItem.teacherName}
            onChangeText={(text) => handleChange('teacherName', text)}
            placeholder="Введите ФИО преподавателя"
            editable={!isSubmitting}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, isSubmitting && styles.buttonDisabled]} 
          onPress={saveScheduleItem}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Сохранение...' : 'Добавить в расписание'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dayButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    width: '13%',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  dayButtonText: {
    fontSize: 14,
  },
  dayButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDay: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  typeButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    width: '45%',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  typeButtonText: {
    fontSize: 16,
  },
  typeButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedType: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeInputWrapper: {
    width: '48%',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  timeHelpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});