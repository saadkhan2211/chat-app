const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const pool = require("./database");
const { Server } = require("socket.io");

const chatRoute = require("./routes/chatRoute");
const authRoute = require("./routes/authRoute");

const app = express();
const port = 4000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected", socket.id);

  socket.on("join_room", (data) => {
    console.log(`User with ID: ${socket.id} joined Room: ${data}`);
  });

  socket.on("upload_image", async (data) => {
    // console.log(data);
    try {
      const getRoomId = await pool.query(
        "SELECT id FROM chat_room WHERE room_id = $1",
        [data.room]
      );

      if (getRoomId.rowCount !== 0) {
        const formattedTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const chat = await pool.query(
          "INSERT INTO chats (sender, message, time, chat_room_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [data.author, data.message, formattedTime, getRoomId.rows[0].id]
        );

        const insertedChat = chat.rows[0];
        socket.emit("receive_message", {
          ...insertedChat,
          id: insertedChat.id,
        });
      }
    } catch (error) {
      console.error("Error processing image upload:", error);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const getRoomId = await pool.query(
        "SELECT id FROM chat_room WHERE room_id = $1",
        [data.room]
      );

      if (getRoomId.rowCount !== 0) {
        const formattedTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const chat = await pool.query(
          "INSERT INTO chats (sender, message, time, chat_room_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [data.author, data.message, formattedTime, getRoomId.rows[0].id]
        );
        const insertedChat = chat.rows[0];
        io.emit("receive_message", { ...insertedChat, id: insertedChat.id });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("close_chat", async (data) => {
    console.log(data);
    const deleteChat = await pool.query(
      "DELETE FROM chats WHERE chat_room_id = $1",
      [data.chat_room_id]
    );
  });

  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id);
  });
});

app.use("/", chatRoute);
app.use("/", authRoute);

server.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
