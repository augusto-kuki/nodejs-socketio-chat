const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

const usernameDiv = document.getElementById("username");
const messageDiv = document.getElementById("messages");

usernameDiv.innerHTML = `Bem-vindo: ${username} <br/>Sala: ${room}`;

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;

      socket.emit("message", {
        message,
        username,
        room,
      });

      event.target.value = "";
    }
  });

document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
});

// emit => para emitir info
// on => para ficar escutando uma info
socket.emit("select_room", { username, room }, (messagesRoom) => {
  messagesRoom.forEach((message) => addMessageHtml(message));
});

socket.on("message", (data) => {
  addMessageHtml(data);
});

function addMessageHtml(message) {
  messageDiv.innerHTML += `
  <div class="new_message">
      <label class="form-label">
        <strong>${message.username}:</strong> 
        <span>${new Date(message.createdAt).toLocaleString()} - ${
    message.text
  }</span>
        
      </label> 
  </div>`;
}
