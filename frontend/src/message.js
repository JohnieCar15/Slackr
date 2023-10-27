import { apiCallPost, apiCallGet, apiCallDelete, apiCallPut, fileToDataUrl, convertISOString, removeAllChildNodes } from "./helpers.js"
import { getUserName, getUserImage, createFormComponent } from "./user.js";
import { globalToken, globalUserId, showPage } from "./main.js";
import { pageCounter } from "./channel.js";

export const sendMessage = (channel, message, image, messagesDiv, pinnedMessagesDiv) => {
    if (message.length === 0 && image === undefined) {
        return;
    }

    apiCallPost(`message/${channel.id}`, {
        message: message == '' ? undefined : message,
        image: image
    }, globalToken)
    .then((body) => {
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const deleteMessage = (channel, message, messageDiv, messagesDiv, pinnedMessagesDiv) => {
    apiCallDelete(`message/${channel.id}/${message.id}`, globalToken)
    .then((body) => {
        messageDiv.remove();
        getMessages(channel, pageCounter, messagesDiv, pinnedMessagesDiv);
    })
    .catch((msg) => {
        alert(msg);
    })
}

const editMessage = (channel, messageId, messages, images, messagesDiv, pinnedMessagesDiv) => {
    if (messages[0] === messages[1]) {
        return;
    }

    if (images[0] === images[1] && (images[1] !== undefined)) {
        return;
    }

    if (messages[1] === '' && images[1] === undefined) {
        return;
    }

    apiCallPut(`message/${channel.id}/${messageId}`, {
        message: messages[1] === '' ? undefined : messages[1],
        image: images[1]
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
        let photoCounter = 0;
        let maxPhotoCounter = messages.filter(x => x.hasOwnProperty('image')).length
        for (let i = 0; i < messages.length; i++) {
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = '20px';
            messageDiv.classList.add('container', 'bg-light', 'bg-gradient');

            const userDiv = document.createElement('div');
            userDiv.classList.add('d-flex', 'justify-content-between')

            const userDivProfile = document.createElement('div');
            userDivProfile.classList.add('container', 'd-flex')

            const messageProfile = document.createElement('img');
            getUserImage(messages[i].sender, messageProfile);
            messageProfile.style.maxHeight = '40px';
            userDivProfile.appendChild(messageProfile);

            const creator = document.createElement('a');
            getUserName(messages[i].sender, creator);
            creator.addEventListener('click', () => {
                showPage(`user-${messages[i].sender}`)
            })

            userDivProfile.appendChild(creator);

            userDiv.appendChild(userDivProfile);

            const timestamp = document.createElement('p');
            timestamp.classList.add('container')

            timestamp.textContent = convertISOString(messages[i].sentAt);

            userDiv.appendChild(timestamp);

            const editedDate = document.createElement('p');
            editedDate.classList.add('container')
            if (messages[i].edited === true) {
                editedDate.textContent = 'Edited: ' + convertISOString(messages[i].editedAt);
            }
            userDiv.appendChild(editedDate);

            const emojiDiv = document.createElement('div');
            emojiDiv.classList.add('container', 'd-flex');

            createEmoji(channel, messages[i], '😍', messagesDiv, pinnedMessagesDiv, emojiDiv);
            createEmoji(channel, messages[i], '😂', messagesDiv, pinnedMessagesDiv, emojiDiv);
            createEmoji(channel, messages[i], '🥲', messagesDiv, pinnedMessagesDiv, emojiDiv);


            userDiv.appendChild(emojiDiv);

            const pinned = document.createElement('a');
            pinned.classList.add('container')
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

            if (messages[i].message !== undefined) {
                const message = document.createElement('p');
                message.textContent = messages[i].message;
                messageDiv.appendChild(message);
            }

            if (messages[i].image !== undefined) {
                const image = document.createElement('img');
                image.style.height = '50px'
                image.style.width = '50px'
                image.classList.add('img-thumbnail')
                const prevModal = document.getElementById(`modal-${channel.id}-${photoCounter}`)

                if (prevModal !== null) {
                    prevModal.remove();
                }

                createModal(channel, messages[i].image, photoCounter, maxPhotoCounter)
                image.setAttribute('data-bs-toggle', 'modal')
                image.setAttribute('data-bs-target', `#modal-${channel.id}-${photoCounter}`)
                image.style.cursor = 'pointer'
                image.src = messages[i].image;
                messageDiv.appendChild(image);
                photoCounter++;
            }

            if (messages[i].sender === globalUserId) {
                const editMessageVal = createFormComponent('Edit message', 'text')
                messageDiv.appendChild(editMessageVal[0])

                const editImage = createFormComponent('Edit image', 'file')
                messageDiv.appendChild(editImage[0])


                const buttonDiv = document.createElement('div');
                buttonDiv.classList.add('d-flex')
                buttonDiv.classList.add('justify-content-between')

                const editMessageSubmit = document.createElement('button');
                editMessageSubmit.textContent = 'Edit'
                editMessageSubmit.classList.add('btn', 'btn-outline-primary')
                editMessageSubmit.addEventListener('click', () => {
                    try {
                        fileToDataUrl(editImage[1].files[0]).then((image) => {
                        editMessage(channel, messages[i].id, [messages[i].message, editMessageVal[1].value], [messages[i].image, image], messagesDiv, pinnedMessagesDiv);
                        editMessageVal[1].value = '';
                        })
                        .catch((msg) => {
                            alert(msg)
                        })
                    } catch(err) {
                        if (editImage[1].files[0] === undefined) {
                            editMessage(channel, messages[i].id, [messages[i].message, editMessageVal[1].value], [undefined, undefined], messagesDiv, pinnedMessagesDiv);
                        } else {
                            alert(err)
                        }
                    }
                })
                buttonDiv.appendChild(editMessageSubmit)

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-outline-danger')
                deleteButton.addEventListener('click', () => {
                    deleteMessage(channel, messages[i], messageDiv, messagesDiv, pinnedMessagesDiv);
                })
                buttonDiv.appendChild(deleteButton);

                messageDiv.appendChild(buttonDiv)
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


const createModal = (channel, image, photoCounter, maxPhotoCounter) => {
    const channelModal = document.createElement('div');
    channelModal.classList.add('modal', 'fade')
    channelModal.id = `modal-${channel.id}-${photoCounter}`;
    channelModal.tabIndex = '-1'

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog')
    channelModal.appendChild(modalDialog)

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content')
    modalDialog.appendChild(modalContent)

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header')

    const modalHeaderH1 = document.createElement('h1')
    modalHeaderH1.classList.add('modal-title', 'fs-5')
    modalHeader.appendChild(modalHeaderH1)

    const modalHeaderButton = document.createElement('button')
    modalHeaderButton.classList.add('btn-close')
    modalHeaderButton.setAttribute('data-bs-dismiss', 'modal')
    modalHeader.appendChild(modalHeaderButton)

    modalContent.appendChild(modalHeader)

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body')

    const modalImage = document.createElement('img');
    modalImage.classList.add('img-fluid')
    modalImage.src = image;

    modalBody.appendChild(modalImage);

    modalContent.appendChild(modalBody)

    const modalFooter = document.createElement('div')


    if (photoCounter > 0) {
        const modalFooterLeftButton = document.createElement('button');
        modalFooterLeftButton.classList.add('bi', 'bi-arrow-left')
        modalFooterLeftButton.setAttribute('data-bs-toggle', 'modal')
        modalFooterLeftButton.setAttribute('data-bs-target', `#modal-${channel.id}-${photoCounter - 1}`)
        modalFooter.appendChild(modalFooterLeftButton)
    }

    if (photoCounter < maxPhotoCounter - 1) {
        const modalFooterRightButton = document.createElement('button');
        modalFooterRightButton.classList.add('bi', 'bi-arrow-right')
        modalFooterRightButton.setAttribute('data-bs-toggle', 'modal')
        modalFooterRightButton.setAttribute('data-bs-target', `#modal-${channel.id}-${photoCounter + 1}`)
        modalFooter.appendChild(modalFooterRightButton)
    }

    modalContent.appendChild(modalFooter)


    document.getElementById('main').appendChild(channelModal);
}