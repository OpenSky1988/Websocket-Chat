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
    nameDisplay.innerHTML = '<p>' + name + '<div class="message-form__change-name">Изменить</div></p>';
    handle.style.display = 'none';
    nameDisplay.classList.add('message-form__name-display_active');
    changeNameBtn = document.getElementsByClassName('message-form__change-name')[0];

    changeNameBtn.addEventListener('click', function () {
        handle.style.display = 'block';
        nameDisplay.classList.remove('message-form__name-display_active');
        nameDisplay.innerHTML = '';
        name = '';
    });
}

// Emit events
sendBtn.addEventListener('click', function () {
    if (handle.value && !message.value) {
        setName();
        message.classList.add('message-form__message_empty');  
    } else if (!handle.value && message.value) {
        handle.classList.add('message-form__handle_empty');
    } else if (handle.value && message.value) {
        socket.emit('chat-message', {
            message: message.value,
            handle: handle.value
        });
        handle.classList.remove('message-form__handle_empty');
        message.classList.remove('message-form__message_empty');
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
