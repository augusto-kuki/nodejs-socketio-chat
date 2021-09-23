import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  username: string;
  text: string;
  createdAt: Date;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        ...data,
        socket_id: socket.id,
      });
    }

    const messagensRoom = getMessagesRoom(data.room);

    callback(messagensRoom);
  });

  socket.on("message", (data) => {
    //salver a mensagem
    const message: Message = {
      ...data,
      createdAt: new Date(),
      text: data.message,
    };

    messages.push(message);

    //enviar a mensagem

    io.to(data.room).emit("message", message);
  });
});

function getMessagesRoom(room: string) {
  return messages.filter((message) => message.room === room);
}
