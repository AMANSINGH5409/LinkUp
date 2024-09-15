import { Alert, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";
import Icon from "../../assets/icons/index";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { getUserImageSrc } from "../../services/imageService";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("notifictions")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Avatar
                uri={getUserImageSrc(user?.image)}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
