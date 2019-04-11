// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementsByClassName('message')[0],
    handle = document.getElementsByClassName('handle')[0],
    sendBtn = document.getElementsByClassName('send')[0],
    output = document.getElementsByClassName('output')[0],
    feedback = document.getElementsByClassName('feedback')[0];

// Emit events
sendBtn.addEventListener('click', function () {
    socket.emit('chat-message', {
        message: message.value,
        handle: handle.value
    });
    message.value = '';
});

message.addEventListener('keypress', function () {
    socket.emit('typing', {
        handle: handle.value
    })
});

// Listen for events
socket.on('chat-message', function (data) {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data.handle + ' is typing a message...</em></p>';
    setTimeout(function () {
        feedback.innerHTML = '';
    }, 3000);
});
