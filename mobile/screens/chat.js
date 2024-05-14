import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import IoIcon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import Attachment from "react-native-vector-icons/Entypo";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import io from "socket.io-client";
import moment from "moment";
import URL from "../url";

const socket = io.connect(`${URL}`);

const user = {
  user_id: 12,
  username: "Arham",
};

const ChatScreen = () => {
  const [room, setRoom] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    socket = io.connect(`${CHAT_URL}`);
    const fetchData = async () => {
      try {
        socket.on("connect", () => {
          console.log("Connected to Chat Server");
          try {
            fetch(`${CHAT_URL}/fetchRoom/${user.id}`)
              .then((roomResponse) => roomResponse.json())
              .then((roomJson) => {
                if (roomJson.success === true) {
                  console.log(roomJson.id);
                  setRoom(roomJson.roomId);
                  socket.emit("join_room", roomJson.roomId);

                  fetch(`${CHAT_URL}/chats/${roomJson.id}`)
                    .then((chatsResponse) => chatsResponse.json())
                    .then((chatsJson) => {
                      if (chatsJson.success === true) {
                        setChats(chatsJson.chats);
                      }
                    })
                    .catch((error) => {
                      console.error("Error fetching chats:", error);
                    });
                }
              })
              .catch((error) => {
                console.error("Error fetching room:", error);
              });
          } catch (error) {
            console.error("Error fetching room and chats:", error);
          }
        });
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(chats);

  const imageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry! Media library access denied");
    } else {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!response.cancelled) {
        const fileExtension = response.assets[0].uri.split(".").pop();
        const filename = `chat-${Date.now()}.${fileExtension}`;

        const formData = new FormData();
        formData.append("filename", filename);
        formData.append("chat", {
          uri: response.assets[0].uri,
          name: filename,
          type: `image/${fileExtension}`,
        });

        const uploadResponse = await fetch(`${CHAT_URL}/uploadImage`, {
          method: "POST",
          body: formData,
        });

        const responseData = await uploadResponse.json();
        if (responseData.success === true) {
          const messageData = {
            room: room,
            author: user.username,
            message: filename,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          };

          await socket.emit("upload_image", messageData);
        }
      }
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: user.username,
        message: newMessage.trim(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      await socket.emit("send_message", messageData);
      setNewMessage("");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => (prevMessage || "") + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChats((prevChats) => [...prevChats, data]);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chats]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.name}>Support</Text>
      </View> */}
      <FlatList
        ref={flatListRef}
        data={chats}
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.messageBubble,
              {
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
                backgroundColor:
                  item.sender === user.username ? "#f8971d" : "#bbbbbb",
                alignSelf:
                  item.sender === user.username ? "flex-end" : "flex-start",
              },
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.time}>
              {moment(`1970-01-01 ${item.time}`).format("hh:mm A")}
            </Text>
          </Animated.View>
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={toggleEmojiPicker}
        >
          <Icon name="emoji-emotions" style={styles.sendButtonText} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.attachment} onPress={imageLibrary}>
          <Attachment name="attachment" size={24} color="#f8971d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <IoIcon name="send" style={styles.sendButtonText} />
        </TouchableOpacity>
      </View>
      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <EmojiSelector
            category={Categories.symbols}
            onEmojiSelected={handleEmojiSelect}
            columns="8"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#303030",
  },
  header: {
    height: 100,
    padding: 10,
    backgroundColor: "#00D50A",
  },
  name: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginTop: 45,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  messageBubble: {
    backgroundColor: "#00D50A",
    borderRadius: 10,
    maxWidth: "70%",
    marginBottom: 10,
    padding: 10,
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  time: {
    color: "#f4f4f4",
    opacity: 0.7,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // borderTopWidth: 1,
    // borderTopColor: "#00D50A",
    shadowColor: "#00D50A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#1C1C1C",
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00C209",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  emojiButton: {
    // backgroundColor: "#00D50A",
    borderWidth: 1,
    borderColor: "#00C209",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 8.5,
    paddingHorizontal: 15,
  },
  sendButton: {
    // backgroundColor: "#00D50A",
    borderWidth: 1,
    borderColor: "#00C209",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 8.5,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  emojiPickerContainer: {
    width: "100%",
    height: 400,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 40 : 10,
    marginBottom: 20,
  },
});

export default ChatScreen;
