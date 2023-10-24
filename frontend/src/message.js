import { apiCallPost, apiCallGet, apiCallDelete, apiCallPut, convertISOString, removeAllChildNodes } from "./helpers.js"
import { getUserName, getUserImage } from "./user.js";
import { globalToken, globalUserId } from "./main.js";
import { pageCounter } from "./channel.js";

export const sendMessage = (channel, message, image, messagesDiv, pinnedMessagesDiv) => {
    if (message.length === 0) {
        return;
    }

    apiCallPost(`message/${channel.id}`, {
        message: message,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const deleteMessage = (channel, message, messageDiv) => {
    apiCallDelete(`message/${channel.id}/${message.id}`, globalToken)
    .then((body) => {
        messageDiv.remove();

    })
    .catch((msg) => {
        alert(msg);
    })
}

const editMessage = (channel, oldMessage, newMessage, image, messagesDiv, pinnedMessagesDiv) => {
    if (oldMessage.message === newMessage.value) {
        return;
    }

    apiCallPut(`message/${channel.id}/${oldMessage.id}`, {
        message: newMessage.value,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const reactMessage = (channel, message, react, messagesDiv, pinnedMessagesDiv) => {
    apiCallPost(`message/react/${channel.id}/${message.id}`, {
        react: react
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const unReactMessage = (channel, message, react, messagesDiv, pinnedMessagesDiv) => {
    apiCallPost(`message/unreact/${channel.id}/${message.id}`, {
        react: react
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const pinMessage = (channel, message, messagesDiv, pinnedMessagesDiv) => {
    apiCallPost(`message/pin/${channel.id}/${message.id}`, {
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const unpinMessage = (channel, message, messagesDiv, pinnedMessagesDiv) => {
    apiCallPost(`message/unpin/${channel.id}/${message.id}`, {
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const createEmoji = (channel, message, emoji, messagesDiv, pinnedMessagesDiv, emojiDiv) => {
    const emojiTemplateDiv = document.createElement('div');
    emojiTemplateDiv.style.display = 'flex';
    emojiTemplateDiv.style.flexDirection = 'column';
    emojiTemplateDiv.style.alignItems = 'center';
    const emojiTemplate = document.createElement('a');
    emojiTemplate.textContent = emoji;

    const emojiTemplateArr = message.reacts.filter((x) => x.react === emoji);

    emojiTemplate.addEventListener('click', () => {
        if (emojiTemplateArr.filter((x) => x.user === globalUserId).length === 1) {
            unReactMessage(channel, message, emoji, messagesDiv, pinnedMessagesDiv);
        } else {
            reactMessage(channel, message, emoji, messagesDiv, pinnedMessagesDiv);
        }

    })

    emojiTemplateDiv.appendChild(emojiTemplate);
    const emojiTemplateCounter = document.createElement('p');
    emojiTemplateCounter.textContent = emojiTemplateArr.length;
    emojiTemplateDiv.appendChild(emojiTemplateCounter);

    emojiDiv.appendChild(emojiTemplateDiv);
}

export const getMessages = (channel, index, messagesDiv, pinnedMessagesDiv) => {
    removeAllChildNodes(messagesDiv);
    const messagesDivHeader = document.createElement('h3');
    messagesDivHeader.textContent = 'Messages';
    messagesDiv.appendChild(messagesDivHeader);

    removeAllChildNodes(pinnedMessagesDiv);
    const pinnedMessagesDivHeader = document.createElement('h3');
    pinnedMessagesDivHeader.textContent = 'Pinned Messages';
    pinnedMessagesDiv.appendChild(pinnedMessagesDivHeader);

    apiCallGet(`message/${channel.id}?start=${index}`, globalToken)
    .then((body) => {
        const messages = body.messages.reverse();
        for (let i = 0; i < messages.length; i++) {
            const messageDiv = document.createElement('div');
            messageDiv.style.border = '1px solid black';
            messageDiv.style.paddingBottom = '40px';
            messageDiv.style.marginBottom = '20px';

            const userDiv = document.createElement('div');
            userDiv.style.display = 'flex';
            userDiv.style.alignItems = 'center';
            userDiv.style.justifyContent = 'space-between'

            const messageProfile = document.createElement('img');
            getUserImage(messages[i].sender, messageProfile);
            messageProfile.style.maxHeight = '40px';
            userDiv.appendChild(messageProfile);

            const creator = document.createElement('p');
            getUserName(messages[i].sender, creator);
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

            createEmoji(channel, messages[i], '😍', messagesDiv, pinnedMessagesDiv, emojiDiv);
            createEmoji(channel, messages[i], '😂', messagesDiv, pinnedMessagesDiv, emojiDiv);
            createEmoji(channel, messages[i], '🥲', messagesDiv, pinnedMessagesDiv, emojiDiv);


            userDiv.appendChild(emojiDiv);

            const pinned = document.createElement('a');
            pinned.textContent = '📌';
            pinned.addEventListener('click', () => {
                if (messages[i].pinned) {
                    unpinMessage(channel, messages[i], messagesDiv, pinnedMessagesDiv);
                } else {
                    pinMessage(channel, messages[i], messagesDiv, pinnedMessagesDiv);
                }
            })

            userDiv.appendChild(pinned);

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
                    editMessage(channel, messages[i], editMessageVal, undefined, messagesDiv, pinnedMessagesDiv);
                })
                editMessageDiv.appendChild(editMessageSubmit)
                messageDiv.appendChild(editMessageDiv);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete message';
                deleteButton.addEventListener('click', () => {
                    deleteMessage(channel, messages[i], messageDiv);
                })
                messageDiv.appendChild(deleteButton);

            }


            messagesDiv.appendChild(messageDiv);

            if (messages[i].pinned) {
                pinnedMessagesDiv.appendChild(messageDiv);
            }
        }

    })
    .catch((msg) => {
        alert(msg);
    })
}