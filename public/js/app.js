const socket = io('/tech');

$(() => {
    getMessages();
});

$("form").submit(() => {
    var $senderMessage = $("#message");
    var $sender = $("#sender");
    var message = {
        name: $sender.val(),
        message: $senderMessage.val(),
        room_id: "1"
    };
    socket.emit('message', message); // Emiting to server
    $senderMessage.val('');
    $sender.hide();
    return false;
});

socket.on('updateClients', (message) => {
    addMessage(message);
});

socket.on('connect', () => {
  //emiting to everyone
  socket.emit('systemLog', "A new user connected"); // Emiting to server
});

function getMessages() {
  $.get("/messages", messages => {
    messages.forEach(addMessage);
  });
}

function addMessage(message) {
  var thisMeesage =
    "<strong>" +
    message.name +
    "</strong>: <span>" +
    message.message +
    "</span>";
  $("#messages").append($("<li>").html(thisMeesage));
}

function log(message){
    console.log(message);
}