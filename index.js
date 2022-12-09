const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const mongoose = require('mongoose')

// ------------Config to use .env file--------------
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  strictQuery: false
})
.then(() => {
  console.log("DB Connetion Successfull");
})
.catch((err) => {
  console.log(err.message);
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ----------Our outpur will listen on thi s port---------
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// ---------Setting our Socket server-----------------
const io = socket(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
