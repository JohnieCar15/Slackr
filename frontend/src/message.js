import { apiCallPost, apiCallGet, apiCallDelete, apiCallPut, convertISOString } from "./helpers.js"
import { getUserName, getUserImage } from "./user.js";

export const sendMessage = (channel, message, image, messagesDiv, globalUserId, globalToken) => {
    localStorage.getItem('token');
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

const deleteMessage = (channel, message, messageDiv, globalToken) => {
    apiCallDelete(`message/${channel.id}/${message.id}`, globalToken)
    .then((body) => {
        messageDiv.remove();

    })
    .catch((msg) => {
        alert(msg);
    })
}

const editMessage = (channel, oldMessage, newMessage, image, messagesDiv, globalUserId, globalToken) => {
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

const reactMessage = (channel, message, react, messagesDiv, globalUserId, globalToken) => {
    apiCallPost(`message/react/${channel.id}/${message.id}`, {
        react: react
    }, globalToken)
    .then((body) => {
        getMessages(channel, 0, messagesDiv, globalUserId, globalToken);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const unReactMessage = (channel, message, react, messagesDiv, globalUserId, globalToken) => {
    apiCallPost(`message/unreact/${channel.id}/${message.id}`, {
        react: react
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
            userDiv.style.justifyContent = 'space-between'

            const messageProfile = document.createElement('img');
            getUserImage(messages[i].sender, messageProfile, globalToken);
            messageProfile.style.maxHeight = '40px';
            userDiv.appendChild(messageProfile);

            const creator = document.createElement('p');
            getUserName(messages[i].sender, creator, globalToken);
            userDiv.appendChild(creator);

            const timestamp = document.createElement('p');

            timestamp.textContent = convertISOString(messages[i].sentAt);




            userDiv.appendChild(timestamp);

            if (messages[i].edited === true) {
                const editedDate = document.createElement('p');
                editedDate.textContent = 'Edited: ' + convertISOString(messages[i].editedAt);
                userDiv.appendChild(editedDate);
            }

            const emojiDiv = document.createElement('div');
            emojiDiv.style.display = 'flex';

            const laughEmojiDiv = document.createElement('div');
            laughEmojiDiv.style.display = 'flex';
            laughEmojiDiv.style.flexDirection = 'column';
            laughEmojiDiv.style.alignItems = 'center';
            const laughEmoji = document.createElement('a');
            laughEmoji.textContent = '😂';

            const laughEmojiArr = messages[i].reacts.filter((x) => x.react === '😂');

            laughEmoji.addEventListener('click', () => {
                if (laughEmojiArr.filter((x) => x.user === globalUserId).length === 1) {
                    unReactMessage(channel, messages[i], '😂', messagesDiv, globalUserId, globalToken);
                } else {
                    reactMessage(channel, messages[i], '😂', messagesDiv, globalUserId, globalToken);
                }

            })

            laughEmojiDiv.appendChild(laughEmoji);
            const laughEmojiCounter = document.createElement('p');
            laughEmojiCounter.textContent = laughEmojiArr.length;
            laughEmojiDiv.appendChild(laughEmojiCounter);

            emojiDiv.appendChild(laughEmojiDiv);


            const loveEmojiDiv = document.createElement('div');
            loveEmojiDiv.style.display = 'flex';
            loveEmojiDiv.style.flexDirection = 'column';
            loveEmojiDiv.style.alignItems = 'center';
            const loveEmoji = document.createElement('a');
            loveEmoji.textContent = '😍';

            const loveEmojiArr = messages[i].reacts.filter((x) => x.react === '😍');

            loveEmoji.addEventListener('click', () => {
                if (loveEmojiArr.filter((x) => x.user === globalUserId).length === 1) {
                    unReactMessage(channel, messages[i], '😍', messagesDiv, globalUserId, globalToken);
                } else {
                    reactMessage(channel, messages[i], '😍', messagesDiv, globalUserId, globalToken);
                }

            })

            loveEmojiDiv.appendChild(loveEmoji);
            const loveEmojiCounter = document.createElement('p');
            loveEmojiCounter.textContent = loveEmojiArr.length;
            loveEmojiDiv.appendChild(loveEmojiCounter);

            emojiDiv.appendChild(loveEmojiDiv);


            const sadEmojiDiv = document.createElement('div');
            sadEmojiDiv.style.display = 'flex';
            sadEmojiDiv.style.flexDirection = 'column';
            sadEmojiDiv.style.alignItems = 'center';
            const sadEmoji = document.createElement('a');
            sadEmoji.textContent = '🥲';

            const sadEmojiArr = messages[i].reacts.filter((x) => x.react === '🥲');

            sadEmoji.addEventListener('click', () => {
                if (sadEmojiArr.filter((x) => x.user === globalUserId).length === 1) {
                    unReactMessage(channel, messages[i], '🥲', messagesDiv, globalUserId, globalToken);
                } else {
                    reactMessage(channel, messages[i], '🥲', messagesDiv, globalUserId, globalToken);
                }

            })

            sadEmojiDiv.appendChild(sadEmoji);
            const sadEmojiCounter = document.createElement('p');
            sadEmojiCounter.textContent = sadEmojiArr.length;
            sadEmojiDiv.appendChild(sadEmojiCounter);

            emojiDiv.appendChild(sadEmojiDiv);




            userDiv.appendChild(emojiDiv);

            const pinnedDiv = document.createElement('a');
            pinnedDiv.textContent = '📌';
            userDiv.appendChild(pinnedDiv);

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
                    editMessage(channel, messages[i], editMessageVal, undefined, messagesDiv, globalUserId, globalToken);
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