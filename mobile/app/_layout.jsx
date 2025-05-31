import { Stack, useRouter, useSegments, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

function AuthChecker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, token } = useAuthStore();

  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignIn = user && token;

    if (!isSignIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth();
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <AuthChecker>
          <Slot />
        </AuthChecker>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}