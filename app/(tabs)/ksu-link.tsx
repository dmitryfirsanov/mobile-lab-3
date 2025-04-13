import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export default function KSULinkPage() {
  useEffect(() => {
    Linking.openURL('https://kursksu.ru/');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Перенаправление на сайт КГУ...</Text>
    </View>
  );
} 