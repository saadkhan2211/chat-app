import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profile from "../assets/profile-1707753902969.png";

const ChatList = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getId = async () => {
      const storedId = await AsyncStorage.getItem("userId");
      if (!storedId) {
        setUserId(storedId);
        navigation.navigate("registration");
      }
    };
    getId();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.card}>
            <Image source={profile} style={styles.image} />
            <View>
              <Text style={styles.name}>Arham Furqan</Text>
              <Text style={styles.message}>Hello vro</Text>
            </View>
            <Text style={styles.date}>10:30 pm</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: "#00C209",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  name: {
    color: "#fff",
    fontSize: 16,
  },
  message: {
    color: "#aaa",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
  },
});
export default ChatList;
