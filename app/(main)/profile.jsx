import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import { getUserImageSrc } from "../../services/imageService";
import { Pressable } from "react-native";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";

let limit = 0;
const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out", "Error signing out");
    }
  };

  const handleLogout = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Model Cancelled"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };

  const getPosts = async () => {
    if (!hasMore) return null;

    limit = limit + 10;
    const res = await fetchPosts(limit, user?.id);

    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FlatList
        data={posts}
        ListHeaderComponent={
          <UserHeader user={user} router={router} handleLogout={handleLogout} />
        }
        ListHeaderComponentStyle={{marginBottom: 30}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        onEndReached={() => {
          getPosts();
        }}
        onEndReachedThreshold={0}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        ListFooterComponent={
          hasMore ? (
            <View
              style={{
                marginVertical: posts.length == 0 ? hp(35) : 30,
              }}
            >
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPost}>No more posts</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={getUserImageSrc(user?.image)}
              size={hp(15)}
              rounded={theme.radius.xxl * 1.8}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("editProfile")}
            >
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user && user?.name}</Text>
            <Text style={styles.infoText}>{user && user?.address}</Text>
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user?.email}</Text>
            </View>
            {user && user?.phoneNumber && (
              <View style={styles.info}>
                <Icon name="call" size={20} color={theme.colors.textLight} />
                <Text style={styles.infoText}>{user && user?.phoneNumber}</Text>
              </View>
            )}
            {user && user?.bio && (
              <View style={styles.info}>
                <Text style={styles.infoText}>{user && user?.bio}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  avatarContainer: {
    height: hp(15),
    width: hp(15),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
});
