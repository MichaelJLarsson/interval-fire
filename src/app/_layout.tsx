import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts,
  BarlowSemiCondensed_500Medium,
  BarlowSemiCondensed_700Bold,
  BarlowSemiCondensed_800ExtraBold,
} from '@expo-google-fonts/barlow-semi-condensed';
import { Barlow_400Regular, Barlow_600SemiBold } from '@expo-google-fonts/barlow';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BarlowSemiCondensed_500Medium,
    BarlowSemiCondensed_700Bold,
    BarlowSemiCondensed_800ExtraBold,
    Barlow_400Regular,
    Barlow_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0d0d' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="build" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="timer"    options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="complete" options={{ animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
