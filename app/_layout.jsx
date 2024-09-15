import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData, user } = useAuth();
  const router = useRouter();

  console.log("USER : ", user);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    const res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
