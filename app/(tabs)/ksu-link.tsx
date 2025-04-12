import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export default function KSULinkPage() {
  useEffect(() => {
    // При монтировании компонента открываем ссылку
    Linking.openURL('https://kursksu.ru/');
  }, []);

  // Этот компонент фактически не отображается, так как мы 
  // используем listeners и preventDefault в _layout.tsx
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Перенаправление на сайт КГУ...</Text>
    </View>
  );
} 