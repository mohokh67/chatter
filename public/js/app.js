const socket = io();

$(() => {
    getMessages();
    $("html, body").animate({ scrollTop: $(document).height() }, 500);
})
        $('form').submit(() => {
            var senderMessage = $('#message');
            var sender = $('#sender');
            //var meesage = '<strong>'+ sender.val() +'</strong>: <span>'+ senderMessage.val() +'</span>'
            var message = {
                name: sender.val(),
                message: senderMessage.val(),
                room_id: "1"
            }
            // postMessage(tempMessage);
            socket.emit('message', message);
            addMessage(message);

            senderMessage.val('');
            sender.hide();
            return false;
        });

        socket.on('connect', () => {
            //emiting to everyone
            socket.emit('systemLog', 'user connected');
        })

        // socket.on('message', (message) => {
        //     var messagesContainer = $('#messages');
        //     messagesContainer.append($('<li>').html(message));
        // })

        // socket.on('message', (data) => {
        //     console.log(data);
        //     socket.emit('another event', { Habib: 'I am good thank you.' });
        // })


function getMessages(){
    $.get('/messages', (messages) => {
        messages.forEach(addMessage);
    })
} 

function addMessage(message){
    var thisMeesage = '<strong>'+ message.name +'</strong>: <span>'+ message.message +'</span>'
    $('#messages').append($('<li>').html(thisMeesage));
}

// function postMessage(message){
//     $.post('/message', message)
// }