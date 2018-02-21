const socket = io('/tech');

$("form").submit(() => {
    var $senderMessage = $("#message");
    var $sender = $("#sender");
    var roomID = $("#roomID").val();
    
    var message = {
        name: $sender.val(),
        message: $senderMessage.val(),
        room_id: roomID
    };
    socket.emit('message', message); // Emiting to server
    $senderMessage.val('');
    $sender.hide();
    return false;
});

socket.on('send_room_id', (roomID) => {
    log(roomID)
    //let roomID = roomID;
})

socket.on('updateClients', (message) => {
    addMessage(message);
});

socket.on('connect', () => {
  // Emiting to everyone
  socket.emit('systemLog', "A new user connected"); // Emiting to server
});

function addMessage(message) {
    let title = message.name;

    let thisMessage =
        "<strong>" +
        title +
        "</strong>: <span>" +
        message.message +
        "</span>";
    $("#messages").append($("<li>").html(thisMessage));
   
}

function log(message){
    console.log(message);
}