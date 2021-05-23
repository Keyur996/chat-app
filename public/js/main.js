const socket = io();
const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const roomUsers = document.querySelector("#users");

//Get Username and Room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log({ username, room });

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputRoomUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll bottom when message comes
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// form submit event user type message and send
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  // emit to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;

  chatMessages.appendChild(div);
}

function outputRoom(room) {
  roomName.textContent = room;
}

function outputRoomUsers(users) {
  roomUsers.innerHTML = `
      ${users.map((user) => `<li>${user.username}</li>`).join(" ")}
   `;
}
