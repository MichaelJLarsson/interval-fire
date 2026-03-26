import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.work,
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home' }} />
      <Tabs.Screen name="build"   options={{ title: 'Build' }} />
      <Tabs.Screen name="stats"   options={{ title: 'Stats' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 2,
    borderTopColor: '#2e2e2e',
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: 'BarlowCondensed_900Black',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tabItem: {
    borderRadius: 12,
  },
});
