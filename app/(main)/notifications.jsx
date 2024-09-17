import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import NotificationItem from "../../components/NotificationItem";
import Header from "../../components/Header";
import { theme } from "../../constants/theme";

const Notifications = () => {
  const [notification, setNotification] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  console.log("NOTI : ", JSON.stringify(notification, undefined, 2));

  useEffect(() => {
    getNotificaions();
  }, []);

  const getNotificaions = async () => {
    let res = await fetchNotifications(user?.id);

    if (res.success) {
      setNotification(res.data);
    } else {
      Alert.alert("Notification", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notification?.map((item, index) => {
            return <NotificationItem key={index} item={item} router={router} />;
          })}
          {notification.length == 0 && (
            <Text style={styles.noData}>No notification yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
