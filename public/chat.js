// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementsByClassName('message-form__message')[0],
    handle = document.getElementsByClassName('message-form__handle')[0],
    sendBtn = document.getElementsByClassName('message-form__send')[0],
    output = document.getElementsByClassName('chat-window__output')[0],
    feedback = document.getElementsByClassName('chat-window__feedback')[0];
    nameDisplay = document.getElementsByClassName('message-form__name-display')[0];

var changeNameBtn;
var name;

function setName () {
    if (!name) {
        name = handle.value;
    }
    nameDisplay.innerHTML = '<p>' + name + '<button class="message-form__change-name">Изменить</button></p>';
    handle.style.display = "none";
    changeNameBtn = document.getElementsByClassName('message-form__change-name')[0];

    changeNameBtn.addEventListener('click', function () {
        handle.style.display = "block";
        nameDisplay.innerHTML = '';
        name = '';
    });
}

// Emit events
sendBtn.addEventListener('click', function () {
    if (handle.value && !message.value) {
        setName();
        console.log('Enter message');    
    } else if (!handle.value && message.value) {
        console.log('Enter name');
    } else if (handle.value && message.value) {
        socket.emit('chat-message', {
            message: message.value,
            handle: handle.value
        });
        setName();
        message.value = '';
    } else {
        console.log('Enter name and message');
    }
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
