const users = [];

// Join Room
export function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// get Current user
export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//user leave chat
export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

//Get Room Users
export function roomUsers(room) {
  return users.filter((user) => user.room === room);
}
