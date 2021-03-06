const socket = io('/tech');

$(() => {
    getMessages();
    //getChatRoms();
});

$("form").submit(() => {
    var $senderMessage = $("#message");
    var $sender = $("#sender");
    
    var message = {
        name: $sender.val(),
        message: $senderMessage.val(),
        room_id: '5a89f62cd0d06f0edf444e9f'
    };
    socket.emit('message', message); // Emiting to server
    $senderMessage.val('');
    $sender.hide();
    return false;
});

socket.on('send_room_id', (roomID) => {
    log(roomID)
    let roomID = roomID;
})

socket.on('updateClients', (message) => {
    addMessage(message);
});

socket.on('connect', () => {
  // Emiting to everyone
  socket.emit('systemLog', "A new user connected"); // Emiting to server
});


function getChatRoms() {
    $.get("/rooms", messages => {
        messages.forEach(addMessage);
    });
}

function getMessages() {
  $.get("/messages", messages => {
        messages.forEach(addMessage);
  });
}

function addMessage(message) {
    //TODO: refactor me
    let title = message.name;
    if(message.hasOwnProperty('extra')){
        let thisMessage = 
        '<strong><a href="http://localhost:2002/messages/' +
        title +
        '">' +
        title +
        '</a></strong> <span class="small">' +
        message.extra +
        '</span>';
        $("#messages").append($("<li>").html(thisMessage));
        return false
    } else {
        let thisMessage =
            "<strong>" +
            title +
            "</strong>: <span>" +
            message.message +
            "</span>";
        $("#messages").append($("<li>").html(thisMessage));
    }
}

function log(message){
    console.log(message);
}