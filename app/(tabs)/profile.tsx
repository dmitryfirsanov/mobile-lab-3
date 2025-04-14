import { useState, useEffect } from 'react';
import {  Text, View , StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { profileService } from '../../services/profileService';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    groupNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await profileService.getProfile();
      if (profile) {
        setUserInfo({
          lastName: profile.lastName || '',
          firstName: profile.firstName || '',
          middleName: profile.middleName || '',
          birthDate: profile.birthDate || '',
          groupNumber: profile.groupNumber || '',
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setUserInfo(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveUserInfo = async () => {
    setIsSaving(true);
    try {
      await profileService.saveProfile(userInfo);
      Alert.alert('Успешно', 'Данные профиля сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить данные профиля');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка данных профиля...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Информация о студенте</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Фамилия</Text>
          <TextInput
            style={styles.input}
            value={userInfo.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            placeholder="Введите фамилию"
            editable={!isSaving}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            value={userInfo.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            placeholder="Введите имя"
            editable={!isSaving}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Отчество</Text>
          <TextInput
            style={styles.input}
            value={userInfo.middleName}
            onChangeText={(text) => handleChange('middleName', text)}
            placeholder="Введите отчество"
            editable={!isSaving}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Дата рождения</Text>
          <TextInput
            style={styles.input}
            value={userInfo.birthDate}
            onChangeText={(text) => handleChange('birthDate', text)}
            placeholder="ДД.ММ.ГГГГ"
            editable={!isSaving}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Номер группы</Text>
          <TextInput
            style={styles.input}
            value={userInfo.groupNumber}
            onChangeText={(text) => handleChange('groupNumber', text)}
            placeholder="Введите номер группы"
            editable={!isSaving}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, isSaving && styles.buttonDisabled]} 
          onPress={saveUserInfo}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
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