import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http";
import * as io from "socket.io";
import { formatMessage } from "./utils/messages.js";
import {
  getCurrentUser,
  userJoin,
  roomUsers,
  userLeave,
} from "./utils/user.js";

// const express = require("express");
// const path = require("path");
// const http = require("http");
const app = express();
const PORT = process.env.PORT || 3000;
const botName = "Chat Bot";

//create server
const server = createServer(app);

// for socket.io
const socketio = new io.Server(server);

const __filename = fileURLToPath(import.meta.url);
//set static folder
app.use(express.static(path.join(path.dirname(__filename), "public")));

socketio.on("connect", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to chatcord"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
    // Get Room users
    socketio.to(user.room).emit("roomUsers", {
      room: user.room,
      users: roomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    //  console.log(msg);
    socketio.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      socketio
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

      // Get Room users
      socketio.to(user.room).emit("roomUsers", {
        room: user.room,
        users: roomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
