const socket = io();

        $('form').submit(() => {
            var senderMessage = $('#message');
            var sender = $('#sender');
            var meesage = '<strong>'+ sender.val() +'</strong>: <span>'+ senderMessage.val() +'</span>'
            socket.emit('message', meesage);
            senderMessage.val('');
            //sender.prop('disabled', true);
            sender.hide();
            return false;
        });

        socket.on('connect', () => {
            //emiting to everyone
            socket.emit('message', 'user connected');
        })

        socket.on('message', (message) => {
            var messagesContainer = $('#messages');
            messagesContainer.append($('<li>').html(message));
        })

        // socket.on('message', (data) => {
        //     console.log(data);
        //     socket.emit('another event', { Habib: 'I am good thank you.' });
        // })