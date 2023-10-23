import { apiCallPost, apiCallGet, apiCallDelete, apiCallPut } from "./helpers.js"
import { showPage } from "./main.js";
import { getUserName, getUserImage } from "./user.js";

export const sendMessage = (channel, message, image, messagesDiv, globalUserId, globalToken) => {
    if (message.length === 0) {
        return;
    }

    apiCallPost(`message/${channel.id}`, {
        message: message,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, 0, messagesDiv, globalUserId, globalToken);
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const deleteMessage = (channel, message, messageDiv, globalToken) => {
    apiCallDelete(`message/${channel.id}/${message.id}`, globalToken)
    .then((body) => {
        messageDiv.remove();

    })
    .catch((msg) => {
        alert(msg);
    })
}

export const editMessage = (channel, oldMessage, newMessage, message, image, messagesDiv, globalUserId, globalToken) => {
    if (oldMessage.message === newMessage.value) {
        return;
    }

    apiCallPut(`message/${channel.id}/${oldMessage.id}`, {
        message: newMessage.value,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, 0, messagesDiv, globalUserId, globalToken);
    })
    .catch((msg) => {
        alert(msg);
    })
}

export const getMessages = (channel, index, messagesDiv, globalUserId, globalToken) => {
    messagesDiv.textContent = '';
    const messagesDivHeader = document.createElement('h3');
    messagesDivHeader.textContent = 'Messages';
    messagesDiv.appendChild(messagesDivHeader);

    apiCallGet(`message/${channel.id}?start=${index}`, globalToken)
    .then((body) => {
        const messages = body.messages.reverse();
        for (let i = 0; i < messages.length; i++) {
            console.log(messages[i])
            const messageDiv = document.createElement('div');
            messageDiv.style.border = '1px solid black';
            messageDiv.style.paddingBottom = '40px';
            messageDiv.style.marginBottom = '20px';

            const userDiv = document.createElement('div');
            userDiv.style.display = 'flex';
            userDiv.style.alignItems = 'center';
            userDiv.style.maxWidth = '350px';
            userDiv.style.justifyContent = 'space-between'

            const messageProfile = document.createElement('img');
            getUserImage(messages[i].sender, messageProfile, globalToken);
            messageProfile.style.maxHeight = '40px';
            userDiv.appendChild(messageProfile);

            const creator = document.createElement('p');
            getUserName(messages[i].sender, creator, globalToken);
            userDiv.appendChild(creator);

            const timestamp = document.createElement('p');

            timestamp.textContent = messages[i].sentAt;
            userDiv.appendChild(timestamp);

            if (messages[i].edited === true) {
                const editedDate = document.createElement('p');
                editedDate.textContent = messages[i].editedAt;
                userDiv.appendChild(editedDate);
            }


            messageDiv.appendChild(userDiv);

            const message = document.createElement('p');
            message.textContent = messages[i].message;
            messageDiv.appendChild(message);

            if (messages[i].sender === globalUserId) {
                const editMessageHeader = document.createElement('h5');
                editMessageHeader.textContent = 'Edit your message:'
                messageDiv.appendChild(editMessageHeader);

                const editMessageDiv = document.createElement('div');

                editMessageDiv.style.display = 'flex';
                const editMessageVal = document.createElement('textarea');
                editMessageDiv.appendChild(editMessageVal)
                const editMessageSubmit = document.createElement('button');
                editMessageSubmit.textContent = 'submit'
                editMessageSubmit.addEventListener('click', () => {
                    editMessage(channel, messages[i], editMessageVal, message, undefined, messagesDiv, globalUserId, globalToken);
                })
                editMessageDiv.appendChild(editMessageSubmit)
                messageDiv.appendChild(editMessageDiv);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete message';
                deleteButton.addEventListener('click', () => {
                    deleteMessage(channel, messages[i], messageDiv, globalToken);
                })
                messageDiv.appendChild(deleteButton);

            }

            messagesDiv.appendChild(messageDiv);
        }

    })
    .catch((msg) => {
        alert(msg);
    })
}