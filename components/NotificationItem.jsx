import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Avatar from "./Avatar";
import { getUserImageSrc } from "../services/imageService";
import moment from "moment";

const NotificationItem = ({ item, router }) => {
  const handleClick = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Avatar uri={getUserImageSrc(item?.sender?.image)} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>

      <View style={[styles.text, { color: theme.colors.textLight }]}>
        <Text>{moment(item?.created_at).format("MMM D")}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    colors: theme.colors.text,
  },
});
