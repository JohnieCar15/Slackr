import { apiCallPost, apiCallGet, apiCallDelete } from "./helpers.js"
import { showPage } from "./main.js";
import { getUserName, getUserImage } from "./user.js";

export const sendMessage = (channel, message, image, messagesDiv, globalToken) => {
    apiCallPost(`message/${channel.id}`, {
        message: message,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, 0, messagesDiv, globalToken);
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
        // alert(msg);
    })
}

export const getMessages = (channel, index, messagesDiv, globalToken) => {
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


            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete message';
            deleteButton.addEventListener('click', () => {
                deleteMessage(channel, message, messageDiv, globalToken);

            })

            messageDiv.addEventListener('mouseover', () => {
                messageDiv.appendChild(deleteButton);
                messageDiv.style.opacity = '0.5';
            })

            messageDiv.addEventListener('mouseout', () => {
                messageDiv.removeChild(deleteButton);
                messageDiv.style.opacity = '1';
            })

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

            messageDiv.appendChild(userDiv);

            const message = document.createElement('p');
            message.textContent = messages[i].message;
            messageDiv.appendChild(message);


            messagesDiv.appendChild(messageDiv);
        }

    })
    .catch((msg) => {
        alert(msg);
    })
}