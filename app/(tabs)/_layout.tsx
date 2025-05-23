import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Linking } from 'react-native';

import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const openKSUWebsite = () => {
    Linking.openURL('https://kursksu.ru/');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Расписание',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-schedule"
        options={{
          title: 'Добавить',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ksu-link"
        options={{
          title: 'КГУ',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="university" color={color} />,
        }}
        listeners={{
          tabPress: (e: { preventDefault: () => void }) => {
            e.preventDefault();
            openKSUWebsite();
          },
        }}
      />
    </Tabs>
  );
} 