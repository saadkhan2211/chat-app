const pool = require("../database");
// const socketIo = require("socket.io");

// let io;

// function socketServer(server) {

// }

// const createChatRoom = async (req, res) => {
//   const { userId, username } = req.body;

//   const getRoom = await pool.query(
//     "SELECT * FROM chat_room WHERE room_id = $1",
//     [userId]
//   );
//   if (getRoom.rowCount === 0) {
//     const currentDate = new Date();

//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//     const day = String(currentDate.getDate()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day}`;
//     const createRoom = await pool.query(
//       "INSERT INTO chat_room (room_id, username, date) VALUES ($1, $2, $3)",
//       [userId, username, formattedDate]
//     );
//     return res.status(200).json({
//       success: true,
//       message: "New Chat Room Created!",
//       data: createRoom.rows,
//     });
//   } else {
//     return res.status(200).json({
//       success: true,
//       message: "Chat already exists!",
//     });
//   }
// };

const getRoom = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const existingRoom = await pool.query(
      "SELECT * FROM chat_room WHERE room_id = $1;",
      [id]
    );
    const user = await pool.query("SELECT * from users WHERE user_id = $1", [
      id,
    ]);

    if (existingRoom.rowCount === 0) {
      const newRoom = await pool.query(
        "INSERT INTO chat_room (room_id, status, date, username) VALUES ($1, 0, CURRENT_DATE, $2) RETURNING *",
        [id, user.rows[0].username]
      );

      const roomId = newRoom.rows[0].id;

      return res.status(200).json({
        success: true,
        message: "Chat room created successfully",
        roomId: roomId,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Chat room already exists",
        id: existingRoom.rows[0].id,
        roomId: existingRoom.rows[0].room_id,
      });
    }
  } catch (error) {
    console.error("Error creating or fetching chat room:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getChat = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const chats = await pool.query(
      "SELECT message, time, sender FROM chats WHERE chat_room_id = $1",
      [id]
    );

    if (chats.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No chat found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        chats: chats.rows,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// For Admin Panel
const getRooms = async (req, res) => {
  try {
    const rooms = await pool.query(
      "WITH RankedChats AS (SELECT chat_room.room_id, chat_room.username, to_char(chats.time, 'HH12:MI am') AS time,chats.message, chats.chat_room_id,ROW_NUMBER() OVER (PARTITION BY chat_room_id ORDER BY chats.time DESC) AS rank FROM chats INNER JOIN chat_room ON chats.chat_room_id = chat_room.id) SELECT room_id, username, time, message, chat_room_id FROM RankedChats WHERE rank = 1;"
    );
    if (rooms.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No Room found!",
      });
    } else {
      //   console.log(rooms.rows);
      return res.status(200).json({
        success: true,
        rooms: rooms.rows,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getChats = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const chats = await pool.query(
      "SELECT message, time, sender FROM chats WHERE chat_room_id = $1",
      [id]
    );

    if (chats.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No chat found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        chats: chats.rows,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadImage = async (req, res) => {
  const image = req.file;

  if (image.filename) {
    return res.status(200).json({
      success: true,
    });
  }

  // try {
  //   const getRoomId = await pool.query(
  //     "SELECT id FROM chat_room WHERE room_id = $1",
  //     [room]
  //   );

  //   if (getRoomId.rowCount !== 0) {
  //     const chat = await pool.query(
  //       "INSERT INTO chats (sender, message, time, chat_room_id) VALUES ($1, $2, $3, $4) RETURNING *",
  //       [author, image.filename, time, getRoomId.rows[0].id]
  //     );

  //     const insertedChat = chat.rows[0];

  //     return res.status(200).json(insertedChat); // Send a JSON response
  //   }
  // } catch (error) {
  //   console.error("Error processing image upload:", error);
  //   return res.status(500).json({ error: "Internal Server Error" }); // Send a JSON error response
  // }
};

module.exports = {
  // createChatRoom,
  getChat,
  getRoom,
  getRooms,
  getChats,
  uploadImage,
};
